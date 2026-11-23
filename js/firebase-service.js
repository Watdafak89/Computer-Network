/**
 * NetQuest 16-Bit: Firebase Auth & Cloud Firestore Service (with Local Auth Fallback)
 * Authenticates students via Student ID + Password mapped to <studentId>@student.netquest.local
 */
(function (global) {
  'use strict';

  const CONFIG_OVERRIDE_KEY = 'netquest_firebase_config_override_v1';
  const LOCAL_ACCOUNTS_KEY = 'netquest_local_accounts_v1';
  const LOCAL_SESSION_KEY = 'netquest_local_session_v1';
  const LOCAL_BACKUP_PREFIX = 'netquest_state_backup_';
  const CUSTOM_Q_KEY = 'netquest_16bit_custom_q_v1';

  function simpleHash(str) {
    let h = 2166136261;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return 'h_' + (h >>> 0).toString(16);
  }

  function sanitizeStudentId(raw) {
    return String(raw || '')
      .trim()
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '');
  }

  function studentIdToEmail(studentId) {
    const trimmed = String(studentId || '').trim();
    if (trimmed.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return trimmed.toLowerCase();
    }
    const clean = sanitizeStudentId(trimmed);
    if (clean.length < 4) return null;
    return `${clean.toLowerCase()}@student.netquest.local`;
  }

  function parseFirebaseConfigInput(rawText) {
    const text = String(rawText || '').trim();
    if (!text) return { ok: false, error: 'กรุณาวางข้อมูล firebaseConfig ก่อนบันทึก' };

    try {
      const parsed = JSON.parse(text);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return { ok: true, config: parsed };
      }
    } catch (e) { /* try extracting JS object properties */ }

    const keys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId', 'measurementId'];
    const cfg = {};
    keys.forEach((k) => {
      const rx = new RegExp(`["']?${k}["']?\\s*:\\s*["']([^"']+)["']`);
      const m = rx.exec(text);
      if (m && m[1]) cfg[k] = m[1].trim();
    });

    if (!cfg.apiKey || !cfg.projectId) {
      return { ok: false, error: 'ไม่พบค่า apiKey และ projectId ในข้อความที่วาง กรุณาคัดลอกบล็อก firebaseConfig ให้ครบถ้วน' };
    }
    if (!cfg.authDomain) cfg.authDomain = `${cfg.projectId}.firebaseapp.com`;
    return { ok: true, config: cfg };
  }

  function translateFirebaseError(err) {
    const code = (err && err.code) ? String(err.code) : '';
    const msg = (err && err.message) ? String(err.message) : '';
    if (code.includes('email-already-in-use')) {
      return 'รหัสนักศึกษานี้ถูกลงทะเบียนแล้ว! กรุณากดแท็บ "เข้าสู่ระบบ" เพื่อล็อกอิน';
    }
    if (code.includes('wrong-password') || code.includes('invalid-credential') || code.includes('invalid-login-credentials')) {
      return 'รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
    }
    if (code.includes('user-not-found')) {
      return 'ไม่พบรหัสนักศึกษานี้ในระบบ กรุณาลงทะเบียนนักศึกษาใหม่ก่อน';
    }
    if (code.includes('weak-password')) {
      return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    }
    if (code.includes('operation-not-allowed')) {
      return 'ยังไม่ได้เปิดใช้งาน Email/Password ใน Firebase Authentication (กรุณาแจ้งครูผู้สอน)';
    }
    if (code.includes('permission-denied')) {
      return 'ไม่มีสิทธิ์ดำเนินการใน Cloud Firestore (การจัดการข้อสอบส่วนกลางต้องใช้บัญชีครูผู้สอนที่มีสิทธิ์ teacher: true)';
    }
    if (code.includes('network-request-failed')) {
      return 'เชื่อมต่ออินเทอร์เน็ตหรือเซิร์ฟเวอร์ Firebase ไม่สำเร็จ';
    }
    if (code.includes('too-many-requests')) {
      return 'ลองเข้าสู่ระบบผิดหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่';
    }
    return msg || 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล';
  }

  function extractStateWithProfile(docData, user, fallbackStudentId) {
    const baseState = (docData && docData.state && typeof docData.state === 'object')
      ? { ...docData.state }
      : null;
    const rawProf = (baseState && baseState.profile && typeof baseState.profile === 'object')
      ? baseState.profile
      : {};
    const resolvedName = String(rawProf.name || (docData && docData.name) || (user && user.displayName) || '').trim();
    const resolvedSid = String(rawProf.studentId || (docData && docData.studentId) || fallbackStudentId || '').trim();
    const resolvedRoom = String(rawProf.classRoom || (docData && docData.classRoom) || 'ปวช.2/1').trim();
    const resolvedClass = String(rawProf.heroClass || (docData && docData.heroClass) || 'paladin');
    const isCreated = Boolean(rawProf.created || resolvedName.length > 0);

    if (!baseState && !isCreated) {
      return null;
    }

    return {
      ...(baseState || {}),
      profile: {
        ...rawProf,
        name: resolvedName,
        studentId: resolvedSid,
        classRoom: resolvedRoom,
        heroClass: resolvedClass,
        created: isCreated
      }
    };
  }

  const FirebaseService = {
    mode: 'local', // 'firebase' | 'local'
    auth: null,
    db: null,
    configSource: 'none',
    activeConfig: null,
    saveTimer: null,
    _pendingWriteFn: null,
    _pendingSavePromise: null,
    _authBusy: false,
    authUnsubscribe: null,

    getEffectiveConfig() {
      try {
        const overrideRaw = localStorage.getItem(CONFIG_OVERRIDE_KEY);
        if (overrideRaw) {
          const parsed = JSON.parse(overrideRaw);
          if (parsed && parsed.apiKey && parsed.projectId) {
            return { config: parsed, source: 'browser' };
          }
        }
      } catch (e) { /* ignore */ }

      const fileCfg = global.NETQUEST_FIREBASE_CONFIG;
      if (fileCfg && fileCfg.apiKey && fileCfg.projectId) {
        return { config: fileCfg, source: 'file' };
      }
      return { config: null, source: 'none' };
    },

    init() {
      const { config, source } = this.getEffectiveConfig();
      this.activeConfig = config;
      this.configSource = source;

      if (config && global.firebase && typeof global.firebase.initializeApp === 'function') {
        try {
          if (!global.firebase.apps || global.firebase.apps.length === 0) {
            global.firebase.initializeApp(config);
          }
          this.auth = global.firebase.auth();
          this.db = global.firebase.firestore();
          this.mode = 'firebase';
          return { mode: this.mode, projectId: config.projectId, source };
        } catch (err) {
          console.warn('Firebase init failed, falling back to Local Mode:', err);
        }
      }

      this.auth = null;
      this.db = null;
      this.mode = 'local';
      return { mode: 'local', projectId: null, source };
    },

    isCloud() {
      return this.mode === 'firebase' && Boolean(this.auth) && Boolean(this.db);
    },

    getActiveConfigInfo() {
      return {
        mode: this.mode,
        source: this.configSource,
        projectId: this.activeConfig ? this.activeConfig.projectId : '',
        hasSdk: Boolean(global.firebase)
      };
    },

    saveRuntimeConfig(rawText) {
      const res = parseFirebaseConfigInput(rawText);
      if (!res.ok) return res;
      localStorage.setItem(CONFIG_OVERRIDE_KEY, JSON.stringify(res.config));
      return { ok: true, config: res.config };
    },

    clearRuntimeConfig() {
      localStorage.removeItem(CONFIG_OVERRIDE_KEY);
    },

    /* ---------------- LOCAL ACCOUNTS STORAGE ---------------- */
    getLocalAccounts() {
      try {
        return JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '{}');
      } catch (e) {
        return {};
      }
    },

    saveLocalAccounts(map) {
      localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(map));
    },

    /* ---------------- AUTHENTICATION ---------------- */
    onAuthReady(callback) {
      if (this.authUnsubscribe) {
        this.authUnsubscribe();
        this.authUnsubscribe = null;
      }

      if (this.isCloud()) {
        this.authUnsubscribe = this.auth.onAuthStateChanged(async (user) => {
          if (this._authBusy) return;
          if (!user) {
            callback(null);
            return;
          }
          const emailPrefix = (user.email || '').split('@')[0];
          let isTeacher = false;
          try {
            const tokenRes = await user.getIdTokenResult(true);
            isTeacher = Boolean(tokenRes && tokenRes.claims && tokenRes.claims.teacher === true);
          } catch (e) {
            try {
              const cachedRes = await user.getIdTokenResult(false);
              isTeacher = Boolean(cachedRes && cachedRes.claims && cachedRes.claims.teacher === true);
            } catch (e2) { /* ignore */ }
          }

          try {
            const snap = await this.db.collection('students').doc(user.uid).get();
            if (snap.exists) {
              const doc = snap.data();
              const resolvedState = extractStateWithProfile(doc, user, emailPrefix);
              callback({
                uid: user.uid,
                studentId: doc.studentId || emailPrefix,
                isTeacher,
                state: resolvedState
              });
              return;
            }
          } catch (err) {
            console.warn('Failed reading Firestore student doc:', err);
          }

          // Fallback to local backup if offline or new doc
          let backupState = null;
          try {
            const raw = localStorage.getItem(LOCAL_BACKUP_PREFIX + user.uid);
            if (raw) backupState = JSON.parse(raw);
          } catch (e) { /* ignore */ }

          callback({
            uid: user.uid,
            studentId: emailPrefix,
            isTeacher,
            state: extractStateWithProfile(backupState ? { state: backupState } : null, user, emailPrefix)
          });
        });
        return;
      }

      // Local Mode session check
      try {
        const sid = localStorage.getItem(LOCAL_SESSION_KEY);
        if (sid) {
          const accounts = this.getLocalAccounts();
          const acc = accounts[sid];
          if (acc) {
            callback({
              uid: acc.uid,
              studentId: acc.studentId,
              isTeacher: sid.startsWith('teacher'),
              state: acc.state || null
            });
            return;
          }
        }
      } catch (e) { /* ignore */ }
      callback(null);
    },

    async refreshTeacherClaim() {
      if (!this.isCloud() || !this.auth.currentUser) return false;
      try {
        const tokenRes = await this.auth.currentUser.getIdTokenResult(true);
        return Boolean(tokenRes && tokenRes.claims && tokenRes.claims.teacher === true);
      } catch (e) {
        return false;
      }
    },

    async registerStudent({ studentId, password, name, classRoom, heroClass, initialState }) {
      const cleanId = sanitizeStudentId(studentId);
      const email = studentIdToEmail(cleanId);
      if (!email) {
        return { ok: false, error: 'รหัสนักศึกษาต้องมีตัวอักษรหรือตัวเลขอย่างน้อย 4 หลัก' };
      }
      if (!password || password.length < 6) {
        return { ok: false, error: 'รหัสผ่าน (PIN) ต้องมีอย่างน้อย 6 ตัวอักษร' };
      }
      if (!name || !name.trim()) {
        return { ok: false, error: 'กรุณากรอกชื่อ-นามสกุลผู้เรียน' };
      }

      const cleanName = name.trim();
      const cleanRoom = (classRoom || 'ปวช.2/1').trim();
      const stateToSave = {
        ...initialState,
        profile: {
          ...(initialState.profile || {}),
          name: cleanName,
          studentId: cleanId,
          classRoom: cleanRoom,
          heroClass: heroClass || 'paladin',
          created: true
        }
      };

      const summary = {
        studentId: cleanId,
        name: cleanName,
        classRoom: cleanRoom,
        heroClass: heroClass || 'paladin',
        level: 1,
        xp: stateToSave.xp || 0,
        unitsCleared: 0,
        badgeCount: Array.isArray(stateToSave.badges) ? stateToSave.badges.length : 1,
        arcadeHighScore: 0,
        updatedAt: new Date().toISOString().slice(0, 10)
      };

      if (this.isCloud()) {
        this._authBusy = true;
        let createdUser = null;
        try {
          const cred = await this.auth.createUserWithEmailAndPassword(email, password);
          createdUser = cred.user;
          const uid = cred.user.uid;
          try {
            await cred.user.updateProfile({ displayName: cleanName });
          } catch (e) { /* non-fatal */ }
          await this.db.collection('students').doc(uid).set({
            uid,
            ...summary,
            state: stateToSave,
            createdAtServer: global.firebase.firestore.FieldValue.serverTimestamp(),
            updatedAtServer: global.firebase.firestore.FieldValue.serverTimestamp()
          });
          localStorage.setItem(LOCAL_BACKUP_PREFIX + uid, JSON.stringify(stateToSave));
          return { ok: true, uid, studentId: cleanId, isTeacher: false, state: stateToSave };
        } catch (err) {
          if (createdUser) {
            try { await createdUser.delete(); } catch (e) { /* ignore cleanup error */ }
          }
          return { ok: false, error: translateFirebaseError(err) };
        } finally {
          this._authBusy = false;
        }
      }

      // Local Mode Registration
      const key = cleanId.toLowerCase();
      const accounts = this.getLocalAccounts();
      if (accounts[key]) {
        return { ok: false, error: 'รหัสนักศึกษานี้ถูกลงทะเบียนแล้ว! กรุณากดแท็บ "เข้าสู่ระบบ" เพื่อล็อกอิน' };
      }
      const uid = `local_${key}`;
      accounts[key] = {
        uid,
        studentId: cleanId,
        passHash: simpleHash(password),
        summary,
        state: stateToSave
      };
      this.saveLocalAccounts(accounts);
      localStorage.setItem(LOCAL_SESSION_KEY, key);
      return { ok: true, uid, studentId: cleanId, isTeacher: false, state: stateToSave };
    },

    async loginStudent({ studentId, password }) {
      const rawInput = String(studentId || '').trim();
      const email = studentIdToEmail(rawInput);
      const cleanId = rawInput.includes('@') ? rawInput.split('@')[0] : sanitizeStudentId(rawInput);
      if (!email) {
        return { ok: false, error: 'กรุณากรอกรหัสนักศึกษาหรืออีเมลครูผู้สอนให้ถูกต้อง' };
      }
      if (!password) {
        return { ok: false, error: 'กรุณากรอกรหัสผ่าน' };
      }

      if (this.isCloud()) {
        this._authBusy = true;
        try {
          const cred = await this.auth.signInWithEmailAndPassword(email, password);
          const uid = cred.user.uid;
          let isTeacher = false;
          try {
            const tokenRes = await cred.user.getIdTokenResult(true);
            isTeacher = Boolean(tokenRes && tokenRes.claims && tokenRes.claims.teacher === true);
          } catch (e) { /* ignore */ }
          let docData = null;
          try {
            const snap = await this.db.collection('students').doc(uid).get();
            if (snap.exists) docData = snap.data();
          } catch (e) { /* handled below */ }
          let resolvedState = extractStateWithProfile(docData, cred.user, (docData && docData.studentId) || cleanId);
          if (!resolvedState) {
            try {
              const rawBak = localStorage.getItem(LOCAL_BACKUP_PREFIX + uid);
              if (rawBak) {
                resolvedState = extractStateWithProfile({ state: JSON.parse(rawBak) }, cred.user, cleanId);
              }
            } catch (e) { /* ignore */ }
          }
          return {
            ok: true,
            uid,
            studentId: (docData && docData.studentId) || cleanId,
            isTeacher,
            state: resolvedState
          };
        } catch (err) {
          return { ok: false, error: translateFirebaseError(err) };
        } finally {
          this._authBusy = false;
        }
      }

      // Local Mode Login
      const key = cleanId.toLowerCase();
      const accounts = this.getLocalAccounts();
      const acc = accounts[key];
      if (!acc) {
        return { ok: false, error: 'ไม่พบรหัสนักศึกษานี้ในเครื่อง กรุณากดแท็บ "ลงทะเบียนนักศึกษาใหม่" ก่อน' };
      }
      if (acc.passHash !== simpleHash(password)) {
        return { ok: false, error: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' };
      }
      localStorage.setItem(LOCAL_SESSION_KEY, key);
      return { ok: true, uid: acc.uid, studentId: acc.studentId, isTeacher: key.startsWith('teacher'), state: acc.state };
    },

    async logout() {
      await this.flushSave();
      localStorage.removeItem(LOCAL_SESSION_KEY);
      if (this.isCloud()) {
        try {
          await this.auth.signOut();
        } catch (e) { /* ignore */ }
      }
    },

    /* ---------------- STATE PERSISTENCE ---------------- */
    async flushSave() {
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
        if (this._pendingWriteFn) {
          const fn = this._pendingWriteFn;
          this._pendingWriteFn = null;
          await fn();
        }
      }
      if (this._pendingSavePromise) {
        try {
          await this._pendingSavePromise;
        } catch (e) { /* ignore */ }
      }
    },

    saveStudentState(uid, stateObj, summary, immediate = false) {
      if (!uid) return;

      try {
        localStorage.setItem(LOCAL_BACKUP_PREFIX + uid, JSON.stringify(stateObj));
      } catch (e) { /* ignore */ }

      if (!this.isCloud()) {
        const cleanId = sanitizeStudentId(summary.studentId || uid.replace(/^local_/, '')).toLowerCase();
        const accounts = this.getLocalAccounts();
        if (accounts[cleanId]) {
          accounts[cleanId].summary = summary;
          accounts[cleanId].state = stateObj;
          this.saveLocalAccounts(accounts);
        }
        return;
      }

      const writeFn = () => {
        if (!this.isCloud()) return Promise.resolve();
        const p = this.db.collection('students').doc(uid).set({
          uid,
          ...summary,
          state: stateObj,
          updatedAtServer: global.firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch((err) => {
          console.warn('Firestore save warning:', err);
        }).finally(() => {
          if (this._pendingSavePromise === p) this._pendingSavePromise = null;
        });
        this._pendingSavePromise = p;
        return p;
      };

      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
      }
      this._pendingWriteFn = writeFn;
      if (immediate) {
        this._pendingWriteFn = null;
        return writeFn();
      }
      this.saveTimer = setTimeout(() => {
        this.saveTimer = null;
        this._pendingWriteFn = null;
        writeFn();
      }, 450);
    },

    /* ---------------- LEADERBOARD & CUSTOM QUESTIONS ---------------- */
    async fetchLeaderboard(fallbackList = []) {
      if (this.isCloud()) {
        try {
          const snap = await this.db.collection('students')
            .orderBy('xp', 'desc')
            .limit(100)
            .get();
          const list = [];
          snap.forEach((doc) => {
            const d = doc.data();
            if (d && d.studentId) {
              list.push({
                name: d.name || d.studentId,
                studentId: d.studentId,
                classRoom: d.classRoom || 'ปวช.',
                heroClass: d.heroClass || 'paladin',
                level: d.level || 1,
                xp: d.xp || 0,
                unitsCleared: d.unitsCleared || 0,
                badgeCount: d.badgeCount || 0,
                arcadeHighScore: d.arcadeHighScore || 0,
                updatedAt: d.updatedAt || ''
              });
            }
          });
          if (list.length > 0) return list;
        } catch (err) {
          console.warn('Firestore leaderboard fallback:', err);
        }
      }

      // Merge Local accounts + initial/local leaderboard
      const map = new Map();
      (fallbackList || []).forEach((item) => {
        if (item && item.studentId) map.set(String(item.studentId).toLowerCase(), item);
      });
      const accounts = this.getLocalAccounts();
      Object.values(accounts).forEach((acc) => {
        if (acc && acc.summary && acc.summary.studentId) {
          map.set(String(acc.summary.studentId).toLowerCase(), acc.summary);
        }
      });
      return Array.from(map.values()).sort((a, b) => (b.xp || 0) - (a.xp || 0));
    },

    async fetchCustomQuestions() {
      let localList = [];
      try {
        localList = JSON.parse(localStorage.getItem(CUSTOM_Q_KEY) || '[]');
      } catch (e) { localList = []; }

      if (!this.isCloud()) return localList;

      try {
        const snap = await this.db.collection('customQuestions').get();
        const cloudList = [];
        snap.forEach((doc) => {
          const d = doc.data();
          if (d && d.q && Array.isArray(d.options)) {
            cloudList.push({ id: doc.id, ...d });
          }
        });
        return cloudList;
      } catch (err) {
        return localList;
      }
    },

    async addCustomQuestion(qObj) {
      if (this.isCloud()) {
        try {
          const docRef = await this.db.collection('customQuestions').add({
            unitId: Number(qObj.unitId),
            q: String(qObj.q || ''),
            options: Array.isArray(qObj.options) ? qObj.options.map(String) : [],
            ans: Number(qObj.ans),
            exp: String(qObj.exp || ''),
            createdAtServer: global.firebase.firestore.FieldValue.serverTimestamp()
          });
          return { ok: true, synced: true, id: docRef.id };
        } catch (err) {
          return { ok: false, synced: false, error: translateFirebaseError(err) };
        }
      }

      let localList = [];
      try {
        localList = JSON.parse(localStorage.getItem(CUSTOM_Q_KEY) || '[]');
      } catch (e) { localList = []; }
      localList.push(qObj);
      localStorage.setItem(CUSTOM_Q_KEY, JSON.stringify(localList));
      return { ok: true, synced: false };
    },

    async deleteCustomQuestion(docId, idxFallback = -1) {
      if (this.isCloud()) {
        try {
          await this.db.collection('customQuestions').doc(docId).delete();
          return { ok: true };
        } catch (err) {
          return { ok: false, error: translateFirebaseError(err) };
        }
      }
      if (idxFallback >= 0) {
        try {
          const localList = JSON.parse(localStorage.getItem(CUSTOM_Q_KEY) || '[]');
          localList.splice(idxFallback, 1);
          localStorage.setItem(CUSTOM_Q_KEY, JSON.stringify(localList));
          return { ok: true };
        } catch (e) { /* ignore */ }
      }
      return { ok: false, error: 'ไม่สามารถลบข้อสอบได้' };
    },

    /* ---------------- TEACHER STUDENT MANAGEMENT (RESET EXP / DELETE) ---------------- */
    async fetchAllStudentsForTeacher() {
      if (this.isCloud()) {
        try {
          const snap = await this.db.collection('students')
            .orderBy('xp', 'desc')
            .limit(200)
            .get();
          const list = [];
          snap.forEach((doc) => {
            const d = doc.data();
            if (d) {
              list.push({
                uid: doc.id,
                studentId: d.studentId || doc.id,
                name: d.name || d.studentId || '-',
                classRoom: d.classRoom || 'ปวช.',
                heroClass: d.heroClass || 'paladin',
                level: d.level || 1,
                xp: d.xp || 0,
                unitsCleared: d.unitsCleared || 0,
                badgeCount: d.badgeCount || 0,
                arcadeHighScore: d.arcadeHighScore || 0,
                updatedAt: d.updatedAt || '',
                state: d.state || null
              });
            }
          });
          return list;
        } catch (err) {
          console.warn('fetchAllStudentsForTeacher error:', err);
          return [];
        }
      }

      const accounts = this.getLocalAccounts();
      return Object.values(accounts)
        .filter((acc) => acc && acc.summary)
        .map((acc) => ({
          uid: acc.uid,
          ...acc.summary,
          state: acc.state || null
        }))
        .sort((a, b) => (b.xp || 0) - (a.xp || 0));
    },

    async resetStudentProgress(targetDoc, mode, freshDefaultState) {
      if (!targetDoc || !targetDoc.uid) {
        return { ok: false, error: 'ไม่พบข้อมูลบัญชีนักศึกษา' };
      }

      const uid = targetDoc.uid;
      const oldState = (targetDoc.state && typeof targetDoc.state === 'object') ? targetDoc.state : {};
      const oldProf = (oldState.profile && typeof oldState.profile === 'object') ? oldState.profile : {};

      const preservedProfile = {
        name: String(oldProf.name || targetDoc.name || targetDoc.studentId || 'ผู้เรียน'),
        studentId: String(oldProf.studentId || targetDoc.studentId || ''),
        classRoom: String(oldProf.classRoom || targetDoc.classRoom || 'ปวช.'),
        heroClass: String(oldProf.heroClass || targetDoc.heroClass || 'paladin'),
        created: true
      };

      const base = {
        ...freshDefaultState,
        profile: preservedProfile,
        inventory: { ...freshDefaultState.inventory, ...(oldState.inventory || {}) },
        unitProgress: { ...freshDefaultState.unitProgress, ...(oldState.unitProgress || {}) },
        daily: { ...freshDefaultState.daily, ...(oldState.daily || {}) }
      };

      let updatedState;
      let updatedSummary;

      if (mode === 'full') {
        updatedState = {
          ...freshDefaultState,
          profile: preservedProfile,
          badges: ['first_login']
        };
        updatedSummary = {
          studentId: preservedProfile.studentId,
          name: preservedProfile.name,
          classRoom: preservedProfile.classRoom,
          heroClass: preservedProfile.heroClass,
          level: 1,
          xp: 0,
          unitsCleared: 0,
          badgeCount: 1,
          arcadeHighScore: 0,
          updatedAt: new Date().toISOString().slice(0, 10)
        };
      } else {
        // mode === 'exp' -> Reset only EXP & Level while keeping profile, units, coins, badges intact
        updatedState = {
          ...base,
          coins: typeof oldState.coins === 'number' ? oldState.coins : freshDefaultState.coins,
          hp: typeof oldState.hp === 'number' ? oldState.hp : freshDefaultState.hp,
          equipment: Array.isArray(oldState.equipment) ? [...oldState.equipment] : [],
          badges: Array.isArray(oldState.badges) ? [...oldState.badges] : ['first_login'],
          arcadeHighScore: typeof oldState.arcadeHighScore === 'number' ? oldState.arcadeHighScore : 0,
          crt: Boolean(oldState.crt),
          xp: 0
        };
        updatedSummary = {
          studentId: preservedProfile.studentId,
          name: preservedProfile.name,
          classRoom: preservedProfile.classRoom,
          heroClass: preservedProfile.heroClass,
          level: 1,
          xp: 0,
          unitsCleared: Number(targetDoc.unitsCleared || 0),
          badgeCount: Array.isArray(updatedState.badges) ? updatedState.badges.length : Number(targetDoc.badgeCount || 0),
          arcadeHighScore: updatedState.arcadeHighScore,
          updatedAt: new Date().toISOString().slice(0, 10)
        };
      }

      if (this.isCloud()) {
        try {
          await this.db.collection('students').doc(uid).set({
            uid,
            ...updatedSummary,
            state: updatedState,
            updatedAtServer: global.firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          localStorage.setItem(LOCAL_BACKUP_PREFIX + uid, JSON.stringify(updatedState));
          return { ok: true, updatedDoc: { uid, ...updatedSummary, state: updatedState } };
        } catch (err) {
          return { ok: false, error: translateFirebaseError(err) };
        }
      }

      // Local Mode
      const key = sanitizeStudentId(preservedProfile.studentId || uid.replace(/^local_/, '')).toLowerCase();
      const accounts = this.getLocalAccounts();
      if (!accounts[key]) {
        return { ok: false, error: 'ไม่พบบัญชีนักศึกษาในเครื่องนี้' };
      }
      accounts[key].summary = updatedSummary;
      accounts[key].state = updatedState;
      this.saveLocalAccounts(accounts);
      localStorage.setItem(LOCAL_BACKUP_PREFIX + uid, JSON.stringify(updatedState));
      return { ok: true, updatedDoc: { uid, ...updatedSummary, state: updatedState } };
    },

    async deleteStudentRecord(uid, studentId) {
      if (!uid) return { ok: false, error: 'ไม่พบ UID นักศึกษา' };
      if (this.isCloud()) {
        try {
          await this.db.collection('students').doc(uid).delete();
          localStorage.removeItem(LOCAL_BACKUP_PREFIX + uid);
          return { ok: true };
        } catch (err) {
          return { ok: false, error: translateFirebaseError(err) };
        }
      }

      const key = sanitizeStudentId(studentId || uid.replace(/^local_/, '')).toLowerCase();
      const accounts = this.getLocalAccounts();
      if (accounts[key]) {
        delete accounts[key];
        this.saveLocalAccounts(accounts);
        return { ok: true };
      }
      return { ok: false, error: 'ไม่พบบัญชีนักศึกษา' };
    }
  };

  global.FirebaseService = FirebaseService;
  global.NetQuestConfigUtil = { sanitizeStudentId, parseFirebaseConfigInput };
})(window);
