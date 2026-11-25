/**
 * Battle City 1990 (Relax Mode) for NetQuest 16-Bit
 * Authentic NES/1990s Tank 1990 engine:
 * - 13x13 tile grid (416x416 canvas, 32px tiles)
 * - Brick, Steel, Bush (camouflage), Water, Ice, Eagle Base
 * - 4 Enemy Tank types + Red Flashing Bonus Tanks
 * - All 6 authentic Battle City Power-Ups:
 *   Star (upgrade gun Lv1-3, Lv3 breaks steel), Helmet (invincibility),
 *   Clock (freeze enemies), Shovel (steel eagle base), Grenade (destroy all),
 *   Tank (1-UP extra life)
 * - 5 handcrafted classic stages + looping difficulty
 */
(function (global) {
  'use strict';

  const TILE = 32;
  const GRID = 13;
  const SIZE = TILE * GRID; // 416x416
  const TANK_SIZE = 28;
  const HIGHSCORE_KEY = 'netquest_battle_city_hi_v1';

  // Tile codes
  const T_EMPTY = 0;
  const T_BRICK = 1;
  const T_STEEL = 2;
  const T_BUSH  = 3;
  const T_WATER = 4;
  const T_ICE   = 5;
  const T_EAGLE = 9;

  // Directions: 0=UP, 1=RIGHT, 2=DOWN, 3=LEFT
  const DX = [0, 1, 0, -1];
  const DY = [-1, 0, 1, 0];

  // Classic 6 Power-Up Items
  const POWERUPS = [
    { id: 'star',    icon: '⭐', name: 'Star',    desc: 'อัปเกรดปืน (Lv.3 ยิงเหล็กแตก!)', color: '#facc15' },
    { id: 'helmet',  icon: '🛡️', name: 'Helmet',  desc: 'เกราะอมตะ 10 วินาที',            color: '#38bdf8' },
    { id: 'clock',   icon: '⏱️', name: 'Clock',   desc: 'หยุดเวลาศัตรูทั้งฉาก 10 วินาที',  color: '#c084fc' },
    { id: 'shovel',  icon: '🧱', name: 'Shovel',  desc: 'เสริมฐานอินทรีเป็นเหล็กกล้า 15 วิ', color: '#94a3b8' },
    { id: 'grenade', icon: '💣', name: 'Grenade', desc: 'ระเบิดทำลายศัตรูทั้งหมดบนฉาก!',    color: '#ef4444' },
    { id: 'tank',    icon: '🪖', name: 'Tank',    desc: '+1 ชีวิต (1-UP)',                 color: '#22c55e' }
  ];

  // 5 Classic Battle City-inspired 13x13 Maps
  // Legend: . empty, B brick, S steel, G bush/grass, W water, I ice
  // Eagle is always placed at (6, 12) with protective ring at (5,11),(6,11),(7,11),(5,12),(7,12)
  const RAW_MAPS = [
    // Stage 1: Classic Battle City Stage 1
    [
      '.............',
      '.B.B.B.B.B.B.',
      '.B.B.B.B.B.B.',
      '.B.B.BSB.B.B.',
      '.B.B.B.B.B.B.',
      '.B.B.....B.B.',
      '.....B.B.....',
      'B..BB...BB..B',
      'S..BB.B.BB..S',
      '.B.B.BBB.B.B.',
      '.B.B.B.B.B.B.',
      '.B.B.....B.B.',
      '.............'
    ],
    // Stage 2: Twin Fortress & Forest Ambush
    [
      '.............',
      '..S..GGG..S..',
      '.BB..GGG..BB.',
      '.BB.S...S.BB.',
      '....B.W.B....',
      '.GG.B.W.B.GG.',
      '.GG..BBB..GG.',
      '..BB..S..BB..',
      '..BB.BBB.BB..',
      '.S...B.B...S.',
      '.BB.......BB.',
      '..B.......B..',
      '.............'
    ],
    // Stage 3: River Crossing
    [
      '.............',
      '.BB..SSS..BB.',
      '.BB.......BB.',
      '....BBBBB....',
      'WWW..GGG..WWW',
      'WWW..GGG..WWW',
      '..B..BBB..B..',
      '.BB.S...S.BB.',
      '.BB..III..BB.',
      '....B.B.B....',
      '.BB.......BB.',
      '.BB.......BB.',
      '.............'
    ],
    // Stage 4: Steel Maze & Ice Field
    [
      '.............',
      '.S.BB.S.BB.S.',
      '...BB...BB...',
      '.BB..III..BB.',
      '.BB.SIIIS.BB.',
      '..G..III..G..',
      '.BGS.BBB.SGB.',
      '..G..B.B..G..',
      '.BB.S...S.BB.',
      '.BB..BBB..BB.',
      '...BB...BB...',
      '.S.........S.',
      '.............'
    ],
    // Stage 5: Grand Citadel
    [
      '.............',
      '.B.S.GGG.S.B.',
      '.B.B.GGG.B.B.',
      '..WW.SSS.WW..',
      '.BB.......BB.',
      '.BB.BSBSB.BB.',
      '.GG.B...B.GG.',
      '.GG.BSBSB.GG.',
      '..BB.....BB..',
      '.S.BB.B.BB.S.',
      '.B..B...B..B.',
      '.............',
      '.............'
    ]
  ];

  const EAGLE_WALLS = [
    [5, 11], [6, 11], [7, 11],
    [5, 12],          [7, 12]
  ];

  // Enemy wave compositions per stage (16 tanks per stage for crisp fun pacing)
  const STAGE_WAVES = [
    ['basic','basic','basic','basic','fast','basic','basic','power','basic','fast','basic','power','basic','fast','armor','armor'],
    ['basic','fast','basic','power','fast','basic','armor','basic','fast','power','basic','fast','armor','power','fast','armor'],
    ['fast','basic','power','fast','armor','power','basic','fast','armor','power','fast','armor','power','fast','armor','armor'],
    ['power','fast','armor','power','fast','armor','power','fast','armor','power','fast','armor','power','armor','armor','armor'],
    ['armor','fast','power','armor','fast','power','armor','fast','power','armor','fast','armor','power','armor','armor','armor']
  ];

  const ENEMY_SPECS = {
    basic: { hp: 1, speed: 0.52, bulletSpeed: 2.0, fireRate: 185, score: 100, body: '#cbd5e1', accent: '#64748b' },
    fast:  { hp: 1, speed: 0.88, bulletSpeed: 2.4, fireRate: 155, score: 200, body: '#38bdf8', accent: '#0369a1' },
    power: { hp: 1, speed: 0.68, bulletSpeed: 3.0, fireRate: 130, score: 300, body: '#4ade80', accent: '#15803d' },
    armor: { hp: 4, speed: 0.52, bulletSpeed: 2.5, fireRate: 145, score: 400, body: '#facc15', accent: '#a16207' }
  };

  // Retro Web Audio SFX (independent & lightweight)
  const bcAudio = {
    ctx: null,
    muted: false,
    ensure() {
      if (this.muted) return null;
      if (!this.ctx) {
        const AC = global.AudioContext || global.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return this.ctx;
    },
    beep(freq, dur, type = 'square', vol = 0.06, slideTo = null) {
      const ctx = this.ensure();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), now + dur);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur);
    },
    shoot() { this.beep(520, 0.08, 'square', 0.05, 180); },
    brick() { this.beep(190, 0.07, 'triangle', 0.06, 90); },
    steel() { this.beep(880, 0.06, 'square', 0.05, 620); },
    explode() {
      this.beep(140, 0.22, 'sawtooth', 0.09, 45);
      setTimeout(() => this.beep(95, 0.18, 'square', 0.07, 40), 40);
    },
    powerup() {
      [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.beep(f, 0.09, 'square', 0.06), i * 55));
    },
    stageStart() {
      [392, 523, 659, 523, 784].forEach((f, i) => setTimeout(() => this.beep(f, 0.11, 'square', 0.06), i * 95));
    },
    gameOver() {
      [392, 349, 311, 261].forEach((f, i) => setTimeout(() => this.beep(f, 0.18, 'sawtooth', 0.07), i * 140));
    }
  };

  const BattleCityGame = {
    canvas: null,
    ctx: null,
    rafId: null,
    running: false,
    paused: false,
    keys: {},
    touchDir: null,
    touchFire: false,
    frame: 0,

    // Game state
    stage: 1,
    score: 0,
    highScore: 0,
    lives: 3,
    starLevel: 0,
    gameOver: false,
    stageClearTimer: 0,
    bannerText: '',
    bannerTimer: 0,

    map: [],
    player: null,
    enemies: [],
    bullets: [],
    explosions: [],
    powerups: [],
    floatingTexts: [],
    spawnQueue: [],
    spawnTimer: 0,
    spawnIdx: 0,

    // Timers (in frames @60fps)
    freezeTimer: 0,
    shovelTimer: 0,
    eagleAlive: true,

    boundKeyDown: null,
    boundKeyUp: null,

    init(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      try {
        this.highScore = Number(localStorage.getItem(HIGHSCORE_KEY) || '0') || 0;
      } catch (e) { this.highScore = 0; }
      this.bindInputs();
      this.startNewGame();
    },

    bindInputs() {
      this.unbindInputs();
      this.boundKeyDown = (e) => {
        if (!this.running) return;
        const k = (e.key || '').toLowerCase();
        const code = e.code || '';
        const gameCodes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyP', 'KeyJ', 'KeyZ'];
        const gameKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd', 'p'];
        if (gameCodes.includes(code) || gameKeys.includes(k)) {
          e.preventDefault();
        }
        if (code === 'KeyP' || k === 'p') {
          this.togglePause();
          return;
        }
        if (k) this.keys[k] = true;
        if (code) this.keys[code] = true;
      };
      this.boundKeyUp = (e) => {
        const k = (e.key || '').toLowerCase();
        const code = e.code || '';
        if (k) this.keys[k] = false;
        if (code) this.keys[code] = false;
      };
      window.addEventListener('keydown', this.boundKeyDown);
      window.addEventListener('keyup', this.boundKeyUp);
    },

    unbindInputs() {
      if (this.boundKeyDown) window.removeEventListener('keydown', this.boundKeyDown);
      if (this.boundKeyUp) window.removeEventListener('keyup', this.boundKeyUp);
      this.boundKeyDown = null;
      this.boundKeyUp = null;
      this.keys = {};
      this.touchDir = null;
      this.touchFire = false;
    },

    setTouchDir(dir) { this.touchDir = dir; },
    setTouchFire(on) { this.touchFire = Boolean(on); },

    toggleMute() {
      bcAudio.muted = !bcAudio.muted;
      const btn = document.getElementById('bc-btn-mute');
      if (btn) btn.textContent = bcAudio.muted ? '🔇 เสียง: ปิด' : '🔊 เสียง: เปิด';
    },

    togglePause() {
      if (this.gameOver) return;
      this.paused = !this.paused;
      const btn = document.getElementById('bc-btn-pause');
      if (btn) btn.textContent = this.paused ? '▶️ เล่นต่อ' : '⏸️ พักเกม';
      this.updateSidebarUI();
    },

    startNewGame() {
      this.stage = 1;
      this.score = 0;
      this.lives = 3;
      this.starLevel = 0;
      this.gameOver = false;
      this.paused = false;
      this.loadStage(1);
      this.startLoop();
    },

    loadStage(stageNum) {
      this.stage = stageNum;
      const mapIdx = (stageNum - 1) % RAW_MAPS.length;
      const raw = RAW_MAPS[mapIdx];
      this.map = [];
      for (let r = 0; r < GRID; r++) {
        const row = [];
        for (let c = 0; c < GRID; c++) {
          const ch = raw[r][c];
          if (ch === 'B') row.push(T_BRICK);
          else if (ch === 'S') row.push(T_STEEL);
          else if (ch === 'G') row.push(T_BUSH);
          else if (ch === 'W') row.push(T_WATER);
          else if (ch === 'I') row.push(T_ICE);
          else row.push(T_EMPTY);
        }
        this.map.push(row);
      }

      // Clear player spawn (4,12) and enemy spawns (0,0),(6,0),(12,0)
      [[4, 12], [0, 0], [6, 0], [12, 0]].forEach(([c, r]) => { this.map[r][c] = T_EMPTY; });
      // Eagle & brick fortress
      this.map[12][6] = T_EAGLE;
      this.setEagleWalls(T_BRICK);

      this.eagleAlive = true;
      this.enemies = [];
      this.bullets = [];
      this.explosions = [];
      this.powerups = [];
      this.floatingTexts = [];
      this.freezeTimer = 0;
      this.shovelTimer = 0;
      this.stageClearTimer = 0;

      const wave = STAGE_WAVES[mapIdx];
      this.spawnQueue = [...wave];
      this.spawnIdx = 0;
      this.spawnTimer = 45;

      this.spawnPlayer(true);
      this.bannerText = `STAGE ${stageNum}`;
      this.bannerTimer = 110;
      bcAudio.stageStart();
      this.updateSidebarUI();
    },

    setEagleWalls(tileType) {
      EAGLE_WALLS.forEach(([c, r]) => {
        this.map[r][c] = tileType;
      });
    },

    spawnPlayer(initialShield = true) {
      this.player = {
        x: 4 * TILE + 2,
        y: 12 * TILE + 2,
        w: TANK_SIZE,
        h: TANK_SIZE,
        dir: 0,
        speed: 1.15,
        cooldown: 0,
        shieldTimer: initialShield ? 240 : 0, // 4s spawn protection
        slideFrames: 0,
        alive: true,
        respawnTimer: 0
      };
    },

    startLoop() {
      this.stopLoop();
      this.running = true;
      const tick = () => {
        if (!this.running) return;
        if (!this.paused) this.update();
        this.render();
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    },

    stopLoop() {
      this.running = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    },

    toggleFullscreen() {
      const box = document.getElementById('bc-modal-box');
      if (!box) return;
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (!fsEl) {
        const fn = box.requestFullscreen || box.webkitRequestFullscreen;
        if (fn) fn.call(box).catch?.(() => {});
      } else {
        const fn = document.exitFullscreen || document.webkitExitFullscreen;
        if (fn) fn.call(document).catch?.(() => {});
      }
      setTimeout(() => {
        const btn = document.getElementById('bc-btn-fs');
        const active = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
        if (btn) btn.textContent = active ? '🗗 ย่อจอ' : '⛶ เต็มจอ';
      }, 120);
    },

    destroy() {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsEl) {
        const fn = document.exitFullscreen || document.webkitExitFullscreen;
        if (fn) fn.call(document).catch?.(() => {});
      }
      this.stopLoop();
      this.unbindInputs();
    },

    addScore(pts, x, y, label = null) {
      this.score += pts;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        try { localStorage.setItem(HIGHSCORE_KEY, String(this.highScore)); } catch (e) { /* ignore */ }
      }
      if (x !== undefined && y !== undefined) {
        this.floatingTexts.push({ x, y, text: label || `+${pts}`, life: 48, color: '#facc15' });
      }
      this.updateSidebarUI();
    },

    spawnEnemy() {
      const maxSimultaneous = this.stage === 1 ? 2 : (this.stage === 2 ? 3 : 4);
      if (this.spawnQueue.length === 0 || this.enemies.length >= maxSimultaneous) return;
      const spots = [0, 6, 12];
      const spotCol = spots[this.spawnIdx % 3];
      const sx = spotCol * TILE + 2;
      const sy = 2;

      // Check overlap with existing tanks
      const blocked = this.enemies.some((e) => this.rectsOverlap(sx, sy, TANK_SIZE, TANK_SIZE, e.x, e.y, e.w, e.h))
        || (this.player && this.player.alive && this.rectsOverlap(sx, sy, TANK_SIZE, TANK_SIZE, this.player.x, this.player.y, this.player.w, this.player.h));
      if (blocked) {
        this.spawnTimer = 35;
        return;
      }

      const type = this.spawnQueue.shift();
      this.spawnIdx += 1;
      const spec = ENEMY_SPECS[type] || ENEMY_SPECS.basic;
      // Classic Battle City: 4th, 8th, 12th, 15th enemy tanks flash red & drop Power-Ups!
      const isBonus = [4, 8, 12, 15].includes(this.spawnIdx);
      const stageSpeedScale = this.stage === 1 ? 0.78 : (this.stage === 2 ? 0.90 : 1 + Math.min(0.65, (this.stage - 2) * 0.12));

      this.enemies.push({
        x: sx,
        y: sy,
        w: TANK_SIZE,
        h: TANK_SIZE,
        dir: 2, // facing down
        type,
        hp: spec.hp,
        maxHp: spec.hp,
        speed: spec.speed * stageSpeedScale,
        bulletSpeed: spec.bulletSpeed + Math.min(1.4, (this.stage - 1) * 0.2),
        fireRate: Math.max(60, spec.fireRate - (this.stage - 1) * 10),
        fireCooldown: 90 + Math.floor(Math.random() * 80),
        aiTimer: 55 + Math.floor(Math.random() * 70),
        score: spec.score,
        isBonus,
        bonusDropped: false
      });
      this.spawnTimer = Math.max(95, 220 - (this.stage - 1) * 24);
      this.updateSidebarUI();
    },

    spawnPowerUp() {
      const def = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
      // Place in an open or brick-free reachable area (rows 1..10, cols 1..11)
      let px = TILE * (1 + Math.floor(Math.random() * 11));
      let py = TILE * (1 + Math.floor(Math.random() * 10));
      for (let tries = 0; tries < 25; tries++) {
        const c = 1 + Math.floor(Math.random() * 11);
        const r = 1 + Math.floor(Math.random() * 10);
        if (this.map[r][c] === T_EMPTY || this.map[r][c] === T_BUSH || this.map[r][c] === T_ICE) {
          px = c * TILE + 2;
          py = r * TILE + 2;
          break;
        }
      }
      this.powerups.push({
        id: def.id,
        icon: def.icon,
        name: def.name,
        color: def.color,
        x: px,
        y: py,
        w: 28,
        h: 28,
        life: 660 // 11 seconds
      });
    },

    applyPowerUp(item) {
      bcAudio.powerup();
      this.addScore(500, item.x + 14, item.y, `${item.icon} ${item.name}!`);
      if (item.id === 'star') {
        this.starLevel = Math.min(3, this.starLevel + 1);
        this.floatingTexts.push({ x: this.player.x, y: this.player.y - 12, text: `⭐ GUN LV.${this.starLevel}`, life: 60, color: '#facc15' });
      } else if (item.id === 'helmet') {
        this.player.shieldTimer = 600; // 10s
      } else if (item.id === 'clock') {
        this.freezeTimer = 600; // 10s
      } else if (item.id === 'shovel') {
        this.shovelTimer = 900; // 15s
        this.setEagleWalls(T_STEEL);
      } else if (item.id === 'grenade') {
        bcAudio.explode();
        this.enemies.forEach((e) => {
          this.explosions.push({ x: e.x + 14, y: e.y + 14, r: 24, life: 22, maxLife: 22 });
          this.addScore(e.score, e.x + 10, e.y);
        });
        this.enemies = [];
      } else if (item.id === 'tank') {
        this.lives += 1;
        this.floatingTexts.push({ x: this.player.x, y: this.player.y - 12, text: '1-UP! 🪖', life: 60, color: '#4ade80' });
      }
      this.updateSidebarUI();
    },

    update() {
      this.frame += 1;
      if (this.bannerTimer > 0) this.bannerTimer -= 1;

      // Update explosions & floating texts even on game over
      this.explosions.forEach((ex) => { ex.life -= 1; });
      this.explosions = this.explosions.filter((ex) => ex.life > 0);
      this.floatingTexts.forEach((ft) => { ft.y -= 0.55; ft.life -= 1; });
      this.floatingTexts = this.floatingTexts.filter((ft) => ft.life > 0);

      if (this.gameOver) return;

      // Stage clear progression
      if (this.spawnQueue.length === 0 && this.enemies.length === 0) {
        if (this.stageClearTimer === 0) {
          this.stageClearTimer = 120;
          this.bannerText = `STAGE ${this.stage} CLEAR!`;
          this.bannerTimer = 120;
          bcAudio.powerup();
        } else {
          this.stageClearTimer -= 1;
          if (this.stageClearTimer <= 0) {
            this.loadStage(this.stage + 1);
          }
        }
        return;
      }

      // Timers
      if (this.freezeTimer > 0) this.freezeTimer -= 1;
      if (this.shovelTimer > 0) {
        this.shovelTimer -= 1;
        if (this.shovelTimer === 0) {
          this.setEagleWalls(T_BRICK);
        } else if (this.shovelTimer < 180) {
          // Classic blink warning before reverting to brick
          this.setEagleWalls(Math.floor(this.shovelTimer / 15) % 2 === 0 ? T_BRICK : T_STEEL);
        }
      }

      // Enemy Spawner
      if (this.spawnQueue.length > 0 && this.enemies.length < 4) {
        this.spawnTimer -= 1;
        if (this.spawnTimer <= 0) this.spawnEnemy();
      }

      // Update Player
      this.updatePlayer();

      // Update Enemies
      this.updateEnemies();

      // Update Bullets
      this.updateBullets();

      // Update Power-Ups
      this.powerups.forEach((p) => { p.life -= 1; });
      if (this.player && this.player.alive) {
        this.powerups = this.powerups.filter((p) => {
          if (p.life <= 0) return false;
          if (this.rectsOverlap(this.player.x, this.player.y, this.player.w, this.player.h, p.x, p.y, p.w, p.h)) {
            this.applyPowerUp(p);
            return false;
          }
          return true;
        });
      } else {
        this.powerups = this.powerups.filter((p) => p.life > 0);
      }

      if (this.frame % 15 === 0) this.updateSidebarUI();
    },

    updatePlayer() {
      const p = this.player;
      if (!p) return;
      if (!p.alive) {
        p.respawnTimer -= 1;
        if (p.respawnTimer <= 0) {
          if (this.lives > 0) {
            this.spawnPlayer(true);
          } else {
            this.triggerGameOver('GAME OVER');
          }
        }
        return;
      }

      if (p.shieldTimer > 0) p.shieldTimer -= 1;
      if (p.cooldown > 0) p.cooldown -= 1;

      let moveDir = null;
      if (this.touchDir !== null) moveDir = this.touchDir;
      else if (this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['arrowup'] || this.keys['w']) moveDir = 0;
      else if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.keys['arrowright'] || this.keys['d']) moveDir = 1;
      else if (this.keys['ArrowDown'] || this.keys['KeyS'] || this.keys['arrowdown'] || this.keys['s']) moveDir = 2;
      else if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.keys['arrowleft'] || this.keys['a']) moveDir = 3;

      const onIce = this.isTankOnTile(p, T_ICE);
      if (moveDir !== null) {
        p.dir = moveDir;
        const spd = p.speed + (this.starLevel >= 1 ? 0.15 : 0);
        this.tryMoveTank(p, DX[p.dir] * spd, DY[p.dir] * spd, null);
        if (onIce) p.slideFrames = 14;
      } else if (p.slideFrames > 0 && onIce) {
        p.slideFrames -= 1;
        this.tryMoveTank(p, DX[p.dir] * 0.75, DY[p.dir] * 0.75, null);
      }

      const firing = this.touchFire || this.keys['Space'] || this.keys[' '] || this.keys['KeyJ'] || this.keys['KeyZ'] || this.keys['j'] || this.keys['z'];
      if (firing && p.cooldown <= 0) {
        const maxBullets = this.starLevel >= 2 ? 2 : 1;
        const activePlayerBullets = this.bullets.filter((b) => b.owner === 'player').length;
        if (activePlayerBullets < maxBullets) {
          const bSpeed = this.starLevel >= 1 ? 5.8 : 4.2;
          this.fireBullet(p, 'player', bSpeed, this.starLevel >= 3);
          p.cooldown = this.starLevel >= 2 ? 12 : 18;
          bcAudio.shoot();
        }
      }
    },

    updateEnemies() {
      if (this.freezeTimer > 0) return;
      this.enemies.forEach((e) => {
        if (e.fireCooldown > 0) e.fireCooldown -= 1;
        e.aiTimer -= 1;

        const moved = this.tryMoveTank(e, DX[e.dir] * e.speed, DY[e.dir] * e.speed, e);
        if (!moved || e.aiTimer <= 0) {
          // Slight bias toward moving down/toward Eagle base
          const roll = Math.random();
          if (roll < 0.36) e.dir = 2; // Down
          else if (roll < 0.56) e.dir = e.x < 6 * TILE ? 1 : 3;
          else e.dir = Math.floor(Math.random() * 4);
          e.aiTimer = 35 + Math.floor(Math.random() * 65);
        }

        if (e.fireCooldown <= 0) {
          const activeFromEnemy = this.bullets.filter((b) => b.owner === 'enemy' && b.src === e).length;
          if (activeFromEnemy === 0) {
            this.fireBullet(e, 'enemy', e.bulletSpeed, false, e);
          }
          e.fireCooldown = e.fireRate + Math.floor(Math.random() * 35);
        }
      });
    },

    fireBullet(tank, owner, speed, canBreakSteel, src = null) {
      const cx = tank.x + tank.w / 2;
      const cy = tank.y + tank.h / 2;
      this.bullets.push({
        x: cx - 3 + DX[tank.dir] * 14,
        y: cy - 3 + DY[tank.dir] * 14,
        w: 6,
        h: 6,
        dir: tank.dir,
        speed,
        owner,
        canBreakSteel,
        src,
        alive: true
      });
    },

    updateBullets() {
      // Move bullets
      for (const b of this.bullets) {
        if (!b.alive) continue;
        b.x += DX[b.dir] * b.speed;
        b.y += DY[b.dir] * b.speed;

        // Arena bounds
        if (b.x < 0 || b.y < 0 || b.x + b.w > SIZE || b.y + b.h > SIZE) {
          b.alive = false;
          this.explosions.push({ x: b.x + 3, y: b.y + 3, r: 9, life: 10, maxLife: 10 });
          if (b.owner === 'player') bcAudio.steel();
          continue;
        }

        // Tile collision (check overlapping tiles)
        const c1 = Math.max(0, Math.floor(b.x / TILE));
        const c2 = Math.min(GRID - 1, Math.floor((b.x + b.w) / TILE));
        const r1 = Math.max(0, Math.floor(b.y / TILE));
        const r2 = Math.min(GRID - 1, Math.floor((b.y + b.h) / TILE));
        let hitWall = false;
        for (let r = r1; r <= r2; r++) {
          for (let c = c1; c <= c2; c++) {
            const t = this.map[r][c];
            if (t === T_BRICK) {
              this.map[r][c] = T_EMPTY;
              hitWall = true;
              if (b.owner === 'player') bcAudio.brick();
            } else if (t === T_STEEL) {
              if (b.canBreakSteel) {
                this.map[r][c] = T_EMPTY;
                bcAudio.brick();
              } else if (b.owner === 'player') {
                bcAudio.steel();
              }
              hitWall = true;
            } else if (t === T_EAGLE && this.eagleAlive) {
              this.eagleAlive = false;
              hitWall = true;
              this.explosions.push({ x: c * TILE + 16, y: r * TILE + 16, r: 30, life: 28, maxLife: 28 });
              this.triggerGameOver('ฐานอินทรีถูกทำลาย!');
            }
          }
        }
        if (hitWall) {
          b.alive = false;
          this.explosions.push({ x: b.x + 3, y: b.y + 3, r: 12, life: 12, maxLife: 12 });
          continue;
        }

        // Bullet vs Enemy
        if (b.owner === 'player') {
          for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            if (this.rectsOverlap(b.x, b.y, b.w, b.h, e.x, e.y, e.w, e.h)) {
              b.alive = false;
              if (e.isBonus && !e.bonusDropped) {
                e.bonusDropped = true;
                this.spawnPowerUp();
              }
              e.hp -= 1;
              if (e.hp <= 0) {
                this.explosions.push({ x: e.x + 14, y: e.y + 14, r: 24, life: 20, maxLife: 20 });
                this.addScore(e.score, e.x + 6, e.y + 8);
                this.enemies.splice(i, 1);
                bcAudio.explode();
              } else {
                this.explosions.push({ x: b.x + 3, y: b.y + 3, r: 10, life: 10, maxLife: 10 });
                bcAudio.steel();
              }
              break;
            }
          }
        } else if (b.owner === 'enemy' && this.player && this.player.alive) {
          // Enemy bullet vs Player
          if (this.rectsOverlap(b.x, b.y, b.w, b.h, this.player.x, this.player.y, this.player.w, this.player.h)) {
            b.alive = false;
            if (this.player.shieldTimer > 0) {
              bcAudio.steel();
            } else {
              this.killPlayer();
            }
          }
        }
      }

      // Bullet vs Bullet cancellation
      for (let i = 0; i < this.bullets.length; i++) {
        for (let j = i + 1; j < this.bullets.length; j++) {
          const a = this.bullets[i];
          const c = this.bullets[j];
          if (!a.alive || !c.alive || a.owner === c.owner) continue;
          if (this.rectsOverlap(a.x, a.y, a.w, a.h, c.x, c.y, c.w, c.h)) {
            a.alive = false;
            c.alive = false;
            this.explosions.push({ x: a.x + 3, y: a.y + 3, r: 9, life: 9, maxLife: 9 });
          }
        }
      }

      this.bullets = this.bullets.filter((b) => b.alive);
    },

    killPlayer() {
      const p = this.player;
      p.alive = false;
      p.respawnTimer = 65;
      this.lives -= 1;
      this.starLevel = 0; // Classic Battle City resets star upgrade on death
      this.explosions.push({ x: p.x + 14, y: p.y + 14, r: 26, life: 24, maxLife: 24 });
      bcAudio.explode();
      this.updateSidebarUI();
    },

    triggerGameOver(msg) {
      if (this.gameOver) return;
      this.gameOver = true;
      this.bannerText = msg || 'GAME OVER';
      this.bannerTimer = 999999;
      bcAudio.gameOver();
      this.updateSidebarUI();
    },

    tryMoveTank(tank, vx, vy, selfEnemy) {
      // Gentle grid-alignment assist for smooth Battle City cornering
      let nx = tank.x + vx;
      let ny = tank.y + vy;
      if (vx !== 0) {
        const snapY = Math.round((tank.y - 2) / (TILE / 2)) * (TILE / 2) + 2;
        if (Math.abs(snapY - tank.y) <= 5) ny = snapY;
      } else if (vy !== 0) {
        const snapX = Math.round((tank.x - 2) / (TILE / 2)) * (TILE / 2) + 2;
        if (Math.abs(snapX - tank.x) <= 5) nx = snapX;
      }

      if (nx < 0 || ny < 0 || nx + tank.w > SIZE || ny + tank.h > SIZE) return false;
      if (this.collidesSolidTile(nx, ny, tank.w, tank.h)) return false;

      // Tank vs Tank collision
      if (selfEnemy && this.player && this.player.alive) {
        if (this.rectsOverlap(nx, ny, tank.w, tank.h, this.player.x, this.player.y, this.player.w, this.player.h)) return false;
      }
      for (const other of this.enemies) {
        if (other === selfEnemy) continue;
        if (this.rectsOverlap(nx, ny, tank.w, tank.h, other.x, other.y, other.w, other.h)) return false;
      }

      tank.x = nx;
      tank.y = ny;
      return true;
    },

    collidesSolidTile(x, y, w, h) {
      const c1 = Math.max(0, Math.floor(x / TILE));
      const c2 = Math.min(GRID - 1, Math.floor((x + w - 1) / TILE));
      const r1 = Math.max(0, Math.floor(y / TILE));
      const r2 = Math.min(GRID - 1, Math.floor((y + h - 1) / TILE));
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          const t = this.map[r][c];
          if (t === T_BRICK || t === T_STEEL || t === T_WATER || t === T_EAGLE) return true;
        }
      }
      return false;
    },

    isTankOnTile(tank, tileType) {
      const c = Math.max(0, Math.min(GRID - 1, Math.floor((tank.x + tank.w / 2) / TILE)));
      const r = Math.max(0, Math.min(GRID - 1, Math.floor((tank.y + tank.h / 2) / TILE)));
      return this.map[r][c] === tileType;
    },

    rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
      return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    },

    /* ---------------- PIXEL ART RENDERER ---------------- */
    render() {
      const ctx = this.ctx;
      if (!ctx) return;

      // Classic black arcade background
      ctx.fillStyle = '#090b10';
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Ground & solid tiles (under tanks)
      for (let r = 0; r < GRID; r++) {
        for (let c = 0; c < GRID; c++) {
          const t = this.map[r][c];
          const x = c * TILE;
          const y = r * TILE;
          if (t === T_BRICK) this.drawBrick(ctx, x, y);
          else if (t === T_STEEL) this.drawSteel(ctx, x, y);
          else if (t === T_WATER) this.drawWater(ctx, x, y);
          else if (t === T_ICE) this.drawIce(ctx, x, y);
          else if (t === T_EAGLE) this.drawEagle(ctx, x, y);
        }
      }

      // Draw Player Tank
      if (this.player && this.player.alive) {
        const pColor = this.starLevel >= 3 ? '#fef08a' : (this.starLevel >= 2 ? '#fde047' : '#facc15');
        this.drawTank(ctx, this.player.x, this.player.y, this.player.dir, pColor, '#b45309', true);
        if (this.player.shieldTimer > 0) {
          ctx.strokeStyle = this.frame % 8 < 4 ? '#38bdf8' : '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(this.player.x - 2, this.player.y - 2, TANK_SIZE + 4, TANK_SIZE + 4);
        }
      }

      // Draw Enemy Tanks
      for (const e of this.enemies) {
        const spec = ENEMY_SPECS[e.type] || ENEMY_SPECS.basic;
        let body = spec.body;
        let accent = spec.accent;
        if (e.type === 'armor') {
          if (e.hp === 3) { body = '#4ade80'; accent = '#15803d'; }
          else if (e.hp === 2) { body = '#cbd5e1'; accent = '#475569'; }
          else if (e.hp === 1) { body = '#fb923c'; accent = '#9a3412'; }
        }
        if (e.isBonus && !e.bonusDropped && Math.floor(this.frame / 8) % 2 === 0) {
          body = '#ef4444';
          accent = '#991b1b';
        }
        this.drawTank(ctx, e.x, e.y, e.dir, body, accent, false);
        if (this.freezeTimer > 0) {
          ctx.strokeStyle = 'rgba(192,132,252,0.8)';
          ctx.lineWidth = 2;
          ctx.strokeRect(e.x, e.y, e.w, e.h);
        }
      }

      // Draw Bullets
      for (const b of this.bullets) {
        ctx.fillStyle = b.canBreakSteel ? '#fef08a' : (b.owner === 'player' ? '#ffffff' : '#fda4af');
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }

      // Draw Bushes OVER tanks (classic Battle City camouflage!)
      for (let r = 0; r < GRID; r++) {
        for (let c = 0; c < GRID; c++) {
          if (this.map[r][c] === T_BUSH) this.drawBush(ctx, c * TILE, r * TILE);
        }
      }

      // Draw Power-Ups (classic blinking arcade icon)
      for (const p of this.powerups) {
        if (p.life < 180 && Math.floor(this.frame / 6) % 2 === 0) continue;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = Math.floor(this.frame / 10) % 2 === 0 ? p.color : '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x + 1, p.y + 1, p.w - 2, p.h - 2);
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.icon, p.x + p.w / 2, p.y + p.h / 2 + 1);
      }

      // Draw Explosions
      for (const ex of this.explosions) {
        const pct = ex.life / ex.maxLife;
        const rad = ex.r * (1.2 - pct * 0.5);
        ctx.fillStyle = pct > 0.5 ? '#fef08a' : '#f97316';
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, Math.max(2, rad), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, Math.max(1, rad * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      // Floating Score / Item Texts
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      for (const ft of this.floatingTexts) {
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
      }

      // Banner overlay (STAGE / CLEAR / PAUSED / GAME OVER)
      if (this.paused || this.bannerTimer > 0) {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.72)';
        ctx.fillRect(48, SIZE / 2 - 36, SIZE - 96, 72);
        ctx.strokeStyle = this.gameOver ? '#ef4444' : '#facc15';
        ctx.lineWidth = 3;
        ctx.strokeRect(48, SIZE / 2 - 36, SIZE - 96, 72);
        ctx.fillStyle = this.gameOver ? '#f87171' : '#facc15';
        ctx.font = 'bold 20px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.paused ? '⏸️ PAUSED' : this.bannerText, SIZE / 2, SIZE / 2 - (this.gameOver ? 10 : 0));
        if (this.gameOver) {
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '13px "Chakra Petch", sans-serif';
          ctx.fillText('กดปุ่ม "🔁 เริ่มเกมใหม่" ด้านขวาเพื่อเล่นอีกครั้ง', SIZE / 2, SIZE / 2 + 16);
        }
      }
    },

    drawBrick(ctx, x, y) {
      ctx.fillStyle = '#9a3412';
      ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = '#c2410c';
      for (let row = 0; row < 4; row++) {
        const offset = (row % 2) * 8;
        ctx.fillRect(x + 1 + offset, y + row * 8 + 1, 14, 6);
        ctx.fillRect(x + 17 - offset, y + row * 8 + 1, 14, 6);
      }
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
    },

    drawSteel(ctx, x, y) {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(x + 4, y + 4, TILE - 8, TILE - 8);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x + 8, y + 8, TILE - 16, TILE - 16);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
    },

    drawWater(ctx, x, y) {
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(x, y, TILE, TILE);
      const shift = Math.floor(this.frame / 18) % 2 === 0 ? 0 : 4;
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(x + 4 + shift, y + 7, 10, 3);
      ctx.fillRect(x + 14 - shift, y + 19, 12, 3);
    },

    drawIce(ctx, x, y) {
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(x, y, TILE, TILE);
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 12); ctx.lineTo(x + 12, y + 4);
      ctx.moveTo(x + 14, y + 26); ctx.lineTo(x + 26, y + 14);
      ctx.stroke();
    },

    drawBush(ctx, x, y) {
      ctx.fillStyle = 'rgba(21, 128, 61, 0.85)';
      ctx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
      ctx.fillStyle = 'rgba(74, 222, 128, 0.78)';
      ctx.fillRect(x + 5, y + 5, 8, 8);
      ctx.fillRect(x + 18, y + 7, 8, 8);
      ctx.fillRect(x + 10, y + 17, 10, 9);
    },

    drawEagle(ctx, x, y) {
      ctx.fillStyle = this.eagleAlive ? '#1e293b' : '#450a0a';
      ctx.fillRect(x, y, TILE, TILE);
      ctx.strokeStyle = this.eagleAlive ? '#facc15' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.eagleAlive ? '🦅' : '💀', x + TILE / 2, y + TILE / 2 + 1);
    },

    drawTank(ctx, x, y, dir, body, accent, isPlayer) {
      ctx.save();
      ctx.translate(x + TANK_SIZE / 2, y + TANK_SIZE / 2);
      ctx.rotate(dir * Math.PI / 2);

      // Left & right treads
      ctx.fillStyle = accent;
      ctx.fillRect(-13, -13, 5, 26);
      ctx.fillRect(8, -13, 5, 26);
      // Tread notches
      ctx.fillStyle = '#0f172a';
      for (let ty = -11; ty <= 10; ty += 5) {
        ctx.fillRect(-13, ty, 5, 2);
        ctx.fillRect(8, ty, 5, 2);
      }

      // Hull
      ctx.fillStyle = body;
      ctx.fillRect(-8, -10, 16, 20);
      // Turret
      ctx.fillStyle = accent;
      ctx.fillRect(-5, -5, 10, 10);
      ctx.fillStyle = isPlayer ? '#ffffff' : body;
      ctx.fillRect(-3, -3, 6, 6);
      // Cannon barrel
      ctx.fillStyle = body;
      ctx.fillRect(-2, -15, 4, 11);

      ctx.restore();
    },

    updateSidebarUI() {
      const rem = this.spawnQueue.length + this.enemies.length;
      const elStage = document.getElementById('bc-stage');
      const elLives = document.getElementById('bc-lives');
      const elScore = document.getElementById('bc-score');
      const elHi = document.getElementById('bc-hi');
      const elStar = document.getElementById('bc-star');
      const elIcons = document.getElementById('bc-enemy-icons');
      const elBuffs = document.getElementById('bc-active-buffs');

      if (elStage) elStage.textContent = `STAGE ${this.stage}`;
      if (elLives) elLives.textContent = `🪖 x${Math.max(0, this.lives)}`;
      if (elScore) elScore.textContent = this.score;
      if (elHi) elHi.textContent = this.highScore;
      if (elStar) elStar.textContent = `LV.${this.starLevel} ${'⭐'.repeat(this.starLevel)}${this.starLevel >= 3 ? ' (ยิงเหล็กแตก!)' : ''}`;
      if (elIcons) {
        elIcons.innerHTML = Array.from({ length: rem }, () => '<span class="bc-tank-pip">👾</span>').join('') || '<span style="color:var(--emerald); font-size:0.78rem;">✔ เคลียร์ฉากแล้ว!</span>';
      }
      if (elBuffs) {
        const active = [];
        if (this.player && this.player.shieldTimer > 0) active.push(`🛡️ อมตะ ${Math.ceil(this.player.shieldTimer / 60)}s`);
        if (this.freezeTimer > 0) active.push(`⏱️ หยุดศัตรู ${Math.ceil(this.freezeTimer / 60)}s`);
        if (this.shovelTimer > 0) active.push(`🧱 ฐานเหล็ก ${Math.ceil(this.shovelTimer / 60)}s`);
        elBuffs.innerHTML = active.length > 0
          ? active.map((a) => `<span class="res-pill" style="font-size:0.72rem;">${a}</span>`).join(' ')
          : '<span style="color:var(--text-muted); font-size:0.74rem;">ยิงรถถังสีแดงกระพริบเพื่อเก็บไอเท็ม!</span>';
      }
    }
  };

  global.BattleCityGame = BattleCityGame;
})(window);
