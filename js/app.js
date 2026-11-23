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
      coins: 120,
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
        6: { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 }
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
          } catch (e) {
            this.cloudQuestions = [];
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
        this.toast(`✨ ${reason}: +${gainedXp} XP, +${gainedCoins} 🪙`);
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
      let clearedCount = 0;
      for (let i = 1; i <= 6; i++) {
        const up = this.state.unitProgress[i];
        if (up && up.bossCleared) {
          clearedCount++;
          this.unlockBadge(`unit${i}_clear`);
        }
      }
      if (clearedCount >= 6) this.unlockBadge('grand_champion');
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
      document.getElementById('hud-units').textContent = `${clearedUnits}/6`;

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

    continueNextUnit() {
      for (let i = 1; i <= 6; i++) {
        if (!this.state.unitProgress[i].bossCleared) {
          this.openUnit(i);
          return;
        }
      }
      this.openUnit(1);
    },

    renderDashboard() {
      // Render 6 Units
      const grid = document.getElementById('units-grid');
      grid.innerHTML = GameData.UNITS.map((u) => {
        const prog = this.state.unitProgress[u.id] || { labCleared: false, bossCleared: false, bestScore: 0, stars: 0 };
        const starsStr = '★'.repeat(prog.stars) + '☆'.repeat(3 - prog.stars);
        return `
          <div class="unit-card ${prog.bossCleared ? 'cleared' : ''}" onclick="App.openUnit(${u.id})">
            <div>
              <div class="unit-card-head">
                <div>
                  <span class="unit-code" style="color:${u.color};">${u.code}</span>
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
                <span class="px-btn px-btn-cyan px-btn-sm">${prog.bossCleared ? '🔁 เล่นซ้ำ' : '⚔️ เข้าภารกิจ'}</span>
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
      ['codex', 'lab', 'boss'].forEach((t) => {
        document.getElementById(`tab-${t}`).classList.toggle('active', t === tab);
        document.getElementById(`stage-body-${t}`).classList.toggle('hidden', t !== tab);
      });
      if (tab !== 'boss') this.stopBattleTimer();
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

    /* ---------------- 6 INTERACTIVE PIXEL LAB SIMULATORS ---------------- */
    renderLab(unit) {
      const el = document.getElementById('stage-body-lab');
      if (unit.id === 1) this.initLab1(el);
      else if (unit.id === 2) this.initLab2(el);
      else if (unit.id === 3) this.initLab3(el);
      else if (unit.id === 4) this.initLab4(el);
      else if (unit.id === 5) this.initLab5(el);
      else if (unit.id === 6) this.initLab6(el);
    },

    completeUnitLab(unitId, msg) {
      const prog = this.state.unitProgress[unitId];
      const firstTime = !prog.labCleared;
      prog.labCleared = true;
      this.state.daily.labsCompletedToday += 1;
      this.refreshStageBadges();
      this.addRewards(firstTime ? 150 : 40, firstTime ? 90 : 25, msg || `ผ่านปฏิบัติการ Lab หน่วยที่ ${unitId}`);
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
          <h3 style="color:var(--amber); margin-bottom:8px;">🔬 Lab 2: ห้องปฏิบัติการเข้าหัวสาย LAN RJ-45 &amp; ติดตั้งอุปกรณ์</h3>
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
        this.completeUnitLab(2, 'ผ่าน Lab 2 เข้าหัว RJ-45 & ติดตั้งอุปกรณ์');
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
          <div class="osi-stack-list">
            ${rows.map((lvl) => `
              <div class="osi-row">
                <b style="color:var(--amber);">Layer ${lvl}</b>
                <select id="osi-name-${lvl}" class="osi-select">
                  <option value="">-- เลือกชื่อชั้น --</option>
                  ${layerOpts.map((o) => `<option value="${o}">${o}</option>`).join('')}
                </select>
                <select id="osi-pdu-${lvl}" class="osi-select">
                  <option value="">-- เลือก PDU --</option>
                  ${pduOpts.map((p) => `<option value="${p}">${p}</option>`).join('')}
                </select>
                <select id="osi-proto-${lvl}" class="osi-select">
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
          <h3 style="color:var(--cyan); margin-bottom:8px;">🔬 Lab 4: หมอรักษาเครือข่าย IPv4 &amp; Cyber CLI Terminal</h3>
          <p style="color:var(--text-muted); margin-bottom:12px;">
            วงเครือข่ายห้องแล็บคือ <b>192.168.10.0 /24</b> | Subnet Mask: <b>255.255.255.0</b> | Gateway Router: <b>192.168.10.1</b><br/>
            ภารกิจ: แก้ค่า IP ของ PC ทั้ง 3 เครื่องที่มีปัญหา แล้วรันคำสั่ง <code>ping 192.168.10.1</code> และ <code>ping 8.8.8.8</code> ใน Terminal!
          </p>
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
          this.completeUnitLab(4, 'ผ่าน Lab 4 แก้ปัญหา IPv4 & CLI');
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
          <div class="lab-grid-2">
            <div class="pixel-box" style="padding:14px;">
              <h4 style="color:var(--amber); margin-bottom:10px;">📡 ตั้งค่า Router ไร้สาย &amp; DHCP Pool</h4>
              <div style="display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
                <div>
                  <label>1. เลือกย่านความถี่สำหรับห้อง Lab ที่มีโน้ตบุ๊กหนาแน่น 35 เครื่อง:</label>
                  <select id="l5-band" class="px-select">
                    <option value="24old">2.4 GHz (802.11b)</option>
                    <option value="5ax">5 GHz (Wi-Fi 6 / 802.11ax)</option>
                  </select>
                </div>
                <div>
                  <label>2. กรณีใช้คลื่น 2.4 GHz ต้องตั้ง Channel ชุดใดที่ไม่กวนกัน:</label>
                  <select id="l5-ch" class="px-select">
                    <option value="123">Channel 1, 2, 3</option>
                    <option value="1611">Channel 1, 6, 11</option>
                  </select>
                </div>
                <div>
                  <label>3. มาตรฐานการเข้ารหัสความปลอดภัย Wi-Fi ที่แนะนำ:</label>
                  <select id="l5-sec" class="px-select">
                    <option value="wep">WEP (64-bit)</option>
                    <option value="wpa3">WPA3-Personal / Enterprise</option>
                  </select>
                </div>
                <div>
                  <label>4. ตั้งค่า DHCP IP Pool ช่วงที่แจกให้ลูกข่าย (Gateway คือ 192.168.50.1):</label>
                  <select id="l5-pool" class="px-select">
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
          <h3 style="color:var(--crimson); margin-bottom:8px;">🔬 Lab 6: ป้อมปราการ Pixel Firewall Defender</h3>
          <p style="color:var(--text-muted); margin-bottom:12px;">
            ตั้งกฎ Firewall (ALLOW / DENY) สำหรับพอร์ตบริการของวิทยาลัยให้ปลอดภัย ก่อนคลื่นแพ็กเก็ตโจมตีจะบุกเข้ามา!
          </p>
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
                    <td><select id="fw-443" class="px-select"><option value="ALLOW">ALLOW (อนุญาต)</option><option value="DENY" selected>DENY (บล็อก)</option></select></td>
                  </tr>
                  <tr>
                    <td><b>Port 23 (Telnet)</b></td>
                    <td>รีโมตแบบ Plain-text ไม่เข้ารหัส</td>
                    <td><select id="fw-23" class="px-select"><option value="ALLOW" selected>ALLOW (อนุญาต)</option><option value="DENY">DENY (บล็อก)</option></select></td>
                  </tr>
                  <tr>
                    <td><b>Port 22 (SSH)</b></td>
                    <td>รีโมตแอดมินแบบเข้ารหัสปลอดภัย</td>
                    <td><select id="fw-22" class="px-select"><option value="ALLOW">ALLOW (อนุญาต)</option><option value="DENY" selected>DENY (บล็อก)</option></select></td>
                  </tr>
                  <tr>
                    <td><b>Port 445 (SMB WAN)</b></td>
                    <td>ช่องโหว่ยอดนิยมแพร่กระจาย Ransomware</td>
                    <td><select id="fw-445" class="px-select"><option value="ALLOW" selected>ALLOW (อนุญาต)</option><option value="DENY">DENY (บล็อก)</option></select></td>
                  </tr>
                  <tr>
                    <td><b>Port 53 (DNS)</b></td>
                    <td>แปลงชื่อโดเมนเว็บไซต์ให้เครือข่าย</td>
                    <td><select id="fw-53" class="px-select"><option value="ALLOW">ALLOW (อนุญาต)</option><option value="DENY" selected>DENY (บล็อก)</option></select></td>
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
            this.completeUnitLab(6, 'ผ่าน Lab 6 Firewall Defender');
          }
        }, idx * 240);
      });
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
        prog.bossCleared = true;
        if (pct > prog.bestScore) prog.bestScore = pct;
        if (stars > prog.stars) prog.stars = stars;
        this.state.daily.bossesDefeatedToday += 1;
        this.refreshStageBadges();
        this.addRewards(220 + b.correctCount * 25, 130 + b.maxCombo * 15, `ปราบบอส ${b.unit.boss.thName}`);
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
      this.arcade = { pool, idx: 0, hearts: 3, score: 0, streak: 0 };
      this.state.daily.arcadeRunsToday += 1;
      this.saveState();
      this.renderArcade();
      document.getElementById('modal-arcade').classList.remove('hidden');
    },

    stopArcade() {
      this.arcade = null;
      this.closeModal('modal-arcade');
    },

    renderArcade() {
      const a = this.arcade;
      const body = document.getElementById('arcade-body');
      if (!a) return;
      if (a.hearts <= 0 || a.idx >= a.pool.length) {
        const isRecord = a.score > this.state.arcadeHighScore;
        if (isRecord) this.state.arcadeHighScore = a.score;
        const rewardXp = Math.min(250, Math.round(a.score / 4));
        const rewardCoins = Math.min(180, Math.round(a.score / 6));
        if (rewardXp > 0) this.addRewards(rewardXp, rewardCoins, `จบเกม Endless Arcade (${a.score} แต้ม)`);
        body.innerHTML = `
          <div style="text-align:center; padding:24px;">
            <h3 class="pixel-title" style="color:var(--amber); font-size:1.4rem;">🕹️ GAME OVER!</h3>
            <p style="font-size:1.2rem; margin:10px 0;">คะแนนรอบนี้: <b style="color:var(--cyan)">${a.score}</b> | สถิติสูงสุด: <b style="color:var(--emerald)">${this.state.arcadeHighScore}</b></p>
            <button class="px-btn px-btn-violet" onclick="App.openArcade()">🔁 เล่นอาร์เคดอีกรอบ</button>
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
            ${list.map((r, i) => `
              <tr style="${r.studentId === this.state.profile.studentId ? 'background:rgba(56,189,248,0.16);' : ''}">
                <td><b>#${i + 1}</b></td>
                <td>${r.studentId}</td>
                <td>${r.name}</td>
                <td>${r.classRoom}</td>
                <td>LV.${r.level}</td>
                <td><b>${r.xp}</b></td>
                <td>${r.unitsCleared}/6</td>
                <td>🏅 ${r.badgeCount}</td>
              </tr>
            `).join('')}
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
        i + 1, r.studentId, `"${r.name}"`, `"${r.classRoom}"`, r.level, r.xp, `${r.unitsCleared}/6`, r.badgeCount, r.updatedAt
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
        <div style="margin-top:8px;">คะแนนประสบการณ์รวม: <b>${this.state.xp} XP</b> | ผ่านภารกิจ: <b>${cleared}/6 หน่วย</b> | เหรียญตรา: <b>${this.state.badges.length}/12</b></div>

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
        this.renderTeacherStudentsTable();
      }
      document.getElementById('modal-teacher').classList.remove('hidden');
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
