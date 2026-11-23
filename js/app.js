/**
 * NetQuest 16-Bit: Main Game Engine & Interactive Lab Controller
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'netquest_16bit_state_v1';
  const LEADERBOARD_KEY = 'netquest_16bit_leaderboard_v1';
  const CUSTOM_Q_KEY = 'netquest_16bit_custom_q_v1';

  const todayKey = () => new Date().toISOString().slice(0, 10);

  function createDefaultState() {
    return {
      profile: {
        name: '',
        studentId: '',
        classRoom: 'ปวช.2/1',
        heroClass: 'paladin',
        created: false
      },
      xp: 0,
      coins: 50,
      hp: 130,
      inventory: {
        potion: 2,
        analyzer: 1,
        clock: 1,
        shield: 1
      },
      equipment: [],
      badges: [],
      unitProgress: {
        1: { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 },
        2: { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 },
        3: { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 },
        4: { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 },
        5: { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 },
        6: { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 },
        7: { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 },
        8: { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 },
        9: { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 },
        10: { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 }
      },
      daily: {
        date: todayKey(),
        labsCompletedToday: 0,
        bossesDefeatedToday: 0,
        bestComboToday: 0,
        arcadeRunsToday: 0,
        claimed: []
      },
      arcadeHighScore: 0,
      crt: false
    };
  }

  const App = {
    state: createDefaultState(),
    currentUid: null,
    isTeacher: false,
    cloudQuestions: [],
    lockedUnits: [],
    teacherStudentsList: [],
    teacherStudentFilter: '',
    currentUnitId: 1,
    currentTab: 'codex',
    selectedClassTemp: 'paladin',
    selectedAuthClass: 'paladin',
    battle: null,
    arcade: null,
    labState: {},

    init() {
      if (global.FirebaseService) {
        FirebaseService.init();
      }
      this.updateCloudBadge();
      this.renderHUD();
      this.renderDashboard();

      if (global.FirebaseService) {
        FirebaseService.onAuthReady(async (session) => {
          if (!session) {
            this.currentUid = null;
            this.isTeacher = false;
            this.state = createDefaultState();
            document.body.classList.remove('crt-active');
            this.renderHUD();
            this.renderDashboard();
            this.openAuthModal('login');
            return;
          }

          this.currentUid = session.uid;
          this.isTeacher = Boolean(session.isTeacher);
          this.applyLoadedState(session.state, session.studentId);
          this.ensureTeacherDefaultProfile(session.studentId);
          this.syncDailyReset();
          document.body.classList.toggle('crt-active', Boolean(this.state.crt));
          try {
            this.cloudQuestions = await FirebaseService.fetchCustomQuestions();
            this.lockedUnits = await FirebaseService.fetchLockedUnits();
          } catch (e) {
            this.cloudQuestions = [];
            this.lockedUnits = [];
          }
          this.closeModal('modal-auth');
          this.renderHUD();
          this.renderDashboard();
          if (!this.state.profile.created) {
            this.openProfileModal(true);
          }
        });
      } else {
        this.loadState();
        this.syncDailyReset();
        if (this.state.crt) document.body.classList.add('crt-active');
        this.renderHUD();
        this.renderDashboard();
        if (!this.state.profile.created) this.openProfileModal(true);
      }
    },

    ensureTeacherDefaultProfile(teacherId) {
      if (this.isTeacher && !this.state.profile.created) {
        const cleanLabel = teacherId || 'teacher';
        const mage = this.getClassObj('mage');
        this.state.profile = {
          name: `ครูผู้สอน (${cleanLabel})`,
          studentId: cleanLabel,
          classRoom: 'ครูผู้สอน',
          heroClass: 'mage',
          created: true
        };
        this.state.hp = mage.baseHp;
        if (!this.state.badges.includes('first_login')) {
          this.state.badges.push('first_login');
        }
        this.saveState(true);
      }
    },

    applyLoadedState(loadedState, fallbackStudentId = '', fallbackProfileMeta = null) {
      const def = createDefaultState();
      if (loadedState && typeof loadedState === 'object') {
        this.state = {
          ...def,
          ...loadedState,
          profile: { ...def.profile, ...(loadedState.profile || {}) },
          inventory: { ...def.inventory, ...(loadedState.inventory || {}) },
          unitProgress: { ...def.unitProgress, ...(loadedState.unitProgress || {}) },
          daily: { ...def.daily, ...(loadedState.daily || {}) }
        };
      } else {
        this.state = def;
      }
      if (fallbackProfileMeta) {
        if (!this.state.profile.name && fallbackProfileMeta.name) this.state.profile.name = fallbackProfileMeta.name;
        if (!this.state.profile.classRoom && fallbackProfileMeta.classRoom) this.state.profile.classRoom = fallbackProfileMeta.classRoom;
        if (!this.state.profile.heroClass && fallbackProfileMeta.heroClass) this.state.profile.heroClass = fallbackProfileMeta.heroClass;
      }
      if (fallbackStudentId && !this.state.profile.studentId) {
        this.state.profile.studentId = fallbackStudentId;
      }
      if (this.state.profile.name && this.state.profile.name.trim()) {
        this.state.profile.created = true;
      }
    },

    loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          this.applyLoadedState(JSON.parse(raw));
        }
      } catch (e) {
        this.state = createDefaultState();
      }
    },

    buildStudentSummary() {
      const { current } = this.getRankInfo(this.state.xp);
      const cleared = Object.values(this.state.unitProgress).filter((u) => u.bossCleared).length;
      return {
        name: this.state.profile.name || this.state.profile.studentId || 'ผู้เรียน',
        studentId: this.state.profile.studentId || '',
        classRoom: this.state.profile.classRoom || 'ปวช.',
        heroClass: this.state.profile.heroClass || 'paladin',
        level: current.level,
        xp: this.state.xp,
        unitsCleared: cleared,
        badgeCount: this.state.badges.length,
        arcadeHighScore: this.state.arcadeHighScore || 0,
        updatedAt: todayKey()
      };
    },

    saveState(immediate = false) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        this.syncLeaderboardEntry();
        if (global.FirebaseService && this.currentUid && this.state.profile.created) {
          FirebaseService.saveStudentState(this.currentUid, this.state, this.buildStudentSummary(), immediate);
        }
      } catch (e) { /* ignore storage quota */ }
    },

    updateCloudBadge() {
      const isCloud = global.FirebaseService && FirebaseService.isCloud();
      const info = global.FirebaseService ? FirebaseService.getActiveConfigInfo() : { projectId: '' };
      const hudPill = document.getElementById('hud-cloud-status');
      const authPill = document.getElementById('auth-cloud-pill');
      const banner = document.getElementById('auth-mode-banner');

      [hudPill, authPill].forEach((el) => {
        if (!el) return;
        el.classList.remove('cloud-online', 'cloud-local');
        if (isCloud) {
          el.classList.add('cloud-online');
          el.textContent = `☁️ Firebase: ${info.projectId}`;
        } else {
          el.classList.add('cloud-local');
          el.textContent = '💾 Local Mode';
        }
      });

      if (banner) {
        if (isCloud) {
          banner.innerHTML = `<b style="color:var(--emerald);">☁️ เชื่อมต่อ Firebase Cloud สำเร็จ (${info.projectId})</b> — นักเรียนล็อกอินด้วยรหัสนักศึกษาเพื่อเซฟข้อมูลข้ามเครื่องและอัปเดต Leaderboard Real-time`;
        } else {
          banner.innerHTML = `<b style="color:var(--amber);">💾 กำลังทำงานในโหมดเครื่องท้องถิ่น (Local Mode)</b> — ยังไม่ได้ตั้งค่า Firebase Config แต่สามารถลงทะเบียน/ล็อกอินด้วยรหัสนักศึกษาบนเครื่องนี้ได้ทันที (ครูใส่ค่าได้ที่ปุ่ม ⚙️ ตั้งค่า Firebase)`;
        }
      }
    },

    syncDailyReset() {
      const t = todayKey();
      if (this.state.daily.date !== t) {
        this.state.daily = {
          date: t,
          labsCompletedToday: 0,
          bossesDefeatedToday: 0,
          bestComboToday: 0,
          arcadeRunsToday: 0,
          claimed: []
        };
        this.saveState();
      }
    },

    getClassObj(id) {
      return GameData.CLASSES.find((c) => c.id === (id || this.state.profile.heroClass)) || GameData.CLASSES[0];
    },

    getPlayerStats() {
      const cls = this.getClassObj();
      let maxHp = cls.baseHp;
      let atk = 25 + cls.atkBonus;
      let timeBonus = cls.timeBonus;
      let crit = cls.critBonus;
      let xpMult = cls.xpMult;
      let coinMult = cls.coinMult;
      let def = 0;

      this.state.equipment.forEach((eqId) => {
        const item = GameData.SHOP_ITEMS.find((i) => i.id === eqId);
        if (item && item.stat) {
          if (item.stat.hp) maxHp += item.stat.hp;
          if (item.stat.atk) atk += item.stat.atk;
          if (item.stat.time) timeBonus += item.stat.time;
          if (item.stat.crit) crit += item.stat.crit;
          if (item.stat.xp) xpMult += item.stat.xp;
          if (item.stat.def) def += item.stat.def;
        }
      });

      return { maxHp, atk, timeBonus, crit, xpMult, coinMult, def };
    },

    getRankInfo(xp) {
      let current = GameData.RANKS[0];
      let next = GameData.RANKS[1];
      for (let i = 0; i < GameData.RANKS.length; i++) {
        if (xp >= GameData.RANKS[i].minXp) {
          current = GameData.RANKS[i];
          next = GameData.RANKS[i + 1] || null;
        }
      }
      return { current, next };
    },

    addRewards(rawXp, rawCoins, reason) {
      const stats = this.getPlayerStats();
      const oldLevel = this.getRankInfo(this.state.xp).current.level;
      const gainedXp = Math.round(rawXp * stats.xpMult);
      const gainedCoins = Math.round(rawCoins * stats.coinMult);
      this.state.xp += gainedXp;
      this.state.coins += gainedCoins;
      const newLevel = this.getRankInfo(this.state.xp).current.level;

      if (reason) {
        const coinText = gainedCoins > 0 ? `, +${gainedCoins} 🪙` : ' (ฝึกซ้ำไม่เพิ่มเหรียญ)';
        this.toast(`✨ ${reason}: +${gainedXp} XP${coinText}`);
      }
      if (newLevel > oldLevel) {
        soundFX.playLevelUp();
        this.state.hp = stats.maxHp;
        this.toast(`🎉 LEVEL UP! เลื่อนระดับเป็น LV.${newLevel}! ฟื้น HP เต็ม!`);
      } else {
        soundFX.playCoin();
      }
      this.checkBadges();
      this.saveState();
      this.renderHUD();
    },

    unlockBadge(badgeId) {
      if (!this.state.badges.includes(badgeId)) {
        this.state.badges.push(badgeId);
        const b = GameData.BADGES.find((x) => x.id === badgeId);
        if (b) {
          soundFX.playPowerUp();
          this.toast(`🏅 ปลดล็อกเหรียญตรา: ${b.icon} ${b.name}!`);
        }
      }
    },

    checkBadges() {
      if (this.state.profile.created) this.unlockBadge('first_login');
      const totalUnits = GameData.UNITS.length;
      let clearedCount = 0;
      for (let i = 1; i <= totalUnits; i++) {
        const up = this.state.unitProgress[i];
        if (up && up.bossCleared) {
          clearedCount++;
          this.unlockBadge(`unit${i}_clear`);
        }
      }
      if (clearedCount >= totalUnits) this.unlockBadge('grand_champion');
      if (this.state.arcadeHighScore >= 500) this.unlockBadge('arcade_hero');
    },

    toast(msg) {
      const container = document.getElementById('toast-container');
      const el = document.createElement('div');
      el.className = 'toast-msg';
      el.textContent = msg;
      container.appendChild(el);
      setTimeout(() => {
        el.remove();
      }, 3600);
    },

    /* ---------------- HUD & PROFILE ---------------- */
    renderHUD() {
      const cls = this.getClassObj();
      const stats = this.getPlayerStats();
      if (this.state.hp > stats.maxHp) this.state.hp = stats.maxHp;
      const { current, next } = this.getRankInfo(this.state.xp);
      const clearedUnits = Object.values(this.state.unitProgress).filter((u) => u.bossCleared).length;

      document.getElementById('hud-avatar').innerHTML = PixelSprites.render(cls.sprite, 46);
      document.getElementById('hud-name').textContent = this.state.profile.name || 'ผู้เล่นใหม่';
      document.getElementById('hud-level').textContent = `LV.${current.level}`;
      const teacherBadge = document.getElementById('hud-teacher-badge');
      if (teacherBadge) teacherBadge.classList.toggle('hidden', !this.isTeacher);
      document.getElementById('hud-class').textContent = `[${cls.thName}]`;
      document.getElementById('hud-rank').textContent = `${current.title} (${this.state.profile.classRoom || 'ปวช.'})`;

      const hpPct = Math.max(0, Math.min(100, Math.round((this.state.hp / stats.maxHp) * 100)));
      document.getElementById('hud-hp-fill').style.width = `${hpPct}%`;
      document.getElementById('hud-hp-text').textContent = `${this.state.hp}/${stats.maxHp}`;

      let xpPct = 100;
      let xpLabel = `${this.state.xp} XP (MAX)`;
      if (next) {
        const span = next.minXp - current.minXp;
        const prog = this.state.xp - current.minXp;
        xpPct = Math.max(4, Math.min(100, Math.round((prog / span) * 100)));
        xpLabel = `${this.state.xp}/${next.minXp} XP`;
      }
      document.getElementById('hud-xp-fill').style.width = `${xpPct}%`;
      document.getElementById('hud-xp-text').textContent = xpLabel;

      document.getElementById('hud-coins').textContent = this.state.coins;
      document.getElementById('hud-badges').textContent = `${this.state.badges.length}/${GameData.BADGES.length}`;
      document.getElementById('hud-units').textContent = `${clearedUnits}/${GameData.UNITS.length}`;

      const eqText = this.state.equipment.length > 0
        ? `⚔️ อุปกรณ์สวมใส่: ${this.state.equipment.length}/4 ชิ้น (ATK ${stats.atk} | CRIT ${Math.round(stats.crit * 100)}%)`
        : `⚔️ ATK ${stats.atk} | CRIT ${Math.round(stats.crit * 100)}% (แวะร้านค้าซื้ออุปกรณ์เพิ่มพลังได้!)`;
      const eqEl = document.getElementById('hero-equip-summary');
      if (eqEl) eqEl.textContent = eqText;
    },

    openProfileModal(firstTime = false) {
      soundFX.playSelect();
      document.getElementById('inp-name').value = this.state.profile.name || '';
      document.getElementById('inp-sid').value = this.state.profile.studentId || '';
      document.getElementById('inp-room').value = this.state.profile.classRoom || 'ปวช.2/1';
      this.selectedClassTemp = this.state.profile.heroClass || 'paladin';

      const closeBtn = document.getElementById('btn-close-profile');
      if (firstTime && !this.state.profile.created) {
        closeBtn.classList.add('hidden');
      } else {
        closeBtn.classList.remove('hidden');
      }
      this.renderClassCards();
      document.getElementById('modal-profile').classList.remove('hidden');
    },

    renderClassCards() {
      const grid = document.getElementById('class-select-grid');
      grid.innerHTML = GameData.CLASSES.map((c) => `
        <div class="class-card ${this.selectedClassTemp === c.id ? 'selected' : ''}" onclick="App.selectClass('${c.id}')">
          <div style="display:flex; justify-content:center; margin-bottom:6px;">
            ${PixelSprites.render(c.sprite, 64)}
          </div>
          <div style="font-weight:700; color:${c.color};">${c.name}</div>
          <div style="font-size:0.85rem; color:#fff;">${c.thName}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:6px;">${c.perk}</div>
        </div>
      `).join('');
    },

    selectClass(id) {
      soundFX.playSelect();
      this.selectedClassTemp = id;
      this.renderClassCards();
    },

    /* ---------------- AUTHENTICATION (STUDENT ID + FIREBASE) ---------------- */
    openAuthModal(tab = 'login') {
      this.updateCloudBadge();
      this.renderAuthClassCards();
      this.switchAuthTab(tab);
      this.showAuthError('');
      document.getElementById('modal-auth').classList.remove('hidden');
    },

    switchAuthTab(tab) {
      soundFX.playSelect();
      const isLogin = tab === 'login';
      document.getElementById('auth-tab-login').classList.toggle('active', isLogin);
      document.getElementById('auth-tab-register').classList.toggle('active', !isLogin);
      document.getElementById('auth-pane-login').classList.toggle('hidden', !isLogin);
      document.getElementById('auth-pane-register').classList.toggle('hidden', isLogin);
      this.showAuthError('');
    },

    renderAuthClassCards() {
      const grid = document.getElementById('auth-class-grid');
      if (!grid) return;
      grid.innerHTML = GameData.CLASSES.map((c) => `
        <div class="class-card ${this.selectedAuthClass === c.id ? 'selected' : ''}" onclick="App.selectAuthClass('${c.id}')">
          <div style="display:flex; justify-content:center; margin-bottom:6px;">
            ${PixelSprites.render(c.sprite, 56)}
          </div>
          <div style="font-weight:700; color:${c.color}; font-size:0.9rem;">${c.name}</div>
          <div style="font-size:0.82rem; color:#fff;">${c.thName}</div>
          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">${c.perk}</div>
        </div>
      `).join('');
    },

    selectAuthClass(id) {
      soundFX.playSelect();
      this.selectedAuthClass = id;
      this.renderAuthClassCards();
    },

    showAuthError(msg) {
      const box = document.getElementById('auth-error-box');
      if (!box) return;
      if (!msg) {
        box.classList.add('hidden');
        box.textContent = '';
      } else {
        box.classList.remove('hidden');
        box.textContent = `⚠️ ${msg}`;
      }
    },

    async submitLogin() {
      const sid = document.getElementById('auth-login-sid').value.trim();
      const pass = document.getElementById('auth-login-pass').value;
      const btn = document.getElementById('btn-login-submit');
      this.showAuthError('');
      if (!sid || !pass) {
        this.showAuthError('กรุณากรอกรหัสนักศึกษาและรหัสผ่านให้ครบถ้วน');
        return;
      }

      btn.disabled = true;
      btn.textContent = '⏳ กำลังตรวจสอบ...';
      const res = await FirebaseService.loginStudent({ studentId: sid, password: pass });
      btn.disabled = false;
      btn.textContent = '🔑 เข้าสู่ระบบทันที';

      if (!res.ok) {
        soundFX.playPlayerHurt();
        this.showAuthError(res.error);
        return;
      }

      this.currentUid = res.uid;
      this.isTeacher = Boolean(res.isTeacher);
      this.applyLoadedState(res.state, res.studentId);
      this.ensureTeacherDefaultProfile(res.studentId);
      this.syncDailyReset();
      try {
        this.cloudQuestions = await FirebaseService.fetchCustomQuestions();
      } catch (e) { this.cloudQuestions = []; }
      this.closeModal('modal-auth');
      this.renderHUD();
      this.renderDashboard();
      if (!this.state.profile.created) {
        this.openProfileModal(true);
      } else {
        this.closeModal('modal-profile');
      }
      soundFX.playPowerUp();
      this.toast(`🔑 เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${this.state.profile.name || res.studentId} (${this.state.profile.classRoom || ''})${this.isTeacher ? ' [สิทธิ์ครูผู้สอน]' : ''}`);
    },

    async submitRegister() {
      const sid = document.getElementById('auth-reg-sid').value.trim();
      const name = document.getElementById('auth-reg-name').value.trim();
      const room = document.getElementById('auth-reg-room').value.trim() || 'ปวช.2/1';
      const pass = document.getElementById('auth-reg-pass').value;
      const pass2 = document.getElementById('auth-reg-pass2').value;
      const btn = document.getElementById('btn-reg-submit');
      this.showAuthError('');

      if (!sid || !name || !pass) {
        this.showAuthError('กรุณากรอกรหัสนักศึกษา ชื่อ-นามสกุล และรหัสผ่านให้ครบถ้วน');
        return;
      }
      if (pass !== pass2) {
        this.showAuthError('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
        return;
      }

      const fresh = createDefaultState();
      const cls = this.getClassObj(this.selectedAuthClass);
      fresh.profile = {
        name,
        studentId: sid,
        classRoom: room,
        heroClass: this.selectedAuthClass,
        created: true
      };
      fresh.hp = cls.baseHp;
      if (this.selectedAuthClass === 'paladin') {
        fresh.inventory.shield = (fresh.inventory.shield || 0) + 1;
      }
      fresh.badges = ['first_login'];

      btn.disabled = true;
      btn.textContent = '⏳ กำลังสร้างบัญชี...';
      const res = await FirebaseService.registerStudent({
        studentId: sid,
        password: pass,
        name,
        classRoom: room,
        heroClass: this.selectedAuthClass,
        initialState: fresh
      });
      btn.disabled = false;
      btn.textContent = '🚀 ลงทะเบียนและเริ่มผจญภัย!';

      if (!res.ok) {
        soundFX.playPlayerHurt();
        this.showAuthError(res.error);
        return;
      }

      this.currentUid = res.uid;
      this.isTeacher = false;
      this.applyLoadedState(res.state || fresh, res.studentId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        this.syncLeaderboardEntry();
      } catch (e) { /* ignore */ }
      this.closeModal('modal-auth');
      this.closeModal('modal-profile');
      this.renderHUD();
      this.renderDashboard();
      soundFX.playLevelUp();
      this.toast(`🎉 ลงทะเบียนสำเร็จ! ยินดีต้อนรับ ${name} (${room})`);
    },

    async quickDemoLogin() {
      soundFX.playSelect();
      const demoId = '6720901099';
      const demoPass = '123456';
      this.showAuthError('');
      let res = await FirebaseService.loginStudent({ studentId: demoId, password: demoPass });
      if (!res.ok) {
        const fresh = createDefaultState();
        fresh.profile = {
          name: 'นายณัฐวุฒิ นักเครือข่าย (เดโม)',
          studentId: demoId,
          classRoom: 'ปวช.2/1',
          heroClass: 'paladin',
          created: true
        };
        fresh.badges = ['first_login'];
        res = await FirebaseService.registerStudent({
          studentId: demoId,
          password: demoPass,
          name: fresh.profile.name,
          classRoom: 'ปวช.2/1',
          heroClass: 'paladin',
          initialState: fresh
        });
      }
      if (!res.ok) {
        this.showAuthError(res.error);
        return;
      }
      this.currentUid = res.uid;
      this.isTeacher = false;
      this.applyLoadedState(res.state, res.studentId);
      this.closeModal('modal-auth');
      this.renderHUD();
      this.renderDashboard();
      soundFX.playPowerUp();
      this.toast(`⚡ เข้าสู่ระบบด้วยบัญชีเดโม (${demoId}) สำเร็จ!`);
    },

    async logoutStudent() {
      if (!this.currentUid) {
        this.openAuthModal('login');
        return;
      }
      if (!confirm('ต้องการออกจากระบบเพื่อสลับบัญชีนักศึกษาหรือไม่?')) return;
      this.stopBattleTimer();
      this.saveState(true);
      if (global.FirebaseService) {
        await FirebaseService.flushSave();
        await FirebaseService.logout();
      }
      this.currentUid = null;
      this.isTeacher = false;
      this.state = createDefaultState();
      this.closeModal('modal-profile');
      this.closeModal('modal-teacher');
      this.showWorldMap();
      this.renderHUD();
      this.renderDashboard();
      this.openAuthModal('login');
      this.toast('🚪 ออกจากระบบเรียบร้อยแล้ว');
    },

    fillDemoStudent() {
      soundFX.playSelect();
      document.getElementById('inp-name').value = 'นายณัฐวุฒิ นักเครือข่าย';
      document.getElementById('inp-room').value = 'ปวช.2/1';
    },

    saveProfile() {
      const name = document.getElementById('inp-name').value.trim();
      const sid = this.state.profile.studentId || document.getElementById('inp-sid').value.trim();
      const room = document.getElementById('inp-room').value.trim() || 'ปวช.2/1';
      if (!name || !sid) {
        alert('กรุณากรอกชื่อ-นามสกุลก่อนบันทึก');
        return;
      }
      const isNew = !this.state.profile.created;
      this.state.profile = {
        name,
        studentId: sid,
        classRoom: room,
        heroClass: this.selectedClassTemp,
        created: true
      };
      if (isNew) {
        const stats = this.getPlayerStats();
        this.state.hp = stats.maxHp;
        if (this.selectedClassTemp === 'paladin') {
          this.state.inventory.shield = (this.state.inventory.shield || 0) + 1;
        }
        this.unlockBadge('first_login');
      }
      this.saveState(true);
      this.closeModal('modal-profile');
      this.renderHUD();
      this.renderDashboard();
      soundFX.playPowerUp();
      this.toast(`บันทึกข้อมูล ${name} เรียบร้อย!`);
    },

    closeModal(id) {
      soundFX.playSelect();
      document.getElementById(id).classList.add('hidden');
    },

    toggleSFX() {
      const on = soundFX.toggleSFX();
      document.getElementById('btn-sfx').textContent = on ? '🔊 SFX' : '🔇 SFX';
    },

    toggleBGM() {
      const on = soundFX.toggleBGM();
      document.getElementById('btn-bgm').textContent = on ? '🎵 BGM:ON' : '🎵 BGM';
      document.getElementById('btn-bgm').classList.toggle('px-btn-cyan', on);
    },

    toggleCRT() {
      this.state.crt = !this.state.crt;
      document.body.classList.toggle('crt-active', this.state.crt);
      this.saveState();
    },

    /* ---------------- DASHBOARD / WORLD MAP ---------------- */
    showWorldMap() {
      soundFX.playSelect();
      this.stopBattleTimer();
      document.getElementById('view-stage').classList.add('hidden');
      document.getElementById('view-dashboard').classList.remove('hidden');
      this.renderDashboard();
    },

    isUnitLocked(unitId) {
      return Array.isArray(this.lockedUnits) && this.lockedUnits.includes(Number(unitId));
    },

    continueNextUnit() {
      for (let i = 1; i <= GameData.UNITS.length; i++) {
        if (!this.isTeacher && this.isUnitLocked(i)) continue;
        if (!this.state.unitProgress[i] || !this.state.unitProgress[i].bossCleared) {
          this.openUnit(i);
          return;
        }
      }
      const firstOpen = GameData.UNITS.find((u) => this.isTeacher || !this.isUnitLocked(u.id));
      if (firstOpen) this.openUnit(firstOpen.id);
      else this.toast('🔒 ขณะนี้หน่วยการเรียนรู้ทั้งหมดถูกล็อกโดยครูผู้สอน');
    },

    renderDashboard() {
      // Render 10 Units
      const grid = document.getElementById('units-grid');
      grid.innerHTML = GameData.UNITS.map((u) => {
        const prog = this.state.unitProgress[u.id] || { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 };
        const starsStr = '★'.repeat(prog.stars) + '☆'.repeat(3 - prog.stars);
        const locked = this.isUnitLocked(u.id);
        return `
          <div class="unit-card ${prog.bossCleared ? 'cleared' : ''} ${locked ? 'locked' : ''}" onclick="App.openUnit(${u.id})">
            <div>
              <div class="unit-card-head">
                <div>
                  <span class="unit-code" style="color:${u.color};">${u.code}</span>
                  ${locked ? '<span class="unit-lock-pill">🔒 ล็อกโดยครู</span>' : ''}
                  <h3 style="margin-top:8px; font-size:1.05rem;">${u.title}</h3>
                </div>
                <div class="unit-boss-preview">${PixelSprites.render(u.boss.sprite, 52)}</div>
              </div>
              <p style="font-size:0.84rem; color:var(--text-muted); margin-top:8px;">${u.subtitle}</p>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.82rem; margin-bottom:8px;">
                <span>Lab: ${prog.labCleared ? '<b style="color:var(--emerald)">✔ ผ่านแล้ว</b>' : '<span style="color:var(--amber)">รอทำแล็บ</span>'}</span>
                <span>Boss: ${prog.bossCleared ? '<b style="color:var(--emerald)">✔ ปราบแล้ว</b>' : '<span style="color:var(--crimson)">ยังไม่ปราบ</span>'}</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:2px dashed #334155; padding-top:8px;">
                <span class="stars-row" style="color:var(--amber);">${starsStr}</span>
                ${locked
                  ? `<span class="px-btn px-btn-sm" style="border-color:var(--crimson); color:#fca5a5;">${this.isTeacher ? '🔒 ล็อก (ครูเข้าดูได้)' : '🔒 ถูกล็อก'}</span>`
                  : `<span class="px-btn px-btn-cyan px-btn-sm">${prog.bossCleared ? '🔁 เล่นซ้ำ' : '⚔️ เข้าภารกิจ'}</span>`
                }
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Render Daily Quests
      const dqList = document.getElementById('daily-quests-list');
      dqList.innerHTML = GameData.DAILY_QUESTS.map((q) => {
        const val = this.state.daily[q.metric] || 0;
        const done = val >= q.target;
        const claimed = this.state.daily.claimed.includes(q.id);
        return `
          <div class="quest-item ${done && !claimed ? 'ready' : ''}">
            <div style="display:flex; justify-content:space-between; gap:8px; font-size:0.88rem; font-weight:700;">
              <span>${q.title}</span>
              <span style="color:var(--cyan);">${Math.min(val, q.target)}/${q.target}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem;">
              <span style="color:var(--amber);">รางวัล: +${q.rewardXp} XP, +${q.rewardCoins} 🪙</span>
              ${claimed
                ? '<span style="color:var(--emerald); font-weight:700;">✔ รับแล้ว</span>'
                : (done
                  ? `<button class="px-btn px-btn-amber px-btn-sm" onclick="App.claimDailyQuest('${q.id}')">รับรางวัล!</button>`
                  : '<span style="color:var(--text-muted);">กำลังทำ...</span>')}
            </div>
          </div>
        `;
      }).join('');

      // Render Badges
      document.getElementById('badge-counter-text').textContent = `${this.state.badges.length}/${GameData.BADGES.length}`;
      const bGrid = document.getElementById('badges-grid');
      bGrid.innerHTML = GameData.BADGES.map((b) => {
        const unlocked = this.state.badges.includes(b.id);
        return `
          <div class="badge-slot ${unlocked ? 'unlocked' : ''}" onclick="App.showBadgeTip('${b.id}')" title="${b.name}: ${b.desc}">
            <span>${b.icon}</span>
            <span class="badge-label">${b.name}</span>
          </div>
        `;
      }).join('');
    },

    showBadgeTip(id) {
      soundFX.playSelect();
      const b = GameData.BADGES.find((x) => x.id === id);
      if (!b) return;
      const unlocked = this.state.badges.includes(id);
      document.getElementById('badge-detail-tip').innerHTML =
        `${b.icon} <b>${b.name}</b> — ${b.desc} (${unlocked ? '<span style="color:var(--emerald)">ปลดล็อกแล้ว ✔</span>' : '<span style="color:var(--amber)">ยังไม่ปลดล็อก</span>'})`;
    },

    claimDailyQuest(id) {
      const q = GameData.DAILY_QUESTS.find((x) => x.id === id);
      if (!q || this.state.daily.claimed.includes(id)) return;
      if ((this.state.daily[q.metric] || 0) < q.target) return;
      this.state.daily.claimed.push(id);
      this.addRewards(q.rewardXp, q.rewardCoins, `ภารกิจรายวัน: ${q.title}`);
      this.renderDashboard();
    },

    /* ---------------- UNIT STAGE (CODEX / LAB / BOSS) ---------------- */
    openUnit(unitId) {
      if (!this.isTeacher && this.isUnitLocked(unitId)) {
        soundFX.playPlayerHurt();
        this.toast(`🔒 หน่วยการเรียนรู้ที่ ${unitId} ถูกล็อกโดยครูผู้สอนชั่วคราว (รอครูปลดล็อกก่อนเข้าเรียน)`);
        return;
      }
      soundFX.playSelect();
      this.currentUnitId = unitId;
      this.stopBattleTimer();
      const unit = GameData.UNITS.find((u) => u.id === unitId);
      if (!unit) return;

      document.getElementById('view-dashboard').classList.add('hidden');
      document.getElementById('view-stage').classList.remove('hidden');

      document.getElementById('stage-unit-code').textContent = unit.code;
      document.getElementById('stage-unit-code').style.color = unit.color;
      document.getElementById('stage-unit-title').textContent = unit.title;
      document.getElementById('stage-unit-sub').textContent = `${unit.zoneName} — ${unit.subtitle}`;

      this.refreshStageBadges();
      this.renderCodex(unit);
      this.renderLab(unit);
      const hasSkill = Boolean(GameData.SKILL_EXERCISES && GameData.SKILL_EXERCISES[unit.id]);
      const tabSkill = document.getElementById('tab-skill');
      const tabBoss = document.getElementById('tab-boss');
      if (tabSkill) tabSkill.classList.toggle('hidden', !hasSkill);
      if (tabBoss) tabBoss.textContent = hasSkill ? '4. ⚔️ ศึกดวลบอส 16-Bit (Quiz Battle)' : '3. ⚔️ ศึกดวลบอส 16-Bit (Quiz Battle)';
      this.renderSkillExercise(unit);
      this.renderBossLobby(unit);
      this.switchStageTab('codex');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    refreshStageBadges() {
      const prog = this.state.unitProgress[this.currentUnitId];
      document.getElementById('stage-lab-status').innerHTML = prog.labCleared
        ? '🔬 Lab: <b style="color:var(--emerald)">ผ่านแล้ว</b>'
        : '🔬 Lab: <span style="color:var(--amber)">ยังไม่ผ่าน</span>';
      document.getElementById('stage-boss-status').innerHTML = prog.bossCleared
        ? `👾 Boss: <b style="color:var(--emerald)">ปราบแล้ว (${'★'.repeat(prog.stars)})</b>`
        : '👾 Boss: <span style="color:var(--crimson)">ยังไม่ปราบ</span>';
    },

    switchStageTab(tab) {
      soundFX.playSelect();
      this.currentTab = tab;
      ['codex', 'lab', 'skill', 'boss'].forEach((t) => {
        const tabEl = document.getElementById(`tab-${t}`);
        const bodyEl = document.getElementById(`stage-body-${t}`);
        if (tabEl) tabEl.classList.toggle('active', t === tab);
        if (bodyEl) bodyEl.classList.toggle('hidden', t !== tab);
      });
      if (tab !== 'boss') this.stopBattleTimer();
    },

    /* ---------------- SKILL EXERCISES (UNITS 1 & 2) ---------------- */
    getSkillStorageKey(unitId) {
      const sid = this.state.profile.studentId || 'guest';
      return `netquest_skill_v1_${sid}_u${unitId}`;
    },

    loadSkillAnswers(unitId) {
      try {
        const raw = localStorage.getItem(this.getSkillStorageKey(unitId));
        return raw ? JSON.parse(raw) : { answers: {}, completed: false };
      } catch (e) {
        return { answers: {}, completed: false };
      }
    },

    saveSkillField(unitId, fieldId, value) {
      const data = this.loadSkillAnswers(unitId);
      data.answers[fieldId] = value;
      try { localStorage.setItem(this.getSkillStorageKey(unitId), JSON.stringify(data)); } catch (e) { /* ignore */ }
    },

    renderSkillExercise(unit) {
      const el = document.getElementById('stage-body-skill');
      if (!el) return;
      const ex = GameData.SKILL_EXERCISES && GameData.SKILL_EXERCISES[unit.id];
      if (!ex) {
        el.innerHTML = '';
        return;
      }
      const saved = this.loadSkillAnswers(unit.id);
      const ans = saved.answers || {};
      const esc = (v) => String(v || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

      el.innerHTML = `
        <div class="pixel-box lab-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
            <div>
              <h3 style="color:var(--cyan);">📝 ${ex.title}</h3>
              <p style="font-size:0.86rem; color:var(--text-muted); margin-top:4px;">${ex.instruction}</p>
            </div>
            <span id="skill-status-pill" class="res-pill" style="color:${saved.completed ? 'var(--emerald)' : 'var(--amber)'};">
              ${saved.completed ? '✔ บันทึกและตรวจแล้ว' : '✏️ รอทำแบบฝึกทักษะ'}
            </span>
          </div>

          <div style="display:flex; flex-direction:column; gap:14px; margin-top:14px;">
            ${ex.connectorPart ? '<h4 style="color:var(--amber); border-bottom:2px solid var(--border-dim); padding-bottom:6px;">ตอนที่ 1 ให้นักเรียนตอบคำถามต่อไปนี้</h4>' : ''}
            ${ex.writtenSections.map((sec) => `
              <div class="pixel-box" style="padding:14px;">
                <div style="font-weight:700; color:#f8fafc; margin-bottom:10px;">${sec.no}. ${sec.prompt}</div>
                <div style="display:flex; flex-direction:column; gap:10px;">
                  ${sec.items.map((it) => `
                    <div>
                      <label style="font-size:0.84rem; color:var(--cyan); display:block; margin-bottom:4px;">${it.label}</label>
                      ${it.multiline
                        ? `<textarea id="sk-${it.id}" class="px-textarea" rows="3" placeholder="${esc(it.placeholder)}" oninput="App.saveSkillField(${unit.id}, '${it.id}', this.value)">${esc(ans[it.id])}</textarea>`
                        : `<input id="sk-${it.id}" class="px-input" value="${esc(ans[it.id])}" placeholder="${esc(it.placeholder)}" oninput="App.saveSkillField(${unit.id}, '${it.id}', this.value)" />`
                      }
                      <div class="skill-model-ans hidden" style="margin-top:6px; padding:8px 10px; background:rgba(16,185,129,0.12); border-left:3px solid var(--emerald); font-size:0.82rem; color:#a7f3d0;">
                        💡 <b>แนวคำตอบ:</b> ${it.model}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}

            ${ex.connectorPart ? `
              <div class="pixel-box" style="padding:14px;">
                <h4 style="color:var(--amber); margin-bottom:10px;">${ex.connectorPart.title}</h4>
                <div style="overflow-x:auto;">
                  <table class="pixel-table">
                    <thead>
                      <tr>
                        <th style="width:60px;">ข้อที่</th>
                        <th style="width:180px;">รูปภาพ</th>
                        <th>ชื่อหัวต่อ</th>
                        <th>สายที่ใช้</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${ex.connectorPart.rows.map((row) => {
                        const nKey = `u2_p2_n_${row.no}`;
                        const cKey = `u2_p2_c_${row.no}`;
                        return `
                          <tr id="sk-conn-row-${row.no}">
                            <td><b>${row.no}</b></td>
                            <td><div style="display:inline-block; border:2px solid var(--border-dim);">${row.svg}</div></td>
                            <td>
                              <select id="sk-${nKey}" class="px-select" onchange="App.saveSkillField(${unit.id}, '${nKey}', this.value)">
                                <option value="">-- เลือกชื่อหัวต่อ --</option>
                                ${ex.connectorPart.nameOptions.map((opt) => `<option value="${opt}" ${ans[nKey] === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                              </select>
                              <div class="skill-model-ans hidden" style="margin-top:4px; font-size:0.78rem; color:#6ee7b7;">เฉลย: ${row.ansName}</div>
                            </td>
                            <td>
                              <select id="sk-${cKey}" class="px-select" onchange="App.saveSkillField(${unit.id}, '${cKey}', this.value)">
                                <option value="">-- เลือกสายที่ใช้ --</option>
                                ${ex.connectorPart.cableOptions.map((opt) => `<option value="${opt}" ${ans[cKey] === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                              </select>
                              <div class="skill-model-ans hidden" style="margin-top:4px; font-size:0.78rem; color:#6ee7b7;">เฉลย: ${row.ansCable}</div>
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}
          </div>

          <div id="skill-feedback-box" style="margin-top:14px; font-size:0.88rem; color:var(--text-muted);"></div>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:14px;">
            <button class="px-btn px-btn-emerald" onclick="App.submitSkillExercise(${unit.id})">✔ ตรวจคำตอบและบันทึก</button>
            <button class="px-btn px-btn-amber" onclick="App.toggleSkillModelAnswers()">💡 เปิด/ซ่อนแนวคำตอบ (เฉลย)</button>
            <button class="px-btn px-btn-sm" onclick="App.clearSkillAnswers(${unit.id})">🧹 ล้างคำตอบ</button>
          </div>
        </div>
      `;
    },

    toggleSkillModelAnswers() {
      soundFX.playSelect();
      document.querySelectorAll('#stage-body-skill .skill-model-ans').forEach((el) => {
        el.classList.toggle('hidden');
      });
    },

    clearSkillAnswers(unitId) {
      if (!confirm(`ต้องการล้างคำตอบแบบฝึกทักษะบทที่ ${unitId} ทั้งหมดหรือไม่?`)) return;
      const saved = this.loadSkillAnswers(unitId);
      saved.answers = {};
      try { localStorage.setItem(this.getSkillStorageKey(unitId), JSON.stringify(saved)); } catch (e) { /* ignore */ }
      const unit = GameData.UNITS.find((u) => u.id === unitId);
      if (unit) this.renderSkillExercise(unit);
      this.toast('🧹 ล้างคำตอบเรียบร้อยแล้ว');
    },

    submitSkillExercise(unitId) {
      const ex = GameData.SKILL_EXERCISES && GameData.SKILL_EXERCISES[unitId];
      if (!ex) return;
      const saved = this.loadSkillAnswers(unitId);
      const fb = document.getElementById('skill-feedback-box');

      let missingWritten = 0;
      ex.writtenSections.forEach((sec) => {
        sec.items.forEach((it) => {
          const val = (document.getElementById(`sk-${it.id}`)?.value || '').trim();
          saved.answers[it.id] = val;
          if (!val) missingWritten++;
        });
      });

      let connCorrect = 0;
      let connTotal = 0;
      if (ex.connectorPart) {
        connTotal = ex.connectorPart.rows.length;
        ex.connectorPart.rows.forEach((row) => {
          const nKey = `u2_p2_n_${row.no}`;
          const cKey = `u2_p2_c_${row.no}`;
          const nVal = document.getElementById(`sk-${nKey}`)?.value || '';
          const cVal = document.getElementById(`sk-${cKey}`)?.value || '';
          saved.answers[nKey] = nVal;
          saved.answers[cKey] = cVal;
          const ok = nVal === row.ansName && cVal === row.ansCable;
          if (ok) connCorrect++;
          const tr = document.getElementById(`sk-conn-row-${row.no}`);
          if (tr) tr.style.background = ok ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.16)';
        });
      }

      if (missingWritten > 0) {
        soundFX.playPlayerHurt();
        try { localStorage.setItem(this.getSkillStorageKey(unitId), JSON.stringify(saved)); } catch (e) { /* ignore */ }
        fb.innerHTML = `<div style="color:#fda4af;">⚠️ ยังตอบคำถามตอนที่ 1 ไม่ครบ (เหลืออีก ${missingWritten} ช่อง) กรุณากรอกให้ครบก่อนส่งตรวจนะครับ</div>`;
        return;
      }

      if (ex.connectorPart && connCorrect < connTotal) {
        soundFX.playPlayerHurt();
        try { localStorage.setItem(this.getSkillStorageKey(unitId), JSON.stringify(saved)); } catch (e) { /* ignore */ }
        fb.innerHTML = `<div style="color:#facc15;">🔎 ตอนที่ 2 (รูปภาพหัวต่อ) ถูก <b>${connCorrect}/${connTotal} ข้อ</b> — แถวสีแดงยังมีจุดผิด ลองปรับคำตอบแล้วกดตรวจอีกครั้งนะ!</div>`;
        return;
      }

      const firstComplete = !saved.completed;
      saved.completed = true;
      try { localStorage.setItem(this.getSkillStorageKey(unitId), JSON.stringify(saved)); } catch (e) { /* ignore */ }
      const pill = document.getElementById('skill-status-pill');
      if (pill) {
        pill.textContent = '✔ บันทึกและตรวจแล้ว';
        pill.style.color = 'var(--emerald)';
      }

      soundFX.playPowerUp();
      fb.innerHTML = `<div style="color:#4ade80;">✅ บันทึกแบบฝึกทักษะบทเรียนที่ ${unitId} ครบถ้วนสมบูรณ์! ${ex.connectorPart ? `(ตอนที่ 2 ได้เต็ม ${connCorrect}/${connTotal} คะแนน)` : ''} สามารถกดปุ่ม "เปิด/ซ่อนแนวคำตอบ" เพื่อทบทวนเพิ่มเติมได้</div>`;
      if (firstComplete) {
        this.addRewards(60, 20, `ทำแบบฝึกทักษะบทที่ ${unitId} สำเร็จ`);
      } else {
        this.toast(`💾 บันทึกคำตอบแบบฝึกทักษะบทที่ ${unitId} เรียบร้อยแล้ว`);
      }
    },

    renderCodex(unit) {
      const el = document.getElementById('stage-body-codex');
      el.innerHTML = `
        <div class="pixel-box codex-diagram-box">
          <div style="font-weight:700; color:var(--cyan); margin-bottom:10px;">📊 แผนภาพอินโฟกราฟิกประจำหน่วย (Pixel Infographic)</div>
          ${unit.svgDiagram}
        </div>
        <div class="codex-cards-grid">
          ${unit.codexCards.map((c) => `
            <div class="pixel-box codex-card">
              <h3>📌 ${c.title}</h3>
              <ul>${c.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:18px; text-align:right;">
          <button class="px-btn px-btn-emerald" onclick="App.switchStageTab('lab')">ไปฝึกปฏิบัติในห้อง Lab Simulator ➜</button>
        </div>
      `;
    },

    /* ---------------- 10 INTERACTIVE PIXEL LAB SIMULATORS ---------------- */
    renderLab(unit) {
      const el = document.getElementById('stage-body-lab');
      if (unit.id === 1) this.initLab1(el);
      else if (unit.id === 2) this.initLabMedia(el);
      else if (unit.id === 3) this.initLab3(el);
      else if (unit.id === 4) this.initLab2(el);
      else if (unit.id === 5) this.initLab5(el);
      else if (unit.id === 6) this.initLabWindowsNet(el);
      else if (unit.id === 7) this.initLabNosVm(el);
      else if (unit.id === 8) this.initLab4(el);
      else if (unit.id === 9) this.initLab6(el);
      else if (unit.id === 10) this.initLabUserPerm(el);
    },

    completeUnitLab(unitId, msg) {
      const prog = this.state.unitProgress[unitId];
      const firstTime = !prog.labCleared;
      prog.labCleared = true;
      this.state.daily.labsCompletedToday += 1;
      this.refreshStageBadges();
      this.addRewards(firstTime ? 130 : 15, firstTime ? 45 : 0, msg || `ผ่านปฏิบัติการ Lab หน่วยที่ ${unitId}`);
    },

    /* === LAB 1: Topology Architect & Fault Simulator === */
    initLab1(el) {
      this.labState[1] = { mode: 'star', links: [], faultCut: false, packetActive: false, scenarioDone: false };
      el.innerHTML = `
        <div class="pixel-box lab-panel">
          <h3 style="color:var(--emerald); margin-bottom:8px;">🔬 Lab 1: สถาปนิกผังเครือข่าย &amp; จำลองสายสัญญาณขาด</h3>
          <p style="color:var(--text-muted); margin-bottom:14px;">
            ภารกิจ: 1) เชื่อมสายครบทุกโหนดในผัง Star แล้วกดจำลองส่งแพ็กเก็ต + ทดลองตัดสาย เพื่อดูผลกระทบ 2) ตอบสถานการณ์เลือกเครือข่าย 4 ข้อให้ครบ
          </p>
          <div class="lab-grid-2">
            <div class="topo-board">
              <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
                <button class="px-btn px-btn-cyan px-btn-sm" onclick="App.lab1SetMode('star')">⭐ Star Topology</button>
                <button class="px-btn px-btn-amber px-btn-sm" onclick="App.lab1SetMode('bus')">🚌 Bus Topology</button>
                <button class="px-btn px-btn-violet px-btn-sm" onclick="App.lab1SetMode('mesh')">🕸️ Mesh Topology</button>
              </div>
              <div id="lab1-svg-wrap"></div>
              <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">
                <button class="px-btn px-btn-emerald px-btn-sm" onclick="App.lab1ConnectAll()">🔌 เชื่อมสายทุกโหนด</button>
                <button class="px-btn px-btn-cyan px-btn-sm" onclick="App.lab1SimulatePacket()">📨 ส่งแพ็กเก็ต</button>
                <button class="px-btn px-btn-crimson px-btn-sm" onclick="App.lab1ToggleFault()">✂️ จำลองสายเส้นที่ 1 ขาด</button>
              </div>
              <div id="lab1-sim-log" style="margin-top:10px; font-size:0.86rem; color:#93c5fd; min-height:42px;">
                คำแนะนำ: กด "เชื่อมสายทุกโหนด" แล้วลองกด "จำลองสายเส้นที่ 1 ขาด" เทียบระหว่าง Star กับ Bus
              </div>
            </div>

            <div class="pixel-box" style="padding:14px;">
              <h4 style="color:var(--amber); margin-bottom:10px;">📋 วิเคราะห์สถานการณ์จริง (4 ข้อ)</h4>
              <div style="display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
                <div>
                  <label>1. ห้องเรียนคอม 35 เครื่อง ต้องการสายขาด 1 เส้นแล้วไม่ล่มทั้งห้อง:</label>
                  <select id="l1-q1" class="px-select">
                    <option value="">-- เลือก --</option>
                    <option value="star">LAN - Star Topology</option>
                    <option value="bus">LAN - Bus Topology</option>
                    <option value="pan">PAN - Bluetooth</option>
                  </select>
                </div>
                <div>
                  <label>2. เชื่อมต่อนาฬิกา Smart Watch กับมือถือในระยะ 2 เมตร:</label>
                  <select id="l1-q2" class="px-select">
                    <option value="">-- เลือก --</option>
                    <option value="wan">WAN</option>
                    <option value="pan">PAN</option>
                    <option value="man">MAN</option>
                  </select>
                </div>
                <div>
                  <label>3. เชื่อมเครือข่ายวิทยาลัย 4 วิทยาเขตครอบคลุมทั้งจังหวัด:</label>
                  <select id="l1-q3" class="px-select">
                    <option value="">-- เลือก --</option>
                    <option value="pan">PAN</option>
                    <option value="man">MAN</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>
                <div>
                  <label>4. ศูนย์ข้อมูลธนาคารต้องการเส้นทางสำรองทุกเครื่องต่อถึงกัน:</label>
                  <select id="l1-q4" class="px-select">
                    <option value="">-- เลือก --</option>
                    <option value="mesh">Mesh Topology</option>
                    <option value="bus">Bus Topology</option>
                    <option value="ring">Ring Topology</option>
                  </select>
                </div>
                <button class="px-btn px-btn-emerald" onclick="App.lab1Check()">✔ ตรวจผลปฏิบัติการ Lab 1</button>
              </div>
            </div>
          </div>
        </div>
      `;
      this.lab1RenderSVG();
    },

    lab1SetMode(mode) {
      soundFX.playSelect();
      this.labState[1].mode = mode;
      this.labState[1].packetActive = false;
      this.lab1RenderSVG();
    },

    lab1ConnectAll() {
      soundFX.playWireSnap();
      this.labState[1].links = [1, 2, 3, 4];
      this.lab1RenderSVG();
      document.getElementById('lab1-sim-log').textContent = `✔ เชื่อมต่อสายในผัง ${this.labState[1].mode.toUpperCase()} เรียบร้อย! ลองส่งแพ็กเก็ตหรือตัดสายดูได้เลย`;
    },

    lab1SimulatePacket() {
      if (this.labState[1].links.length < 4) {
        alert('กรุณากด "เชื่อมสายทุกโหนด" ก่อนส่งแพ็กเก็ต');
        return;
      }
      soundFX.playLaserAttack();
      this.labState[1].packetActive = true;
      this.lab1RenderSVG();
      const s = this.labState[1];
      let msg = '📨 แพ็กเก็ตวิ่งถึงทุกโหนดสมบูรณ์!';
      if (s.faultCut && s.mode === 'bus') msg = '❌ สายหลัก Bus ขาด! แพ็กเก็ตส่งไม่ได้ เครือข่ายล่มทั้งวง!';
      else if (s.faultCut && s.mode === 'star') msg = '⚠️ PC-1 สายขาด แต่ PC-2, PC-3, Server ยังส่งผ่าน Switch ได้ปกติ!';
      else if (s.faultCut && s.mode === 'mesh') msg = '✅ สายเส้น 1 ขาด แต่ Mesh วิ่งอ้อมผ่านเส้นทางสำรองได้ 100%!';
      document.getElementById('lab1-sim-log').textContent = msg;
    },

    lab1ToggleFault() {
      soundFX.playCrimp();
      this.labState[1].faultCut = !this.labState[1].faultCut;
      this.lab1RenderSVG();
      const s = this.labState[1];
      if (!s.faultCut) {
        document.getElementById('lab1-sim-log').textContent = '🔧 ซ่อมสายสัญญาณเส้นที่ 1 กลับมาใช้งานได้แล้ว';
      } else {
        this.lab1SimulatePacket();
      }
    },

    lab1RenderSVG() {
      const s = this.labState[1];
      const connected = s.links.length === 4;
      let lines = '';
      let nodes = '';

      if (s.mode === 'star') {
        if (connected) {
          lines += `<line x1="210" y1="150" x2="80" y2="65" stroke="${s.faultCut ? '#ef4444' : '#22c55e'}" stroke-width="4" stroke-dasharray="${s.faultCut ? '6,6' : 'none'}"/>`;
          lines += `<line x1="210" y1="150" x2="340" y2="65" stroke="#22c55e" stroke-width="4"/>`;
          lines += `<line x1="210" y1="150" x2="80" y2="235" stroke="#22c55e" stroke-width="4"/>`;
          lines += `<line x1="210" y1="150" x2="340" y2="235" stroke="#22c55e" stroke-width="4"/>`;
        }
        if (s.packetActive && connected) {
          lines += `<circle cx="275" cy="108" r="7" fill="#38bdf8" class="packet-dot"/>`;
          lines += `<circle cx="275" cy="192" r="7" fill="#38bdf8" class="packet-dot"/>`;
        }
        nodes = `
          <rect x="180" y="130" width="60" height="40" fill="#1d4ed8" stroke="#93c5fd" stroke-width="3"/>
          <text x="210" y="154" fill="#fff" font-size="11" text-anchor="middle" font-weight="bold">SWITCH</text>
          <rect x="52" y="45" width="56" height="36" fill="${s.faultCut ? '#7f1d1d' : '#0f766e'}" stroke="#fff" stroke-width="2"/><text x="80" y="67" fill="#fff" font-size="11" text-anchor="middle">PC-1 ${s.faultCut ? '✖' : ''}</text>
          <rect x="312" y="45" width="56" height="36" fill="#0f766e" stroke="#fff" stroke-width="2"/><text x="340" y="67" fill="#fff" font-size="11" text-anchor="middle">PC-2</text>
          <rect x="52" y="215" width="56" height="36" fill="#0f766e" stroke="#fff" stroke-width="2"/><text x="80" y="237" fill="#fff" font-size="11" text-anchor="middle">PC-3</text>
          <rect x="312" y="215" width="56" height="36" fill="#6d28d9" stroke="#fff" stroke-width="2"/><text x="340" y="237" fill="#fff" font-size="11" text-anchor="middle">SERVER</text>
        `;
      } else if (s.mode === 'bus') {
        if (connected) {
          lines += `<line x1="40" y1="150" x2="380" y2="150" stroke="${s.faultCut ? '#ef4444' : '#f59e0b'}" stroke-width="6" stroke-dasharray="${s.faultCut ? '10,8' : 'none'}"/>`;
          lines += `<line x1="90" y1="150" x2="90" y2="75" stroke="#94a3b8" stroke-width="3"/>`;
          lines += `<line x1="170" y1="150" x2="170" y2="225" stroke="#94a3b8" stroke-width="3"/>`;
          lines += `<line x1="250" y1="150" x2="250" y2="75" stroke="#94a3b8" stroke-width="3"/>`;
          lines += `<line x1="330" y1="150" x2="330" y2="225" stroke="#94a3b8" stroke-width="3"/>`;
        }
        nodes = `
          <rect x="32" y="140" width="12" height="20" fill="#ef4444"/><rect x="376" y="140" width="12" height="20" fill="#ef4444"/>
          <rect x="64" y="45" width="52" height="30" fill="${s.faultCut ? '#7f1d1d' : '#334155'}" stroke="#fff" stroke-width="2"/><text x="90" y="64" fill="#fff" font-size="10" text-anchor="middle">PC-1</text>
          <rect x="144" y="225" width="52" height="30" fill="${s.faultCut ? '#7f1d1d' : '#334155'}" stroke="#fff" stroke-width="2"/><text x="170" y="244" fill="#fff" font-size="10" text-anchor="middle">PC-2</text>
          <rect x="224" y="45" width="52" height="30" fill="${s.faultCut ? '#7f1d1d' : '#334155'}" stroke="#fff" stroke-width="2"/><text x="250" y="64" fill="#fff" font-size="10" text-anchor="middle">PC-3</text>
          <rect x="304" y="225" width="52" height="30" fill="${s.faultCut ? '#7f1d1d' : '#6d28d9'}" stroke="#fff" stroke-width="2"/><text x="330" y="244" fill="#fff" font-size="10" text-anchor="middle">SRV</text>
        `;
      } else {
        if (connected) {
          lines += `<line x1="90" y1="70" x2="330" y2="70" stroke="${s.faultCut ? '#ef4444' : '#a855f7'}" stroke-width="3" stroke-dasharray="${s.faultCut ? '6,6' : 'none'}"/>`;
          lines += `<line x1="90" y1="230" x2="330" y2="230" stroke="#a855f7" stroke-width="3"/>`;
          lines += `<line x1="90" y1="70" x2="90" y2="230" stroke="#a855f7" stroke-width="3"/>`;
          lines += `<line x1="330" y1="70" x2="330" y2="230" stroke="#a855f7" stroke-width="3"/>`;
          lines += `<line x1="90" y1="70" x2="330" y2="230" stroke="#38bdf8" stroke-width="3"/>`;
          lines += `<line x1="330" y1="70" x2="90" y2="230" stroke="#38bdf8" stroke-width="3"/>`;
        }
        if (s.packetActive && connected) {
          lines += `<circle cx="210" cy="150" r="8" fill="#22c55e" class="packet-dot"/>`;
        }
        nodes = `
          <rect x="64" y="52" width="52" height="34" fill="#6d28d9" stroke="#fff" stroke-width="2"/><text x="90" y="73" fill="#fff" font-size="10" text-anchor="middle">NODE A</text>
          <rect x="304" y="52" width="52" height="34" fill="#6d28d9" stroke="#fff" stroke-width="2"/><text x="330" y="73" fill="#fff" font-size="10" text-anchor="middle">NODE B</text>
          <rect x="64" y="212" width="52" height="34" fill="#6d28d9" stroke="#fff" stroke-width="2"/><text x="90" y="233" fill="#fff" font-size="10" text-anchor="middle">NODE C</text>
          <rect x="304" y="212" width="52" height="34" fill="#6d28d9" stroke="#fff" stroke-width="2"/><text x="330" y="233" fill="#fff" font-size="10" text-anchor="middle">NODE D</text>
        `;
      }

      document.getElementById('lab1-svg-wrap').innerHTML = `
        <svg viewBox="0 0 420 290" class="topo-svg" shape-rendering="crispEdges">
          <rect width="420" height="290" fill="#050a18"/>
          ${lines}${nodes}
        </svg>
      `;
    },

    lab1Check() {
      const a1 = document.getElementById('l1-q1').value;
      const a2 = document.getElementById('l1-q2').value;
      const a3 = document.getElementById('l1-q3').value;
      const a4 = document.getElementById('l1-q4').value;
      if (this.labState[1].links.length < 4) {
        alert('อย่าลืมกด "เชื่อมสายทุกโหนด" บนกระดานจำลองด้วยนะครับ!');
        return;
      }
      if (a1 === 'star' && a2 === 'pan' && a3 === 'man' && a4 === 'mesh') {
        this.completeUnitLab(1, 'ผ่าน Lab 1 สถาปนิกผังเครือข่าย');
      } else {
        soundFX.playPlayerHurt();
        alert('ยังมีบางข้อไม่ถูกต้อง ลองทบทวนขนาดเครือข่าย PAN/LAN/MAN/WAN และ Topology อีกครั้งนะ!');
      }
    },

    /* === LAB 2: 16-Bit RJ-45 Cable Crimper & Device Placement === */
    initLab2(el) {
      this.labState[2] = { standard: 'T568B', pins: Array(8).fill(null), crimped: false, testerPassed: false, attempts: 0 };
      el.innerHTML = `
        <div class="pixel-box lab-panel">
          <h3 style="color:var(--amber); margin-bottom:8px;">🔬 Lab 4: ห้องปฏิบัติการเข้าหัวสาย LAN RJ-45 &amp; ติดตั้งอุปกรณ์</h3>
          <div class="lab-grid-2">
            <div class="rj45-shell">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <span style="font-weight:700; color:var(--cyan);">เลือกโหมดมาตรฐาน:</span>
                <div style="display:flex; gap:6px;">
                  <button class="px-btn px-btn-cyan px-btn-sm" onclick="App.lab2SetStd('T568B')">T568B (มาตรฐานหลัก)</button>
                  <button class="px-btn px-btn-violet px-btn-sm" onclick="App.lab2SetStd('T568A')">T568A</button>
                </div>
              </div>
              <div id="lab2-std-hint" style="font-size:0.84rem; color:var(--amber); margin-top:8px;">
                เป้าหมายปัจจุบัน: เรียงสีสาย <b>T568B</b> จาก Pin 1 → Pin 8 ให้ถูกต้อง
              </div>

              <div class="rj45-pins-row" id="lab2-pins-row"></div>

              <div style="font-size:0.84rem; font-weight:700;">คลิกเลือกสีสายไฟเพื่อเสียบเข้าพินถัดไป (หรือคลิกที่พินเพื่อถอดออก):</div>
              <div class="wire-palette" id="lab2-wire-palette"></div>

              <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px;">
                <button class="px-btn px-btn-sm" onclick="App.lab2ResetWires()">🔄 ล้างสายใหม่</button>
                <button class="px-btn px-btn-amber px-btn-sm" onclick="App.lab2Crimp()">🗜️ บีบหัวสายด้วยคีม (Crimp)</button>
                <button class="px-btn px-btn-emerald px-btn-sm" onclick="App.lab2RunTester()">🔦 เปิด LAN Cable Tester</button>
              </div>

              <div class="tester-box">
                <div style="display:flex; justify-content:space-between; font-size:0.82rem;">
                  <span>เครื่องทดสอบสาย LAN (RJ-45 Tester)</span>
                  <span id="lab2-tester-status" style="color:var(--text-muted);">พร้อมทดสอบ</span>
                </div>
                <div class="tester-leds" id="lab2-leds">
                  ${[1,2,3,4,5,6,7,8].map((p) => `<div id="led-${p}" class="tester-led">P${p}</div>`).join('')}
                </div>
              </div>
            </div>

            <div class="pixel-box" style="padding:14px;">
              <h4 style="color:var(--cyan); margin-bottom:10px;">🛠️ ติดตั้งอุปกรณ์เครือข่ายให้ถูกจุด</h4>
              <div style="display:flex; flex-direction:column; gap:12px; font-size:0.88rem;">
                <div>
                  <label>1. จุดรับเน็ตจากผู้ให้บริการ ISP และเชื่อมเครือข่ายต่างวง:</label>
                  <select id="l2-dev1" class="px-select">
                    <option value="">-- เลือกอุปกรณ์ --</option>
                    <option value="hub">Hub (Layer 1)</option>
                    <option value="router">Router (Layer 3)</option>
                    <option value="repeater">Repeater</option>
                  </select>
                </div>
                <div>
                  <label>2. จุดกระจายสาย UTP ในห้องปฏิบัติการ 30 เครื่อง (จำ MAC Address):</label>
                  <select id="l2-dev2" class="px-select">
                    <option value="">-- เลือกอุปกรณ์ --</option>
                    <option value="switch">Switch Layer 2</option>
                    <option value="hub">Hub</option>
                    <option value="modem">Modem 56K</option>
                  </select>
                </div>
                <div>
                  <label>3. จุดกระจายสัญญาณไร้สาย Wi-Fi สำหรับโถงอาคารเรียน:</label>
                  <select id="l2-dev3" class="px-select">
                    <option value="">-- เลือกอุปกรณ์ --</option>
                    <option value="ap">Access Point (AP)</option>
                    <option value="crimper">Crimping Tool</option>
                    <option value="nic">UTP Wall Jack</option>
                  </select>
                </div>
                <div>
                  <label>4. สายสัญญาณสำหรับเดินเชื่อมตึกไกล 700 เมตร ผ่านแนวสายไฟแรงสูง:</label>
                  <select id="l2-dev4" class="px-select">
                    <option value="">-- เลือกสายสัญญาณ --</option>
                    <option value="utp">สาย UTP Cat5e</option>
                    <option value="fiber">สาย Fiber Optic</option>
                    <option value="coax">สาย Coaxial</option>
                  </select>
                </div>
                <button class="px-btn px-btn-emerald" onclick="App.lab2VerifyAll()">✔ ส่งงาน Lab หน่วยที่ 2</button>
              </div>
            </div>
          </div>
        </div>
      `;
      this.lab2RenderPins();
    },

    lab2SetStd(std) {
      soundFX.playSelect();
      this.labState[2].standard = std;
      this.lab2ResetWires();
      document.getElementById('lab2-std-hint').innerHTML = `เป้าหมายปัจจุบัน: เรียงสีสาย <b>${std}</b> จาก Pin 1 → Pin 8 ให้ถูกต้อง`;
    },

    lab2RenderPins() {
      const s = this.labState[2];
      const pinsRow = document.getElementById('lab2-pins-row');
      pinsRow.innerHTML = s.pins.map((wireId, idx) => {
        const wire = GameData.T568B.find((w) => w.id === wireId);
        return `
          <div class="rj45-pin-slot ${wire ? 'filled' : ''}" onclick="App.lab2RemovePin(${idx})" title="คลิกเพื่อถอดสายออก">
            <span style="font-size:0.7rem; color:var(--amber);">P${idx + 1}</span>
            ${wire ? `
              <div class="wire-visual" style="background:${wire.color};">
                ${wire.stripe ? `<div class="wire-stripe" style="--stripe-color:${wire.stripe};"></div>` : ''}
              </div>
              <span style="font-size:0.65rem; text-align:center;">${wire.name}</span>
            ` : '<span style="font-size:0.7rem; color:#475569;">ว่าง</span><span></span>'}
          </div>
        `;
      }).join('');

      const palette = document.getElementById('lab2-wire-palette');
      palette.innerHTML = GameData.T568B.map((w) => {
        const used = s.pins.includes(w.id);
        return `
          <button class="wire-pick-btn" ${used || s.crimped ? 'disabled' : ''} onclick="App.lab2AddWire('${w.id}')">
            <span class="wire-swatch" style="background:${w.stripe ? `repeating-linear-gradient(45deg,${w.color},${w.color} 4px,${w.stripe} 4px,${w.stripe} 8px)` : w.color};"></span>
            <span>${w.name}</span>
          </button>
        `;
      }).join('');
    },

    lab2AddWire(id) {
      const s = this.labState[2];
      if (s.crimped) return;
      const emptyIdx = s.pins.indexOf(null);
      if (emptyIdx === -1) return;
      soundFX.playWireSnap();
      s.pins[emptyIdx] = id;
      this.lab2RenderPins();
    },

    lab2RemovePin(idx) {
      const s = this.labState[2];
      if (s.crimped || !s.pins[idx]) return;
      soundFX.playSelect();
      s.pins[idx] = null;
      this.lab2RenderPins();
    },

    lab2ResetWires() {
      soundFX.playSelect();
      const s = this.labState[2];
      s.pins = Array(8).fill(null);
      s.crimped = false;
      s.testerPassed = false;
      document.getElementById('lab2-tester-status').textContent = 'พร้อมทดสอบ';
      for (let p = 1; p <= 8; p++) {
        document.getElementById(`led-${p}`).className = 'tester-led';
      }
      this.lab2RenderPins();
    },

    lab2Crimp() {
      const s = this.labState[2];
      if (s.pins.includes(null)) {
        alert('กรุณาใส่สายให้ครบทั้ง 8 พินก่อนบีบหัวสายด้วยคีม!');
        return;
      }
      soundFX.playCrimp();
      s.crimped = true;
      this.lab2RenderPins();
      this.toast('🗜️ ย้ำหัว RJ-45 แล้ว! กดเปิดเครื่อง LAN Cable Tester ได้เลย');
    },

    lab2RunTester() {
      const s = this.labState[2];
      if (!s.crimped) {
        alert('กรุณากด "บีบหัวสายด้วยคีม (Crimp)" ก่อนทดสอบสาย!');
        return;
      }
      s.attempts += 1;
      const targetOrder = s.standard === 'T568A' ? GameData.T568A_ORDER : GameData.T568B_ORDER;
      let allOk = true;
      for (let i = 1; i <= 8; i++) {
        document.getElementById(`led-${i}`).className = 'tester-led';
      }
      document.getElementById('lab2-tester-status').textContent = 'กำลังสแกนพิน 1-8...';

      for (let i = 0; i < 8; i++) {
        const ok = s.pins[i] === targetOrder[i];
        if (!ok) allOk = false;
        setTimeout(() => {
          soundFX.playTesterBeep(i + 1);
          const led = document.getElementById(`led-${i + 1}`);
          if (led) led.classList.add(ok ? 'led-ok' : 'led-fail');
          if (i === 7) {
            s.testerPassed = allOk;
            const stEl = document.getElementById('lab2-tester-status');
            if (allOk) {
              stEl.innerHTML = `<b style="color:var(--emerald)">PASS! สายตรงมาตรฐาน ${s.standard} ✔</b>`;
              if (s.attempts === 1 && s.standard === 'T568B') this.unlockBadge('perfect_crimper');
            } else {
              stEl.innerHTML = `<b style="color:var(--crimson)">FAIL! มีพินสีผิด กดล้างสายแล้วเรียงใหม่</b>`;
              s.crimped = false;
              this.lab2RenderPins();
            }
          }
        }, i * 160);
      }
    },

    lab2VerifyAll() {
      const s = this.labState[2];
      if (!s.testerPassed) {
        alert('กรุณาเข้าหัวสาย RJ-45 และทดสอบด้วย LAN Cable Tester ให้ผ่าน (PASS) ก่อนนะครับ');
        return;
      }
      const d1 = document.getElementById('l2-dev1').value;
      const d2 = document.getElementById('l2-dev2').value;
      const d3 = document.getElementById('l2-dev3').value;
      const d4 = document.getElementById('l2-dev4').value;
      if (d1 === 'router' && d2 === 'switch' && d3 === 'ap' && d4 === 'fiber') {
        this.completeUnitLab(4, 'ผ่าน Lab 4 การเข้าหัวสาย UTP กับหัวต่อ RJ-45');
      } else {
        soundFX.playPlayerHurt();
        alert('สาย RJ-45 ผ่านแล้ว! แต่อุปกรณ์เครือข่ายทางขวายังเลือกผิดบางจุด ลองตรวจสอบดูนะ');
      }
    },

    /* === LAB 3: OSI 7-Layer Tower & Encapsulation Factory === */
    initLab3(el) {
      const rows = [7, 6, 5, 4, 3, 2, 1];
      const layerOpts = [
        'Application', 'Presentation', 'Session', 'Transport', 'Network', 'Data Link', 'Physical'
      ];
      const pduOpts = ['Data', 'Segment', 'Packet', 'Frame', 'Bits'];
      const protoOpts = [
        'HTTP / DNS / FTP',
        'SSL / TLS / JPEG',
        'Session / NetBIOS',
        'TCP / UDP (Port)',
        'IP / Router',
        'MAC / Switch',
        'UTP / Fiber / Hub'
      ];

      el.innerHTML = `
        <div class="pixel-box lab-panel">
          <h3 style="color:var(--violet); margin-bottom:8px;">🔬 Lab 3: หอคอย OSI 7 Layers &amp; โรงงานห่อหุ้มแพ็กเก็ต</h3>
          <p style="color:var(--text-muted); margin-bottom:12px;">
            จับคู่ชื่อชั้นสื่อสาร หน่วยข้อมูล (PDU) และโปรโตคอล/อุปกรณ์ประจำ Layer 7 ลงมาถึง Layer 1 ให้ถูกต้อง แล้วรัน Encapsulation Simulation
          </p>
          <div class="topo-board" style="margin-bottom:14px;">
            <div id="lab3-svg-wrap"></div>
          </div>
          <div class="osi-stack-list">
            ${rows.map((lvl) => `
              <div class="osi-row">
                <b style="color:var(--amber);">Layer ${lvl}</b>
                <select id="osi-name-${lvl}" class="osi-select" onchange="App.renderLab3SVG()">
                  <option value="">-- เลือกชื่อชั้น --</option>
                  ${layerOpts.map((o) => `<option value="${o}">${o}</option>`).join('')}
                </select>
                <select id="osi-pdu-${lvl}" class="osi-select" onchange="App.renderLab3SVG()">
                  <option value="">-- เลือก PDU --</option>
                  ${pduOpts.map((p) => `<option value="${p}">${p}</option>`).join('')}
                </select>
                <select id="osi-proto-${lvl}" class="osi-select" onchange="App.renderLab3SVG()">
                  <option value="">-- โปรโตคอล/อุปกรณ์ --</option>
                  ${protoOpts.map((pr) => `<option value="${pr}">${pr}</option>`).join('')}
                </select>
              </div>
            `).join('')}
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:14px;">
            <button class="px-btn px-btn-emerald" onclick="App.lab3Check()">✔ ตรวจความถูกต้องและรัน Encapsulation</button>
            <button class="px-btn px-btn-sm" onclick="App.lab3AutoHint()">💡 ใบ้ L7 และ L1</button>
          </div>
          <div id="lab3-encap-box" class="pixel-box" style="margin-top:14px; padding:12px; background:#050a18; min-height:58px; font-family:var(--font-mono); color:var(--cyan);">
            สถานะโรงงานแพ็กเก็ต: รอตรวจความถูกต้องของชั้น OSI...
          </div>
        </div>
      `;
      this.renderLab3SVG();
    },

    renderLab3SVG(activeLvl = 0) {
      const wrap = document.getElementById('lab3-svg-wrap');
      if (!wrap) return;
      const expected = { 7: 'Application', 6: 'Presentation', 5: 'Session', 4: 'Transport', 3: 'Network', 2: 'Data Link', 1: 'Physical' };
      const colors = { 7: '#7c3aed', 6: '#6d28d9', 5: '#5b21b6', 4: '#2563eb', 3: '#0284c7', 2: '#0d9488', 1: '#16a34a' };
      const rowsHtml = [7, 6, 5, 4, 3, 2, 1].map((lvl, idx) => {
        const y = 18 + idx * 28;
        const nVal = document.getElementById(`osi-name-${lvl}`)?.value || '';
        const pVal = document.getElementById(`osi-pdu-${lvl}`)?.value || '';
        const ok = nVal === expected[lvl];
        const glow = activeLvl === lvl;
        const fill = glow ? '#f59e0b' : ok ? colors[lvl] : '#1e293b';
        const stroke = glow ? '#fde047' : ok ? '#4ade80' : '#475569';
        return `
          <rect x="28" y="${y}" width="310" height="22" fill="${fill}" stroke="${stroke}" stroke-width="${glow ? 3 : 2}"/>
          <text x="42" y="${y + 15}" fill="#fff" font-size="11" font-weight="bold">L${lvl}: ${nVal || '???'}</text>
          <text x="326" y="${y + 15}" fill="${ok ? '#bbf7d0' : '#94a3b8'}" font-size="10" text-anchor="end">${pVal || 'PDU ?'}</text>
        `;
      }).join('');
      wrap.innerHTML = `
        <svg viewBox="0 0 600 225" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="600" height="225" fill="#070d1d"/>
          ${rowsHtml}
          <rect x="364" y="22" width="212" height="182" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
          <text x="470" y="44" fill="#c084fc" font-size="12" font-weight="bold" text-anchor="middle">PACKET ENCAPSULATION</text>
          <rect x="394" y="58" width="152" height="24" fill="#312e81" stroke="#38bdf8"/><text x="470" y="74" fill="#e0f2fe" font-size="10" text-anchor="middle">L7-5: [ DATA ]</text>
          <rect x="386" y="88" width="168" height="24" fill="#1e3a8a" stroke="#38bdf8"/><text x="470" y="104" fill="#e0f2fe" font-size="10" text-anchor="middle">L4: [ TCP | DATA ]</text>
          <rect x="378" y="118" width="184" height="24" fill="#0c4a6e" stroke="#22d3ee"/><text x="470" y="134" fill="#e0f2fe" font-size="10" text-anchor="middle">L3: [ IP | TCP | DATA ]</text>
          <rect x="372" y="148" width="196" height="24" fill="#115e59" stroke="#4ade80"/><text x="470" y="164" fill="#dcfce7" font-size="10" text-anchor="middle">L2: [ MAC | IP | DATA | FCS ]</text>
          <text x="470" y="192" fill="#facc15" font-size="11" font-family="monospace" text-anchor="middle">L1: 10110010 01101001...</text>
        </svg>
      `;
    },

    lab3AutoHint() {
      soundFX.playSelect();
      document.getElementById('osi-name-7').value = 'Application';
      document.getElementById('osi-pdu-7').value = 'Data';
      document.getElementById('osi-proto-7').value = 'HTTP / DNS / FTP';
      document.getElementById('osi-name-1').value = 'Physical';
      document.getElementById('osi-pdu-1').value = 'Bits';
      document.getElementById('osi-proto-1').value = 'UTP / Fiber / Hub';
      this.toast('💡 ใส่คำใบ้ Layer 7 และ Layer 1 ให้แล้ว!');
    },

    lab3Check() {
      const answerKey = {
        7: { name: 'Application', pdu: 'Data', proto: 'HTTP / DNS / FTP' },
        6: { name: 'Presentation', pdu: 'Data', proto: 'SSL / TLS / JPEG' },
        5: { name: 'Session', pdu: 'Data', proto: 'Session / NetBIOS' },
        4: { name: 'Transport', pdu: 'Segment', proto: 'TCP / UDP (Port)' },
        3: { name: 'Network', pdu: 'Packet', proto: 'IP / Router' },
        2: { name: 'Data Link', pdu: 'Frame', proto: 'MAC / Switch' },
        1: { name: 'Physical', pdu: 'Bits', proto: 'UTP / Fiber / Hub' }
      };

      let wrong = [];
      for (let l = 7; l >= 1; l--) {
        const n = document.getElementById(`osi-name-${l}`).value;
        const p = document.getElementById(`osi-pdu-${l}`).value;
        const pr = document.getElementById(`osi-proto-${l}`).value;
        if (n !== answerKey[l].name || p !== answerKey[l].pdu || pr !== answerKey[l].proto) {
          wrong.push(`L${l}`);
        }
      }

      if (wrong.length > 0) {
        soundFX.playPlayerHurt();
        document.getElementById('lab3-encap-box').innerHTML =
          `<span style="color:var(--crimson)">❌ พบจุดที่ยังไม่ถูกต้องในชั้น: ${wrong.join(', ')} (ลองเปิดดูตารางในคัมภีร์ความรู้ได้นะ)</span>`;
        return;
      }

      const steps = [
        'L7 Application: สร้างข้อมูลเว็บ [HTTP Data]',
        'L6 Presentation: เข้ารหัส TLS [Encrypted Data]',
        'L5 Session: เปิด Session ID #9941',
        'L4 Transport: ห่อ TCP Header + Port 443 → [Segment]',
        'L3 Network: ห่อ IP Header (Src/Dst IP) → [Packet]',
        'L2 Data Link: ห่อ MAC Header + FCS → [Frame]',
        'L1 Physical: แปลงเป็น Bits 01011001 ส่งข้ามสายไฟเบอร์สำเร็จ! ✔'
      ];
      const box = document.getElementById('lab3-encap-box');
      box.innerHTML = '';
      steps.forEach((st, idx) => {
        setTimeout(() => {
          soundFX.playTesterBeep(idx + 1);
          box.innerHTML += `<div>▶ ${st}</div>`;
          if (idx === steps.length - 1) {
            this.completeUnitLab(3, 'ผ่าน Lab 3 หอคอย OSI 7 Layers');
          }
        }, idx * 240);
      });
    },

    /* === LAB 4: Network Doctor IPv4 & Green-Screen CLI Terminal === */
    initLab4(el) {
      this.labState[4] = { testedPing: false, allFixed: false };
      el.innerHTML = `
        <div class="pixel-box lab-panel">
          <h3 style="color:var(--cyan); margin-bottom:8px;">🔬 Lab 8: หมอรักษาเครือข่าย IPv4 &amp; Cyber CLI Terminal</h3>
          <p style="color:var(--text-muted); margin-bottom:12px;">
            วงเครือข่ายห้องแล็บคือ <b>192.168.10.0 /24</b> | Subnet Mask: <b>255.255.255.0</b> | Gateway Router: <b>192.168.10.1</b><br/>
            ภารกิจ: แก้ค่า IP ของ PC ทั้ง 3 เครื่องที่มีปัญหา แล้วรันคำสั่ง <code>ping 192.168.10.1</code> และ <code>ping 8.8.8.8</code> ใน Terminal!
          </p>
          <div class="topo-board" style="margin-bottom:14px;">
            <div id="lab8-svg-wrap"></div>
          </div>
          <div class="lab-grid-2">
            <div>
              <div class="pc-fix-card" id="pc-card-1">
                <div style="display:flex; justify-content:space-between;">
                  <b style="color:var(--crimson);">PC-01 (แจ้งเตือน: IP Conflict ชน Gateway!)</b>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; margin-top:8px;">
                  <div><small>IPv4 Address</small><input id="pc1-ip" class="pc-input" value="192.168.10.1" /></div>
                  <div><small>Subnet Mask</small><input id="pc1-mask" class="pc-input" value="255.255.255.0" /></div>
                  <div><small>Gateway</small><input id="pc1-gw" class="pc-input" value="192.168.10.1" /></div>
                </div>
              </div>

              <div class="pc-fix-card" id="pc-card-2">
                <div style="display:flex; justify-content:space-between;">
                  <b style="color:var(--crimson);">PC-02 (แจ้งเตือน: อยู่คนละ Network ID!)</b>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; margin-top:8px;">
                  <div><small>IPv4 Address</small><input id="pc2-ip" class="pc-input" value="192.168.99.25" /></div>
                  <div><small>Subnet Mask</small><input id="pc2-mask" class="pc-input" value="255.255.255.0" /></div>
                  <div><small>Gateway</small><input id="pc2-gw" class="pc-input" value="192.168.10.1" /></div>
                </div>
              </div>

              <div class="pc-fix-card" id="pc-card-3">
                <div style="display:flex; justify-content:space-between;">
                  <b style="color:var(--crimson);">PC-03 (แจ้งเตือน: ออกเน็ตไม่ได้ Gateway ผิด!)</b>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; margin-top:8px;">
                  <div><small>IPv4 Address</small><input id="pc3-ip" class="pc-input" value="192.168.10.30" /></div>
                  <div><small>Subnet Mask</small><input id="pc3-mask" class="pc-input" value="255.255.255.0" /></div>
                  <div><small>Gateway</small><input id="pc3-gw" class="pc-input" value="192.168.10.254" /></div>
                </div>
              </div>
              <button class="px-btn px-btn-emerald" onclick="App.lab4ValidatePCs()">💾 บันทึกการตั้งค่า IP ทั้ง 3 เครื่อง</button>
            </div>

            <div class="cli-terminal">
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #10b981; padding-bottom:6px; margin-bottom:8px;">
                <span>NETQUEST CLI v2.4 (Admin)</span>
                <div style="display:flex; gap:4px; flex-wrap:wrap;">
                  <button class="px-btn px-btn-sm" onclick="App.lab4RunCmd('ipconfig')">ipconfig</button>
                  <button class="px-btn px-btn-sm" onclick="App.lab4RunCmd('ping 192.168.10.1')">ping GW</button>
                  <button class="px-btn px-btn-sm" onclick="App.lab4RunCmd('ping 8.8.8.8')">ping 8.8.8.8</button>
                </div>
              </div>
              <div id="lab4-cli-out" class="cli-output">Microsoft Windows [Version 10.0.22621]
(c) NetQuest Vocational Lab. พิมพ์คำสั่งเช่น ipconfig, ping 192.168.10.1, ping 8.8.8.8, tracert 8.8.8.8
</div>
              <div class="cli-input-row">
                <span>C:\NetTech&gt;</span>
                <input id="lab4-cli-in" class="cli-input" placeholder="พิมพ์คำสั่งแล้วกด Enter..." onkeydown="if(event.key==='Enter') App.lab4RunCmd(this.value)" />
                <button class="px-btn px-btn-emerald px-btn-sm" onclick="App.lab4RunCmd(document.getElementById('lab4-cli-in').value)">RUN</button>
              </div>
            </div>
          </div>
        </div>
      `;
      this.renderLab8SVG(false, false, false);
    },

    renderLab8SVG(ok1 = false, ok2 = false, ok3 = false) {
      const wrap = document.getElementById('lab8-svg-wrap');
      if (!wrap) return;
      const all = ok1 && ok2 && ok3;
      const c1 = ok1 ? '#22c55e' : '#ef4444';
      const c2 = ok2 ? '#22c55e' : '#ef4444';
      const c3 = ok3 ? '#22c55e' : '#ef4444';
      wrap.innerHTML = `
        <svg viewBox="0 0 600 185" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="600" height="185" fill="#070d1d"/>
          <line x1="120" y1="38" x2="232" y2="92" stroke="${c1}" stroke-width="3" stroke-dasharray="${ok1 ? '' : '6,4'}"/>
          <line x1="120" y1="92" x2="232" y2="92" stroke="${c2}" stroke-width="3" stroke-dasharray="${ok2 ? '' : '6,4'}"/>
          <line x1="120" y1="146" x2="232" y2="92" stroke="${c3}" stroke-width="3" stroke-dasharray="${ok3 ? '' : '6,4'}"/>
          <line x1="308" y1="92" x2="386" y2="92" stroke="${all ? '#22c55e' : '#f59e0b'}" stroke-width="4"/>
          <line x1="474" y1="92" x2="520" y2="92" stroke="${all ? '#38bdf8' : '#ef4444'}" stroke-width="4" stroke-dasharray="${all ? '' : '6,4'}"/>

          <rect x="20" y="20" width="102" height="36" fill="#0f172a" stroke="${c1}" stroke-width="2"/><text x="71" y="42" fill="${c1}" font-size="11" font-weight="bold" text-anchor="middle">PC-01 ${ok1 ? '✔' : '✖'}</text>
          <rect x="20" y="74" width="102" height="36" fill="#0f172a" stroke="${c2}" stroke-width="2"/><text x="71" y="96" fill="${c2}" font-size="11" font-weight="bold" text-anchor="middle">PC-02 ${ok2 ? '✔' : '✖'}</text>
          <rect x="20" y="128" width="102" height="36" fill="#0f172a" stroke="${c3}" stroke-width="2"/><text x="71" y="150" fill="${c3}" font-size="11" font-weight="bold" text-anchor="middle">PC-03 ${ok3 ? '✔' : '✖'}</text>

          <rect x="232" y="70" width="76" height="44" fill="#1d4ed8" stroke="#93c5fd" stroke-width="2"/>
          <text x="270" y="96" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">SWITCH</text>

          <rect x="386" y="64" width="88" height="56" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="430" y="88" fill="#facc15" font-size="10" font-weight="bold" text-anchor="middle">GATEWAY</text>
          <text x="430" y="106" fill="#cbd5e1" font-size="9" text-anchor="middle">192.168.10.1</text>

          <rect x="520" y="64" width="66" height="56" fill="#0f172a" stroke="${all ? '#38bdf8' : '#64748b'}" stroke-width="2"/>
          <text x="553" y="88" fill="${all ? '#38bdf8' : '#94a3b8'}" font-size="10" font-weight="bold" text-anchor="middle">🌐 DNS</text>
          <text x="553" y="106" fill="#cbd5e1" font-size="9" text-anchor="middle">8.8.8.8</text>
        </svg>
      `;
    },

    lab4IsValidOctetHost(ip, usedIps) {
      const m = /^192\.168\.10\.(\d{1,3})$/.exec((ip || '').trim());
      if (!m) return false;
      const last = Number(m[1]);
      if (last < 2 || last > 254) return false; // .1 is gateway
      if (usedIps.includes(ip.trim())) return false;
      return true;
    },

    lab4ValidatePCs() {
      const ip1 = document.getElementById('pc1-ip').value.trim();
      const mask1 = document.getElementById('pc1-mask').value.trim();
      const gw1 = document.getElementById('pc1-gw').value.trim();

      const ip2 = document.getElementById('pc2-ip').value.trim();
      const mask2 = document.getElementById('pc2-mask').value.trim();
      const gw2 = document.getElementById('pc2-gw').value.trim();

      const ip3 = document.getElementById('pc3-ip').value.trim();
      const mask3 = document.getElementById('pc3-mask').value.trim();
      const gw3 = document.getElementById('pc3-gw').value.trim();

      const ok1 = this.lab4IsValidOctetHost(ip1, []) && mask1 === '255.255.255.0' && gw1 === '192.168.10.1';
      const ok2 = this.lab4IsValidOctetHost(ip2, [ip1]) && mask2 === '255.255.255.0' && gw2 === '192.168.10.1';
      const ok3 = this.lab4IsValidOctetHost(ip3, [ip1, ip2]) && mask3 === '255.255.255.0' && gw3 === '192.168.10.1';

      document.getElementById('pc-card-1').classList.toggle('fixed', ok1);
      document.getElementById('pc-card-2').classList.toggle('fixed', ok2);
      document.getElementById('pc-card-3').classList.toggle('fixed', ok3);
      this.renderLab8SVG(ok1, ok2, ok3);

      if (ok1 && ok2 && ok3) {
        this.labState[4].allFixed = true;
        soundFX.playPowerUp();
        this.toast('✅ แก้ไข IPv4 ของ PC ทั้ง 3 เครื่องถูกต้อง! ต่อไปกดรัน ping 8.8.8.8 เพื่อยืนยันผล');
      } else {
        soundFX.playPlayerHurt();
        alert('ยังมีบางเครื่องตั้งค่าผิด! ตรวจสอบว่า IP อยู่ในวง 192.168.10.2 - .254 ไม่ซ้ำกัน Mask 255.255.255.0 และ Gateway 192.168.10.1');
      }
    },

    lab4RunCmd(rawCmd) {
      const cmd = (rawCmd || '').trim().toLowerCase();
      if (!cmd) return;
      soundFX.playSelect();
      const inEl = document.getElementById('lab4-cli-in');
      if (inEl) inEl.value = '';
      const outEl = document.getElementById('lab4-cli-out');

      const ip1 = document.getElementById('pc1-ip').value.trim();
      const mask1 = document.getElementById('pc1-mask').value.trim();
      const gw1 = document.getElementById('pc1-gw').value.trim();
      const allFixed = this.labState[4].allFixed;

      let res = `\nC:\\NetTech> ${rawCmd}\n`;
      if (cmd === 'cls' || cmd === 'clear') {
        outEl.textContent = '';
        return;
      } else if (cmd === 'help') {
        res += 'คำสั่งที่ใช้ได้: ipconfig, ipconfig /all, ping 192.168.10.1, ping 8.8.8.8, tracert 8.8.8.8, cls';
      } else if (cmd.startsWith('ipconfig')) {
        res += `Ethernet adapter CampusLAN:\n   IPv4 Address. . . . : ${ip1}${ip1 === '192.168.10.1' ? ' (DUPLICATE!)' : ''}\n   Subnet Mask . . . . : ${mask1}\n   Default Gateway . . : ${gw1}`;
      } else if (cmd === 'ping 192.168.10.1') {
        if (allFixed || (ip1 !== '192.168.10.1' && ip1.startsWith('192.168.10.'))) {
          res += 'Reply from 192.168.10.1: bytes=32 time=1ms TTL=64\nReply from 192.168.10.1: bytes=32 time=1ms TTL=64\nPackets: Sent = 2, Received = 2, Lost = 0 (0% loss)';
        } else {
          res += 'PING: transmit failed. General failure (IP Conflict with Gateway!)';
        }
      } else if (cmd === 'ping 8.8.8.8') {
        if (allFixed) {
          res += 'Reply from 8.8.8.8: bytes=32 time=14ms TTL=117\nReply from 8.8.8.8: bytes=32 time=13ms TTL=117\n✔ เชื่อมต่ออินเทอร์เน็ตสำเร็จ 100%!';
          this.completeUnitLab(8, 'ผ่าน Lab 8 ตรวจสอบและแก้ปัญหาเครือข่าย CLI');
        } else {
          res += 'Request timed out. (กรุณาแก้ไขและกด "บันทึกการตั้งค่า IP ทั้ง 3 เครื่อง" ก่อน!)';
        }
      } else if (cmd.startsWith('tracert')) {
        res += allFixed
          ? '  1    1 ms    192.168.10.1 (Campus Gateway)\n  2    9 ms    10.250.0.1 (ISP Core)\n  3   14 ms    8.8.8.8 (Google DNS)\nTrace complete.'
          : '  1     *        *        *     Request timed out.';
      } else {
        res += `'${rawCmd}' is not recognized. พิมพ์ help เพื่อดูรายการคำสั่ง`;
      }
      outEl.textContent += res + '\n';
      outEl.scrollTop = outEl.scrollHeight;
    },

    /* === LAB 5: Wireless Wi-Fi & DHCP DORA Server Control Center === */
    initLab5(el) {
      el.innerHTML = `
        <div class="pixel-box lab-panel">
          <h3 style="color:var(--cyan); margin-bottom:8px;">🔬 Lab 5: ศูนย์ควบคุม Wi-Fi ความเร็วสูง &amp; DHCP Server (DORA)</h3>
          <div class="topo-board" style="margin-bottom:14px;">
            <div id="lab5-svg-wrap"></div>
          </div>
          <div class="lab-grid-2">
            <div class="pixel-box" style="padding:14px;">
              <h4 style="color:var(--amber); margin-bottom:10px;">📡 ตั้งค่า Router ไร้สาย &amp; DHCP Pool</h4>
              <div style="display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
                <div>
                  <label>1. เลือกย่านความถี่สำหรับห้อง Lab ที่มีโน้ตบุ๊กหนาแน่น 35 เครื่อง:</label>
                  <select id="l5-band" class="px-select" onchange="App.renderLab5SVG()">
                    <option value="24old">2.4 GHz (802.11b)</option>
                    <option value="5ax">5 GHz (Wi-Fi 6 / 802.11ax)</option>
                  </select>
                </div>
                <div>
                  <label>2. กรณีใช้คลื่น 2.4 GHz ต้องตั้ง Channel ชุดใดที่ไม่กวนกัน:</label>
                  <select id="l5-ch" class="px-select" onchange="App.renderLab5SVG()">
                    <option value="123">Channel 1, 2, 3</option>
                    <option value="1611">Channel 1, 6, 11</option>
                  </select>
                </div>
                <div>
                  <label>3. มาตรฐานการเข้ารหัสความปลอดภัย Wi-Fi ที่แนะนำ:</label>
                  <select id="l5-sec" class="px-select" onchange="App.renderLab5SVG()">
                    <option value="wep">WEP (64-bit)</option>
                    <option value="wpa3">WPA3-Personal / Enterprise</option>
                  </select>
                </div>
                <div>
                  <label>4. ตั้งค่า DHCP IP Pool ช่วงที่แจกให้ลูกข่าย (Gateway คือ 192.168.50.1):</label>
                  <select id="l5-pool" class="px-select" onchange="App.renderLab5SVG()">
                    <option value="bad">192.168.50.1 - 192.168.50.10 (ชน Gateway!)</option>
                    <option value="good">192.168.50.100 - 192.168.50.200 (ถูกต้อง)</option>
                  </select>
                </div>
                <button class="px-btn px-btn-emerald" onclick="App.lab5StartDORA()">🚀 บันทึกและจำลอง DHCP DORA Handshake</button>
              </div>
            </div>

            <div class="pixel-box" style="padding:14px; background:#050a18;">
              <h4 style="color:var(--emerald); margin-bottom:10px;">🔄 สถานะลำดับขั้นตอน DORA Handshake</h4>
              <div id="lab5-dora-log" style="font-family:var(--font-mono); font-size:0.86rem; display:flex; flex-direction:column; gap:8px; color:var(--text-muted);">
                <div>[รอการตั้งค่า Wi-Fi และ DHCP ทางซ้าย...]</div>
              </div>
            </div>
          </div>
        </div>
      `;
      this.renderLab5SVG(0);
    },

    renderLab5SVG(doraStep = 0) {
      const wrap = document.getElementById('lab5-svg-wrap');
      if (!wrap) return;
      const band = document.getElementById('l5-band')?.value || '24old';
      const ch = document.getElementById('l5-ch')?.value || '123';
      const sec = document.getElementById('l5-sec')?.value || 'wep';
      const pool = document.getElementById('l5-pool')?.value || 'bad';
      const secColor = sec === 'wpa3' ? '#22c55e' : '#ef4444';
      const waveColor = band === '5ax' ? '#38bdf8' : '#f59e0b';
      const doraLabels = ['รอเชื่อมต่อ', '1. DISCOVER ➜', '2. ⬅ OFFER', '3. REQUEST ➜', '4. ✔ ACK (.101)'];
      wrap.innerHTML = `
        <svg viewBox="0 0 600 185" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="600" height="185" fill="#070d1d"/>
          <rect x="26" y="42" width="136" height="96" fill="#0f172a" stroke="${waveColor}" stroke-width="3"/>
          <text x="94" y="66" fill="${waveColor}" font-size="12" font-weight="bold" text-anchor="middle">📡 WI-FI AP</text>
          <text x="94" y="88" fill="#e2e8f0" font-size="10" text-anchor="middle">${band === '5ax' ? '5 GHz Wi-Fi 6' : '2.4 GHz (802.11b)'}</text>
          <text x="94" y="106" fill="${ch === '1611' ? '#4ade80' : '#fca5a5'}" font-size="10" text-anchor="middle">Ch: ${ch === '1611' ? '1 / 6 / 11' : '1, 2, 3 (ชนกัน)'}</text>
          <text x="94" y="124" fill="${secColor}" font-size="10" font-weight="bold" text-anchor="middle">🔒 ${sec === 'wpa3' ? 'WPA3 SECURE' : 'WEP UNSAFE'}</text>

          <line x1="166" y1="90" x2="310" y2="90" stroke="${doraStep > 0 ? '#22c55e' : waveColor}" stroke-width="4" stroke-dasharray="8,6"/>
          <rect x="192" y="68" width="96" height="22" fill="#1e293b" stroke="${doraStep === 4 ? '#4ade80' : '#38bdf8'}"/>
          <text x="240" y="83" fill="#fff" font-size="10" text-anchor="middle">${doraLabels[doraStep] || doraLabels[0]}</text>

          <rect x="314" y="42" width="122" height="96" fill="#0f172a" stroke="${doraStep === 4 ? '#22c55e' : '#64748b'}" stroke-width="3"/>
          <text x="375" y="72" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">💻 CLIENT</text>
          <text x="375" y="96" fill="${doraStep === 4 ? '#4ade80' : '#94a3b8'}" font-size="10" text-anchor="middle">${doraStep === 4 ? '192.168.50.101' : 'No IP Yet'}</text>
          <text x="375" y="118" fill="#cbd5e1" font-size="10" text-anchor="middle">35 Devices Lab</text>

          <rect x="454" y="42" width="122" height="96" fill="#0f172a" stroke="${pool === 'good' ? '#10b981' : '#ef4444'}" stroke-width="3"/>
          <text x="515" y="70" fill="#facc15" font-size="11" font-weight="bold" text-anchor="middle">DHCP SERVER</text>
          <text x="515" y="94" fill="${pool === 'good' ? '#4ade80' : '#fca5a5'}" font-size="10" text-anchor="middle">${pool === 'good' ? '.100 - .200 ✔' : '.1 - .10 (ชน GW!)'}</text>
          <text x="515" y="118" fill="#94a3b8" font-size="10" text-anchor="middle">GW: .50.1</text>
        </svg>
      `;
    },

    lab5StartDORA() {
      const band = document.getElementById('l5-band').value;
      const ch = document.getElementById('l5-ch').value;
      const sec = document.getElementById('l5-sec').value;
      const pool = document.getElementById('l5-pool').value;

      if (band !== '5ax' || ch !== '1611' || sec !== 'wpa3' || pool !== 'good') {
        soundFX.playPlayerHurt();
        alert('การตั้งค่ายังไม่เหมาะสม! แนะนำเลือก 5 GHz (Wi-Fi 6), Channel 1/6/11, เข้ารหัส WPA3 และ Pool .100-.200');
        return;
      }

      const steps = [
        { k: 'D - DISCOVER', m: 'Client Broadcast: มี DHCP Server ในวง 192.168.50.0 ไหม?', c: '#38bdf8' },
        { k: 'O - OFFER', m: 'DHCP Server: เสนอให้ใช้ IP 192.168.50.101 /24 (GW .1)', c: '#10b981' },
        { k: 'R - REQUEST', m: 'Client: ตกลงครับ ขอเช่าใช้ IP 192.168.50.101!', c: '#a855f7' },
        { k: 'A - ACKNOWLEDGE', m: 'DHCP Server: อนุมัติ! Client เชื่อมต่อ Wi-Fi 6 (WPA3) สำเร็จ!', c: '#facc15' }
      ];
      const log = document.getElementById('lab5-dora-log');
      log.innerHTML = '';
      steps.forEach((st, idx) => {
        setTimeout(() => {
          soundFX.playTesterBeep(idx + 2);
          this.renderLab5SVG(idx + 1);
          log.innerHTML += `<div style="border:2px solid ${st.c}; padding:8px; color:#fff;"><b style="color:${st.c}">${st.k}</b><br/>${st.m}</div>`;
          if (idx === steps.length - 1) {
            this.completeUnitLab(5, 'ผ่าน Lab 5 Wi-Fi & DHCP DORA');
          }
        }, idx * 280);
      });
    },

    /* === LAB 6: Pixel Firewall Defender === */
    initLab6(el) {
      el.innerHTML = `
        <div class="pixel-box lab-panel">
          <h3 style="color:var(--crimson); margin-bottom:8px;">🔬 Lab 9: ป้อมปราการ Windows Defender Firewall</h3>
          <p style="color:var(--text-muted); margin-bottom:12px;">
            ตั้งกฎ Firewall (ALLOW / DENY) สำหรับพอร์ตบริการของวิทยาลัยให้ปลอดภัย ก่อนคลื่นแพ็กเก็ตโจมตีจะบุกเข้ามา!
          </p>
          <div class="topo-board" style="margin-bottom:14px;">
            <div id="lab9-svg-wrap"></div>
          </div>
          <div class="lab-grid-2">
            <div>
              <table class="pixel-table">
                <thead>
                  <tr><th>Port / Service</th><th>ความเสี่ยง / การใช้งาน</th><th>กฎ Firewall</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Port 443 (HTTPS)</b></td>
                    <td>เว็บระบบทะเบียนนักศึกษาแบบเข้ารหัส</td>
                    <td><select id="fw-443" class="px-select" onchange="App.renderLab9SVG()"><option value="ALLOW">ALLOW (อนุญาต)</option><option value="DENY" selected>DENY (บล็อก)</option></select></td>
                  </tr>
                  <tr>
                    <td><b>Port 23 (Telnet)</b></td>
                    <td>รีโมตแบบ Plain-text ไม่เข้ารหัส</td>
                    <td><select id="fw-23" class="px-select" onchange="App.renderLab9SVG()"><option value="ALLOW" selected>ALLOW (อนุญาต)</option><option value="DENY">DENY (บล็อก)</option></select></td>
                  </tr>
                  <tr>
                    <td><b>Port 22 (SSH)</b></td>
                    <td>รีโมตแอดมินแบบเข้ารหัสปลอดภัย</td>
                    <td><select id="fw-22" class="px-select" onchange="App.renderLab9SVG()"><option value="ALLOW">ALLOW (อนุญาต)</option><option value="DENY" selected>DENY (บล็อก)</option></select></td>
                  </tr>
                  <tr>
                    <td><b>Port 445 (SMB WAN)</b></td>
                    <td>ช่องโหว่ยอดนิยมแพร่กระจาย Ransomware</td>
                    <td><select id="fw-445" class="px-select" onchange="App.renderLab9SVG()"><option value="ALLOW" selected>ALLOW (อนุญาต)</option><option value="DENY">DENY (บล็อก)</option></select></td>
                  </tr>
                  <tr>
                    <td><b>Port 53 (DNS)</b></td>
                    <td>แปลงชื่อโดเมนเว็บไซต์ให้เครือข่าย</td>
                    <td><select id="fw-53" class="px-select" onchange="App.renderLab9SVG()"><option value="ALLOW">ALLOW (อนุญาต)</option><option value="DENY" selected>DENY (บล็อก)</option></select></td>
                  </tr>
                </tbody>
              </table>
              <button class="px-btn px-btn-crimson" style="margin-top:12px;" onclick="App.lab6Simulate()">🛡️ เปิด Firewall สกัดการโจมตี!</button>
            </div>

            <div class="pixel-box" style="padding:14px; background:#050a18;">
              <h4 style="color:var(--amber); margin-bottom:10px;">📡 บันทึกการตรวจจับ Packet (Firewall Log)</h4>
              <div id="lab6-fw-log" style="font-family:var(--font-mono); font-size:0.84rem; color:var(--text-muted); display:flex; flex-direction:column; gap:6px;">
                <div>รอการตั้งค่ากฎ Firewall ทั้ง 5 พอร์ต...</div>
              </div>
            </div>
          </div>
        </div>
      `;
      this.renderLab9SVG();
    },

    renderLab9SVG() {
      const wrap = document.getElementById('lab9-svg-wrap');
      if (!wrap) return;
      const ports = [
        { id: 'fw-443', label: 'HTTPS :443', safe: 'ALLOW', y: 24 },
        { id: 'fw-23', label: 'Telnet :23', safe: 'DENY', y: 58 },
        { id: 'fw-22', label: 'SSH :22', safe: 'ALLOW', y: 92 },
        { id: 'fw-445', label: 'SMB :445', safe: 'DENY', y: 126 },
        { id: 'fw-53', label: 'DNS :53', safe: 'ALLOW', y: 160 }
      ];
      const rows = ports.map((p) => {
        const val = document.getElementById(p.id)?.value || 'DENY';
        const allow = val === 'ALLOW';
        const lineColor = allow ? '#22c55e' : '#ef4444';
        return `
          <rect x="24" y="${p.y}" width="112" height="24" fill="#1e293b" stroke="${p.safe === 'DENY' ? '#f59e0b' : '#38bdf8'}"/>
          <text x="80" y="${p.y + 16}" fill="#fff" font-size="10" text-anchor="middle">${p.label}</text>
          <line x1="138" y1="${p.y + 12}" x2="254" y2="${p.y + 12}" stroke="${lineColor}" stroke-width="3"/>
          ${allow
            ? `<line x1="344" y1="${p.y + 12}" x2="454" y2="${p.y + 12}" stroke="#22c55e" stroke-width="3"/><text x="400" y="${p.y + 8}" fill="#4ade80" font-size="9" text-anchor="middle">ALLOW ➜</text>`
            : `<text x="398" y="${p.y + 16}" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">🛡️ BLOCKED</text>`}
        `;
      }).join('');
      wrap.innerHTML = `
        <svg viewBox="0 0 600 202" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="600" height="202" fill="#070d1d"/>
          ${rows}
          <rect x="256" y="18" width="86" height="170" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/>
          <text x="299" y="96" fill="#fff" font-size="12" font-weight="bold" text-anchor="middle">FIREWALL</text>
          <text x="299" y="114" fill="#fde047" font-size="10" text-anchor="middle">WINDOWS</text>
          <rect x="458" y="42" width="118" height="120" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
          <text x="517" y="98" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">🏫 CAMPUS</text>
          <text x="517" y="118" fill="#cbd5e1" font-size="10" text-anchor="middle">INTERNAL LAN</text>
        </svg>
      `;
    },

    lab6Simulate() {
      const r443 = document.getElementById('fw-443').value;
      const r23 = document.getElementById('fw-23').value;
      const r22 = document.getElementById('fw-22').value;
      const r445 = document.getElementById('fw-445').value;
      const r53 = document.getElementById('fw-53').value;

      const log = document.getElementById('lab6-fw-log');
      const ok = r443 === 'ALLOW' && r23 === 'DENY' && r22 === 'ALLOW' && r445 === 'DENY' && r53 === 'ALLOW';

      if (!ok) {
        soundFX.playPlayerHurt();
        log.innerHTML = `
          <div style="color:var(--crimson);">❌ ALERT! การตั้งค่า Firewall ยังมีช่องโหว่หรือบล็อกบริการจำเป็น:</div>
          <div>- HTTPS (443), SSH (22), DNS (53) ควร ALLOW</div>
          <div>- Telnet (23 ไม่เข้ารหัส) และ SMB WAN (445 เสี่ยง Ransomware) ควร DENY!</div>
        `;
        return;
      }

      const waves = [
        '✔ ALLOW TCP:443 — นักศึกษาเข้าใช้งานเว็บทะเบียนแบบ HTTPS สำเร็จ',
        '🛡️ BLOCKED TCP:23 — ป้องกันบอตพยายามเจาะรหัส Telnet สำเร็จ!',
        '✔ ALLOW TCP:22 — ผู้ดูแลระบบเชื่อมต่อ SSH เข้ารหัสสำเร็จ',
        '🛡️ BLOCKED TCP:445 — สกัดมัลแวร์ Ransomware จากภายนอกสำเร็จ!',
        '✔ ALLOW UDP:53 — ระบบ DNS แปลงชื่อโดเมนทำงานราบรื่น'
      ];
      log.innerHTML = '';
      waves.forEach((w, idx) => {
        setTimeout(() => {
          soundFX.playTesterBeep(idx + 3);
          log.innerHTML += `<div style="color:${w.startsWith('🛡️') ? '#fbbf24' : '#4ade80'}">${w}</div>`;
          if (idx === waves.length - 1) {
            this.completeUnitLab(9, 'ผ่าน Lab 9 Windows Firewall & ป้องกันภัยคุกคาม');
          }
        }, idx * 240);
      });
    },

    /* === LAB 2 (NEW): Media, Device & Connector Engineering Lab === */
    initLabMedia(el) {
      el.innerHTML = `
        <div class="pixel-box lab-panel">
          <div class="lab-title-row">
            <div>
              <h3 style="color:var(--amber);">🔌 Lab 2: วิศวกรเลือกอุปกรณ์ สื่อนำสัญญาณ และหัวต่อ</h3>
              <p style="font-size:0.86rem; color:var(--text-muted);">วิเคราะห์โจทย์งานติดตั้งจริง 4 สถานการณ์ แล้วเลือกอุปกรณ์ สื่อกลาง และหัวต่อสัญญาณให้เหมาะสมครบทุกข้อ</p>
            </div>
          </div>
          <div class="topo-board" style="margin-top:10px;">
            <div id="lab-media-svg-wrap"></div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-top:12px;">
            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--cyan); margin-bottom:6px;">ภารกิจ 1: เดินสายเชื่อมตึกเรียนห่างกัน 500 ม. ใกล้หม้อแปลงไฟฟ้า</div>
              <label style="font-size:0.8rem; color:var(--text-muted);">เลือกสื่อนำสัญญาณ:</label>
              <select id="lm-m1" class="px-input" style="margin:4px 0 8px;" onchange="App.renderLabMediaSVG()">
                <option value="">-- เลือกสื่อกลาง --</option>
                <option value="utp">สาย UTP Cat5e (ระยะไม่เกิน 100 ม.)</option>
                <option value="fiber">สาย Fiber Optic (ใยแก้วนำแสง)</option>
                <option value="ir">อินฟราเรด (Infrared)</option>
              </select>
              <label style="font-size:0.8rem; color:var(--text-muted);">เลือกหัวต่อมาตรฐาน:</label>
              <select id="lm-c1" class="px-input" style="margin-top:4px;" onchange="App.renderLabMediaSVG()">
                <option value="">-- เลือกหัวต่อ --</option>
                <option value="rj11">RJ-11 (สายโทรศัพท์)</option>
                <option value="bnc">BNC (สาย Coaxial)</option>
                <option value="sc_lc">SC / LC (หัวต่อไฟเบอร์ออปติก)</option>
              </select>
            </div>

            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--emerald); margin-bottom:6px;">ภารกิจ 2: เชื่อมคอมพิวเตอร์ 30 เครื่องในห้องแล็บแบบ Full-Duplex</div>
              <label style="font-size:0.8rem; color:var(--text-muted);">เลือกอุปกรณ์ศูนย์กลาง:</label>
              <select id="lm-d2" class="px-input" style="margin:4px 0 8px;" onchange="App.renderLabMediaSVG()">
                <option value="">-- เลือกอุปกรณ์ --</option>
                <option value="hub">Hub (Layer 1 กระจายทุกพอร์ต)</option>
                <option value="switch">Switch (Layer 2 จดจำ MAC Address)</option>
                <option value="repeater">Repeater (ทวนสัญญาณอย่างเดียว)</option>
              </select>
              <label style="font-size:0.8rem; color:var(--text-muted);">เลือกสาย + หัวต่อในห้องแล็บ:</label>
              <select id="lm-c2" class="px-input" style="margin-top:4px;" onchange="App.renderLabMediaSVG()">
                <option value="">-- เลือกสายและหัวต่อ --</option>
                <option value="utp_rj45">สาย UTP Cat6 + หัวต่อ RJ-45</option>
                <option value="coax_bnc">สาย Coaxial + หัวต่อ BNC</option>
                <option value="phone_rj11">สายโทรศัพท์ + หัวต่อ RJ-11</option>
              </select>
            </div>

            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--violet); margin-bottom:6px;">ภารกิจ 3: เชื่อมเครือข่าย LAN ของวิทยาลัยออกสู่อินเทอร์เน็ต</div>
              <label style="font-size:0.8rem; color:var(--text-muted);">เลือกอุปกรณ์หาเส้นทาง (Layer 3):</label>
              <select id="lm-d3" class="px-input" style="margin:4px 0 8px;" onchange="App.renderLabMediaSVG()">
                <option value="">-- เลือกอุปกรณ์ --</option>
                <option value="router">Router (เชื่อมต่างเครือข่ายด้วย IP)</option>
                <option value="nic">NIC (การ์ดแลนประจำเครื่อง)</option>
                <option value="bridge">Bridge (เชื่อม LAN 2 ฝั่ง)</option>
              </select>
            </div>

            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--amber); margin-bottom:6px;">ภารกิจ 4: เชื่อมสัญญาณไร้สายข้ามถนนระหว่างอาคาร (แนวสายตา LOS)</div>
              <label style="font-size:0.8rem; color:var(--text-muted);">เลือกสื่อกลางไร้สายที่เหมาะสม:</label>
              <select id="lm-w4" class="px-input" style="margin:4px 0 8px;" onchange="App.renderLabMediaSVG()">
                <option value="">-- เลือกสื่อไร้สาย --</option>
                <option value="bluetooth">Bluetooth (ระยะ 10 ม.)</option>
                <option value="microwave">คลื่นไมโครเวฟ (Point-to-Point Microwave)</option>
                <option value="ir">อินฟราเรดรีโมตทีวี</option>
              </select>
            </div>
          </div>

          <div id="lab-media-log" style="margin-top:12px; font-size:0.86rem; color:var(--text-muted);">เลือกคำตอบให้ครบทั้ง 4 ภารกิจ แล้วกดปุ่มตรวจสอบด้านล่าง</div>
          <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
            <button class="px-btn px-btn-emerald" onclick="App.checkLabMedia()">✔ ตรวจสเปกอุปกรณ์และสื่อนำสัญญาณ</button>
          </div>
        </div>
      `;
      this.renderLabMediaSVG();
    },

    renderLabMediaSVG() {
      const wrap = document.getElementById('lab-media-svg-wrap');
      if (!wrap) return;
      const m1 = document.getElementById('lm-m1')?.value || '';
      const c1 = document.getElementById('lm-c1')?.value || '';
      const d2 = document.getElementById('lm-d2')?.value || '';
      const c2 = document.getElementById('lm-c2')?.value || '';
      const d3 = document.getElementById('lm-d3')?.value || '';
      const w4 = document.getElementById('lm-w4')?.value || '';
      const ok1 = m1 === 'fiber' && c1 === 'sc_lc';
      const ok2 = d2 === 'switch' && c2 === 'utp_rj45';
      const ok3 = d3 === 'router';
      const ok4 = w4 === 'microwave';
      wrap.innerHTML = `
        <svg viewBox="0 0 600 185" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="600" height="185" fill="#070d1d"/>
          <rect x="14" y="14" width="278" height="72" fill="#0f172a" stroke="${ok1 ? '#22c55e' : '#38bdf8'}" stroke-width="2"/>
          <text x="153" y="34" fill="${ok1 ? '#4ade80' : '#38bdf8'}" font-size="11" font-weight="bold" text-anchor="middle">1) ตึก A ⟷ ตึก B (500m + EMI)</text>
          <line x1="66" y1="60" x2="240" y2="60" stroke="${ok1 ? '#22c55e' : '#f59e0b'}" stroke-width="4" stroke-dasharray="${ok1 ? '' : '6,4'}"/>
          <text x="153" y="54" fill="#fff" font-size="10" text-anchor="middle">${m1 ? m1.toUpperCase() : '?'} / ${c1 ? c1.toUpperCase() : '?'}</text>

          <rect x="308" y="14" width="278" height="72" fill="#0f172a" stroke="${ok2 ? '#22c55e' : '#10b981'}" stroke-width="2"/>
          <text x="447" y="34" fill="${ok2 ? '#4ade80' : '#6ee7b7'}" font-size="11" font-weight="bold" text-anchor="middle">2) ห้องแล็บ 30 PC (Full-Duplex)</text>
          <text x="447" y="64" fill="#fff" font-size="11" text-anchor="middle">💻 ⟷ [ ${d2 ? d2.toUpperCase() : 'DEVICE ?'} ] ⟷ ${c2 ? c2.toUpperCase() : 'CABLE ?'}</text>

          <rect x="14" y="98" width="278" height="72" fill="#0f172a" stroke="${ok3 ? '#22c55e' : '#a855f7'}" stroke-width="2"/>
          <text x="153" y="118" fill="${ok3 ? '#4ade80' : '#c084fc'}" font-size="11" font-weight="bold" text-anchor="middle">3) LAN วิทยาลัย ⟷ 🌐 อินเทอร์เน็ต</text>
          <text x="153" y="148" fill="#fff" font-size="11" text-anchor="middle">LAN ⟷ [ ${d3 ? d3.toUpperCase() : 'LAYER 3 ?'} ] ⟷ WAN</text>

          <rect x="308" y="98" width="278" height="72" fill="#0f172a" stroke="${ok4 ? '#22c55e' : '#f59e0b'}" stroke-width="2"/>
          <text x="447" y="118" fill="${ok4 ? '#4ade80' : '#facc15'}" font-size="11" font-weight="bold" text-anchor="middle">4) ไร้สายข้ามถนนระหว่างอาคาร (LOS)</text>
          <text x="447" y="148" fill="#fff" font-size="11" text-anchor="middle">🏢 📡 ~~~ ${w4 ? w4.toUpperCase() : 'WIRELESS ?'} ~~~ 📡 🏢</text>
        </svg>
      `;
    },

    checkLabMedia() {
      const m1 = document.getElementById('lm-m1').value;
      const c1 = document.getElementById('lm-c1').value;
      const d2 = document.getElementById('lm-d2').value;
      const c2 = document.getElementById('lm-c2').value;
      const d3 = document.getElementById('lm-d3').value;
      const w4 = document.getElementById('lm-w4').value;
      const log = document.getElementById('lab-media-log');

      const errs = [];
      if (m1 !== 'fiber' || c1 !== 'sc_lc') errs.push('ภารกิจ 1: เดินสายข้ามตึก 500 ม. กัน EMI ต้องใช้ Fiber Optic + หัวต่อ SC/LC');
      if (d2 !== 'switch' || c2 !== 'utp_rj45') errs.push('ภารกิจ 2: ห้องแล็บ 30 เครื่อง Full-Duplex ต้องใช้ Switch + สาย UTP Cat6 หัวต่อ RJ-45');
      if (d3 !== 'router') errs.push('ภารกิจ 3: การเชื่อมต่างเครือข่ายออกอินเทอร์เน็ตต้องใช้ Router (Layer 3)');
      if (w4 !== 'microwave') errs.push('ภารกิจ 4: เชื่อมไร้สายข้ามอาคารแนวสายตา (LOS) ใช้คลื่นไมโครเวฟแบบ Point-to-Point');

      if (errs.length > 0) {
        soundFX.playPlayerHurt();
        log.innerHTML = `<div style="color:#fda4af;">❌ ยังมีจุดไม่ถูกต้อง:<br>• ${errs.join('<br>• ')}</div>`;
        return;
      }
      soundFX.playPowerUp();
      log.innerHTML = `<div style="color:#4ade80;">✔ ยอดเยี่ยม! เลือกอุปกรณ์ สื่อนำสัญญาณ และหัวต่อได้ถูกต้องครบทั้ง 4 สถานการณ์</div>`;
      this.completeUnitLab(2, 'ผ่าน Lab 2 อุปกรณ์และสื่อนำสัญญาณ');
    },

    /* === LAB 6 (NEW): Windows Network, Static IP & File/Printer Sharing === */
    initLabWindowsNet(el) {
      el.innerHTML = `
        <div class="pixel-box lab-panel">
          <div class="lab-title-row">
            <div>
              <h3 style="color:#60a5fa;">🪟 Lab 6: ตั้งค่าเครือข่าย Windows และแชร์ไฟล์/เครื่องพิมพ์</h3>
              <p style="font-size:0.86rem; color:var(--text-muted);">ตั้งค่าเครื่อง <b>LAB-PC01</b> ให้อยู่ใน Workgroup <code>ROOM301</code>, ตั้ง Static IPv4 วง <code>192.168.10.x/24</code> (Gateway <code>192.168.10.1</code>, DNS <code>8.8.8.8</code>), เปิดแชร์โฟลเดอร์ & เครื่องพิมพ์ แล้วทดสอบเข้าถึงด้วย UNC Path</p>
            </div>
          </div>
          <div class="topo-board" style="margin-top:10px;">
            <div id="lab-win-svg-wrap"></div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px; margin-top:12px;">
            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--cyan); margin-bottom:8px;">1) System Properties (ชื่อเครื่อง &amp; เครือข่าย)</div>
              <label style="font-size:0.8rem;">Computer Name:</label>
              <input id="lw-name" class="px-input" value="LAB-PC01" oninput="App.renderLabWinSVG()" style="margin:4px 0 8px;" />
              <label style="font-size:0.8rem;">Workgroup Name (กำหนดเป็น ROOM301):</label>
              <input id="lw-wg" class="px-input" value="WORKGROUP" oninput="App.renderLabWinSVG()" style="margin-top:4px;" />
            </div>

            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--emerald); margin-bottom:8px;">2) TCP/IPv4 Properties (ncpa.cpl)</div>
              <label style="font-size:0.8rem;">IPv4 Address (เช่น 192.168.10.20):</label>
              <input id="lw-ip" class="px-input" value="192.168.10.20" oninput="App.renderLabWinSVG()" style="margin:4px 0 6px;" />
              <label style="font-size:0.8rem;">Subnet Mask:</label>
              <input id="lw-mask" class="px-input" value="255.255.255.0" oninput="App.renderLabWinSVG()" style="margin:4px 0 6px;" />
              <label style="font-size:0.8rem;">Default Gateway:</label>
              <input id="lw-gw" class="px-input" value="192.168.1.1" oninput="App.renderLabWinSVG()" style="margin:4px 0 6px;" />
              <label style="font-size:0.8rem;">Preferred DNS Server:</label>
              <input id="lw-dns" class="px-input" value="" placeholder="เช่น 8.8.8.8" oninput="App.renderLabWinSVG()" style="margin-top:4px;" />
            </div>

            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--amber); margin-bottom:8px;">3) File &amp; Printer Sharing + Run (Win+R)</div>
              <label style="display:flex; gap:8px; align-items:center; font-size:0.84rem; margin-bottom:6px; cursor:pointer;">
                <input type="checkbox" id="lw-disc" onchange="App.renderLabWinSVG()" /> เปิด Network Discovery &amp; File Sharing
              </label>
              <label style="display:flex; gap:8px; align-items:center; font-size:0.84rem; margin-bottom:6px; cursor:pointer;">
                <input type="checkbox" id="lw-folder" onchange="App.renderLabWinSVG()" /> แชร์โฟลเดอร์ชื่อ <code>Homework</code> (สิทธิ์ Read/Change)
              </label>
              <label style="display:flex; gap:8px; align-items:center; font-size:0.84rem; margin-bottom:10px; cursor:pointer;">
                <input type="checkbox" id="lw-printer" onchange="App.renderLabWinSVG()" /> แชร์เครื่องพิมพ์ <code>LAB-LaserJet</code>
              </label>
              <label style="font-size:0.8rem;">ทดสอบพิมพ์ UNC Path เข้าถึงโฟลเดอร์ที่แชร์:</label>
              <input id="lw-unc" class="px-input" placeholder="เช่น \\\\LAB-PC01\\Homework" oninput="App.renderLabWinSVG()" style="margin-top:4px;" />
            </div>
          </div>

          <div id="lab-win-log" style="margin-top:12px; font-size:0.86rem; color:var(--text-muted);">กรอกและติ๊กตั้งค่าให้ครบ แล้วกดปุ่ม "ทดสอบเชื่อมต่อเครือข่าย Windows"</div>
          <div style="margin-top:12px;">
            <button class="px-btn px-btn-emerald" onclick="App.checkLabWindowsNet()">✔ ทดสอบเชื่อมต่อเครือข่าย Windows</button>
          </div>
        </div>
      `;
      this.renderLabWinSVG();
    },

    renderLabWinSVG() {
      const wrap = document.getElementById('lab-win-svg-wrap');
      if (!wrap) return;
      const name = document.getElementById('lw-name')?.value.trim() || 'LAB-PC01';
      const wg = document.getElementById('lw-wg')?.value.trim().toUpperCase() || 'WORKGROUP';
      const ip = document.getElementById('lw-ip')?.value.trim() || '-';
      const gw = document.getElementById('lw-gw')?.value.trim() || '-';
      const disc = document.getElementById('lw-disc')?.checked;
      const folder = document.getElementById('lw-folder')?.checked;
      const printer = document.getElementById('lw-printer')?.checked;
      const unc = document.getElementById('lw-unc')?.value.trim() || '\\\\...';
      const gwOk = gw === '192.168.10.1';
      const wgOk = wg === 'ROOM301';
      wrap.innerHTML = `
        <svg viewBox="0 0 600 185" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="600" height="185" fill="#070d1d"/>
          <rect x="20" y="20" width="212" height="145" fill="#0f172a" stroke="${wgOk && gwOk ? '#22c55e' : '#3b82f6'}" stroke-width="3"/>
          <text x="126" y="42" fill="#60a5fa" font-size="12" font-weight="bold" text-anchor="middle">🪟 ${name}</text>
          <text x="126" y="62" fill="${wgOk ? '#4ade80' : '#facc15'}" font-size="10" text-anchor="middle">Workgroup: ${wg}</text>
          <text x="126" y="82" fill="#e2e8f0" font-size="10" text-anchor="middle">IP: ${ip}</text>
          <text x="126" y="98" fill="${gwOk ? '#4ade80' : '#fca5a5'}" font-size="10" text-anchor="middle">GW: ${gw}</text>
          <rect x="34" y="112" width="88" height="38" fill="#1e293b" stroke="${folder ? '#22c55e' : '#475569'}"/><text x="78" y="135" fill="${folder ? '#4ade80' : '#94a3b8'}" font-size="10" text-anchor="middle">📁 ${folder ? 'Shared' : 'Closed'}</text>
          <rect x="130" y="112" width="88" height="38" fill="#1e293b" stroke="${printer ? '#22c55e' : '#475569'}"/><text x="174" y="135" fill="${printer ? '#4ade80' : '#94a3b8'}" font-size="10" text-anchor="middle">🖨️ ${printer ? 'Shared' : 'Closed'}</text>

          <line x1="234" y1="92" x2="394" y2="92" stroke="${disc && folder ? '#22c55e' : '#64748b'}" stroke-width="4" stroke-dasharray="8,5"/>
          <rect x="246" y="66" width="136" height="22" fill="#1e293b" stroke="#a855f7"/>
          <text x="314" y="81" fill="#e9d5ff" font-size="9" text-anchor="middle">${unc.slice(0, 22)}</text>

          <rect x="396" y="38" width="184" height="108" fill="#0f172a" stroke="${disc ? '#38bdf8' : '#64748b'}" stroke-width="3"/>
          <text x="488" y="68" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">💻 CLIENT PC</text>
          <text x="488" y="92" fill="#cbd5e1" font-size="10" text-anchor="middle">Workgroup: ROOM301</text>
          <text x="488" y="114" fill="${disc ? '#4ade80' : '#94a3b8'}" font-size="10" text-anchor="middle">Discovery: ${disc ? 'ON ✔' : 'OFF'}</text>
        </svg>
      `;
    },

    checkLabWindowsNet() {
      const name = document.getElementById('lw-name').value.trim();
      const wg = document.getElementById('lw-wg').value.trim().toUpperCase();
      const ip = document.getElementById('lw-ip').value.trim();
      const mask = document.getElementById('lw-mask').value.trim();
      const gw = document.getElementById('lw-gw').value.trim();
      const dns = document.getElementById('lw-dns').value.trim();
      const disc = document.getElementById('lw-disc').checked;
      const folder = document.getElementById('lw-folder').checked;
      const printer = document.getElementById('lw-printer').checked;
      const unc = document.getElementById('lw-unc').value.trim();
      const log = document.getElementById('lab-win-log');

      const errs = [];
      if (!name) errs.push('กรุณาระบุชื่อเครื่อง (Computer Name)');
      if (wg !== 'ROOM301') errs.push('Workgroup ต้องตั้งเป็น ROOM301 ตามโจทย์');
      if (!/^192\.168\.10\.([2-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-4])$/.test(ip)) errs.push('IPv4 Address ต้องอยู่ในวง 192.168.10.2–254 (ห้ามซ้ำ Gateway .1)');
      if (mask !== '255.255.255.0') errs.push('Subnet Mask สำหรับ /24 ต้องเป็น 255.255.255.0');
      if (gw !== '192.168.10.1') errs.push('Default Gateway ต้องเป็น 192.168.10.1 (ตรงวงเดียวกับ IP)');
      if (!dns) errs.push('กรุณาระบุ DNS Server (เช่น 8.8.8.8 หรือ 1.1.1.1)');
      if (!disc || !folder || !printer) errs.push('กรุณาเปิด Network Discovery, แชร์โฟลเดอร์ Homework และแชร์เครื่องพิมพ์ให้ครบ');
      const expectedUnc1 = `\\\\${name}\\Homework`.toLowerCase();
      const expectedUnc2 = `\\\\${ip}\\Homework`.toLowerCase();
      if (unc.toLowerCase() !== expectedUnc1 && unc.toLowerCase() !== expectedUnc2) {
        errs.push(`UNC Path ไม่ถูกต้อง (ต้องเป็น \\\\${name}\\Homework หรือ \\\\${ip}\\Homework)`);
      }

      if (errs.length > 0) {
        soundFX.playPlayerHurt();
        log.innerHTML = `<div style="color:#fda4af;">❌ พบข้อผิดพลาดในการตั้งค่า Windows:<br>• ${errs.join('<br>• ')}</div>`;
        return;
      }
      soundFX.playPowerUp();
      log.innerHTML = `<div style="color:#4ade80;">✔ เชื่อมต่อ <code>${unc}</code> สำเร็จ! พบโฟลเดอร์แชร์ Homework และเครื่องพิมพ์ LAB-LaserJet ใน Workgroup ROOM301</div>`;
      this.completeUnitLab(6, 'ผ่าน Lab 6 การใช้งานเครือข่ายใน Windows');
    },

    /* === LAB 7 (NEW): Virtual Server & NOS Deployment Lab === */
    initLabNosVm(el) {
      el.innerHTML = `
        <div class="pixel-box lab-panel">
          <div class="lab-title-row">
            <div>
              <h3 style="color:#818cf8;">🖥️ Lab 7: สร้างเครื่องจำลอง (VM) และติดตั้งระบบปฏิบัติการเครือข่าย (NOS)</h3>
              <p style="font-size:0.86rem; color:var(--text-muted);">ตั้งค่า Virtual Machine สำหรับติดตั้ง <b>Network OS</b> ให้ผ่านสเปกขั้นต่ำ (vCPU ≥ 2, RAM ≥ 2048 MB, Disk ≥ 30 GB), ตั้งการ์ดแลน VM ให้รับ IP วง LAN จริง และ Mount ไฟล์ติดตั้ง .ISO</p>
            </div>
          </div>
          <div class="topo-board" style="margin-top:10px;">
            <div id="lab-nos-svg-wrap"></div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:12px; margin-top:12px;">
            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--cyan); margin-bottom:8px;">1) เลือก Hypervisor &amp; ระบบปฏิบัติการเครือข่าย</div>
              <label style="font-size:0.8rem;">ซอฟต์แวร์จำลองเครื่อง (Hypervisor):</label>
              <select id="l7-hv" class="px-input" style="margin:4px 0 8px;" onchange="App.renderLabNosSVG()">
                <option value="">-- เลือก Hypervisor --</option>
                <option value="vbox">Oracle VirtualBox / VMware Workstation</option>
                <option value="paint">Microsoft Paint</option>
              </select>
              <label style="font-size:0.8rem;">ระบบปฏิบัติการเครือข่าย (NOS):</label>
              <select id="l7-nos" class="px-input" style="margin-top:4px;" onchange="App.renderLabNosSVG()">
                <option value="">-- เลือก NOS --</option>
                <option value="winserver">Windows Server 2022 (Active Directory)</option>
                <option value="ubuntu">Ubuntu Server 24.04 LTS (Open-Source)</option>
                <option value="dos">MS-DOS 6.22</option>
              </select>
            </div>

            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--emerald); margin-bottom:8px;">2) จัดสรรทรัพยากรฮาร์ดแวร์เสมือน</div>
              <label style="font-size:0.8rem;">จำนวน vCPU (ขั้นต่ำ 2 Cores):</label>
              <select id="l7-cpu" class="px-input" style="margin:4px 0 6px;" onchange="App.renderLabNosSVG()">
                <option value="1">1 vCPU</option>
                <option value="2">2 vCPU</option>
                <option value="4">4 vCPU</option>
              </select>
              <label style="font-size:0.8rem;">หน่วยความจำ RAM (ขั้นต่ำ 2048 MB):</label>
              <select id="l7-ram" class="px-input" style="margin:4px 0 6px;" onchange="App.renderLabNosSVG()">
                <option value="512">512 MB</option>
                <option value="2048">2048 MB (2 GB)</option>
                <option value="4096">4096 MB (4 GB)</option>
              </select>
              <label style="font-size:0.8rem;">Virtual Hard Disk (ขั้นต่ำ 30 GB):</label>
              <select id="l7-disk" class="px-input" style="margin-top:4px;" onchange="App.renderLabNosSVG()">
                <option value="10">10 GB</option>
                <option value="40">40 GB (Dynamically Allocated)</option>
                <option value="80">80 GB</option>
              </select>
            </div>

            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--amber); margin-bottom:8px;">3) Virtual Network &amp; Optical Drive (.ISO)</div>
              <label style="font-size:0.8rem;">โหมดการ์ดแลน VM (ให้เครื่องอื่นใน LAN เข้าถึงได้):</label>
              <select id="l7-net" class="px-input" style="margin:4px 0 8px;" onchange="App.renderLabNosSVG()">
                <option value="nat">NAT (ซ่อนหลัง Host)</option>
                <option value="bridged">Bridged Adapter (รับ IP วง LAN จริง)</option>
                <option value="hostonly">Host-Only (คุยเฉพาะเครื่องแม่)</option>
              </select>
              <label style="font-size:0.8rem;">ไฟล์แผ่นติดตั้งระบบปฏิบัติการ:</label>
              <select id="l7-iso" class="px-input" style="margin-top:4px;" onchange="App.renderLabNosSVG()">
                <option value="">-- ยังไม่ใส่แผ่น --</option>
                <option value="iso">NOS_Server_Installer.iso</option>
                <option value="txt">readme.txt</option>
              </select>
            </div>
          </div>

          <div id="lab-nos-log" class="cli-terminal" style="margin-top:12px; min-height:76px; font-size:0.82rem; color:#94a3b8;">[Hypervisor Console] รอการตั้งค่า VM และกดปุ่ม "Power On &amp; ติดตั้ง NOS"...</div>
          <div style="margin-top:12px;">
            <button class="px-btn px-btn-emerald" onclick="App.deployLabNosVm()">🚀 Power On VM &amp; ติดตั้ง NOS</button>
          </div>
        </div>
      `;
      this.renderLabNosSVG();
    },

    renderLabNosSVG() {
      const wrap = document.getElementById('lab-nos-svg-wrap');
      if (!wrap) return;
      const hv = document.getElementById('l7-hv')?.value || '';
      const nos = document.getElementById('l7-nos')?.value || '';
      const cpu = Number(document.getElementById('l7-cpu')?.value || 1);
      const ram = Number(document.getElementById('l7-ram')?.value || 512);
      const disk = Number(document.getElementById('l7-disk')?.value || 10);
      const net = document.getElementById('l7-net')?.value || 'nat';
      const iso = document.getElementById('l7-iso')?.value || '';
      const specOk = cpu >= 2 && ram >= 2048 && disk >= 30;
      const netOk = net === 'bridged';
      const nosLabel = nos === 'winserver' ? 'Windows Server 2022' : nos === 'ubuntu' ? 'Ubuntu Server 24.04' : 'ยังไม่เลือก NOS';
      wrap.innerHTML = `
        <svg viewBox="0 0 600 190" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="600" height="190" fill="#070d1d"/>
          <rect x="24" y="16" width="340" height="82" fill="#1e1b4b" stroke="${specOk && iso === 'iso' ? '#22c55e' : '#6366f1'}" stroke-width="3"/>
          <text x="194" y="38" fill="#a5b4fc" font-size="12" font-weight="bold" text-anchor="middle">🖥️ VM: ${nosLabel}</text>
          <text x="194" y="60" fill="${specOk ? '#4ade80' : '#fca5a5'}" font-size="11" text-anchor="middle">vCPU: ${cpu} | RAM: ${ram} MB | Disk: ${disk} GB</text>
          <text x="194" y="82" fill="${iso === 'iso' ? '#38bdf8' : '#94a3b8'}" font-size="10" text-anchor="middle">💿 Optical: ${iso === 'iso' ? 'NOS_Server_Installer.iso ✔' : 'Empty / Invalid'}</text>

          <rect x="24" y="106" width="340" height="30" fill="#312e81" stroke="${hv === 'vbox' ? '#22c55e' : '#a855f7'}" stroke-width="2"/>
          <text x="194" y="125" fill="#e9d5ff" font-size="11" font-weight="bold" text-anchor="middle">Hypervisor: ${hv === 'vbox' ? 'VirtualBox / VMware ✔' : 'ยังไม่เลือก'}</text>

          <rect x="24" y="144" width="340" height="30" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
          <text x="194" y="163" fill="#cbd5e1" font-size="10" text-anchor="middle">Host Hardware (VT-x / AMD-V Physical NIC)</text>

          <line x1="366" y1="60" x2="432" y2="95" stroke="${netOk ? '#22c55e' : '#f59e0b'}" stroke-width="4" stroke-dasharray="${netOk ? '' : '6,4'}"/>
          <rect x="434" y="48" width="144" height="96" fill="#0f172a" stroke="${netOk ? '#22c55e' : '#f59e0b'}" stroke-width="3"/>
          <text x="506" y="76" fill="${netOk ? '#4ade80' : '#facc15'}" font-size="11" font-weight="bold" text-anchor="middle">VIRTUAL NIC</text>
          <text x="506" y="100" fill="#fff" font-size="11" text-anchor="middle">${net.toUpperCase()}</text>
          <text x="506" y="124" fill="${netOk ? '#4ade80' : '#fca5a5'}" font-size="9" text-anchor="middle">${netOk ? 'LAN IP 192.168.10.5 ✔' : 'เครื่องอื่นเข้าไม่ได้'}</text>
        </svg>
      `;
    },

    deployLabNosVm() {
      const hv = document.getElementById('l7-hv').value;
      const nos = document.getElementById('l7-nos').value;
      const cpu = Number(document.getElementById('l7-cpu').value);
      const ram = Number(document.getElementById('l7-ram').value);
      const disk = Number(document.getElementById('l7-disk').value);
      const net = document.getElementById('l7-net').value;
      const iso = document.getElementById('l7-iso').value;
      const log = document.getElementById('lab-nos-log');

      const errs = [];
      if (hv !== 'vbox') errs.push('กรุณาเลือกซอฟต์แวร์ Hypervisor (VirtualBox / VMware)');
      if (nos !== 'winserver' && nos !== 'ubuntu') errs.push('กรุณาเลือกระบบปฏิบัติการเครือข่าย (Windows Server หรือ Ubuntu Server)');
      if (cpu < 2 || ram < 2048 || disk < 30) errs.push('ทรัพยากร VM ไม่พอ! ต้องใช้ vCPU ≥ 2, RAM ≥ 2048 MB และ Disk ≥ 30 GB');
      if (net !== 'bridged') errs.push('โหมด Virtual Network ต้องเป็น Bridged Adapter เพื่อให้เครื่องอื่นใน LAN เชื่อมต่อ Server ได้');
      if (iso !== 'iso') errs.push('ยังไม่ได้ Mount ไฟล์แผ่นติดตั้ง .ISO ในไดรฟ์เสมือน');

      if (errs.length > 0) {
        soundFX.playPlayerHurt();
        log.innerHTML = `<div style="color:#fda4af;">[BOOT FAILED]<br>• ${errs.join('<br>• ')}</div>`;
        return;
      }

      const nosName = nos === 'winserver' ? 'Windows Server 2022' : 'Ubuntu Server 24.04 LTS';
      const steps = [
        `[BIOS] VT-x/AMD-V Enabled | ${cpu} vCPU | ${ram} MB RAM | ${disk} GB Virtual Disk`,
        `[BOOT] Mounting NOS_Server_Installer.iso ... OK`,
        `[INSTALL] Installing ${nosName} Core & Network Services ... 100%`,
        `[NET] Bridged Adapter Active → Assigned LAN IP 192.168.10.5/24`,
        `✔ [READY] ${nosName} บูตสำเร็จและพร้อมให้บริการในเครือข่ายแล้ว! (บันทึก Snapshot สำเร็จ)`
      ];
      log.innerHTML = '';
      steps.forEach((line, idx) => {
        setTimeout(() => {
          soundFX.playTesterBeep(idx + 2);
          log.innerHTML += `<div style="color:${idx === steps.length - 1 ? '#4ade80' : '#38bdf8'}">${line}</div>`;
          if (idx === steps.length - 1) {
            this.completeUnitLab(7, 'ผ่าน Lab 7 ติดตั้งระบบปฏิบัติการเครือข่ายบน VM');
          }
        }, idx * 240);
      });
    },

    /* === LAB 10 (NEW): Windows User, Group & NTFS Permission Manager === */
    initLabUserPerm(el) {
      el.innerHTML = `
        <div class="pixel-box lab-panel">
          <div class="lab-title-row">
            <div>
              <h3 style="color:#facc15;">🔑 Lab 10: จัดการบัญชีผู้ใช้ กลุ่มผู้ใช้ และสิทธิ์โฟลเดอร์ (lusrmgr.msc + NTFS)</h3>
              <p style="font-size:0.86rem; color:var(--text-muted);">สร้างบัญชีครู (<code>teacher01</code>) และนักศึกษา (<code>student01</code>), จัดเข้ากลุ่มให้ถูกต้อง และกำหนดสิทธิ์โฟลเดอร์ <code>Exam_Bank</code> ตามหลัก <b>Least Privilege</b> (ครูแก้ไขได้เต็มที่ แต่นักศึกษาอ่านได้อย่างเดียว ห้ามแก้ไข/ลบ)</p>
            </div>
          </div>
          <div class="topo-board" style="margin-top:10px;">
            <div id="lab-u10-svg-wrap"></div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px; margin-top:12px;">
            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--cyan); margin-bottom:8px;">1) สร้างบัญชีผู้ใช้ &amp; ระดับบัญชี</div>
              <div style="font-size:0.82rem; margin-bottom:4px;">บัญชี <code>teacher01</code> — กลุ่มที่สังกัด:</div>
              <select id="l10-tgroup" class="px-input" style="margin-bottom:10px;" onchange="App.renderLabU10SVG()">
                <option value="">-- เลือกกลุ่มผู้ใช้ --</option>
                <option value="Teachers">Teachers (กลุ่มครูผู้สอน)</option>
                <option value="Students">Students (กลุ่มนักศึกษา)</option>
                <option value="Guests">Guests (ผู้ใช้ชั่วคราว)</option>
              </select>

              <div style="font-size:0.82rem; margin-bottom:4px;">บัญชี <code>student01</code> — ระดับบัญชี (Account Type):</div>
              <select id="l10-stype" class="px-input" style="margin-bottom:8px;" onchange="App.renderLabU10SVG()">
                <option value="">-- เลือกระดับบัญชี --</option>
                <option value="admin">Administrator (คุมเครื่องทั้งหมด)</option>
                <option value="standard">Standard User (ใช้งานทั่วไป ปลอดภัย)</option>
              </select>

              <div style="font-size:0.82rem; margin-bottom:4px;">บัญชี <code>student01</code> — กลุ่มที่สังกัด:</div>
              <select id="l10-sgroup" class="px-input" onchange="App.renderLabU10SVG()">
                <option value="">-- เลือกกลุ่มผู้ใช้ --</option>
                <option value="Teachers">Teachers</option>
                <option value="Students">Students</option>
              </select>
            </div>

            <div class="pixel-box" style="padding:12px;">
              <div style="font-weight:700; color:var(--amber); margin-bottom:8px;">2) NTFS Permissions โฟลเดอร์ <code>\\LAB-SRV\Exam_Bank</code></div>
              <div style="font-size:0.82rem; margin-bottom:4px;">สิทธิ์ของกลุ่ม <b>Teachers</b>:</div>
              <select id="l10-tperm" class="px-input" style="margin-bottom:10px;" onchange="App.renderLabU10SVG()">
                <option value="">-- กำหนดสิทธิ์ NTFS --</option>
                <option value="full">Full Control / Modify (สร้าง/แก้ไข/ลบได้)</option>
                <option value="read">Read Only (อ่านอย่างเดียว)</option>
                <option value="deny">Deny All (ห้ามเข้าถึง)</option>
              </select>

              <div style="font-size:0.82rem; margin-bottom:4px;">สิทธิ์ของกลุ่ม <b>Students</b>:</div>
              <select id="l10-sperm" class="px-input" style="margin-bottom:10px;" onchange="App.renderLabU10SVG()">
                <option value="">-- กำหนดสิทธิ์ NTFS --</option>
                <option value="full">Full Control (แก้/ลบข้อสอบได้)</option>
                <option value="read">Read &amp; Execute (อ่านได้อย่างเดียว ห้ามแก้ไข)</option>
              </select>

              <div style="font-size:0.82rem; margin-bottom:4px;">กฎความปลอดภัย: หากบัญชีถูกตั้งทั้ง <b>Allow Read</b> และ <b>Deny Read</b> ผลคือ:</div>
              <select id="l10-rule" class="px-input" onchange="App.renderLabU10SVG()">
                <option value="">-- เลือกผลลัพธ์ --</option>
                <option value="allow">Allow ชนะ (เปิดอ่านได้)</option>
                <option value="deny">Explicit Deny ชนะ Allow เสมอ (ถูกปฏิเสธ)</option>
              </select>
            </div>
          </div>

          <div id="lab-u10-log" class="cli-terminal" style="margin-top:12px; min-height:70px; font-size:0.82rem; color:#94a3b8;">[Windows Security Audit] ตั้งค่าบัญชี กลุ่ม และสิทธิ์ NTFS ให้ครบ แล้วกด "ทดสอบ Sign-in และตรวจสิทธิ์"</div>
          <div style="margin-top:12px;">
            <button class="px-btn px-btn-emerald" onclick="App.checkLabUserPerm()">🔐 ทดสอบ Sign-in และตรวจสิทธิ์การเข้าถึง</button>
          </div>
        </div>
      `;
      this.renderLabU10SVG();
    },

    renderLabU10SVG() {
      const wrap = document.getElementById('lab-u10-svg-wrap');
      if (!wrap) return;
      const tg = document.getElementById('l10-tgroup')?.value || '?';
      const st = document.getElementById('l10-stype')?.value || '?';
      const sg = document.getElementById('l10-sgroup')?.value || '?';
      const tp = document.getElementById('l10-tperm')?.value || '?';
      const sp = document.getElementById('l10-sperm')?.value || '?';
      const tOk = tg === 'Teachers' && tp === 'full';
      const sOk = st === 'standard' && sg === 'Students' && sp === 'read';
      wrap.innerHTML = `
        <svg viewBox="0 0 600 185" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="600" height="185" fill="#070d1d"/>
          <rect x="18" y="22" width="136" height="60" fill="#0f172a" stroke="${tOk ? '#22c55e' : '#facc15'}" stroke-width="2"/>
          <text x="86" y="46" fill="#facc15" font-size="11" font-weight="bold" text-anchor="middle">👑 teacher01</text>
          <text x="86" y="66" fill="#cbd5e1" font-size="10" text-anchor="middle">Group: ${tg}</text>

          <rect x="18" y="104" width="136" height="60" fill="#0f172a" stroke="${sOk ? '#22c55e' : '#38bdf8'}" stroke-width="2"/>
          <text x="86" y="128" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">👤 student01</text>
          <text x="86" y="148" fill="#cbd5e1" font-size="9" text-anchor="middle">${st} / ${sg}</text>

          <line x1="156" y1="52" x2="394" y2="76" stroke="${tOk ? '#22c55e' : '#f59e0b'}" stroke-width="3" stroke-dasharray="${tOk ? '' : '6,4'}"/>
          <rect x="206" y="34" width="134" height="22" fill="#1e293b" stroke="${tOk ? '#22c55e' : '#f59e0b'}"/>
          <text x="273" y="49" fill="#fff" font-size="9" text-anchor="middle">NTFS: ${tp.toUpperCase()}</text>

          <line x1="156" y1="134" x2="394" y2="110" stroke="${sOk ? '#22c55e' : '#ef4444'}" stroke-width="3" stroke-dasharray="${sOk ? '' : '6,4'}"/>
          <rect x="206" y="128" width="134" height="22" fill="#1e293b" stroke="${sOk ? '#22c55e' : '#ef4444'}"/>
          <text x="273" y="143" fill="#fff" font-size="9" text-anchor="middle">NTFS: ${sp.toUpperCase()}</text>

          <rect x="396" y="38" width="184" height="108" fill="#0f172a" stroke="${tOk && sOk ? '#22c55e' : '#eab308'}" stroke-width="3"/>
          <text x="488" y="70" fill="#facc15" font-size="12" font-weight="bold" text-anchor="middle">🔐 EXAM_BANK</text>
          <text x="488" y="92" fill="#cbd5e1" font-size="10" text-anchor="middle">\\\\LAB-SRV\\Exam_Bank</text>
          <text x="488" y="118" fill="${tOk && sOk ? '#4ade80' : '#94a3b8'}" font-size="10" text-anchor="middle">${tOk && sOk ? 'Least Privilege ✔' : 'รอตั้งค่าสิทธิ์'}</text>
        </svg>
      `;
    },

    checkLabUserPerm() {
      const tgroup = document.getElementById('l10-tgroup').value;
      const stype = document.getElementById('l10-stype').value;
      const sgroup = document.getElementById('l10-sgroup').value;
      const tperm = document.getElementById('l10-tperm').value;
      const sperm = document.getElementById('l10-sperm').value;
      const rule = document.getElementById('l10-rule').value;
      const log = document.getElementById('lab-u10-log');

      const errs = [];
      if (tgroup !== 'Teachers') errs.push('teacher01 ต้องอยู่ในกลุ่ม Teachers');
      if (stype !== 'standard') errs.push('student01 ควรเป็นบัญชี Standard User ตามหลัก Least Privilege (ไม่ควรให้สิทธิ์ Administrator)');
      if (sgroup !== 'Students') errs.push('student01 ต้องอยู่ในกลุ่ม Students');
      if (tperm !== 'full') errs.push('กลุ่ม Teachers ต้องได้รับสิทธิ์ Full Control / Modify ในโฟลเดอร์ Exam_Bank');
      if (sperm !== 'read') errs.push('กลุ่ม Students ต้องได้รับสิทธิ์ Read & Execute (อ่านได้อย่างเดียว ห้ามแก้ไข/ลบ)');
      if (rule !== 'deny') errs.push('กฎเหล็ก NTFS: Explicit Deny จะชนะ Allow เสมอ');

      if (errs.length > 0) {
        soundFX.playPlayerHurt();
        log.innerHTML = `<div style="color:#fda4af;">❌ การตรวจสอบสิทธิ์ไม่ผ่าน:<br>• ${errs.join('<br>• ')}</div>`;
        return;
      }

      soundFX.playPowerUp();
      log.innerHTML = `
        <div style="color:#38bdf8;">[TEST 1] Sign-in as <b>teacher01</b> (Group: Teachers) → เปิด/แก้ไข \\\\LAB-SRV\\Exam_Bank ✔ ALLOWED</div>
        <div style="color:#facc15;">[TEST 2] Sign-in as <b>student01</b> (Standard User, Group: Students) → อ่านไฟล์ ✔ ALLOWED | ลบไฟล์ 🛡️ ACCESS DENIED</div>
        <div style="color:#4ade80;">✔ ระบบบัญชีผู้ใช้ กลุ่ม และสิทธิ์ NTFS ผ่านมาตรฐาน Least Privilege 100%!</div>
      `;
      this.completeUnitLab(10, 'ผ่าน Lab 10 การสร้างบัญชีผู้ใช้ กลุ่ม และกำหนดสิทธิ์');
    },

    /* ---------------- TURN-BASED 16-BIT BOSS BATTLE ---------------- */
    getUnitQuestions(unitId) {
      const unit = GameData.UNITS.find((u) => u.id === unitId);
      const base = unit ? [...unit.quiz] : [];
      const extra = [];
      try {
        const raw = localStorage.getItem(CUSTOM_Q_KEY);
        if (raw) {
          JSON.parse(raw).forEach((q) => {
            if (Number(q.unitId) === unitId) extra.push(q);
          });
        }
      } catch (e) { /* ignore */ }
      (this.cloudQuestions || []).forEach((q) => {
        if (Number(q.unitId) === unitId && !extra.some((x) => x.q === q.q)) {
          extra.push(q);
        }
      });
      return base.concat(extra);
    },

    renderBossLobby(unit) {
      const prog = this.state.unitProgress[unit.id];
      const labBuff = prog.labCleared ? '⚡ บัฟห้อง Lab ทำงาน: พลังโจมตี +10 ต่อบอส!' : '💡 คำแนะนำ: ผ่าน Lab ขั้นที่ 2 ก่อนเพื่อรับโบนัสโจมตี +10';
      document.getElementById('stage-body-boss').innerHTML = `
        <div class="battle-arena" style="text-align:center;">
          <div style="display:flex; justify-content:center; margin-bottom:10px;">
            ${PixelSprites.render(unit.boss.sprite, 108)}
          </div>
          <h2 class="pixel-title" style="color:var(--crimson); font-size:1.4rem;">${unit.boss.name}</h2>
          <div style="font-size:1.05rem; color:#fff; margin-top:4px;">${unit.boss.thName} (HP: ${unit.boss.hp})</div>
          <p style="color:var(--amber); margin:10px auto; max-width:560px; font-style:italic;">"${unit.boss.taunt}"</p>
          <div style="color:var(--cyan); font-size:0.9rem; margin-bottom:16px;">${labBuff}</div>
          <button class="px-btn px-btn-crimson" onclick="App.startBossBattle(${unit.id})">⚔️ เริ่มการต่อสู้กับบอส!</button>
        </div>
      `;
    },

    startBossBattle(unitId) {
      soundFX.playLaserAttack();
      const unit = GameData.UNITS.find((u) => u.id === unitId);
      const stats = this.getPlayerStats();
      this.state.hp = stats.maxHp; // Full heal on entering battle stage
      this.renderHUD();

      const questions = this.getUnitQuestions(unitId);
      const labCleared = this.state.unitProgress[unitId].labCleared;

      this.battle = {
        unit,
        questions,
        qIndex: 0,
        bossHp: unit.boss.hp,
        bossMaxHp: unit.boss.hp,
        combo: 0,
        maxCombo: 0,
        correctCount: 0,
        shieldActive: false,
        answered: false,
        timeLeft: 25 + stats.timeBonus,
        timerId: null,
        labAtkBonus: labCleared ? 10 : 0
      };
      this.renderBattleUI();
      this.startBattleTimer();
    },

    stopBattleTimer() {
      if (this.battle && this.battle.timerId) {
        clearInterval(this.battle.timerId);
        this.battle.timerId = null;
      }
      if (this.arcade && this.arcade.timerId) {
        clearInterval(this.arcade.timerId);
        this.arcade.timerId = null;
      }
    },

    startBattleTimer() {
      if (!this.battle) return;
      clearInterval(this.battle.timerId);
      this.battle.timerId = setInterval(() => {
        if (!this.battle || this.battle.answered) return;
        this.battle.timeLeft -= 1;
        const tEl = document.getElementById('battle-timer-val');
        if (tEl) tEl.textContent = `${this.battle.timeLeft}s`;
        if (this.battle.timeLeft <= 0) {
          this.handleBattleAnswer(-1);
        }
      }, 1000);
    },

    renderBattleUI() {
      const b = this.battle;
      const cls = this.getClassObj();
      const stats = this.getPlayerStats();
      const q = b.questions[b.qIndex];
      const bossPct = Math.max(0, Math.round((b.bossHp / b.bossMaxHp) * 100));
      const heroPct = Math.max(0, Math.round((this.state.hp / stats.maxHp) * 100));

      document.getElementById('stage-body-boss').innerHTML = `
        <div class="battle-arena">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
            <span class="unit-code" style="color:var(--cyan);">ข้อที่ ${b.qIndex + 1} / ${b.questions.length}</span>
            <span id="battle-combo-pill" class="combo-pill">🔥 COMBO x${b.combo}</span>
            <span class="res-pill" style="border-color:var(--amber);">⏱️ เวลา: <b id="battle-timer-val" style="color:var(--amber);">${b.timeLeft}s</b></span>
          </div>

          <div class="battle-stage">
            <div class="combatant">
              <div id="hero-sprite-stage" class="sprite-stage">${PixelSprites.render(cls.sprite, 88)}</div>
              <b>${this.state.profile.name || 'ผู้กล้า'} ${b.shieldActive ? '🛡️' : ''}</b>
              <div class="pixel-bar-track" style="width:180px;"><div id="battle-hero-bar" class="pixel-bar-fill bar-hp" style="width:${heroPct}%"></div></div>
              <small id="battle-hero-hp-text">${this.state.hp} / ${stats.maxHp} HP</small>
            </div>

            <div class="pixel-title" style="color:var(--amber); font-size:1.3rem;">VS</div>

            <div class="combatant">
              <div id="boss-sprite-stage" class="sprite-stage">${PixelSprites.render(b.unit.boss.sprite, 92)}</div>
              <b style="color:var(--crimson);">${b.unit.boss.thName}</b>
              <div class="pixel-bar-track" style="width:180px;"><div id="battle-boss-bar" class="pixel-bar-fill bar-boss" style="width:${bossPct}%"></div></div>
              <small id="battle-boss-hp-text">${b.bossHp} / ${b.bossMaxHp} HP</small>
            </div>
          </div>

          <div class="pixel-box" style="padding:16px;">
            <h3 style="font-size:1.08rem; color:#fff;">❓ ${q.q}</h3>
            <div class="quiz-options-grid" id="battle-options">
              ${q.options.map((opt, idx) => `
                <button id="b-opt-${idx}" class="quiz-option-btn" onclick="App.handleBattleAnswer(${idx})">
                  <b>${['ก', 'ข', 'ค', 'ง'][idx] || idx + 1}.</b> ${opt}
                </button>
              `).join('')}
            </div>

            <div id="battle-feedback" style="margin-top:12px;"></div>

            <div class="battle-items-bar">
              <span style="font-size:0.84rem; color:var(--text-muted); align-self:center;">🎒 กระเป๋าไอเทม:</span>
              <button class="px-btn px-btn-emerald px-btn-sm" onclick="App.useBattleItem('potion')">🧪 Ping Potion (${this.state.inventory.potion || 0})</button>
              <button class="px-btn px-btn-cyan px-btn-sm" onclick="App.useBattleItem('analyzer')">🔍 50/50 (${this.state.inventory.analyzer || 0})</button>
              <button class="px-btn px-btn-amber px-btn-sm" onclick="App.useBattleItem('clock')">⏱️ +15s (${this.state.inventory.clock || 0})</button>
              <button class="px-btn px-btn-violet px-btn-sm" onclick="App.useBattleItem('shield')">🛡️ Shield (${this.state.inventory.shield || 0})</button>
            </div>
          </div>
        </div>
      `;
    },

    useBattleItem(type) {
      if (!this.battle || this.battle.answered) return;
      if ((this.state.inventory[type] || 0) <= 0) {
        alert('ไอเทมชนิดนี้หมดแล้ว! สามารถแวะซื้อเพิ่มได้ใน 🛒 ร้านค้า');
        return;
      }
      const stats = this.getPlayerStats();
      if (type === 'potion') {
        this.state.inventory.potion -= 1;
        this.state.hp = Math.min(stats.maxHp, this.state.hp + 45);
        soundFX.playPowerUp();
        this.toast('🧪 ใช้ Ping Potion ฟื้นฟู +45 HP!');
        this.renderBattleUI();
      } else if (type === 'clock') {
        this.state.inventory.clock -= 1;
        this.battle.timeLeft += 15;
        soundFX.playPowerUp();
        this.toast('⏱️ ใช้ Overclock Crystal เพิ่มเวลา +15 วินาที!');
        document.getElementById('battle-timer-val').textContent = `${this.battle.timeLeft}s`;
      } else if (type === 'shield') {
        if (this.battle.shieldActive) return;
        this.state.inventory.shield -= 1;
        this.battle.shieldActive = true;
        soundFX.playPowerUp();
        this.toast('🛡️ เปิดเกราะ Firewall Shield กันดาเมจ 1 ครั้ง!');
        this.renderBattleUI();
      } else if (type === 'analyzer') {
        const q = this.battle.questions[this.battle.qIndex];
        const wrongIndices = q.options.map((_, i) => i).filter((i) => i !== q.ans);
        if (wrongIndices.length < 2) return;
        this.state.inventory.analyzer -= 1;
        soundFX.playPowerUp();
        wrongIndices.slice(0, 2).forEach((wi) => {
          const btn = document.getElementById(`b-opt-${wi}`);
          if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.25';
          }
        });
        this.toast('🔍 Packet Sniffer ตัดตัวเลือกที่ผิดออกให้แล้ว 2 ข้อ!');
      }
      this.saveState();
      this.renderHUD();
    },

    handleBattleAnswer(selectedIdx) {
      if (!this.battle || this.battle.answered) return;
      this.battle.answered = true;
      clearInterval(this.battle.timerId);

      const b = this.battle;
      const q = b.questions[b.qIndex];
      const stats = this.getPlayerStats();
      const isCorrect = selectedIdx === q.ans;

      // Highlight options
      q.options.forEach((_, idx) => {
        const btn = document.getElementById(`b-opt-${idx}`);
        if (!btn) return;
        btn.disabled = true;
        if (idx === q.ans) btn.classList.add('correct');
        else if (idx === selectedIdx) btn.classList.add('wrong');
      });

      const fb = document.getElementById('battle-feedback');
      if (isCorrect) {
        b.combo += 1;
        b.correctCount += 1;
        if (b.combo > b.maxCombo) b.maxCombo = b.combo;
        if (b.combo > this.state.daily.bestComboToday) this.state.daily.bestComboToday = b.combo;
        if (b.combo >= 4) this.unlockBadge('combo_master');

        const isCrit = Math.random() < stats.crit;
        const baseDmg = stats.atk + b.labAtkBonus + (b.combo - 1) * 5;
        const dmg = Math.round(baseDmg * (isCrit ? 1.5 : 1));
        b.bossHp = Math.max(0, b.bossHp - dmg);

        soundFX.playBossHit();
        const bossEl = document.getElementById('boss-sprite-stage');
        if (bossEl) bossEl.classList.add('sprite-hit');

        fb.innerHTML = `
          <div class="pixel-box" style="padding:12px; border-color:var(--emerald); background:rgba(16,185,129,0.12);">
            <b style="color:var(--emerald);">⚔️ โจมตีบอส -${dmg} HP! ${isCrit ? '💥 CRITICAL HIT!' : ''} (Combo x${b.combo})</b>
            <div style="font-size:0.88rem; margin-top:4px;">💡 เฉลย: ${q.exp}</div>
            <button class="px-btn px-btn-cyan px-btn-sm" style="margin-top:10px;" onclick="App.nextBattleStep()">ดำเนินการต่อ ➜</button>
          </div>
        `;
      } else {
        b.combo = 0;
        let dmgTaken = Math.round(b.unit.boss.atk * (1 - stats.def));
        if (b.shieldActive) {
          dmgTaken = 0;
          b.shieldActive = false;
        }
        this.state.hp = Math.max(0, this.state.hp - dmgTaken);
        soundFX.playPlayerHurt();
        const heroEl = document.getElementById('hero-sprite-stage');
        if (heroEl) heroEl.classList.add('sprite-hit');

        fb.innerHTML = `
          <div class="pixel-box" style="padding:12px; border-color:var(--crimson); background:rgba(239,68,68,0.12);">
            <b style="color:var(--crimson);">${selectedIdx === -1 ? '⏱️ หมดเวลา!' : '❌ ตอบผิด!'} ${dmgTaken === 0 ? '🛡️ โล่ Firewall ป้องกันดาเมจไว้ได้!' : `โดนบอสโจมตี -${dmgTaken} HP!`}</b>
            <div style="font-size:0.88rem; margin-top:4px;">💡 เฉลย: ${q.exp}</div>
            <button class="px-btn px-btn-amber px-btn-sm" style="margin-top:10px;" onclick="App.nextBattleStep()">สู้ต่อ ➜</button>
          </div>
        `;
      }
      // Sync Battle Arena HP bars & Combo immediately
      const bossBar = document.getElementById('battle-boss-bar');
      const bossHpTxt = document.getElementById('battle-boss-hp-text');
      const heroBar = document.getElementById('battle-hero-bar');
      const heroHpTxt = document.getElementById('battle-hero-hp-text');
      const comboPill = document.getElementById('battle-combo-pill');
      if (bossBar) bossBar.style.width = `${Math.max(0, Math.round((b.bossHp / b.bossMaxHp) * 100))}%`;
      if (bossHpTxt) bossHpTxt.textContent = `${b.bossHp} / ${b.bossMaxHp} HP`;
      if (heroBar) heroBar.style.width = `${Math.max(0, Math.round((this.state.hp / stats.maxHp) * 100))}%`;
      if (heroHpTxt) heroHpTxt.textContent = `${this.state.hp} / ${stats.maxHp} HP`;
      if (comboPill) comboPill.textContent = `🔥 COMBO x${b.combo}`;
      this.renderHUD();
    },

    nextBattleStep() {
      const b = this.battle;
      if (!b) return;
      if (this.state.hp <= 0) {
        this.finishBattle(false);
        return;
      }
      if (b.bossHp <= 0 || b.qIndex >= b.questions.length - 1) {
        const won = b.bossHp <= 0 || b.correctCount >= Math.ceil(b.questions.length * 0.6);
        this.finishBattle(won);
        return;
      }
      b.qIndex += 1;
      b.answered = false;
      b.timeLeft = 25 + this.getPlayerStats().timeBonus;
      this.renderBattleUI();
      this.startBattleTimer();
    },

    finishBattle(won) {
      const b = this.battle;
      this.stopBattleTimer();
      const totalQ = b.questions.length;
      const pct = Math.round((b.correctCount / totalQ) * 100);
      const stars = won ? (pct >= 90 ? 3 : pct >= 70 ? 2 : 1) : 0;

      if (won) {
        soundFX.playVictoryFanfare();
        const prog = this.state.unitProgress[b.unit.id];
        const firstBossClear = !prog.bossCleared;
        prog.bossCleared = true;
        if (pct > prog.bestScore) prog.bestScore = pct;
        if (stars > prog.stars) prog.stars = stars;
        this.state.daily.bossesDefeatedToday += 1;
        this.refreshStageBadges();
        const bossXp = firstBossClear ? (200 + b.correctCount * 20) : 40;
        const bossCoins = firstBossClear ? (60 + b.maxCombo * 5) : 10;
        this.addRewards(bossXp, bossCoins, `ปราบบอส ${b.unit.boss.thName}`);
      } else {
        soundFX.playPlayerHurt();
        const stats = this.getPlayerStats();
        this.state.hp = stats.maxHp;
        this.renderHUD();
      }

      document.getElementById('stage-body-boss').innerHTML = `
        <div class="battle-arena" style="text-align:center; padding:28px;">
          <h2 class="pixel-title" style="color:${won ? 'var(--amber)' : 'var(--crimson)'}; font-size:1.6rem;">
            ${won ? '🎉 VICTORY! ปราบบอสสำเร็จ!' : '💀 DEFEAT! พ่ายแพ้ในการต่อสู้'}
          </h2>
          <div style="font-size:2rem; color:var(--amber); margin:10px 0;">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
          <p style="font-size:1.05rem;">ตอบถูก ${b.correctCount} / ${totalQ} ข้อ (${pct}%) | คอมโบสูงสุด x${b.maxCombo}</p>
          <div style="display:flex; justify-content:center; gap:12px; margin-top:18px; flex-wrap:wrap;">
            <button class="px-btn px-btn-cyan" onclick="App.showWorldMap()">🗺️ กลับแผนที่โลก</button>
            <button class="px-btn px-btn-amber" onclick="App.startBossBattle(${b.unit.id})">🔁 ท้าทายบอสอีกครั้ง</button>
          </div>
        </div>
      `;
      this.battle = null;
    },

    /* ---------------- SHOP & EQUIPMENT ---------------- */
    openShop() {
      soundFX.playSelect();
      this.renderShop();
      document.getElementById('modal-shop').classList.remove('hidden');
    },

    renderShop() {
      document.getElementById('shop-coins').textContent = this.state.coins;
      const grid = document.getElementById('shop-items-grid');
      grid.innerHTML = GameData.SHOP_ITEMS.map((item) => {
        const ownedEquip = item.type === 'equipment' && this.state.equipment.includes(item.id);
        const qty = item.type === 'consumable' ? (this.state.inventory[item.id] || 0) : 0;
        return `
          <div class="shop-card">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                ${PixelSprites.render(item.sprite, 48)}
                <span class="res-pill" style="font-size:0.75rem;">
                  ${item.type === 'equipment' ? (ownedEquip ? '✔ สวมใส่แล้ว' : 'อุปกรณ์ถาวร') : `มีอยู่: ${qty}`}
                </span>
              </div>
              <h4 style="color:var(--cyan); margin-top:8px;">${item.name}</h4>
              <p style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">${item.desc}</p>
            </div>
            <button class="px-btn px-btn-amber px-btn-sm" ${ownedEquip ? 'disabled' : ''} onclick="App.buyItem('${item.id}')">
              ${ownedEquip ? 'สวมใส่เรียบร้อย' : `ซื้อ 🪙 ${item.price}`}
            </button>
          </div>
        `;
      }).join('');
    },

    buyItem(id) {
      const item = GameData.SHOP_ITEMS.find((i) => i.id === id);
      if (!item) return;
      if (item.type === 'equipment' && this.state.equipment.includes(id)) return;
      if (this.state.coins < item.price) {
        soundFX.playPlayerHurt();
        alert('เหรียญ BitCoins ไม่เพียงพอ! ลองทำ Lab หรือตอบคำถามเพื่อสะสมเหรียญเพิ่มนะ');
        return;
      }
      this.state.coins -= item.price;
      if (item.type === 'equipment') {
        this.state.equipment.push(id);
        this.state.hp = this.getPlayerStats().maxHp;
      } else {
        this.state.inventory[id] = (this.state.inventory[id] || 0) + 1;
      }
      this.unlockBadge('shopaholic');
      soundFX.playCoin();
      this.toast(`🛒 ซื้อ ${item.name} สำเร็จ!`);
      this.saveState();
      this.renderHUD();
      this.renderShop();
    },

    /* ---------------- ENDLESS ARCADE ---------------- */
    openArcade() {
      soundFX.playSelect();
      const pool = [];
      GameData.UNITS.forEach((u) => {
        this.getUnitQuestions(u.id).forEach((q) => pool.push({ ...q, unitCode: u.code }));
      });
      // Shuffle
      pool.sort(() => Math.random() - 0.5);
      this.arcade = { pool, idx: 0, hearts: 3, score: 0, streak: 0, viewingBoard: false };
      this.state.daily.arcadeRunsToday += 1;
      this.saveState();
      const boardBtn = document.getElementById('btn-arcade-board');
      if (boardBtn) boardBtn.textContent = '🏆 ตารางคะแนน';
      this.renderArcade();
      document.getElementById('modal-arcade').classList.remove('hidden');
    },

    stopArcade() {
      this.arcade = null;
      this.closeModal('modal-arcade');
    },

    async toggleArcadeLeaderboard() {
      soundFX.playSelect();
      if (!this.arcade) return;
      this.arcade.viewingBoard = !this.arcade.viewingBoard;
      const boardBtn = document.getElementById('btn-arcade-board');
      if (this.arcade.viewingBoard) {
        if (boardBtn) boardBtn.textContent = '🎮 กลับหน้าอาร์เคด';
        await this.renderArcadeLeaderboard();
      } else {
        if (boardBtn) boardBtn.textContent = '🏆 ตารางคะแนน';
        this.renderArcade();
      }
    },

    async renderArcadeLeaderboard() {
      const body = document.getElementById('arcade-body');
      if (!body) return;
      this.syncLeaderboardEntry();
      body.innerHTML = `<div style="padding:20px; text-align:center; color:var(--cyan);">⏳ กำลังโหลดตารางคะแนน Endless Arcade...</div>`;
      const fallback = this.getLeaderboardData();
      const rawList = global.FirebaseService
        ? await FirebaseService.fetchLeaderboard(fallback)
        : fallback;
      const list = [...rawList].sort((a, b) => (b.arcadeHighScore || 0) - (a.arcadeHighScore || 0));
      const isCloud = global.FirebaseService && FirebaseService.isCloud();

      body.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px; font-size:0.85rem;">
          <span style="color:${isCloud ? 'var(--emerald)' : 'var(--amber)'}; font-weight:700;">
            🕹️ อันดับคะแนนสูงสุด Endless Arcade (${isCloud ? '☁️ Cloud Firestore' : '💾 Local Mode'})
          </span>
          <div style="display:flex; gap:6px;">
            <button class="px-btn px-btn-sm" onclick="App.renderArcadeLeaderboard()">🔄 รีเฟรช</button>
            <button class="px-btn px-btn-violet px-btn-sm" onclick="App.toggleArcadeLeaderboard()">🎮 กลับหน้าอาร์เคด</button>
          </div>
        </div>
        <table class="pixel-table">
          <thead>
            <tr><th>อันดับ</th><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th><th>ห้อง</th><th>คะแนนสูงสุด</th></tr>
          </thead>
          <tbody>
            ${list.map((r, i) => {
              const heroKey = r.heroClass || 'paladin';
              const clsObj = this.getClassObj(heroKey);
              return `
                <tr style="${r.studentId === this.state.profile.studentId ? 'background:rgba(168,85,247,0.18);' : ''}">
                  <td>
                    <div style="display:inline-flex; align-items:center; gap:8px;">
                      <b>#${i + 1}</b>
                      <span title="${clsObj.thName}" style="display:inline-flex; align-items:center;">${PixelSprites.render(heroKey, 28)}</span>
                    </div>
                  </td>
                  <td>${r.studentId}</td>
                  <td>${r.name}</td>
                  <td>${r.classRoom}</td>
                  <td><b style="color:var(--amber);">🏆 ${r.arcadeHighScore || 0}</b></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    },

    renderArcade() {
      const a = this.arcade;
      const body = document.getElementById('arcade-body');
      if (!a) return;
      if (a.hearts <= 0 || a.idx >= a.pool.length) {
        if (!a.finished) {
          a.finished = true;
          const isRecord = a.score > this.state.arcadeHighScore;
          if (isRecord) this.state.arcadeHighScore = a.score;
          const rewardXp = Math.min(200, Math.round(a.score / 5));
          const withinDailyCoinCap = (this.state.daily.arcadeRunsToday || 0) <= 3;
          const rewardCoins = withinDailyCoinCap ? Math.min(50, Math.round(a.score / 15)) : 0;
          if (rewardXp > 0) this.addRewards(rewardXp, rewardCoins, `จบเกม Endless Arcade (${a.score} แต้ม)`);
          else if (isRecord) this.saveState(true);
        }
        body.innerHTML = `
          <div style="text-align:center; padding:24px;">
            <h3 class="pixel-title" style="color:var(--amber); font-size:1.4rem;">🕹️ GAME OVER!</h3>
            <p style="font-size:1.2rem; margin:10px 0;">คะแนนรอบนี้: <b style="color:var(--cyan)">${a.score}</b> | สถิติสูงสุด: <b style="color:var(--emerald)">${this.state.arcadeHighScore}</b></p>
            <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:12px;">
              <button class="px-btn px-btn-violet" onclick="App.openArcade()">🔁 เล่นอาร์เคดอีกรอบ</button>
              <button class="px-btn px-btn-amber" onclick="App.toggleArcadeLeaderboard()">🏆 ดูตารางคะแนนอาร์เคด</button>
            </div>
          </div>
        `;
        return;
      }

      const q = a.pool[a.idx];
      body.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <span class="res-pill">❤️ หัวใจ: ${'❤️'.repeat(a.hearts)}${'🖤'.repeat(3 - a.hearts)}</span>
          <span class="res-pill">⚡ Streak: x${a.streak}</span>
          <span class="res-pill">🏆 Score: <b style="color:var(--amber);">${a.score}</b> (High: ${this.state.arcadeHighScore})</span>
        </div>
        <div class="pixel-box" style="padding:16px;">
          <span class="unit-code" style="color:var(--violet);">${q.unitCode}</span>
          <h4 style="margin-top:8px; font-size:1.05rem;">${q.q}</h4>
          <div class="quiz-options-grid">
            ${q.options.map((opt, idx) => `
              <button class="quiz-option-btn" onclick="App.answerArcade(${idx})">${['ก', 'ข', 'ค', 'ง'][idx]}. ${opt}</button>
            `).join('')}
          </div>
          <div id="arcade-fb" style="margin-top:10px; font-size:0.88rem;"></div>
        </div>
      `;
    },

    answerArcade(idx) {
      const a = this.arcade;
      if (!a) return;
      const q = a.pool[a.idx];
      if (idx === q.ans) {
        a.streak += 1;
        a.score += 100 + (a.streak - 1) * 25;
        soundFX.playCoin();
        a.idx += 1;
        this.renderArcade();
      } else {
        a.streak = 0;
        a.hearts -= 1;
        soundFX.playPlayerHurt();
        a.idx += 1;
        this.toast(`❌ พลาด! เฉลย: ${q.options[q.ans]}`);
        this.renderArcade();
      }
    },

    /* ---------------- ENCYCLOPEDIA ---------------- */
    openEncyclopedia() {
      soundFX.playSelect();
      document.getElementById('encyclopedia-body').innerHTML = `
        <div style="display:flex; flex-direction:column; gap:18px;">
          <div>
            <h4 style="color:var(--amber); margin-bottom:8px;">1. ตารางสีสาย UTP RJ-45 (T568B vs T568A)</h4>
            <table class="pixel-table">
              <thead><tr><th>Pin</th><th>มาตรฐาน T568B (สายตรงนิยมสุด)</th><th>มาตรฐาน T568A</th></tr></thead>
              <tbody>
                ${[0,1,2,3,4,5,6,7].map((i) => {
                  const b = GameData.T568B.find((x) => x.id === GameData.T568B_ORDER[i]);
                  const a = GameData.T568B.find((x) => x.id === GameData.T568A_ORDER[i]);
                  return `<tr><td><b>Pin ${i + 1}</b></td><td>${b.name}</td><td>${a.name}</td></tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div>
            <h4 style="color:var(--cyan); margin-bottom:8px;">2. ตารางหมายเลขพอร์ต (Well-Known Ports)</h4>
            <table class="pixel-table">
              <thead><tr><th>Port</th><th>Protocol</th><th>หน้าที่การทำงาน</th></tr></thead>
              <tbody>
                ${GameData.ENCYCLOPEDIA_PORTS.map((p) => `<tr><td><b>${p.port}</b></td><td>${p.proto}</td><td>${p.desc}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
          <div>
            <h4 style="color:var(--emerald); margin-bottom:8px;">3. ตาราง Subnet Mask มาตรฐาน IPv4</h4>
            <table class="pixel-table">
              <thead><tr><th>CIDR</th><th>Subnet Mask</th><th>จำนวน Host ที่ใช้ได้</th><th>ตัวอย่างการใช้งาน</th></tr></thead>
              <tbody>
                <tr><td>/8</td><td>255.0.0.0</td><td>16,777,214</td><td>Class A องค์กรขนาดยักษ์</td></tr>
                <tr><td>/16</td><td>255.255.0.0</td><td>65,534</td><td>Class B มหาวิทยาลัย/องค์กรใหญ่</td></tr>
                <tr><td>/24</td><td>255.255.255.0</td><td>254</td><td>Class C ห้องปฏิบัติการ/สำนักงาน</td></tr>
                <tr><td>/25</td><td>255.255.255.128</td><td>126</td><td>แบ่ง 2 วงย่อย</td></tr>
                <tr><td>/30</td><td>255.255.255.252</td><td>2</td><td>ลิงก์เชื่อม Router-to-Router</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
      document.getElementById('modal-encyclopedia').classList.remove('hidden');
    },

    /* ---------------- LEADERBOARD & CSV ---------------- */
    getLeaderboardData() {
      let list = [...GameData.INITIAL_LEADERBOARD];
      try {
        const raw = localStorage.getItem(LEADERBOARD_KEY);
        if (raw) list = JSON.parse(raw);
      } catch (e) { /* ignore */ }
      return list.sort((a, b) => b.xp - a.xp);
    },

    syncLeaderboardEntry() {
      if (!this.state.profile.created) return;
      let list = this.getLeaderboardData();
      const { current } = this.getRankInfo(this.state.xp);
      const cleared = Object.values(this.state.unitProgress).filter((u) => u.bossCleared).length;
      const entry = {
        name: this.state.profile.name,
        studentId: this.state.profile.studentId,
        classRoom: this.state.profile.classRoom,
        heroClass: this.state.profile.heroClass,
        level: current.level,
        xp: this.state.xp,
        unitsCleared: cleared,
        badgeCount: this.state.badges.length,
        arcadeHighScore: this.state.arcadeHighScore || 0,
        updatedAt: todayKey()
      };
      const idx = list.findIndex((x) => x.studentId === entry.studentId);
      if (idx >= 0) list[idx] = entry;
      else list.push(entry);
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
    },

    async openLeaderboard() {
      soundFX.playSelect();
      this.syncLeaderboardEntry();
      document.getElementById('leaderboard-body').innerHTML = `<div style="padding:20px; text-align:center; color:var(--cyan);">⏳ กำลังดึงข้อมูลอันดับล่าสุด...</div>`;
      document.getElementById('modal-leaderboard').classList.remove('hidden');

      const fallback = this.getLeaderboardData();
      const list = global.FirebaseService
        ? await FirebaseService.fetchLeaderboard(fallback)
        : fallback;
      const isCloud = global.FirebaseService && FirebaseService.isCloud();

      document.getElementById('leaderboard-body').innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:0.85rem;">
          <span style="color:${isCloud ? 'var(--emerald)' : 'var(--amber)'}; font-weight:700;">
            ${isCloud ? '☁️ ซิงก์อันดับ Real-time จาก Cloud Firestore' : '💾 แสดงอันดับจากบัญชีในเครื่องนี้ + ข้อมูลจำลอง'}
          </span>
          <button class="px-btn px-btn-sm" onclick="App.openLeaderboard()">🔄 รีเฟรช</button>
        </div>
        <table class="pixel-table">
          <thead>
            <tr><th>อันดับ</th><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th><th>ห้อง</th><th>LV</th><th>XP</th><th>ผ่าน (หน่วย)</th><th>เหรียญ</th></tr>
          </thead>
          <tbody>
            ${list.map((r, i) => {
              const heroKey = r.heroClass || 'paladin';
              const clsObj = this.getClassObj(heroKey);
              return `
                <tr style="${r.studentId === this.state.profile.studentId ? 'background:rgba(56,189,248,0.16);' : ''}">
                  <td>
                    <div style="display:inline-flex; align-items:center; gap:8px;">
                      <b>#${i + 1}</b>
                      <span title="${clsObj.thName}" style="display:inline-flex; align-items:center;">${PixelSprites.render(heroKey, 28)}</span>
                    </div>
                  </td>
                  <td>${r.studentId}</td>
                  <td>${r.name}</td>
                  <td>${r.classRoom}</td>
                  <td>LV.${r.level}</td>
                  <td><b>${r.xp}</b></td>
                  <td>${r.unitsCleared}/${GameData.UNITS.length}</td>
                  <td>🏅 ${r.badgeCount}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    },

    async exportCSV() {
      const fallback = this.getLeaderboardData();
      const list = global.FirebaseService
        ? await FirebaseService.fetchLeaderboard(fallback)
        : fallback;
      const header = ['Rank', 'StudentID', 'Name', 'ClassRoom', 'Level', 'XP', 'UnitsCleared', 'Badges', 'UpdatedAt'];
      const rows = list.map((r, i) => [
        i + 1, r.studentId, `"${r.name}"`, `"${r.classRoom}"`, r.level, r.xp, `${r.unitsCleared}/${GameData.UNITS.length}`, r.badgeCount, r.updatedAt
      ].join(','));
      const csv = '\uFEFF' + [header.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NetQuest_Leaderboard_${todayKey()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      this.toast('📥 ดาวน์โหลดไฟล์คะแนน CSV เรียบร้อย!');
    },

    /* ---------------- CERTIFICATE & PRINT ---------------- */
    openCertificate() {
      soundFX.playSelect();
      const { current } = this.getRankInfo(this.state.xp);
      const cleared = Object.values(this.state.unitProgress).filter((u) => u.bossCleared).length;
      const cls = this.getClassObj();

      document.getElementById('certificate-print-area').innerHTML = `
        <div style="font-size:0.9rem; color:#92400e; font-weight:700;">NETQUEST 16-BIT — CYBER NETWORK ACADEMY (ปวช.)</div>
        <h2>เกียรติบัตรและใบรายงานผลการเรียนรู้รายวิชาระบบเครือข่ายคอมพิวเตอร์</h2>
        <p>ขอมอบเกียรติบัตรฉบับนี้เพื่อแสดงว่า</p>
        <div style="font-size:1.5rem; font-weight:700; color:#1e3a8a; margin:8px 0;">
          ${this.state.profile.name || 'ผู้เรียน'} (รหัส ${this.state.profile.studentId || '-'})
        </div>
        <div>ระดับชั้น: <b>${this.state.profile.classRoom || 'ปวช.'}</b> | อาชีพ: <b>${cls.thName}</b> | ยศ: <b>LV.${current.level} ${current.title}</b></div>
        <div style="margin-top:8px;">คะแนนประสบการณ์รวม: <b>${this.state.xp} XP</b> | ผ่านภารกิจ: <b>${cleared}/${GameData.UNITS.length} หน่วย</b> | เหรียญตรา: <b>${this.state.badges.length}/${GameData.BADGES.length}</b></div>

        <table class="cert-table">
          <thead>
            <tr><th>หน่วยการเรียนรู้</th><th>ห้อง Lab ปฏิบัติการ</th><th>ดวลบอสทดสอบความรู้</th><th>คะแนนสูงสุด</th><th>ระดับดาว</th></tr>
          </thead>
          <tbody>
            ${GameData.UNITS.map((u) => {
              const p = this.state.unitProgress[u.id];
              return `
                <tr>
                  <td style="text-align:left;">${u.code}: ${u.title}</td>
                  <td>${p.labCleared ? 'ผ่าน ✔' : 'รอทำ'}</td>
                  <td>${p.bossCleared ? 'ผ่าน ✔' : 'ยังไม่ผ่าน'}</td>
                  <td>${p.bestScore}%</td>
                  <td>${'★'.repeat(p.stars)}${'☆'.repeat(3 - p.stars)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        <div style="display:flex; justify-content:space-between; margin-top:20px; font-size:0.85rem;">
          <span>วันที่ออกรายงาน: ${todayKey()}</span>
          <span>ลงชื่อ................................................ครูผู้สอน</span>
        </div>
      `;
      document.getElementById('modal-certificate').classList.remove('hidden');
    },

    /* ---------------- BOSS GALLERY & TEACHER MODE ---------------- */
    openBossPreview() {
      soundFX.playSelect();
      document.getElementById('boss-gallery-grid').innerHTML = GameData.UNITS.map((u) => `
        <div class="shop-card">
          <div style="display:flex; align-items:center; gap:10px;">
            ${PixelSprites.render(u.boss.sprite, 54)}
            <div>
              <b style="color:${u.color};">${u.code}</b>
              <div style="font-weight:700; font-size:0.9rem;">${u.boss.thName}</div>
              <small style="color:var(--crimson);">HP ${u.boss.hp} | ATK ${u.boss.atk}</small>
            </div>
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">"${u.boss.taunt}"</p>
        </div>
      `).join('');
      document.getElementById('modal-boss-gallery').classList.remove('hidden');
    },

    async openTeacherModal() {
      soundFX.playSelect();
      const isCloud = global.FirebaseService && FirebaseService.isCloud();
      const canManageQuestions = !isCloud || this.isTeacher;
      if (global.FirebaseService && isCloud && this.currentUid) {
        try {
          this.cloudQuestions = await FirebaseService.fetchCustomQuestions();
        } catch (e) { /* keep existing */ }
      }
      if (global.FirebaseService && canManageQuestions) {
        try {
          this.teacherStudentsList = await FirebaseService.fetchAllStudentsForTeacher();
        } catch (e) { this.teacherStudentsList = []; }
      } else {
        this.teacherStudentsList = [];
      }
      const customList = isCloud
        ? (this.cloudQuestions || [])
        : (() => {
            try { return JSON.parse(localStorage.getItem(CUSTOM_Q_KEY) || '[]'); } catch (e) { return []; }
          })();

      const fbInfo = global.FirebaseService
        ? FirebaseService.getActiveConfigInfo()
        : { mode: 'local', projectId: '', source: 'none' };

      document.getElementById('teacher-body').innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div class="pixel-box ${this.isTeacher ? 'pixel-box-gold' : ''}" style="padding:14px;">
            <h4 style="color:var(--amber); margin-bottom:6px;">🔐 สถานะสิทธิ์บัญชี (Role &amp; Custom Claim)</h4>
            <div style="font-size:0.88rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <div>
                บัญชี: <b>${this.state.profile.studentId || 'ยังไม่เข้าสู่ระบบ'}</b> |
                สิทธิ์: <b style="color:${this.isTeacher ? 'var(--emerald)' : 'var(--cyan)'};">
                  ${this.isTeacher ? '👑 ครูผู้สอน (Custom Claim: teacher=true)' : (isCloud ? '🎓 นักเรียนทั่วไป (ไม่สามารถแก้ไขข้อสอบหรือรีเซ็ตคะแนน)' : '💾 โหมดเครื่องท้องถิ่น')}
                </b>
                ${this.currentUid ? `<div style="font-size:0.78rem; color:var(--text-muted); margin-top:3px;">UID: <code>${this.currentUid}</code></div>` : ''}
              </div>
              ${isCloud && this.currentUid ? `<button class="px-btn px-btn-sm" onclick="App.refreshTeacherClaimUI()">🔄 รีเฟรชสิทธิ์ครู</button>` : ''}
            </div>
          </div>

          <div class="pixel-box pixel-box-cyan" style="padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
              <h4 style="color:var(--cyan); margin:0;">🔒 ล็อก / ปลดล็อกหน่วยการเรียนรู้ (Unit 01 – Unit 10)</h4>
              ${canManageQuestions ? `
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                  <button class="px-btn px-btn-emerald px-btn-sm" onclick="App.setAllUnitsLockUI(false)">🔓 ปลดล็อกทั้งหมด</button>
                  <button class="px-btn px-btn-crimson px-btn-sm" onclick="App.setAllUnitsLockUI(true)">🔒 ล็อกทั้งหมด</button>
                </div>
              ` : ''}
            </div>
            ${!canManageQuestions ? `
              <div class="teacher-lock-box">
                🔒 <b>ล็อกสิทธิ์สำหรับครูผู้สอนเท่านั้น</b> — เฉพาะบัญชีครูที่มี Custom Claim <code>teacher: true</code> จึงจะล็อกหรือปลดล็อกหน่วยการเรียนรู้ได้
              </div>
            ` : `
              <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:10px;">
                กดปุ่มเพื่อเปิด/ปิดการเข้าถึงแต่ละหน่วยสำหรับนักศึกษา (ครูผู้สอนยังคงเข้าดูหน่วยที่ล็อกไว้ได้ตามปกติ)
              </p>
              <div id="teacher-unit-locks-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:8px;"></div>
            `}
          </div>

          <div class="pixel-box pixel-box-gold" style="padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
              <h4 style="color:var(--amber); margin:0;">👥 จัดการและรีเซ็ตข้อมูล EXP นักเรียนรายบุคคล</h4>
              ${canManageQuestions ? `<button class="px-btn px-btn-sm" onclick="App.reloadTeacherStudentsUI()">🔄 โหลดรายชื่อใหม่</button>` : ''}
            </div>
            ${!canManageQuestions ? `
              <div class="teacher-lock-box">
                🔒 <b>ล็อกสิทธิ์สำหรับครูผู้สอนเท่านั้น</b> — เฉพาะบัญชีครูที่มี Custom Claim <code>teacher: true</code> จึงจะดูรายชื่อและรีเซ็ต EXP นักเรียนรายบุคคลได้
              </div>
            ` : `
              <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:8px;">
                กด <b>🔄 รีเซ็ต EXP</b> เพื่อล้างค่า EXP เป็น 0 (LV.1) โดยเก็บชื่อ-นามสกุล ห้อง และด่านที่ผ่านไว้ หรือกด <b>🧹 รีเซ็ตทั้งหมด</b> เพื่อเริ่มใหม่ทั้งโปรไฟล์ (ชื่อและห้องยังอยู่ครบ)
              </p>
              <input id="teacher-student-search" class="px-input" style="margin-bottom:10px;" value="${this.teacherStudentFilter || ''}" placeholder="🔍 ค้นหาด้วย รหัสนักศึกษา, ชื่อ หรือ ห้อง..." oninput="App.filterTeacherStudents(this.value)" />
              <div id="teacher-students-table-wrap" style="max-height:240px; overflow:auto;"></div>
            `}
          </div>

          <div class="pixel-box pixel-box-cyan" style="padding:14px;">
            <h4 style="color:var(--cyan); margin-bottom:8px;">☁️ ตั้งค่าฐานข้อมูล Firebase (Auth + Cloud Firestore)</h4>
            <div style="font-size:0.86rem; margin-bottom:8px;">
              สถานะปัจจุบัน:
              <b style="color:${fbInfo.mode === 'firebase' ? 'var(--emerald)' : 'var(--amber)'};">
                ${fbInfo.mode === 'firebase' ? `☁️ เชื่อมต่อ Firebase Cloud แล้ว (Project: ${fbInfo.projectId})` : '💾 โหมดเครื่องท้องถิ่น (Local Mode - ยังไม่ได้วางค่า firebaseConfig)'}
              </b>
            </div>
            <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:8px;">
              วางโค้ด <code>firebaseConfig</code> ที่คัดลอกจาก Firebase Console → Project Settings → Web App ลงในช่องด้านล่าง (หรือวางในไฟล์ <code>js/firebase-config.js</code>)
            </p>
            <textarea id="tf-config-input" class="px-textarea" placeholder='วาง { apiKey: "...", authDomain: "...", projectId: "...", ... } ที่นี่...'></textarea>
            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
              <button class="px-btn px-btn-cyan px-btn-sm" onclick="App.saveFirebaseConfigUI()">💾 บันทึกและเชื่อมต่อ Firebase</button>
              <button class="px-btn px-btn-sm" onclick="App.resetFirebaseConfigUI()">🔄 รีเซ็ต Config ในเบราว์เซอร์</button>
            </div>
          </div>

          <div class="pixel-box" style="padding:14px;">
            <h4 style="color:var(--amber); margin-bottom:8px;">➕ เพิ่มข้อสอบพิเศษเข้าคลังบอส (Custom Teacher Question)</h4>
            <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:10px;">ข้อสอบพิเศษในระบบ: <b>${customList.length} ข้อ</b></p>
            ${!canManageQuestions ? `
              <div class="teacher-lock-box">
                🔒 <b>ล็อกสิทธิ์สำหรับครูผู้สอนเท่านั้น</b> — ในโหมด Firebase Cloud เฉพาะบัญชีที่มี Custom Claim <code>teacher: true</code> (เช่น บัญชีครู <code>watdafak</code>) จึงจะเพิ่มหรือลบข้อสอบส่วนกลางได้
                <div style="margin-top:6px; font-size:0.8rem; color:var(--text-muted);">
                  หากเพิ่งตั้งสิทธิ์ครูให้บัญชีนี้ด้วยสคริปต์ <code>scripts/set-teacher-claim.mjs</code> กรุณากดปุ่ม <b>🔄 รีเฟรชสิทธิ์ครู</b> ด้านบน หรือออกจากระบบแล้วล็อกอินใหม่
                </div>
              </div>
            ` : `
              <div style="display:grid; gap:8px;">
                <select id="tq-unit" class="px-select">
                  ${GameData.UNITS.map((u) => `<option value="${u.id}">${u.code}: ${u.title}</option>`).join('')}
                </select>
                <input id="tq-q" class="px-input" placeholder="คำถาม..." />
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                  <input id="tq-0" class="px-input" placeholder="ตัวเลือก ก" />
                  <input id="tq-1" class="px-input" placeholder="ตัวเลือก ข" />
                  <input id="tq-2" class="px-input" placeholder="ตัวเลือก ค" />
                  <input id="tq-3" class="px-input" placeholder="ตัวเลือก ง" />
                </div>
                <select id="tq-ans" class="px-select">
                  <option value="0">เฉลย: ข้อ ก</option>
                  <option value="1">เฉลย: ข้อ ข</option>
                  <option value="2">เฉลย: ข้อ ค</option>
                  <option value="3">เฉลย: ข้อ ง</option>
                </select>
                <input id="tq-exp" class="px-input" placeholder="คำอธิบายเฉลยสั้นๆ..." />
                <button class="px-btn px-btn-emerald" onclick="App.saveTeacherQuestion()">💾 บันทึกข้อสอบลงหน่วยที่เลือก</button>
              </div>
            `}
            ${customList.length > 0 ? `
              <div style="margin-top:12px; border-top:2px dashed #334155; padding-top:10px;">
                <div style="font-size:0.85rem; color:var(--cyan); font-weight:700; margin-bottom:6px;">📋 รายการข้อสอบพิเศษปัจจุบัน:</div>
                <div style="display:flex; flex-direction:column; gap:6px; max-height:160px; overflow-y:auto;">
                  ${customList.map((item, idx) => `
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; background:#0b1224; border:1px solid #334155; padding:6px 8px; font-size:0.82rem;">
                      <span><b>[U${item.unitId}]</b> ${item.q}</span>
                      ${canManageQuestions ? `<button class="px-btn px-btn-crimson px-btn-sm" onclick="App.deleteTeacherQuestion('${item.id || ''}', ${idx})">🗑️</button>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="pixel-box" style="padding:14px;">
            <h4 style="color:var(--cyan); margin-bottom:8px;">⚙️ จัดการห้องเรียนและข้อมูลผู้เล่น</h4>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button class="px-btn px-btn-emerald px-btn-sm" onclick="App.exportCSV()">📥 ส่งออกคะแนนทั้งห้อง (.CSV)</button>
              <button class="px-btn px-btn-amber px-btn-sm" onclick="App.switchNewStudent()">👤 ออกจากระบบ / สลับนักศึกษาคนถัดไป</button>
            </div>
          </div>
        </div>
      `;
      if (canManageQuestions) {
        this.renderTeacherUnitLocks();
        this.renderTeacherStudentsTable();
      }
      document.getElementById('modal-teacher').classList.remove('hidden');
    },

    renderTeacherUnitLocks() {
      const wrap = document.getElementById('teacher-unit-locks-grid');
      if (!wrap) return;
      wrap.innerHTML = GameData.UNITS.map((u) => {
        const locked = this.isUnitLocked(u.id);
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:8px 10px; background:#0b1224; border:2px solid ${locked ? 'var(--crimson)' : '#1e3a8a'};">
            <div style="font-size:0.8rem; line-height:1.3;">
              <b style="color:${locked ? '#fca5a5' : 'var(--cyan)'};">${u.code}</b>: ${u.title}
              <div style="font-size:0.74rem; color:${locked ? '#f87171' : '#4ade80'};">${locked ? '🔒 ล็อกอยู่ (นักศึกษาเข้าไม่ได้)' : '🔓 เปิดให้เรียนปกติ'}</div>
            </div>
            <button class="px-btn ${locked ? 'px-btn-emerald' : 'px-btn-crimson'} px-btn-sm" style="white-space:nowrap;" onclick="App.toggleUnitLockUI(${u.id})">
              ${locked ? '🔓 ปลดล็อก' : '🔒 ล็อก'}
            </button>
          </div>
        `;
      }).join('');
    },

    async toggleUnitLockUI(unitId) {
      const next = new Set(this.lockedUnits || []);
      const willLock = !next.has(unitId);
      if (willLock) next.add(unitId);
      else next.delete(unitId);
      const res = await FirebaseService.saveLockedUnits([...next]);
      if (!res.ok) {
        soundFX.playPlayerHurt();
        alert(res.error || 'ไม่สามารถบันทึกสถานะการล็อกหน่วยได้');
        return;
      }
      this.lockedUnits = res.lockedUnits;
      this.renderTeacherUnitLocks();
      this.renderDashboard();
      soundFX.playSelect();
      this.toast(willLock ? `🔒 ล็อกหน่วยที่ ${unitId} เรียบร้อยแล้ว` : `🔓 ปลดล็อกหน่วยที่ ${unitId} เรียบร้อยแล้ว`);
    },

    async setAllUnitsLockUI(lockAll) {
      const target = lockAll ? GameData.UNITS.map((u) => u.id) : [];
      const res = await FirebaseService.saveLockedUnits(target);
      if (!res.ok) {
        soundFX.playPlayerHurt();
        alert(res.error || 'ไม่สามารถอัปเดตสถานะการล็อกหน่วยได้');
        return;
      }
      this.lockedUnits = res.lockedUnits;
      this.renderTeacherUnitLocks();
      this.renderDashboard();
      soundFX.playPowerUp();
      this.toast(lockAll ? '🔒 ล็อกหน่วยการเรียนรู้ทั้งหมด 10 หน่วยแล้ว' : '🔓 ปลดล็อกหน่วยการเรียนรู้ทั้งหมด 10 หน่วยแล้ว');
    },

    filterTeacherStudents(query) {
      this.teacherStudentFilter = query || '';
      this.renderTeacherStudentsTable();
    },

    renderTeacherStudentsTable() {
      const wrap = document.getElementById('teacher-students-table-wrap');
      if (!wrap) return;
      const q = (this.teacherStudentFilter || '').trim().toLowerCase();
      const filtered = (this.teacherStudentsList || []).filter((s) => {
        if (!q) return true;
        return String(s.studentId || '').toLowerCase().includes(q)
          || String(s.name || '').toLowerCase().includes(q)
          || String(s.classRoom || '').toLowerCase().includes(q);
      });

      if (filtered.length === 0) {
        wrap.innerHTML = `<div style="padding:12px; text-align:center; color:var(--text-muted); font-size:0.85rem;">ไม่พบรายชื่อนักศึกษาที่ค้นหา</div>`;
        return;
      }

      wrap.innerHTML = `
        <table class="pixel-table" style="font-size:0.8rem;">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ชื่อ-นามสกุล</th>
              <th>ห้อง</th>
              <th>LV / XP</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((s) => `
              <tr>
                <td><code>${s.studentId}</code></td>
                <td>${s.name}</td>
                <td>${s.classRoom}</td>
                <td><b>LV.${s.level || 1}</b> (${s.xp || 0} XP)</td>
                <td style="white-space:nowrap;">
                  <button class="px-btn px-btn-amber px-btn-sm" onclick="App.resetStudentExpUI('${s.uid}', 'exp')" title="รีเซ็ตเฉพาะ EXP เป็น 0">🔄 รีเซ็ต EXP</button>
                  <button class="px-btn px-btn-sm" onclick="App.resetStudentExpUI('${s.uid}', 'full')" title="รีเซ็ต EXP + หน่วย + เหรียญตราทั้งหมด">🧹 ทั้งหมด</button>
                  ${s.uid !== this.currentUid ? `<button class="px-btn px-btn-crimson px-btn-sm" onclick="App.deleteStudentRecordUI('${s.uid}', '${s.studentId}')" title="ลบบัญชีนี้ออกจากตาราง">🗑️</button>` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    },

    async reloadTeacherStudentsUI() {
      soundFX.playSelect();
      if (global.FirebaseService) {
        this.teacherStudentsList = await FirebaseService.fetchAllStudentsForTeacher();
        this.renderTeacherStudentsTable();
        this.toast('🔄 โหลดรายชื่อและ EXP นักศึกษาล่าสุดแล้ว');
      }
    },

    async resetStudentExpUI(uid, mode = 'exp') {
      const target = (this.teacherStudentsList || []).find((s) => s.uid === uid);
      if (!target) return;
      const label = mode === 'full'
        ? `รีเซ็ตข้อมูลการเล่นทั้งหมด (EXP, ด่านที่ผ่าน, เหรียญตรา) ของ "${target.name}" (${target.studentId})?\n(ชื่อและห้องเรียนจะยังคงอยู่)`
        : `รีเซ็ต EXP ของ "${target.name}" (${target.studentId}) จาก ${target.xp || 0} XP ให้กลับเป็น 0 XP (LV.1) หรือไม่?`;
      if (!confirm(label)) return;

      const res = await FirebaseService.resetStudentProgress(target, mode, createDefaultState());
      if (!res.ok) {
        soundFX.playPlayerHurt();
        alert(res.error || 'ไม่สามารถรีเซ็ตข้อมูลนักศึกษาได้');
        return;
      }

      const idx = this.teacherStudentsList.findIndex((s) => s.uid === uid);
      if (idx >= 0) this.teacherStudentsList[idx] = res.updatedDoc;
      if (uid === this.currentUid) {
        this.applyLoadedState(res.updatedDoc.state, res.updatedDoc.studentId);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch (e) { /* ignore */ }
        this.renderHUD();
        this.renderDashboard();
      }
      this.renderTeacherStudentsTable();
      soundFX.playPowerUp();
      this.toast(mode === 'full'
        ? `🧹 รีเซ็ตข้อมูลทั้งหมดของ ${target.name} (${target.studentId}) เป็น 0 XP เรียบร้อย!`
        : `🔄 รีเซ็ต EXP ของ ${target.name} (${target.studentId}) เป็น 0 XP (LV.1) เรียบร้อย!`);
    },

    async deleteStudentRecordUI(uid, studentId) {
      if (!confirm(`ต้องการลบข้อมูลตารางอันดับของรหัส ${studentId} ออกจาก Cloud Firestore หรือไม่?`)) return;
      const res = await FirebaseService.deleteStudentRecord(uid, studentId);
      if (!res.ok) {
        soundFX.playPlayerHurt();
        alert(res.error || 'ลบข้อมูลไม่สำเร็จ');
        return;
      }
      this.teacherStudentsList = (this.teacherStudentsList || []).filter((s) => s.uid !== uid);
      this.renderTeacherStudentsTable();
      soundFX.playSelect();
      this.toast(`🗑️ ลบข้อมูลของ ${studentId} ออกจากฐานข้อมูลแล้ว`);
    },

    async refreshTeacherClaimUI() {
      if (!global.FirebaseService) return;
      const ok = await FirebaseService.refreshTeacherClaim();
      this.isTeacher = ok;
      this.renderHUD();
      if (ok) {
        soundFX.playPowerUp();
        this.toast('👑 ยืนยันสิทธิ์ครูผู้สอน (teacher: true) สำเร็จ!');
      } else {
        soundFX.playSelect();
        this.toast('ℹ️ บัญชีนี้ยังไม่มีสิทธิ์ teacher: true');
      }
      this.openTeacherModal();
    },

    saveFirebaseConfigUI() {
      const raw = document.getElementById('tf-config-input').value;
      const res = FirebaseService.saveRuntimeConfig(raw);
      if (!res.ok) {
        soundFX.playPlayerHurt();
        alert(res.error);
        return;
      }
      soundFX.playPowerUp();
      this.toast(`☁️ บันทึก Config (${res.config.projectId}) แล้ว! กำลังรีโหลดเพื่อเชื่อมต่อ Firebase...`);
      setTimeout(() => location.reload(), 900);
    },

    resetFirebaseConfigUI() {
      FirebaseService.clearRuntimeConfig();
      soundFX.playSelect();
      this.toast('🔄 ล้าง Firebase Config ที่บันทึกในเบราว์เซอร์แล้ว กำลังรีโหลด...');
      setTimeout(() => location.reload(), 700);
    },

    async saveTeacherQuestion() {
      const unitId = Number(document.getElementById('tq-unit').value);
      const q = document.getElementById('tq-q').value.trim();
      const opts = [0, 1, 2, 3].map((i) => document.getElementById(`tq-${i}`).value.trim());
      const ans = Number(document.getElementById('tq-ans').value);
      const exp = document.getElementById('tq-exp').value.trim() || 'เพิ่มโดยครูผู้สอน';
      if (!q || opts.some((x) => !x)) {
        alert('กรุณากรอกคำถามและตัวเลือกให้ครบทั้ง 4 ข้อ');
        return;
      }
      const qObj = { unitId, q, options: opts, ans, exp };
      const res = global.FirebaseService
        ? await FirebaseService.addCustomQuestion(qObj)
        : { ok: true, synced: false };

      if (!res.ok) {
        soundFX.playPlayerHurt();
        alert(res.error || 'ไม่มีสิทธิ์เพิ่มข้อสอบส่วนกลาง');
        return;
      }

      if (res.id) qObj.id = res.id;
      if (!this.cloudQuestions) this.cloudQuestions = [];
      this.cloudQuestions.push(qObj);
      soundFX.playPowerUp();
      this.toast(res.synced
        ? `✔ เพิ่มข้อสอบใหม่เข้าหน่วยที่ ${unitId} และซิงก์ขึ้น Cloud Firestore แล้ว!`
        : `✔ เพิ่มข้อสอบใหม่เข้าหน่วยที่ ${unitId} บนเครื่องนี้แล้ว!`);
      this.openTeacherModal();
    },

    async deleteTeacherQuestion(docId, idx) {
      if (!confirm('ต้องการลบข้อสอบพิเศษข้อนี้หรือไม่?')) return;
      const res = global.FirebaseService
        ? await FirebaseService.deleteCustomQuestion(docId, idx)
        : { ok: false, error: 'ไม่พบบริการฐานข้อมูล' };
      if (!res.ok) {
        soundFX.playPlayerHurt();
        alert(res.error || 'ลบข้อสอบไม่สำเร็จ');
        return;
      }
      if (docId && this.cloudQuestions) {
        this.cloudQuestions = this.cloudQuestions.filter((x) => x.id !== docId);
      } else if (this.cloudQuestions && idx >= 0) {
        this.cloudQuestions.splice(idx, 1);
      }
      soundFX.playSelect();
      this.toast('🗑️ ลบข้อสอบพิเศษเรียบร้อยแล้ว');
      this.openTeacherModal();
    },

    switchNewStudent() {
      this.logoutStudent();
    }
  };

  global.App = App;
  window.addEventListener('DOMContentLoaded', () => App.init());
})(window);
