/**
 * NetQuest 16-Bit: Comprehensive Computer Network Curriculum & Game Data
 * Covers all 10 vocational textbook units, 60+ boss quiz items, 16 badges,
 * classes, shop items, and custom pixel infographics.
 */
(function (global) {
  'use strict';

  const RANKS = [
    { level: 1, minXp: 0, title: 'เด็กฝึกหัดสายแลน (Cable Novice)', titleShort: 'Novice' },
    { level: 2, minXp: 300, title: 'ช่างเทคนิคสายสัญญาณ (Wire Tech)', titleShort: 'Wire Tech' },
    { level: 3, minXp: 750, title: 'ผู้พิทักษ์สวิตช์ (Switch Knight)', titleShort: 'Switch Knight' },
    { level: 4, minXp: 1300, title: 'นักวิเคราะห์แพ็กเก็ต (Packet Analyst)', titleShort: 'Analyst' },
    { level: 5, minXp: 1950, title: 'จอมเวทไอพีแอดเดรส (IP Wizard)', titleShort: 'IP Wizard' },
    { level: 6, minXp: 2650, title: 'วิศวกรเครือข่ายฝึกหัด (Net Engineer)', titleShort: 'Engineer' },
    { level: 7, minXp: 3400, title: 'ผู้เชี่ยวชาญโครงข่ายไร้สาย (Wi-Fi Master)', titleShort: 'Wi-Fi Master' },
    { level: 8, minXp: 4200, title: 'ผู้บัญชาการไฟร์วอลล์ (Firewall Commander)', titleShort: 'Commander' },
    { level: 9, minXp: 5050, title: 'ปรมาจารย์สถาปัตยกรรม (Cyber Architect)', titleShort: 'Architect' },
    { level: 10, minXp: 6000, title: 'ตำนานแห่งไซเบอร์ (Grand Net Legend)', titleShort: 'Grand Legend' }
  ];

  const CLASSES = [
    {
      id: 'paladin',
      name: 'Cable Paladin',
      thName: 'อัศวินสายสัญญาณ',
      sprite: 'paladin',
      color: '#38bdf8',
      baseHp: 130,
      atkBonus: 5,
      xpMult: 1.0,
      coinMult: 1.0,
      timeBonus: 0,
      critBonus: 0.1,
      perk: 'HP สูงสุด 130 + เริ่มเกมพร้อมโล่ Firewall Shield x1'
    },
    {
      id: 'mage',
      name: 'Packet Mage',
      thName: 'จอมเวทโปรโตคอล',
      sprite: 'mage',
      color: '#a855f7',
      baseHp: 100,
      atkBonus: 8,
      xpMult: 1.15,
      coinMult: 1.0,
      timeBonus: 2,
      critBonus: 0.12,
      perk: 'โบนัสค่าประสบการณ์ XP +15% และพลังโจมตี +8'
    },
    {
      id: 'ranger',
      name: 'Router Ranger',
      thName: 'เรนเจอร์เราเตอร์',
      sprite: 'ranger',
      color: '#10b981',
      baseHp: 110,
      atkBonus: 4,
      xpMult: 1.05,
      coinMult: 1.05,
      timeBonus: 10,
      critBonus: 0.15,
      perk: 'เพิ่มเวลาตอบคำถามบอส +10 วินาทีต่อข้อ'
    },
    {
      id: 'ninja',
      name: 'Cyber Ninja',
      thName: 'นินจาไซเบอร์',
      sprite: 'ninja',
      color: '#f43f5e',
      baseHp: 95,
      atkBonus: 10,
      xpMult: 1.0,
      coinMult: 1.25,
      timeBonus: 0,
      critBonus: 0.3,
      perk: 'โบนัสเหรียญ BitCoins +25% และโอกาส Critical 30%'
    }
  ];

  const SHOP_ITEMS = [
    {
      id: 'potion',
      type: 'consumable',
      name: 'Ping Potion (ฟื้น HP)',
      desc: 'ฟื้นฟู HP +45 หน่วย ระหว่างต่อสู้กับบอส',
      price: 50,
      sprite: 'potion',
      effect: 'heal'
    },
    {
      id: 'analyzer',
      type: 'consumable',
      name: 'Packet Sniffer (50/50)',
      desc: 'ตัดตัวเลือกที่ผิดออก 2 ข้อ ในศึกบอส',
      price: 75,
      sprite: 'analyzer',
      effect: 'fifty'
    },
    {
      id: 'clock',
      type: 'consumable',
      name: 'Overclock Crystal (+15s)',
      desc: 'เพิ่มเวลาตอบข้อปัจจุบันอีก 15 วินาที',
      price: 60,
      sprite: 'clock',
      effect: 'time'
    },
    {
      id: 'shield',
      type: 'consumable',
      name: 'Firewall Shield (กันดาเมจ)',
      desc: 'ป้องกันดาเมจจากการตอบผิดได้ 1 ครั้ง',
      price: 85,
      sprite: 'shield',
      effect: 'shield'
    },
    {
      id: 'golden_crimper',
      type: 'equipment',
      name: 'คีมย้ำสายทองคำ (Equip)',
      desc: 'เพิ่มพลังโจมตีถาวร +12 ต่อบอสทุกตัว',
      price: 380,
      sprite: 'golden_crimper',
      stat: { atk: 12 }
    },
    {
      id: 'fiber_boots',
      type: 'equipment',
      name: 'รองเท้าไฟเบอร์ (Equip)',
      desc: 'เพิ่มเวลาตอบคำถามถาวร +6 วินาทีทุกข้อ',
      price: 320,
      sprite: 'fiber_boots',
      stat: { time: 6 }
    },
    {
      id: 'packet_goggles',
      type: 'equipment',
      name: 'แว่นสแกนแพ็กเก็ต (Equip)',
      desc: 'เพิ่มโอกาส Critical Hit +18% และ XP +15%',
      price: 450,
      sprite: 'packet_goggles',
      stat: { crit: 0.18, xp: 0.15 }
    },
    {
      id: 'firewall_armor',
      type: 'equipment',
      name: 'เกราะไฟร์วอลล์ (Equip)',
      desc: 'เพิ่ม Max HP ถาวร +35 และลดดาเมจบอส 25%',
      price: 520,
      sprite: 'firewall_armor',
      stat: { hp: 35, def: 0.25 }
    }
  ];

  const BADGES = [
    { id: 'first_login', name: 'นักผจญภัยเครือข่าย', desc: 'ลงทะเบียนและเข้าสู่ระบบ NetQuest 16-Bit', icon: '🎮', color: '#38bdf8' },
    { id: 'unit1_clear', name: 'บทที่ 1: พื้นฐานเครือข่าย', desc: 'ปราบบอสประจำบทที่ 1 ความรู้เกี่ยวกับระบบเครือข่ายคอมพิวเตอร์', icon: '🌐', color: '#22c55e' },
    { id: 'unit2_clear', name: 'บทที่ 2: อุปกรณ์และสื่อฯ', desc: 'ปราบบอสประจำบทที่ 2 อุปกรณ์และสื่อนำสัญญาณ', icon: '🔌', color: '#f97316' },
    { id: 'unit3_clear', name: 'บทที่ 3: มาตรฐาน/โปรโตคอล', desc: 'ปราบบอสประจำบทที่ 3 มาตรฐานและโปรโตคอลของระบบเครือข่าย', icon: '🗼', color: '#a855f7' },
    { id: 'unit4_clear', name: 'บทที่ 4: LAN แบบใช้สาย', desc: 'ปราบบอสประจำบทที่ 4 เครือข่าย LAN แบบใช้สาย', icon: '🧵', color: '#14b8a6' },
    { id: 'unit5_clear', name: 'บทที่ 5: LAN แบบไร้สาย', desc: 'ปราบบอสประจำบทที่ 5 เครือข่าย LAN แบบไร้สาย', icon: '📡', color: '#0ea5e9' },
    { id: 'unit6_clear', name: 'บทที่ 6: เครือข่าย Windows', desc: 'ปราบบอสประจำบทที่ 6 การใช้งานเครือข่ายในระบบปฏิบัติการวินโดวส์', icon: '🪟', color: '#3b82f6' },
    { id: 'unit7_clear', name: 'บทที่ 7: ระบบ NOS & VM', desc: 'ปราบบอสประจำบทที่ 7 ระบบปฏิบัติการเครือข่าย', icon: '🖥️', color: '#6366f1' },
    { id: 'unit8_clear', name: 'บทที่ 8: ออกแบบ/แก้ปัญหา', desc: 'ปราบบอสประจำบทที่ 8 การออกแบบ ติดตั้ง ตรวจสอบ และแก้ปัญหาเครือข่าย', icon: '💻', color: '#06b6d4' },
    { id: 'unit9_clear', name: 'บทที่ 9: ความปลอดภัยฯ', desc: 'ปราบบอสประจำบทที่ 9 ความปลอดภัยในระบบเครือข่าย', icon: '🛡️', color: '#ef4444' },
    { id: 'unit10_clear', name: 'บทที่ 10: บัญชีผู้ใช้/สิทธิ์', desc: 'ปราบบอสประจำบทที่ 10 การสร้างบัญชีผู้ใช้และการใช้งาน', icon: '🔑', color: '#eab308' },
    { id: 'combo_master', name: 'คอมโบสายฟ้าฟาด', desc: 'ตอบคำถามบอสถูกติดต่อกัน 4 ข้อ (Combo x4)', icon: '⚡', color: '#facc15' },
    { id: 'perfect_crimper', name: 'มือทองเข้าหัว RJ-45', desc: 'ผ่าน Lab 4 เข้าหัวสาย UTP (T568B) ในครั้งแรก', icon: '🔧', color: '#fbbf24' },
    { id: 'shopaholic', name: 'นักช้อปอุปกรณ์เทพ', desc: 'ซื้อไอเทมหรืออุปกรณ์จาก Pixel Shop', icon: '🛒', color: '#ec4899' },
    { id: 'arcade_hero', name: 'ราชาตู้อาร์เคด', desc: 'ทำคะแนนโหมด Endless Arcade ตั้งแต่ 500 ขึ้นไป', icon: '🕹️', color: '#8b5cf6' },
    { id: 'grand_champion', name: 'บัณฑิตเครือข่าย', desc: 'พิชิตครบทั้ง 10 บทเรียนในแผนที่อาณาจักรเครือข่าย!', icon: '👑', color: '#f59e0b' },
    /* === Special Badges (เหรียญตราพิเศษ) === */
    { id: 'skill_submitter', name: 'นักปฏิบัติการตัวจริง', desc: 'ส่งแบบฝึกทักษะขึ้นระบบ Cloud อย่างน้อย 1 หน่วย', icon: '📝', color: '#14b8a6', special: true, rarity: 'RARE' },
    { id: 'skill_master', name: 'นักเรียนดีเด่นแบบฝึกทักษะ', desc: 'ได้รับคะแนนแบบฝึกทักษะจากครูตั้งแต่ 8/10 ขึ้นไป', icon: '🌟', color: '#f59e0b', special: true, rarity: 'EPIC' },
    { id: 'lab_scientist', name: 'นักวิทยาศาสตร์ห้องแล็บ', desc: 'ผ่านห้องปฏิบัติการจำลอง (Pixel Lab) ครบ 5 หน่วยขึ้นไป', icon: '🔬', color: '#06b6d4', special: true, rarity: 'RARE' },
    { id: 'full_equip', name: 'นักรบชุดเกราะเต็มยศ', desc: 'สวมใส่อุปกรณ์ถาวรจาก Pixel Shop ครบทั้ง 4 ชิ้น', icon: '⚔️', color: '#ec4899', special: true, rarity: 'EPIC' },
    { id: 'max_level_legend', name: 'ตำนานไซเบอร์ LV.10', desc: 'สะสมค่าประสบการณ์จนบรรลุเลเวลสูงสุด LV.10 (6,000 XP)', icon: '💎', color: '#a855f7', special: true, rarity: 'LEGENDARY' },
    { id: 'streak_10', name: 'คอมโบ 10 ข้อไร้พลาด', desc: 'ตอบคำถามศึกดวลบอสถูกติดต่อกัน 10 ข้อโดยไม่ผิดเลย', icon: '🔥', color: '#f97316', special: true, rarity: 'RARE' },
    { id: 'streak_20', name: 'สตรีคสายฟ้า 20 ข้อ', desc: 'ตอบคำถามศึกดวลบอสถูกติดต่อกัน 20 ข้อข้ามด่านโดยไม่ผิดเลย', icon: '⚡', color: '#eab308', special: true, rarity: 'EPIC' },
    { id: 'streak_30', name: 'ดาวหางไร้เทียมทาน 30 ข้อ', desc: 'ตอบคำถามศึกดวลบอสถูกติดต่อกัน 30 ข้อข้ามด่านโดยไม่ผิดเลย', icon: '☄️', color: '#ec4899', special: true, rarity: 'LEGENDARY' },
    { id: 'streak_100', name: 'ปรมาจารย์ไร้พ่าย 100 ข้อ (10 หน่วย)', desc: 'ตอบคำถามศึกดวลบอสถูกติดต่อกัน 100 ข้อ หรือทำคะแนนเต็ม 100% ครบทั้ง 10 หน่วย', icon: '🏆', color: '#facc15', special: true, rarity: 'MYTHIC' },
    { id: 'tank_champion', name: 'ผู้บัญชาการรถถัง 1990', desc: 'พิชิตครบทั้ง 10 ด่านในเกม BATTLE CITY 1990', icon: '🪖', color: '#f59e0b', special: true, rarity: 'LEGENDARY' },
    { id: 'grade4_sure', name: 'เกรด4 แน่นอน', desc: 'เหรียญตราเกียรติยศพิเศษ มอบโดยครูผู้สอนในโหมดครู ให้แก่นักศึกษาที่มีผลงานยอดเยี่ยม!', icon: '🎓', color: '#facc15', special: true, teacherGranted: true, rarity: 'MYTHIC' },
    { id: 'teacher_grandmaster', name: 'ปรมาจารย์ผู้สอนเครือข่าย', desc: 'เหรียญตราเกียรติยศเฉพาะบัญชีครูผู้สอน NetQuest', icon: '👑', color: '#facc15', special: true, teacherOnly: true, rarity: 'MYTHIC' }
  ];

  const DAILY_QUESTS = [
    { id: 'dq_lab', title: 'ทำห้อง Lab จำลองสำเร็จ 1 หน่วย', rewardXp: 40, rewardCoins: 25, target: 1, metric: 'labsCompletedToday' },
    { id: 'dq_boss', title: 'พิชิตบอสประจำหน่วย 1 ตัว', rewardXp: 50, rewardCoins: 30, target: 1, metric: 'bossesDefeatedToday' },
    { id: 'dq_combo', title: 'ทำคอมโบตอบถูกต่อเนื่อง 3 ข้อ', rewardXp: 35, rewardCoins: 20, target: 3, metric: 'bestComboToday' },
    { id: 'dq_arcade', title: 'เข้าเล่นโหมด Endless Arcade 1 รอบ', rewardXp: 35, rewardCoins: 20, target: 1, metric: 'arcadeRunsToday' }
  ];

  const T568B = [
    { id: 'wo', name: 'ขาว-ส้ม', color: '#ffedd5', stripe: '#f97316' },
    { id: 'o', name: 'ส้ม', color: '#f97316', stripe: null },
    { id: 'wg', name: 'ขาว-เขียว', color: '#dcfce7', stripe: '#22c55e' },
    { id: 'b', name: 'น้ำเงิน', color: '#2563eb', stripe: null },
    { id: 'wb', name: 'ขาว-น้ำเงิน', color: '#dbeafe', stripe: '#2563eb' },
    { id: 'g', name: 'เขียว', color: '#22c55e', stripe: null },
    { id: 'wbr', name: 'ขาว-น้ำตาล', color: '#fef3c7', stripe: '#92400e' },
    { id: 'br', name: 'น้ำตาล', color: '#92400e', stripe: null }
  ];

  const T568A_ORDER = ['wg', 'g', 'wo', 'b', 'wb', 'o', 'wbr', 'br'];
  const T568B_ORDER = ['wo', 'o', 'wg', 'b', 'wb', 'g', 'wbr', 'br'];

  const UNITS = [
    /* ===================== UNIT 01 ===================== */
    {
      id: 1,
      code: 'UNIT 01',
      title: 'ความรู้เกี่ยวกับระบบเครือข่ายคอมพิวเตอร์',
      subtitle: 'ประโยชน์ องค์ประกอบ ประเภท สถาปัตยกรรม และ Topology',
      color: '#22c55e',
      zoneName: 'อาณาจักร Smart Campus',
      boss: {
        name: 'Slime King of Disconnection',
        thName: 'ราชาสไลม์ตัดสัญญาณ',
        sprite: 'slime_king',
        hp: 170,
        atk: 18,
        taunt: 'สายบัสเส้นเดียวขาดเมื่อไหร่ เครือข่ายเจ้าก็ล่มทั้งตึก!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#22c55e" stroke-width="4"/>
          <rect x="24" y="24" width="184" height="192" fill="#111c36" stroke="#38bdf8" stroke-width="2"/>
          <text x="116" y="46" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">STAR TOPOLOGY (LAN)</text>
          <line x1="116" y1="120" x2="64" y2="78" stroke="#22c55e" stroke-width="3" stroke-dasharray="6,4"/>
          <line x1="116" y1="120" x2="168" y2="78" stroke="#22c55e" stroke-width="3" stroke-dasharray="6,4"/>
          <line x1="116" y1="120" x2="64" y2="164" stroke="#22c55e" stroke-width="3" stroke-dasharray="6,4"/>
          <line x1="116" y1="120" x2="168" y2="164" stroke="#22c55e" stroke-width="3" stroke-dasharray="6,4"/>
          <rect x="96" y="106" width="40" height="28" fill="#1d4ed8" stroke="#93c5fd" stroke-width="2"/>
          <text x="116" y="124" fill="#fff" font-size="10" text-anchor="middle">SW</text>
          <rect x="52" y="66" width="24" height="20" fill="#0f766e" stroke="#5eead4" stroke-width="2"/>
          <rect x="156" y="66" width="24" height="20" fill="#0f766e" stroke="#5eead4" stroke-width="2"/>
          <rect x="52" y="154" width="24" height="20" fill="#0f766e" stroke="#5eead4" stroke-width="2"/>
          <rect x="156" y="154" width="24" height="20" fill="#0f766e" stroke="#5eead4" stroke-width="2"/>
          <text x="116" y="200" fill="#cbd5e1" font-size="11" text-anchor="middle">เสถียร สายขาดกระทบ 1 เครื่อง</text>

          <rect x="228" y="24" width="184" height="192" fill="#111c36" stroke="#f59e0b" stroke-width="2"/>
          <text x="320" y="46" fill="#f59e0b" font-size="13" font-weight="bold" text-anchor="middle">BUS TOPOLOGY</text>
          <line x1="252" y1="120" x2="388" y2="120" stroke="#f59e0b" stroke-width="5"/>
          <rect x="246" y="112" width="10" height="16" fill="#ef4444"/>
          <rect x="384" y="112" width="10" height="16" fill="#ef4444"/>
          <line x1="280" y1="120" x2="280" y2="85" stroke="#94a3b8" stroke-width="3"/>
          <line x1="320" y1="120" x2="320" y2="155" stroke="#94a3b8" stroke-width="3"/>
          <line x1="360" y1="120" x2="360" y2="85" stroke="#94a3b8" stroke-width="3"/>
          <rect x="268" y="65" width="24" height="20" fill="#475569" stroke="#cbd5e1" stroke-width="2"/>
          <rect x="308" y="155" width="24" height="20" fill="#475569" stroke="#cbd5e1" stroke-width="2"/>
          <rect x="348" y="65" width="24" height="20" fill="#475569" stroke="#cbd5e1" stroke-width="2"/>
          <text x="320" y="200" fill="#cbd5e1" font-size="11" text-anchor="middle">ประหยัดสาย แต่สายหลักขาด=ล่ม</text>

          <rect x="432" y="24" width="184" height="192" fill="#111c36" stroke="#a855f7" stroke-width="2"/>
          <text x="524" y="46" fill="#c084fc" font-size="13" font-weight="bold" text-anchor="middle">MESH TOPOLOGY (WAN)</text>
          <line x1="474" y1="80" x2="574" y2="80" stroke="#a855f7" stroke-width="2"/>
          <line x1="474" y1="158" x2="574" y2="158" stroke="#a855f7" stroke-width="2"/>
          <line x1="474" y1="80" x2="474" y2="158" stroke="#a855f7" stroke-width="2"/>
          <line x1="574" y1="80" x2="574" y2="158" stroke="#a855f7" stroke-width="2"/>
          <line x1="474" y1="80" x2="574" y2="158" stroke="#38bdf8" stroke-width="2"/>
          <line x1="574" y1="80" x2="474" y2="158" stroke="#38bdf8" stroke-width="2"/>
          <rect x="462" y="68" width="24" height="24" fill="#6d28d9" stroke="#e9d5ff" stroke-width="2"/>
          <rect x="562" y="68" width="24" height="24" fill="#6d28d9" stroke="#e9d5ff" stroke-width="2"/>
          <rect x="462" y="146" width="24" height="24" fill="#6d28d9" stroke="#e9d5ff" stroke-width="2"/>
          <rect x="562" y="146" width="24" height="24" fill="#6d28d9" stroke="#e9d5ff" stroke-width="2"/>
          <text x="524" y="200" fill="#cbd5e1" font-size="11" text-anchor="middle">มีเส้นทางสำรอง ทนทานสูงสุด</text>
        </svg>
      `,
      codexCards: [
        {
          title: '1. ประโยชน์และองค์ประกอบของระบบเครือข่ายคอมพิวเตอร์',
          bullets: [
            '<b>ประโยชน์หลัก 4 ด้าน</b>: (1) ใช้ทรัพยากรร่วมกัน (เครื่องพิมพ์ ไฟล์ อินเทอร์เน็ต), (2) ติดต่อสื่อสารรวดเร็ว (อีเมล แชต ประชุมออนไลน์), (3) ลดต้นทุนการจัดซื้ออุปกรณ์/ซอฟต์แวร์, (4) จัดเก็บและสำรองข้อมูลแบบรวมศูนย์อย่างปลอดภัย',
            '<b>องค์ประกอบพื้นฐาน 5 ประการ</b>: ผู้ส่ง (Sender), ผู้รับ (Receiver), ข้อมูลข่าวสาร (Message), สื่อกลางนำสัญญาณ (Transmission Medium เช่น สาย UTP/Fiber/คลื่นวิทยุ) และโปรโตคอล (Protocol ข้อตกลงการสื่อสาร)',
            '<b>ทิศทางการสื่อสาร</b>: <b>Simplex</b> (ทางเดียว เช่น วิทยุ/ทีวี), <b>Half-Duplex</b> (สลับกันรับ-ส่ง เช่น วิทยุสื่อสาร), <b>Full-Duplex</b> (รับ-ส่งพร้อมกัน เช่น โทรศัพท์/Switch)'
          ]
        },
        {
          title: '2. ประเภทของเครือข่ายตามขนาดพื้นที่ (PAN / LAN / MAN / WAN)',
          bullets: [
            '<b>PAN (Personal Area Network)</b>: เครือข่ายส่วนบุคคลระยะใกล้ 1–10 เมตร เช่น Bluetooth เชื่อมสมาร์ตโฟนกับหูฟังหรือสมาร์ตวอตช์',
            '<b>LAN (Local Area Network)</b>: เครือข่ายท้องถิ่นในห้องเรียน อาคาร หรือวิทยาลัยเดียวกัน ส่งข้อมูลความเร็วสูง ต้นทุนต่ำ ดูแลง่าย',
            '<b>MAN (Metropolitan Area Network)</b>: เครือข่ายระดับเมือง เชื่อมโยงหลายอาคารหรือหลายวิทยาเขตภายในเมืองหรือจังหวัดเดียวกัน',
            '<b>WAN (Wide Area Network)</b>: เครือข่ายบริเวณกว้าง ข้ามจังหวัด ข้ามประเทศ หรือทั่วโลก เช่น ระบบอินเทอร์เน็ตและสาขาธนาคาร'
          ]
        },
        {
          title: '3. สถาปัตยกรรมเครือข่าย (Peer-to-Peer vs Client-Server)',
          bullets: [
            '<b>Peer-to-Peer (Workgroup)</b>: ทุกเครื่องมีสิทธิ์เท่าเทียมกัน ไม่มีเครื่องแม่ข่ายกลาง (Server) ติดตั้งง่าย ราคาประหยัด เหมาะกับเครือข่ายขนาดเล็กไม่เกิน 10 เครื่อง แต่จัดการความปลอดภัยยากเมื่อเครื่องเยอะขึ้น',
            '<b>Client-Server (Domain)</b>: มีเครื่องแม่ข่าย (Server) ทำหน้าที่ให้บริการและควบคุมสิทธิ์ผู้ใช้ ฐานข้อมูล การสำรองข้อมูล และความปลอดภัยแบบรวมศูนย์ โดยมีเครื่องลูกข่าย (Client) ร้องขอใช้บริการ เหมาะกับองค์กรและสถานศึกษา'
          ]
        },
        {
          title: '4. รูปแบบการเชื่อมต่อเครือข่าย (Network Topologies)',
          bullets: [
            '<b>Bus Topology</b>: เชื่อมทุกเครื่องเข้าสายหลักเส้นเดียว (Backbone) และมี <b>Terminator</b> ปิดหัวท้ายกันสัญญาณสะท้อน ประหยัดสายแต่หากสายหลักขาดจะล่มทั้งเครือข่าย',
            '<b>Star Topology</b>: นิยมมากที่สุด ทุกเครื่องต่อสายแยกเข้าอุปกรณ์ศูนย์กลาง (Switch/Hub) หากสายเครื่องใดขาดจะกระทบเฉพาะเครื่องนั้น',
            '<b>Ring Topology</b>: เชื่อมเป็นวงแหวนส่งข้อมูลทิศทางเดียวผ่าน <b>Token Passing</b> ลดการชนกันของข้อมูล แต่เพิ่ม/ถอดเครื่องยากและสายขาดอาจกระทบทั้งวง',
            '<b>Mesh & Hybrid Topology</b>: Full Mesh เชื่อมทุกเครื่องเข้าหากันโดยตรง (จำนวนสาย = <code>N(N-1)/2</code>) ทนทานสูงสุด ส่วน Hybrid ผสมหลายรูปแบบตามพื้นที่จริง'
          ]
        }
      ],
      quiz: [
        {
          q: 'ข้อใดคือองค์ประกอบพื้นฐาน 5 ประการของการสื่อสารข้อมูลในระบบเครือข่าย?',
          options: ['ผู้ส่ง, ผู้รับ, ข้อมูล, สื่อกลาง, โปรโตคอล', 'เมาส์, คีย์บอร์ด, จอภาพ, ซีพียู, แรม', 'LAN, MAN, WAN, PAN, SAN', 'HTTP, FTP, DNS, DHCP, SSH'],
          ans: 0,
          exp: 'การสื่อสารข้อมูลประกอบด้วย ผู้ส่ง (Sender), ผู้รับ (Receiver), ข้อมูล (Message), สื่อกลาง (Medium) และโปรโตคอล (Protocol)'
        },
        {
          q: 'วิทยาลัยต้องการเชื่อมคอมพิวเตอร์ 40 เครื่องภายในห้องปฏิบัติการเดียวกัน จัดเป็นเครือข่ายประเภทใด?',
          options: ['PAN', 'LAN', 'MAN', 'WAN'],
          ans: 1,
          exp: 'LAN (Local Area Network) คือเครือข่ายท้องถิ่นภายในห้อง อาคาร หรือบริเวณเดียวกัน'
        },
        {
          q: 'สถาปัตยกรรมเครือข่ายแบบใดที่มีเครื่องแม่ข่ายควบคุมบัญชีผู้ใช้ ความปลอดภัย และการสำรองข้อมูลแบบรวมศูนย์?',
          options: ['Peer-to-Peer', 'Ad-Hoc', 'Client-Server', 'Simplex'],
          ans: 2,
          exp: 'Client-Server มีเครื่อง Server ให้บริการและควบคุมสิทธิ์แบบรวมศูนย์ เหมาะกับองค์กรขนาดกลางถึงใหญ่'
        },
        {
          q: 'หากสายสัญญาณจาก PC-03 ไปยัง Switch ในระบบ Star Topology ขาด จะเกิดผลอย่างไร?',
          options: ['เครือข่ายล่มทั้งห้องทันที', 'กระทบเฉพาะ PC-03 เครื่องเดียว เครื่องอื่นใช้งานได้ปกติ', 'ข้อมูลจะย้อนกลับทาง Token Ring', 'Switch จะปิดการทำงาน'],
          ans: 1,
          exp: 'Star Topology แยกสายแต่ละเครื่องเข้าสู่ Switch ตรงกลาง สายขาด 1 เส้นจึงกระทบเฉพาะเครื่องนั้น'
        },
        {
          q: 'โครงสร้างแบบใดต้องมี Terminator ปิดหัวท้ายสายหลัก และหากสายแกนกลางขาดจะล่มทั้งเครือข่าย?',
          options: ['Star Topology', 'Mesh Topology', 'Bus Topology', 'Hybrid Topology'],
          ans: 2,
          exp: 'Bus Topology ใช้สายหลัก (Backbone) ร่วมกันและต้องมี Terminator ปิดหัวท้ายเพื่อป้องกันสัญญาณสะท้อน'
        },
        {
          q: 'สูตรคำนวณจำนวนสายเชื่อมต่อแบบ Full Mesh Topology สำหรับอุปกรณ์จำนวน N เครื่อง คือข้อใด?',
          options: ['N + 1', 'N × 2', 'N(N - 1) / 2', 'N²'],
          ans: 2,
          exp: 'Full Mesh เชื่อมทุกเครื่องเข้าหากันโดยตรง จึงใช้สายเท่ากับ N(N - 1) / 2 เส้น'
        },
        {
          q: 'เครือข่ายที่เชื่อมต่ออุปกรณ์ส่วนตัวระยะใกล้ เช่น หูฟัง Bluetooth กับสมาร์ตโฟน (ระยะ ~10 เมตร) เรียกว่าเครือข่ายใด?',
          options: ['PAN (Personal Area Network)', 'MAN (Metropolitan Area Network)', 'WAN (Wide Area Network)', 'SAN (Storage Area Network)'],
          ans: 0,
          exp: 'PAN เป็นเครือข่ายส่วนบุคคลระยะใกล้รอบตัวผู้ใช้ เช่น Bluetooth, Hotspot มือถือ หรือ NFC'
        },
        {
          q: 'การสื่อสารข้อมูลที่สามารถรับและส่งข้อมูลได้พร้อมกันทั้งสองทิศทางในเวลาเดียวกัน (เช่น โทรศัพท์ หรือ Switch Ethernet) เรียกว่าแบบใด?',
          options: ['Simplex', 'Half-Duplex', 'Full-Duplex', 'Broadcast'],
          ans: 2,
          exp: 'Full-Duplex ส่งและรับข้อมูลพร้อมกันได้สองทาง ส่วน Half-Duplex ต้องสลับกันส่ง (เช่น ว.สื่อสาร) และ Simplex ส่งทางเดียว'
        },
        {
          q: 'โครงสร้างเครือข่ายแบบวงแหวน (Ring Topology) มักใช้กลไกใดในการควบคุมสิทธิ์การส่งข้อมูลเพื่อไม่ให้ชนกัน?',
          options: ['CSMA/CD', 'Token Passing (ส่งผ่านโทเค็น)', 'DHCP Relay', 'Port Forwarding'],
          ans: 1,
          exp: 'Ring Topology ใช้ Token Passing โดยเครื่องที่ถือโทเค็นเท่านั้นจึงจะมีสิทธิ์ส่งข้อมูลในขณะนั้น'
        },
        {
          q: 'ข้อใดคือจุดเด่นของสถาปัตยกรรมเครือข่ายแบบ Peer-to-Peer (P2P) เมื่อเทียบกับ Client-Server?',
          options: ['รองรับผู้ใช้ได้หลักหมื่นคนพร้อมกัน', 'ติดตั้งง่าย ประหยัดต้นทุน ไม่ต้องมีเครื่อง Server กลาง', 'มีความปลอดภัยแบบรวมศูนย์สูงกว่ามาก', 'ต้องใช้ระบบ Active Directory เสมอ'],
          ans: 1,
          exp: 'Peer-to-Peer ทุกเครื่องมีสถานะเท่าเทียมกัน เหมาะกับเครือข่ายขนาดเล็ก (ไม่เกิน ~10 เครื่อง) และประหยัดงบประมาณ'
        }
      ]
    },

    /* ===================== UNIT 02 ===================== */
    {
      id: 2,
      code: 'UNIT 02',
      title: 'อุปกรณ์และสื่อนำสัญญาณ',
      subtitle: 'อุปกรณ์เครือข่าย Guided Media, Wireless Media และหัวต่อ',
      color: '#f97316',
      zoneName: 'คลังแสงสื่อสัญญาณ',
      boss: {
        name: 'Wire Golem MK-II',
        thName: 'โกเลมสื่อสัญญาณคลั่ง',
        sprite: 'wire_golem',
        hp: 185,
        atk: 19,
        taunt: 'เลือกสายผิดประเภทหรือเสียบหัวต่อผิดขั้ว สัญญาณเจ้าก็จะดับสนิท!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#f97316" stroke-width="4"/>
          <rect x="22" y="24" width="186" height="192" fill="#111c36" stroke="#38bdf8" stroke-width="2"/>
          <text x="115" y="46" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">GUIDED MEDIA (แบบสาย)</text>
          <rect x="38" y="62" width="154" height="36" fill="#1e293b" stroke="#f97316"/>
          <text x="115" y="78" fill="#fdba74" font-size="11" font-weight="bold" text-anchor="middle">UTP / STP (คู่บิดเกลียว)</text>
          <text x="115" y="92" fill="#cbd5e1" font-size="9" text-anchor="middle">ระยะ ≤ 100m • หัวต่อ RJ-45</text>
          <rect x="38" y="108" width="154" height="36" fill="#1e293b" stroke="#facc15"/>
          <text x="115" y="124" fill="#fde047" font-size="11" font-weight="bold" text-anchor="middle">Coaxial (สายแกนร่วม)</text>
          <text x="115" y="138" fill="#cbd5e1" font-size="9" text-anchor="middle">ทีวีเคเบิล/CCTV • หัวต่อ BNC</text>
          <rect x="38" y="154" width="154" height="44" fill="#1e293b" stroke="#10b981"/>
          <text x="115" y="172" fill="#6ee7b7" font-size="11" font-weight="bold" text-anchor="middle">Fiber Optic (ใยแก้วนำแสง)</text>
          <text x="115" y="188" fill="#cbd5e1" font-size="9" text-anchor="middle">ไกลหลาย กม. • หัวต่อ SC / LC / ST</text>

          <rect x="226" y="24" width="188" height="192" fill="#111c36" stroke="#a855f7" stroke-width="2"/>
          <text x="320" y="46" fill="#c084fc" font-size="12" font-weight="bold" text-anchor="middle">WIRELESS MEDIA (ไร้สาย)</text>
          <text x="320" y="78" fill="#38bdf8" font-size="11" text-anchor="middle">📻 คลื่นวิทยุ (Radio / Wi-Fi)</text>
          <text x="320" y="108" fill="#facc15" font-size="11" text-anchor="middle">📡 ไมโครเวฟ (Microwave)</text>
          <text x="320" y="138" fill="#fb7185" font-size="11" text-anchor="middle">🔴 อินฟราเรด (Infrared - LOS)</text>
          <text x="320" y="168" fill="#6ee7b7" font-size="11" text-anchor="middle">🛰️ ดาวเทียม (Satellite)</text>
          <text x="320" y="198" fill="#94a3b8" font-size="10" text-anchor="middle">ส่งผ่านอากาศ ไม่ต้องเดินสาย</text>

          <rect x="432" y="24" width="186" height="192" fill="#111c36" stroke="#22c55e" stroke-width="2"/>
          <text x="525" y="46" fill="#4ade80" font-size="12" font-weight="bold" text-anchor="middle">NETWORK DEVICES</text>
          <text x="525" y="76" fill="#e2e8f0" font-size="11" text-anchor="middle">NIC = การ์ดแลน (MAC)</text>
          <text x="525" y="102" fill="#e2e8f0" font-size="11" text-anchor="middle">Hub = กระจายทุกพอร์ต (L1)</text>
          <text x="525" y="128" fill="#38bdf8" font-size="11" text-anchor="middle">Switch = ส่งตรง MAC (L2)</text>
          <text x="525" y="154" fill="#facc15" font-size="11" text-anchor="middle">Router = หาเส้นทาง IP (L3)</text>
          <text x="525" y="180" fill="#c084fc" font-size="11" text-anchor="middle">AP / Modem = Wi-Fi / ISP</text>
        </svg>
      `,
      svgDiagram2: `
        <svg viewBox="0 0 640 165" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="165" fill="#0b1224"/>
          <rect x="6" y="6" width="628" height="153" fill="none" stroke="#38bdf8" stroke-width="3"/>
          <text x="320" y="26" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">หัวต่อสายสัญญาณมาตรฐานทั้ง 6 ชนิด (Connectors)</text>
          <rect x="18" y="38" width="94" height="108" fill="#111c36" stroke="#facc15"/><text x="65" y="62" fill="#fde047" font-size="12" font-weight="bold" text-anchor="middle">1. BNC</text><text x="65" y="84" fill="#e2e8f0" font-size="10" text-anchor="middle">หัวกลมล็อกเขี้ยว</text><text x="65" y="108" fill="#94a3b8" font-size="9" text-anchor="middle">ใช้กับสาย</text><text x="65" y="124" fill="#4ade80" font-size="10" font-weight="bold" text-anchor="middle">Coaxial</text>
          <rect x="120" y="38" width="94" height="108" fill="#111c36" stroke="#f97316"/><text x="167" y="62" fill="#fdba74" font-size="12" font-weight="bold" text-anchor="middle">2. RJ-45</text><text x="167" y="84" fill="#e2e8f0" font-size="10" text-anchor="middle">หัวใส 8 พิน</text><text x="167" y="108" fill="#94a3b8" font-size="9" text-anchor="middle">ใช้กับสาย</text><text x="167" y="124" fill="#4ade80" font-size="10" font-weight="bold" text-anchor="middle">UTP / STP</text>
          <rect x="222" y="38" width="94" height="108" fill="#111c36" stroke="#10b981"/><text x="269" y="62" fill="#6ee7b7" font-size="12" font-weight="bold" text-anchor="middle">3. ST</text><text x="269" y="84" fill="#e2e8f0" font-size="10" text-anchor="middle">หัวกลมบิดล็อก</text><text x="269" y="108" fill="#94a3b8" font-size="9" text-anchor="middle">ใช้กับสาย</text><text x="269" y="124" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Fiber Optic</text>
          <rect x="324" y="38" width="94" height="108" fill="#111c36" stroke="#10b981"/><text x="371" y="62" fill="#6ee7b7" font-size="12" font-weight="bold" text-anchor="middle">4. FC</text><text x="371" y="84" fill="#e2e8f0" font-size="10" text-anchor="middle">หัวกลมเกลียวหมุน</text><text x="371" y="108" fill="#94a3b8" font-size="9" text-anchor="middle">ใช้กับสาย</text><text x="371" y="124" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Fiber Optic</text>
          <rect x="426" y="38" width="94" height="108" fill="#111c36" stroke="#10b981"/><text x="473" y="62" fill="#6ee7b7" font-size="12" font-weight="bold" text-anchor="middle">5. LC</text><text x="473" y="84" fill="#e2e8f0" font-size="10" text-anchor="middle">เหลี่ยมเล็กมีสลัก</text><text x="473" y="108" fill="#94a3b8" font-size="9" text-anchor="middle">ใช้กับสาย</text><text x="473" y="124" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Fiber Optic</text>
          <rect x="528" y="38" width="94" height="108" fill="#111c36" stroke="#10b981"/><text x="575" y="62" fill="#6ee7b7" font-size="12" font-weight="bold" text-anchor="middle">6. SC</text><text x="575" y="84" fill="#e2e8f0" font-size="10" text-anchor="middle">เหลี่ยมกด-ดึง</text><text x="575" y="108" fill="#94a3b8" font-size="9" text-anchor="middle">ใช้กับสาย</text><text x="575" y="124" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">Fiber Optic</text>
        </svg>
      `,
      codexCards: [
        {
          title: '1. อุปกรณ์ในระบบเครือข่าย (Network Devices)',
          bullets: [
            '<b>NIC (การ์ดแลน)</b>: เชื่อมคอมพิวเตอร์กับสื่อนำสัญญาณ มีหมายเลข MAC Address เฉพาะตัว',
            '<b>Repeater & Hub (Layer 1)</b>: ทวนสัญญาณให้ไกลขึ้น / กระจายสัญญาณออกทุกพอร์ต (Broadcast) ทำให้ชนกันง่าย',
            '<b>Bridge & Switch (Layer 2)</b>: เชื่อมวง LAN และจดจำ MAC Address ส่งข้อมูลตรงถึงพอร์ตปลายทางแบบ Full-Duplex',
            '<b>Router (Layer 3), Access Point & Modem</b>: Router หาเส้นทางข้ามเครือข่ายด้วย IP, AP กระจายสัญญาณ Wi-Fi, Modem แปลงสัญญาณจากผู้ให้บริการ (ISP)'
          ]
        },
        {
          title: '2. สื่อกลางแบบสาย: Coaxial และคู่บิดเกลียว (STP vs UTP)',
          bullets: [
            '<b>สายโคแอกเชียล (Coaxial)</b>: มี <b>2 ชนิด</b> คือ <b>แบบบาง (Thinnet / 10BASE2)</b> และ <b>แบบหนา (Thicknet / 10BASE5)</b> | <b>ข้อดี</b>: กันสัญญาณรบกวนได้ดี เดินสายได้ไกลกว่า UTP | <b>ข้อเสีย</b>: สายแข็ง ติดตั้งและเข้าหัวยากกว่า UTP',
            '<b>สายคู่บิดเกลียว STP vs UTP</b>: <b>STP (Shielded)</b> มีแผ่นโลหะ/ฟอยล์หุ้มป้องกันคลื่นรบกวน EMI ได้ดีกว่าแต่ราคาแพงและสายแข็งกว่า ส่วน <b>UTP (Unshielded)</b> ไม่มีฉนวนโลหะหุ้ม ราคาถูก ดัดงอง่าย นิยมใช้ใน LAN มากที่สุด (ระยะ ≤ 100 ม.)'
          ]
        },
        {
          title: '3. สายใยแก้วนำแสง (Fiber Optic) และสื่อกลางไร้สาย',
          bullets: [
            '<b>Fiber Optic มี 2 แบบ</b>: <b>Single-Mode (SMF)</b> แกนเล็ก ส่งแสงแนวตรงได้ไกลหลายกิโลเมตร และ <b>Multi-Mode (MMF)</b> แกนใหญ่กว่า ใช้ระยะใกล้ในอาคาร | <b>ข้อดี</b>: ความเร็วสูงมาก ไม่ถูกรบกวนจาก EMI เดินสายได้ไกล | <b>ข้อจำกัด</b>: ราคาสูง สายเปราะหักงอไม่ได้ เข้าหัวสายยาก',
            '<b>สื่อกลางไร้สายเปรียบเทียบ 3 ชนิด</b>: <b>ไมโครเวฟ (Microwave)</b> ส่งระยะไกลระดับกิโลเมตรเชื่อมข้ามอาคาร/สถานีแบบแนวสายตา (LOS), <b>บลูทูธ (Bluetooth)</b> ระยะใกล้ 1–10 ม. (PAN) ทะลุสิ่งกีดขวางเบาได้ ใช้กับหูฟัง/อุปกรณ์พกพา, <b>อินฟราเรด (Infrared)</b> ระยะใกล้มากและ<b>ห้ามมีสิ่งกีดขวาง</b>กั้นแนวสายตา (เช่น รีโมตทีวี)'
          ]
        },
        {
          title: '4. หัวต่อสายสัญญาณ (Connectors ทั้ง 6 ชนิด)',
          bullets: [
            '<b>BNC</b>: หัวต่อโลหะแบบเขี้ยวหมุนล็อก ใช้กับ <b>สายโคแอกเชียล (Coaxial)</b>',
            '<b>RJ-45 (8P8C)</b>: หัวต่อพลาสติกใส 8 ขา ใช้กับ <b>สายคู่บิดเกลียว (UTP / STP)</b> (ส่วน RJ-11 ใช้กับสายโทรศัพท์)',
            '<b>หัวต่อ Fiber Optic 4 แบบ</b>: <b>ST</b> (หัวกลมบิดล็อกแบบ Bayonet), <b>FC</b> (หัวกลมเกลียวหมุนแน่น), <b>LC</b> (หัวเหลี่ยมขนาดเล็กมีสลักกดคล้าย RJ-45), <b>SC</b> (หัวสี่เหลี่ยมแบบเสียบกด-ดึง Push-Pull)'
          ]
        }
      ],
      quiz: [
        {
          q: 'อุปกรณ์เครือข่ายใดทำงานในระดับ Layer 2 โดยจดจำ MAC Address เพื่อส่งเฟรมข้อมูลตรงไปยังเครื่องปลายทาง?',
          options: ['Repeater', 'Hub', 'Switch', 'Modem'],
          ans: 2,
          exp: 'Switch จดจำ MAC Address Table ในแต่ละพอร์ต จึงส่งข้อมูลตรงถึงปลายทางและลดปัญหาการชนกันของสัญญาณ'
        },
        {
          q: 'ต้องการเชื่อมสายสัญญาณระหว่างอาคารเรียนที่ห่างกัน 600 เมตร และใกล้หม้อแปลงไฟฟ้าแรงสูง ควรเลือกใช้สื่อกลางใด?',
          options: ['สาย UTP Cat5e', 'สาย Fiber Optic', 'สายโทรศัพท์ RJ-11', 'อินฟราเรด'],
          ans: 1,
          exp: 'สาย Fiber Optic ส่งสัญญาณด้วยแสง จึงเดินได้ไกลเกิน 100 เมตรและไม่ถูกรบกวนจากคลื่นแม่เหล็กไฟฟ้า (EMI)'
        },
        {
          q: 'หัวต่อสัญญาณแบบใดที่ใช้กับสายคู่บิดเกลียว (UTP) สำหรับเครือข่ายคอมพิวเตอร์ LAN?',
          options: ['RJ-11', 'BNC', 'RJ-45', 'LC'],
          ans: 2,
          exp: 'RJ-45 (8P8C) เป็นหัวต่อมาตรฐานสำหรับสาย UTP ในเครือข่าย Ethernet LAN'
        },
        {
          q: 'ข้อใดคือความแตกต่างสำคัญระหว่างสาย UTP และสาย STP?',
          options: ['STP มีแผ่นโลหะหุ้มป้องกันสัญญาณรบกวน (Shielded) ส่วน UTP ไม่มี', 'UTP ส่งข้อมูลด้วยแสง ส่วน STP ส่งด้วยไฟฟ้า', 'STP ใช้หัวต่อ BNC เท่านั้น', 'UTP เดินสายได้ไกล 10 กิโลเมตร'],
          ans: 0,
          exp: 'STP (Shielded Twisted Pair) มีฉนวนหุ้มป้องกันคลื่นแม่เหล็กไฟฟ้ารบกวนได้ดีกว่า UTP (Unshielded)'
        },
        {
          q: 'อุปกรณ์ใดทำหน้าที่เชื่อมโยงเครือข่ายที่แตกต่างกัน (เช่น LAN ภายในกับอินเทอร์เน็ต) และเลือกเส้นทางส่งแพ็กเก็ตด้วย IP Address?',
          options: ['Hub', 'Router', 'NIC', 'Patch Panel'],
          ans: 1,
          exp: 'Router ทำงานที่ Layer 3 (Network Layer) ทำหน้าที่หาเส้นทาง (Routing) ข้ามเครือข่ายโดยอ้างอิง IP Address'
        },
        {
          q: 'หัวต่อแบบ SC, LC และ ST ใช้กับสายสัญญาณประเภทใด?',
          options: ['สาย Coaxial', 'สาย Fiber Optic', 'สาย UTP Cat6', 'สายโทรศัพท์'],
          ans: 1,
          exp: 'SC, LC และ ST เป็นหัวต่อมาตรฐานสำหรับสายใยแก้วนำแสง (Fiber Optic)'
        },
        {
          q: 'เหตุใดสาย UTP จึงต้องบิดสายทองแดงเป็นเกลียวคู่ (Twisted Pair)?',
          options: ['เพื่อลดสัญญาณรบกวนทางแม่เหล็กไฟฟ้าและ Crosstalk ระหว่างคู่สาย', 'เพื่อให้สายมีน้ำหนักเบาลง', 'เพื่อเพิ่มแรงดันไฟฟ้าในสายเป็น 220V', 'เพื่อให้เสียบกับหัว BNC ได้'],
          ans: 0,
          exp: 'การบิดเกลียวช่วยหักล้างสัญญาณรบกวนแม่เหล็กไฟฟ้า (EMI) และลดสัญญาณแทรกข้ามคู่สาย (Crosstalk)'
        },
        {
          q: 'อุปกรณ์ใดทำหน้าที่ขยายและทวนสัญญาณไฟฟ้าที่อ่อนลงให้กลับมาสมบูรณ์ เพื่อเพิ่มระยะทางเดินสายใน Layer 1?',
          options: ['Repeater', 'Firewall', 'DNS Server', 'Proxy Server'],
          ans: 0,
          exp: 'Repeater ทำงานที่ Physical Layer (Layer 1) เพื่อทวนสัญญาณให้ส่งไปได้ไกลขึ้น'
        },
        {
          q: 'สาย Fiber Optic แบบ Single-Mode (SMF) แตกต่างจาก Multi-Mode (MMF) อย่างไร?',
          options: ['SMF แกนแสงเล็กกว่า ส่งข้อมูลได้ไกลหลายสิบกิโลเมตรด้วยเลเซอร์', 'MMF ส่งข้อมูลได้ไกลกว่า SMF เสมอ', 'SMF ใช้ลวดทองแดงแทนใยแก้ว', 'MMF ใช้ได้เฉพาะกับหัวต่อ RJ-45'],
          ans: 0,
          exp: 'Single-Mode Fiber ใช้ลำแสงเลเซอร์แกนเล็ก ส่งได้ไกลหลายสิบกิโลเมตร ส่วน Multi-Mode ใช้ LED เหมาะกับระยะใกล้ภายในอาคาร'
        },
        {
          q: 'อุปกรณ์ใดที่ติดตั้งอยู่ภายในเครื่องคอมพิวเตอร์ (หรือแบบ USB) เพื่อให้เครื่องเชื่อมต่อเข้ากับสาย LAN หรือ Wi-Fi ได้?',
          options: ['NIC (Network Interface Card)', 'Patch Panel', 'Rack Cabinet', 'Cable Tester'],
          ans: 0,
          exp: 'NIC หรือการ์ดแลน มีหมายเลข MAC Address ประจำตัว ทำหน้าที่แปลงข้อมูลคอมพิวเตอร์เป็นสัญญาณเครือข่าย'
        }
      ]
    },

    /* ===================== UNIT 03 ===================== */
    {
      id: 3,
      code: 'UNIT 03',
      title: 'มาตรฐานและโปรโตคอลของระบบเครือข่าย',
      subtitle: 'องค์กรมาตรฐาน OSI 7 Layers, TCP/IP, IPv4 Class และ IEEE 802',
      color: '#a855f7',
      zoneName: 'หอคอยโปรโตคอล 7 ชั้น',
      boss: {
        name: 'OSI 7-Headed Hydra',
        thName: 'ไฮดรา 7 เศียรแห่งโปรโตคอล',
        sprite: 'osi_hydra',
        hp: 200,
        atk: 21,
        taunt: 'เรียงชั้น OSI หรือแยกคลาส IP ผิดแม้แต่นิดเดียว แพ็กเก็ตเจ้าจะแหลกสลาย!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#a855f7" stroke-width="4"/>
          <text x="175" y="30" fill="#c084fc" font-size="12" font-weight="bold" text-anchor="middle">OSI 7 LAYERS</text>
          <rect x="30" y="38" width="290" height="22" fill="#7c3aed"/><text x="175" y="53" fill="#fff" font-size="11" text-anchor="middle">7. Application (HTTP, DNS, FTP) — Data</text>
          <rect x="30" y="64" width="290" height="22" fill="#6d28d9"/><text x="175" y="79" fill="#fff" font-size="11" text-anchor="middle">6. Presentation (SSL/TLS, JPEG) — Data</text>
          <rect x="30" y="90" width="290" height="22" fill="#5b21b6"/><text x="175" y="105" fill="#fff" font-size="11" text-anchor="middle">5. Session (NetBIOS, RPC) — Data</text>
          <rect x="30" y="116" width="290" height="22" fill="#2563eb"/><text x="175" y="131" fill="#fff" font-size="11" text-anchor="middle">4. Transport (TCP / UDP) — Segment</text>
          <rect x="30" y="142" width="290" height="22" fill="#0284c7"/><text x="175" y="157" fill="#fff" font-size="11" text-anchor="middle">3. Network (IP, ICMP, Router) — Packet</text>
          <rect x="30" y="168" width="290" height="22" fill="#0d9488"/><text x="175" y="183" fill="#fff" font-size="11" text-anchor="middle">2. Data Link (MAC, Switch) — Frame</text>
          <rect x="30" y="194" width="290" height="22" fill="#16a34a"/><text x="175" y="209" fill="#fff" font-size="11" text-anchor="middle">1. Physical (Cable, Hub) — Bits (0/1)</text>

          <rect x="342" y="28" width="272" height="90" fill="#111c36" stroke="#38bdf8" stroke-width="2"/>
          <text x="478" y="48" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">IPv4 ADDRESS CLASSES</text>
          <text x="478" y="68" fill="#4ade80" font-size="11" text-anchor="middle">Class A: 1–126 (/8) • 10.0.0.0 Private</text>
          <text x="478" y="88" fill="#facc15" font-size="11" text-anchor="middle">Class B: 128–191 (/16) • 172.16–31 Private</text>
          <text x="478" y="108" fill="#f472b6" font-size="11" text-anchor="middle">Class C: 192–223 (/24) • 192.168 Private</text>

          <rect x="342" y="128" width="272" height="88" fill="#111c36" stroke="#f59e0b" stroke-width="2"/>
          <text x="478" y="148" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">มาตรฐาน IEEE 802 ที่สำคัญ</text>
          <text x="478" y="168" fill="#e2e8f0" font-size="11" text-anchor="middle">802.3 = Ethernet (LAN แบบสาย)</text>
          <text x="478" y="186" fill="#e2e8f0" font-size="11" text-anchor="middle">802.11 = Wi-Fi (WLAN) | 802.15 = Bluetooth</text>
          <text x="478" y="204" fill="#e2e8f0" font-size="11" text-anchor="middle">802.1Q = VLAN Tagging</text>
        </svg>
      `,
      codexCards: [
        {
          title: '1. องค์กรกำหนดมาตรฐานสากล (5 องค์กรสำคัญ)',
          bullets: [
            '<b>ITU</b> (International Telecommunication Union): กำหนดมาตรฐาน กฎระเบียบ และพัฒนาระบบการสื่อสารโทรคมนาคม รวมถึงจัดสรรแถบคลื่นความถี่วิทยุ',
            '<b>IEEE</b>: องค์กรวิชาชีพระดับนานาชาติด้านไฟฟ้าและคอมพิวเตอร์ เป็นผู้กำหนดมาตรฐานตระกูล <b>IEEE 802</b> (802.3 Ethernet, 802.11 Wi-Fi, 802.15 ไร้สายระยะใกล้)',
            '<b>ISO</b>: องค์กรกำหนดมาตรฐานอุตสาหกรรมระหว่างชาติ เป็นผู้สร้างแบบจำลอง <b>OSI 7 Layers Model</b>',
            '<b>EIA & TIA</b>: <b>EIA</b> กำหนดมาตรฐานอุปกรณ์ฮาร์ดแวร์/โทรคมนาคม ส่วน <b>TIA</b> กำหนดมาตรฐานการจัดเรียงสายสัญญาณ <b>TIA T568A/B</b>'
          ]
        },
        {
          title: '2. แบบจำลอง OSI 7 Layers และหน้าที่ครบทุกชั้น',
          bullets: [
            '<b>7. Application</b>: กำหนดมาตรฐานการติดต่อกับซอฟต์แวร์ผู้ใช้ (HTTP, DNS, FTP) | <b>6. Presentation</b>: แปลงรูปแบบข้อมูล เข้ารหัส (SSL/TLS) และบีบอัดข้อมูล',
            '<b>5. Session</b>: สร้าง ควบคุม และสิ้นสุดการเชื่อมต่อเซสชัน | <b>4. Transport</b>: แบ่งข้อมูลเป็น Segment ควบคุมการรับ-ส่งให้ครบถ้วน (TCP/UDP)',
            '<b>3. Network</b>: กำหนดหมายเลข IP Address และเลือกเส้นทาง (Routing) | <b>2. Data Link</b>: จัดรูปแบบเฟรม อ้างอิง MAC Address และตรวจสอบความผิดพลาด',
            '<b>1. Physical</b>: รับ-ส่งสัญญาณบิต (0/1) ผ่านสื่อนำสัญญาณทางกายภาพ (สาย UTP, Fiber, คลื่นวิทยุ)'
          ]
        },
        {
          title: '3. โปรโตคอลในการสื่อสารข้อมูล (Protocol 4 ตระกูล)',
          bullets: [
            '<b>Protocol</b> คือ ข้อกำหนดหรือข้อตกลงร่วมกันในการติดต่อสื่อสารข้อมูลระหว่างอุปกรณ์เครือข่าย',
            '<b>TCP/IP</b>: โปรโตคอลหลักที่ใช้ในระบบเครือข่ายอินเทอร์เน็ต กำหนดหมายเลขเครื่องด้วย IP Address (TCP เน้นถูกต้อง, UDP เน้นความเร็ว)',
            '<b>NetBEUI</b>: เหมาะกับเครือข่ายขนาดเล็ก ใช้งานง่ายแต่<b>ไม่มีความสามารถในการค้นหา/กำหนดเส้นทาง (Non-routable)</b>',
            '<b>AppleTalk</b>: ใช้ในระบบเครือข่ายคอมพิวเตอร์ <b>Macintosh</b> (เช่น EtherTalk และ TokenTalk) | <b>IPX/SPX</b>: พัฒนาโดยบริษัท <b>Novell</b> ใช้ในระบบปฏิบัติการเครือข่าย <b>NetWare</b>'
          ]
        },
        {
          title: '4. IPv4, Private/Public IP, NAT และมาตรฐาน IEEE 802',
          bullets: [
            '<b>Public IP vs Private IP</b>: <b>Public IP</b> ใช้เชื่อมต่อบนอินเทอร์เน็ตโดยตรง ส่วน <b>Private IP</b> (10.x, 172.16–31.x, 192.168.x) ใช้ภายในองค์กร และใช้ <b>NAT (Network Address Translation)</b> แปลง Private IP เป็น Public IP เพื่อออกอินเทอร์เน็ต',
            '<b>การแบ่งคลาส IPv4</b>: Class A (1–126 /8), Class B (128–191 /16), Class C (192–223 /24), 127.0.0.1 = Loopback',
            '<b>มาตรฐาน IEEE 802</b>: <b>802.3</b> = Ethernet, <b>802.11</b> = ระบบเครือข่ายไร้สาย (Wi-Fi), <b>802.15</b> = เครือข่ายไร้สายระยะใกล้ (WPAN/Bluetooth), <b>802.1Q</b> = VLAN'
          ]
        }
      ],
      quiz: [
        {
          q: 'องค์กรใดเป็นผู้กำหนดแบบจำลองอ้างอิง OSI 7 Layers?',
          options: ['IEEE', 'ISO', 'TIA/EIA', 'ICANN'],
          ans: 1,
          exp: 'ISO (International Organization for Standardization) เป็นผู้พัฒนาแบบจำลอง OSI 7 Layers'
        },
        {
          q: 'ในแบบจำลอง OSI ชั้นใดทำหน้าที่เลือกเส้นทาง (Routing) และอ้างอิงหมายเลข IP Address?',
          options: ['Layer 1: Physical', 'Layer 2: Data Link', 'Layer 3: Network', 'Layer 4: Transport'],
          ans: 2,
          exp: 'Layer 3 (Network Layer) รับผิดชอบการกำหนด IP Address และการเลือกเส้นทางส่ง Packet'
        },
        {
          q: 'หน่วยข้อมูล (PDU) ของ Layer 2 (Data Link) และ Layer 4 (Transport) ตามลำดับคือข้อใด?',
          options: ['Packet และ Bits', 'Frame และ Segment', 'Data และ Frame', 'Bits และ Packet'],
          ans: 1,
          exp: 'Layer 1=Bits, Layer 2=Frame, Layer 3=Packet, Layer 4=Segment, Layer 5-7=Data'
        },
        {
          q: 'หมายเลข IP Address 192.168.10.25 จัดอยู่ในคลาสใด และมี Default Subnet Mask เป็นเท่าใด?',
          options: ['Class A (255.0.0.0)', 'Class B (255.255.0.0)', 'Class C (255.255.255.0)', 'Class D (Multicast)'],
          ans: 2,
          exp: 'ชุดแรก 192 อยู่ในช่วง 192–223 ซึ่งเป็น Class C มี Default Subnet Mask คือ 255.255.255.0 (/24)'
        },
        {
          q: 'มาตรฐาน IEEE 802.3 และ IEEE 802.11 หมายถึงเทคโนโลยีใดตามลำดับ?',
          options: ['Wi-Fi และ Bluetooth', 'Ethernet LAN และ Wireless LAN (Wi-Fi)', 'Token Ring และ Fiber', 'VLAN และ VPN'],
          ans: 1,
          exp: 'IEEE 802.3 คือมาตรฐานเครือข่าย Ethernet แบบใช้สาย ส่วน IEEE 802.11 คือมาตรฐานเครือข่ายไร้สาย Wi-Fi'
        },
        {
          q: 'โปรโตคอล TCP แตกต่างจาก UDP อย่างไร?',
          options: ['TCP ส่งข้อมูลเร็วกว่าแต่ไม่ตรวจสอบความถูกต้อง', 'TCP มีการเชื่อมต่อและตรวจสอบให้ข้อมูลถึงครบถ้วน ส่วน UDP ส่งเร็วไม่รอการยืนยัน', 'UDP ใช้กับการโอนไฟล์ธนาคารเท่านั้น', 'TCP ทำงานที่ Layer 1'],
          ans: 1,
          exp: 'TCP เป็น Connection-Oriented ที่รับประกันความถูกต้อง ส่วน UDP เป็น Connectionless ที่เน้นความเร็ว'
        },
        {
          q: 'โปรโตคอลใดทำหน้าที่แจกหมายเลข IP Address, Subnet Mask, Gateway และ DNS ให้เครื่องลูกข่ายโดยอัตโนมัติ?',
          options: ['DNS', 'DHCP', 'HTTP', 'SMTP'],
          ans: 1,
          exp: 'DHCP (Dynamic Host Configuration Protocol) แจกค่า IP อัตโนมัติผ่านกระบวนการ DORA (Discover, Offer, Request, Acknowledge)'
        },
        {
          q: 'หมายเลขพอร์ตมาตรฐานของโปรโตคอล HTTPS (การเข้าชมเว็บไซต์แบบเข้ารหัสปลอดภัย) คือพอร์ตใด?',
          options: ['Port 21', 'Port 53', 'Port 80', 'Port 443'],
          ans: 3,
          exp: 'HTTP ใช้พอร์ต 80 ส่วน HTTPS (เข้ารหัส TLS/SSL) ใช้พอร์ต 443 (Port 21=FTP, Port 53=DNS)'
        },
        {
          q: 'ในแบบจำลอง OSI ชั้นที่ 6 (Presentation Layer) มีหน้าที่หลักเกี่ยวข้องกับข้อใด?',
          options: ['การเข้ารหัส (Encryption) บีบอัดข้อมูล และแปลงรูปแบบไฟล์ให้ระบบเข้าใจตรงกัน', 'การเข้าหัวสาย RJ-45', 'การกำหนด MAC Address', 'การเลือกเส้นทาง Routing'],
          ans: 0,
          exp: 'Presentation Layer (Layer 6) รับผิดชอบการแปลงรูปแบบข้อมูล (Encoding), การบีบอัด (Compression) และการเข้ารหัส (Encryption)'
        },
        {
          q: 'หมายเลข IPv4 มีขนาดกี่บิต และโดยทั่วไปเขียนแสดงผลในรูปแบบใด?',
          options: ['16 บิต เลขฐานสิบหก', '32 บิต แบ่งเป็น 4 ชุด (Octets) คั่นด้วยจุด', '64 บิต คั่นด้วยเครื่องหมายโคลอน', '128 บิต แบ่งเป็น 8 ชุด'],
          ans: 1,
          exp: 'IPv4 มีขนาด 32 บิต แบ่งเป็น 4 ชุด ชุดละ 8 บิต (เช่น 192.168.1.1) ส่วน IPv6 มีขนาด 128 บิต'
        }
      ]
    },

    /* ===================== UNIT 04 ===================== */
    {
      id: 4,
      code: 'UNIT 04',
      title: 'เครือข่าย LAN แบบใช้สาย',
      subtitle: 'เทคโนโลยี LAN, มาตรฐาน Ethernet, อุปกรณ์ UTP และการเข้าหัว RJ-45',
      color: '#14b8a6',
      zoneName: 'โรงงานเข้าหัวสายแลน',
      boss: {
        name: 'Cable Titan RJ-45',
        thName: 'ไททันหัวสายแลน',
        sprite: 'cable_titan',
        hp: 210,
        atk: 21,
        taunt: 'เรียงสีสาย T568B ผิดแม้แต่พินเดียว ไฟ Tester จะไม่มีวันติดครบ 1 ถึง 8!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#14b8a6" stroke-width="4"/>
          <text x="320" y="34" fill="#5eead4" font-size="14" font-weight="bold" text-anchor="middle">มาตรฐานการเข้าหัวสาย RJ-45 (TIA/EIA-568B)</text>
          <rect x="70" y="48" width="500" height="92" fill="#111c36" stroke="#94a3b8" stroke-width="2"/>
          <rect x="92" y="56" width="44" height="54" fill="#ffedd5" stroke="#f97316" stroke-width="3"/><text x="114" y="128" fill="#e2e8f0" font-size="10" text-anchor="middle">1 ขาวส้ม</text>
          <rect x="150" y="56" width="44" height="54" fill="#f97316"/><text x="172" y="128" fill="#e2e8f0" font-size="10" text-anchor="middle">2 ส้ม</text>
          <rect x="208" y="56" width="44" height="54" fill="#dcfce7" stroke="#22c55e" stroke-width="3"/><text x="230" y="128" fill="#e2e8f0" font-size="10" text-anchor="middle">3 ขาวเขียว</text>
          <rect x="266" y="56" width="44" height="54" fill="#2563eb"/><text x="288" y="128" fill="#e2e8f0" font-size="10" text-anchor="middle">4 น้ำเงิน</text>
          <rect x="324" y="56" width="44" height="54" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><text x="346" y="128" fill="#e2e8f0" font-size="10" text-anchor="middle">5 ขาวน้ำเงิน</text>
          <rect x="382" y="56" width="44" height="54" fill="#22c55e"/><text x="404" y="128" fill="#e2e8f0" font-size="10" text-anchor="middle">6 เขียว</text>
          <rect x="440" y="56" width="44" height="54" fill="#fef3c7" stroke="#92400e" stroke-width="3"/><text x="462" y="128" fill="#e2e8f0" font-size="10" text-anchor="middle">7 ขาวน้ำตาล</text>
          <rect x="498" y="56" width="44" height="54" fill="#92400e"/><text x="520" y="128" fill="#e2e8f0" font-size="10" text-anchor="middle">8 น้ำตาล</text>

          <rect x="30" y="156" width="280" height="58" fill="#111c36" stroke="#38bdf8" stroke-width="2"/>
          <text x="170" y="177" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">สายตรง (Straight-Through)</text>
          <text x="170" y="198" fill="#cbd5e1" font-size="11" text-anchor="middle">T568B ↔ T568B (PC ↔ Switch / Router)</text>

          <rect x="330" y="156" width="280" height="58" fill="#111c36" stroke="#f59e0b" stroke-width="2"/>
          <text x="470" y="177" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">สายไขว้ (Crossover)</text>
          <text x="470" y="198" fill="#cbd5e1" font-size="11" text-anchor="middle">T568A ↔ T568B (PC ↔ PC / สลับพิน 1-3, 2-6)</text>
        </svg>
      `,
      svgDiagram2: `
        <svg viewBox="0 0 640 155" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="155" fill="#0b1224"/>
          <rect x="6" y="6" width="628" height="143" fill="none" stroke="#14b8a6" stroke-width="3"/>
          <text x="320" y="26" fill="#5eead4" font-size="12" font-weight="bold" text-anchor="middle">8 ขั้นตอนการเข้าหัวสาย UTP CAT5e กับหัวต่อ RJ-45</text>
          <rect x="18" y="40" width="144" height="44" fill="#111c36" stroke="#38bdf8"/><text x="90" y="58" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">1. ปอกเปลือกหุ้มสาย</text><text x="90" y="74" fill="#cbd5e1" font-size="9" text-anchor="middle">ยาว ~2-3 ซม.</text>
          <rect x="172" y="40" width="144" height="44" fill="#111c36" stroke="#38bdf8"/><text x="244" y="58" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">2. คลี่สายออกมา</text><text x="244" y="74" fill="#cbd5e1" font-size="9" text-anchor="middle">แยกเกลียวทั้ง 4 คู่</text>
          <rect x="326" y="40" width="144" height="44" fill="#111c36" stroke="#38bdf8"/><text x="398" y="58" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">3. จัดเรียงสายตามมาตรฐาน</text><text x="398" y="74" fill="#cbd5e1" font-size="9" text-anchor="middle">TIA-568A หรือ 568B</text>
          <rect x="480" y="40" width="142" height="44" fill="#111c36" stroke="#38bdf8"/><text x="551" y="58" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">4. จัดสายให้เรียงชิดกัน</text><text x="551" y="74" fill="#cbd5e1" font-size="9" text-anchor="middle">ดึงให้ตรงแนบชิด</text>
          <rect x="18" y="94" width="144" height="44" fill="#111c36" stroke="#4ade80"/><text x="90" y="112" fill="#4ade80" font-size="10" font-weight="bold" text-anchor="middle">5. ตัดปลายสายแนวตรง</text><text x="90" y="128" fill="#cbd5e1" font-size="9" text-anchor="middle">ให้ยาวเท่ากัน ~1.2 ซม.</text>
          <rect x="172" y="94" width="144" height="44" fill="#111c36" stroke="#4ade80"/><text x="244" y="112" fill="#4ade80" font-size="10" font-weight="bold" text-anchor="middle">6. สอดเข้าไปในหัวต่อ</text><text x="244" y="128" fill="#cbd5e1" font-size="9" text-anchor="middle">ดันสุดปลายพินทองแดง</text>
          <rect x="326" y="94" width="144" height="44" fill="#111c36" stroke="#4ade80"/><text x="398" y="112" fill="#4ade80" font-size="10" font-weight="bold" text-anchor="middle">7. ใช้คีมบีบหัวต่อให้แน่น</text><text x="398" y="128" fill="#cbd5e1" font-size="9" text-anchor="middle">ย้ำด้วย Crimping Tool</text>
          <rect x="480" y="94" width="142" height="44" fill="#111c36" stroke="#facc15"/><text x="551" y="112" fill="#facc15" font-size="10" font-weight="bold" text-anchor="middle">8. ตรวจด้วย Cable Tester</text><text x="551" y="128" fill="#cbd5e1" font-size="9" text-anchor="middle">ไฟติดครบพิน 1–8 ✔</text>
        </svg>
      `,
      codexCards: [
        {
          title: '1. การรับส่งข้อมูลแบบ Ethernet vs Token Pass',
          bullets: [
            '<b>Ethernet (IEEE 802.3)</b>: ใช้กลไก <b>CSMA/CD</b> ตรวจสอบว่าสายสัญญาณว่างก่อนส่งข้อมูล หากเกิดการชนกันจะหยุดรอแล้วสุ่มเวลาส่งใหม่ (ปัจจุบันผ่าน Switch ทำงาน Full-Duplex ไม่มีสัญญาณชน)',
            '<b>Token Pass</b>: ส่งสัญญาณรหัสสิทธิ์ (<b>Token</b>) วนไปตามลำดับในเครือข่าย (เช่น Ring Topology) เฉพาะเครื่องที่ได้รับ Token เท่านั้นจึงจะมีสิทธิ์ส่งข้อมูล ช่วยป้องกันการชนกันของข้อมูล',
            '<b>อุปกรณ์ LAN แบบใช้สาย</b>: Switch, การ์ดแลน (NIC), สาย UTP + หัวต่อ RJ-45, Patch Panel, Wall Outlet และ Router'
          ]
        },
        {
          title: '2. ตารางมาตรฐานเครือข่ายอีเทอร์เน็ต (IEEE 802.3 ครบ 7 รุ่น)',
          bullets: [
            '<b>10BASE-T</b>: IEEE <b>802.3i</b> | สาย UTP (Cat3/Cat5) | แบบ Baseband (10 Mbps)',
            '<b>100BASE-TX</b>: IEEE <b>802.3u</b> | สาย UTP (Cat5/Cat5e) | แบบ Baseband (100 Mbps) | <b>100BASE-FX</b>: IEEE <b>802.3u</b> | สาย Fiber Optic (MMF) | Baseband',
            '<b>1000Base-SX</b>: IEEE <b>802.3z</b> | Fiber Optic (MMF คลื่นสั้น) | <b>1000Base-LX</b>: IEEE <b>802.3z</b> | Fiber Optic (SMF/MMF คลื่นยาว)',
            '<b>1000Base-T</b>: IEEE <b>802.3ab</b> | สาย UTP (Cat5e/Cat6) | <b>1000Base-LX10</b>: IEEE <b>802.3ah</b> | Fiber Optic (SMF ระยะ 10 กม.) | แบบ Baseband ทั้งหมด'
          ]
        },
        {
          title: '3. มาตรฐานการเรียงสาย TIA-568A / TIA-568B และลักษณะการเข้าสาย',
          bullets: [
            '<b>TIA-568A (พิน 1–8)</b>: 1.ขาว-เขียว, 2.เขียว, 3.ขาว-ส้ม, 4.น้ำเงิน, 5.ขาว-น้ำเงิน, 6.ส้ม, 7.ขาว-น้ำตาล, 8.น้ำตาล',
            '<b>TIA-568B (พิน 1–8 นิยมสุด)</b>: 1.ขาว-ส้ม, 2.ส้ม, 3.ขาว-เขียว, 4.น้ำเงิน, 5.ขาว-น้ำเงิน, 6.เขียว, 7.ขาว-น้ำตาล, 8.น้ำตาล',
            '<b>ลักษณะการเข้าสาย 2 แบบ</b>: <b>สายตรง (Straight-Through: B–B หรือ A–A)</b> ต่ออุปกรณ์ต่างชนิด (PC ↔ Switch) | <b>สายไขว้ (Crossover: A–B)</b> สลับพิน 1-3, 2-6 ต่ออุปกรณ์ชนิดเดียวกัน (PC ↔ PC)'
          ]
        },
        {
          title: '4. 8 ขั้นตอนการเข้าสาย UTP CAT5e กับหัวต่อ RJ-45',
          bullets: [
            '1) ปอกเปลือกหุ้มสาย → 2) คลี่สายออกมา → 3) จัดเรียงสายตามมาตรฐาน (568A/B) → 4) จัดสายให้เรียงชิดกัน',
            '5) ตัดปลายสายเป็นแนวตรง → 6) สอดเข้าไปในหัวต่อ RJ-45 → 7) ใช้คีมบีบหัวต่อที่เข้าสายให้แน่น → 8) ใช้เครื่องมือตรวจสอบการเข้าสาย (LAN Cable Tester)'
          ]
        }
      ],
      quiz: [
        {
          q: 'ลำดับสีของสาย UTP มาตรฐาน T568B ตั้งแต่พินที่ 1 ถึง 4 คือข้อใด?',
          options: ['ขาว-เขียว, เขียว, ขาว-ส้ม, น้ำเงิน', 'ขาว-ส้ม, ส้ม, ขาว-เขียว, น้ำเงิน', 'ส้ม, ขาว-ส้ม, เขียว, ขาว-เขียว', 'ขาว-น้ำตาล, น้ำตาล, ขาว-เขียว, เขียว'],
          ans: 1,
          exp: 'มาตรฐาน T568B เรียงสีพิน 1–8 คือ ขาว-ส้ม, ส้ม, ขาว-เขียว, น้ำเงิน, ขาว-น้ำเงิน, เขียว, ขาว-น้ำตาล, น้ำตาล'
        },
        {
          q: 'การต่อสาย LAN จากเครื่องคอมพิวเตอร์ (PC) ไปยัง Switch ควรใช้สายรูปแบบใด?',
          options: ['สายไขว้ (Crossover: T568A–T568B)', 'สายตรง (Straight-Through: T568B–T568B)', 'สาย Rollover Console', 'สาย Coaxial'],
          ans: 1,
          exp: 'อุปกรณ์ต่างประเภท (PC ↔ Switch) ใช้สายตรง (Straight-Through) ที่เข้าหัวแบบเดียวกันทั้งสองปลาย'
        },
        {
          q: 'มาตรฐาน 1000BASE-T (Gigabit Ethernet) รองรับความเร็วสูงสุดเท่าใด และควรใช้สาย UTP อย่างน้อยระดับใด?',
          options: ['10 Mbps / Cat3', '100 Mbps / Cat5', '1,000 Mbps (1 Gbps) / Cat5e หรือ Cat6', '100 Gbps / Cat5e'],
          ans: 2,
          exp: '1000BASE-T ให้ความเร็ว 1 Gbps (1,000 Mbps) ระยะสูงสุด 100 เมตร ใช้สาย Cat5e หรือ Cat6 ขึ้นไป'
        },
        {
          q: 'สายไขว้ (Crossover) แตกต่างจากสายตรงโดยการสลับคู่พินใด?',
          options: ['พิน 4-5 กับ 7-8', 'พิน 1-2 กับ 3-6', 'พิน 1-8 ทั้งหมด', 'พิน 2-3 กับ 6-7'],
          ans: 1,
          exp: 'T568A กับ T568B สลับคู่สีส้ม (พิน 1-2) กับคู่สีเขียว (พิน 3-6) ซึ่งเป็นคู่ส่ง (TX) และรับ (RX)'
        },
        {
          q: 'อุปกรณ์ใดใช้ตรวจสอบว่าสาย LAN ที่เข้าหัว RJ-45 แล้วต่อครบทั้ง 8 เส้นและไม่สลับคู่?',
          options: ['LAN Cable Tester', 'Power Supply Tester', 'Oscilloscope', 'Barcode Scanner'],
          ans: 0,
          exp: 'LAN Cable Tester จะไล่ไฟแสดงผลพิน 1 ถึง 8 เพื่อตรวจสอบการนำสัญญาณและการเรียงสาย'
        },
        {
          q: 'ระยะทางมาตรฐานสูงสุดของสาย UTP ในเครือข่าย Ethernet 1 ช่วงสาย (โดยไม่ใช้ Repeater/Switch) คือเท่าใด?',
          options: ['25 เมตร', '50 เมตร', '100 เมตร', '500 เมตร'],
          ans: 2,
          exp: 'มาตรฐาน IEEE 802.3 กำหนดความยาวสูงสุดของสาย UTP ไว้ที่ 100 เมตร เพื่อไม่ให้สัญญาณอ่อนลงจนเกิดข้อผิดพลาด'
        },
        {
          q: 'กลไกการตรวจสอบและหลีกเลี่ยงการชนกันของสัญญาณในเครือข่าย Ethernet แบบใช้สายดั้งเดิม (Half-Duplex) คือข้อใด?',
          options: ['CSMA/CD', 'CSMA/CA', 'WPA3-SAE', 'RIP v2'],
          ans: 0,
          exp: 'Ethernet ใช้ CSMA/CD (Collision Detection) ตรวจจับการชนกันของสัญญาณ ส่วน Wi-Fi ใช้ CSMA/CA (Collision Avoidance)'
        },
        {
          q: 'ลำดับสีของสาย UTP มาตรฐาน T568A ในพินที่ 1 และ 2 คือสีใด?',
          options: ['ขาว-ส้ม และ ส้ม', 'ขาว-เขียว และ เขียว', 'ขาว-น้ำเงิน และ น้ำเงิน', 'ขาว-น้ำตาล และ น้ำตาล'],
          ans: 1,
          exp: 'T568A เริ่มต้นพิน 1-2 ด้วย ขาว-เขียว, เขียว (สลับคู่สีเขียวกับส้มเมื่อเทียบกับ T568B)'
        },
        {
          q: 'มาตรฐาน 100BASE-TX (Fast Ethernet) รองรับความเร็วรับส่งข้อมูลสูงสุดเท่าใด?',
          options: ['10 Mbps', '100 Mbps', '1,000 Mbps', '10,000 Mbps'],
          ans: 1,
          exp: 'ตัวเลข 100 ใน 100BASE-TX หมายถึงความเร็ว 100 Mbps ผ่านสายคู่บิดเกลียว (UTP Cat5 ขึ้นไป)'
        },
        {
          q: 'เครื่องมือใดใช้สำหรับบีบหัวต่อ RJ-45 ให้เขี้ยวทองแดงกดแน่นเข้ากับสาย UTP ทั้ง 8 เส้น?',
          options: ['คีมเข้าหัวสาย (Crimping Tool)', 'หัวแร้งบัดกรี', 'มัลติมิเตอร์', 'ไขควงวัดไฟ'],
          ans: 0,
          exp: 'คีมเข้าหัวสาย (Crimping Tool) ใช้ปลอกฉนวน ตัดปลายสายตรง และย้ำหัว RJ-45 ให้แน่นพอดี'
        }
      ]
    },

    /* ===================== UNIT 05 ===================== */
    {
      id: 5,
      code: 'UNIT 05',
      title: 'เครือข่าย LAN แบบไร้สาย',
      subtitle: 'WLAN, มาตรฐาน 802.11, อุปกรณ์, รูปแบบการเชื่อมต่อ และ WPA2/WPA3',
      color: '#0ea5e9',
      zoneName: 'หอส่งสัญญาณ Wi-Fi',
      boss: {
        name: 'Wi-Fi Signal Dragon',
        thName: 'มังกรคลื่นสัญญาณแทรก',
        sprite: 'wifi_dragon',
        hp: 220,
        atk: 22,
        taunt: 'ใช้รหัส WEP โบราณหรือเปิดช่องสัญญาณชนกัน ข้าจะแฮก Wi-Fi เจ้าในพริบตา!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#0ea5e9" stroke-width="4"/>
          <rect x="24" y="24" width="286" height="92" fill="#111c36" stroke="#38bdf8" stroke-width="2"/>
          <text x="167" y="46" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">มาตรฐาน IEEE 802.11 (Wi-Fi)</text>
          <text x="167" y="68" fill="#e2e8f0" font-size="11" text-anchor="middle">802.11n (Wi-Fi 4): 2.4 / 5 GHz</text>
          <text x="167" y="86" fill="#e2e8f0" font-size="11" text-anchor="middle">802.11ac (Wi-Fi 5): 5 GHz ความเร็วสูง</text>
          <text x="167" y="104" fill="#4ade80" font-size="11" text-anchor="middle">802.11ax (Wi-Fi 6/6E): 2.4 / 5 / 6 GHz</text>

          <rect x="330" y="24" width="286" height="92" fill="#111c36" stroke="#f59e0b" stroke-width="2"/>
          <text x="473" y="46" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">รูปแบบการเชื่อมต่อไร้สาย</text>
          <text x="473" y="68" fill="#cbd5e1" font-size="11" text-anchor="middle">Ad-Hoc (IBSS): เชื่อมตรงเครื่องต่อเครื่อง</text>
          <text x="473" y="88" fill="#4ade80" font-size="11" text-anchor="middle">Infrastructure (BSS/ESS): ผ่าน Access Point</text>
          <text x="473" y="106" fill="#38bdf8" font-size="11" text-anchor="middle">2.4 GHz ช่องไม่ซ้อนทับ = Ch 1, 6, 11</text>

          <rect x="24" y="130" width="592" height="86" fill="#111c36" stroke="#10b981" stroke-width="2"/>
          <text x="320" y="152" fill="#6ee7b7" font-size="12" font-weight="bold" text-anchor="middle">ระดับความปลอดภัยไร้สาย (Wireless Security)</text>
          <rect x="44" y="164" width="120" height="38" fill="#7f1d1d" stroke="#ef4444"/><text x="104" y="187" fill="#fecaca" font-size="11" text-anchor="middle">WEP (อันตราย)</text>
          <rect x="184" y="164" width="120" height="38" fill="#78350f" stroke="#f59e0b"/><text x="244" y="187" fill="#fde68a" font-size="11" text-anchor="middle">WPA (ล้าสมัย)</text>
          <rect x="324" y="164" width="130" height="38" fill="#065f46" stroke="#10b981"/><text x="389" y="187" fill="#a7f3d0" font-size="11" text-anchor="middle">WPA2-AES (ดี)</text>
          <rect x="474" y="164" width="126" height="38" fill="#0369a1" stroke="#38bdf8"/><text x="537" y="187" fill="#e0f2fe" font-size="11" text-anchor="middle">WPA3 (ดีที่สุด)</text>
        </svg>
      `,
      codexCards: [
        {
          title: '1. ข้อดีของเครือข่ายไร้สาย และมาตรฐาน IEEE 802.11 (Wi-Fi 4/5/6)',
          bullets: [
            '<b>ข้อดีของ WLAN</b>: (1) เคลื่อนย้ายอุปกรณ์ได้อิสระไม่ต้องต่อสาย, (2) ติดตั้งง่ายและขยายเครือข่ายได้รวดเร็ว, (3) รองรับอุปกรณ์พกพาหลากหลายและประหยัดค่าเดินสาย',
            '<b>มาตรฐานและความเร็วสูงสุด</b>: <b>IEEE 802.11n</b> (สูงสุด <b>600 Mbps</b> = <b>Wi-Fi 4</b>), <b>IEEE 802.11ac</b> (สูงสุด <b>6.9 Gbps</b> = <b>Wi-Fi 5</b>), <b>IEEE 802.11ax</b> (สูงสุด <b>9.6 Gbps</b> = <b>Wi-Fi 6 / 6E</b>)',
            '<b>ย่านความถี่</b>: 2.4 GHz ทะลุกำแพงไกลกว่า (ช่องไม่ซ้อนทับคือ 1, 6, 11) | 5 GHz / 6 GHz ความเร็วสูงและสัญญาณกวนน้อยกว่า'
          ]
        },
        {
          title: '2. เทคนิคการส่งข้อมูล SU-MIMO vs MU-MIMO',
          bullets: [
            '<b>SU-MIMO (Single-User MIMO)</b>: ใช้หลายเสาอากาศรับ-ส่งข้อมูลความเร็วสูงให้ลูกข่ายได้ทีละ <b>1 เครื่อง</b>ต่อครั้ง',
            '<b>MU-MIMO (Multi-User MIMO)</b>: พัฒนาให้ Access Point สามารถส่งข้อมูลไปยังลูกข่าย<b>หลายเครื่องพร้อมกัน</b>ในเวลาเดียวกัน ช่วยลดความหน่วงในห้องเรียนที่มีอุปกรณ์หนาแน่น'
          ]
        },
        {
          title: '3. อุปกรณ์เครือข่ายไร้สายและรูปแบบการเชื่อมต่อ',
          bullets: [
            '<b>Access Point (AP)</b>: จุดกระจายสัญญาณไร้สายเพื่อเชื่อมลูกข่ายไร้สายเข้ากับเครือข่าย LAN แบบสาย',
            '<b>Range Extender (Repeater)</b>: รับสัญญาณ Wi-Fi เดิมแล้วขยาย/ทวนสัญญาณให้ครอบคลุมพื้นที่ได้ไกลขึ้น',
            '<b>Wireless Bridge</b>: เชื่อมต่อเครือข่าย LAN สองวงหรือสองอาคารเข้าด้วยกันแบบไร้สาย',
            '<b>รูปแบบการเชื่อมต่อ</b>: <b>Ad-Hoc (IBSS)</b> เชื่อมตรงเครื่องต่อเครื่อง, <b>Infrastructure (BSS)</b> ผ่าน AP ศูนย์กลาง, <b>ESS / Mesh / Point-to-Point</b> ใช้ AP หลายตัวเชื่อมโยงกัน'
          ]
        },
        {
          title: '4. การรักษาความปลอดภัยในเครือข่ายไร้สาย',
          bullets: [
            '<b>การเข้ารหัส</b>: ใช้ <b>WPA2-PSK (AES)</b> หรือ <b>WPA3</b> (หลีกเลี่ยง WEP/WPA รุ่นเก่าที่ถูกเจาะได้ง่าย)',
            '<b>มาตรการเสริม</b>: เปิด <b>MAC Address Filtering</b>, ซ่อนชื่อ <b>SSID</b>, เปลี่ยนรหัสผ่าน Admin ของ Router, ปิด WPS, แยกเครือข่าย Guest และอัปเดต Firmware สม่ำเสมอ'
          ]
        }
      ],
      quiz: [
        {
          q: 'มาตรฐานการเข้ารหัสความปลอดภัยของ Wi-Fi แบบใดที่ปลอดภัยสูงสุดและแนะนำในปัจจุบัน?',
          options: ['Open Network', 'WEP', 'WPA-TKIP', 'WPA3 (หรือ WPA2-AES)'],
          ans: 3,
          exp: 'WPA3 (และ WPA2-AES) ใช้การเข้ารหัสที่แข็งแกร่ง ป้องกันการดักฟังและ Brute-force ได้ดีกว่า WEP/WPA รุ่นเก่า'
        },
        {
          q: 'ในย่านความถี่ 2.4 GHz ช่องสัญญาณ (Channel) ชุดใดที่ไม่ซ้อนทับกัน (Non-overlapping)?',
          options: ['1, 2, 3', '1, 6, 11', '2, 5, 8', '4, 8, 12'],
          ans: 1,
          exp: 'ช่องสัญญาณ 1, 6 และ 11 บนย่าน 2.4 GHz ไม่ซ้อนทับกัน จึงลดสัญญาณรบกวนระหว่าง Access Point ได้ดีที่สุด'
        },
        {
          q: 'มาตรฐาน IEEE 802.11ax มีชื่อเรียกทางการค้าว่าอะไร?',
          options: ['Wi-Fi 3', 'Wi-Fi 4', 'Wi-Fi 5', 'Wi-Fi 6'],
          ans: 3,
          exp: '802.11n = Wi-Fi 4, 802.11ac = Wi-Fi 5 และ 802.11ax = Wi-Fi 6'
        },
        {
          q: 'รูปแบบการเชื่อมต่อไร้สายที่เครื่องลูกข่ายทุกเครื่องต้องเชื่อมต่อผ่านอุปกรณ์ Access Point เรียกว่าโหมดใด?',
          options: ['Ad-Hoc Mode', 'Infrastructure Mode', 'Simplex Mode', 'Bus Mode'],
          ans: 1,
          exp: 'Infrastructure Mode ใช้ Access Point เป็นศูนย์กลางเชื่อมต่อเครื่องลูกข่ายเข้าสู่เครือข่าย LAN'
        },
        {
          q: 'ข้อเปรียบเทียบระหว่างคลื่น Wi-Fi 2.4 GHz และ 5 GHz ข้อใดถูกต้อง?',
          options: ['2.4 GHz ทะลุสิ่งกีดขวางได้ไกลกว่า แต่ 5 GHz ให้ความเร็วสูงกว่าและสัญญาณกวนน้อยกว่า', '5 GHz ทะลุกำแพงได้ไกลกว่า 2.4 GHz เสมอ', '2.4 GHz ใช้ได้เฉพาะสายแลน', 'ทั้งสองย่านให้ความเร็วและระยะทางเท่ากันทุกประการ'],
          ans: 0,
          exp: 'คลื่น 2.4 GHz ความถี่ต่ำกว่าจึงทะลุผนังได้ไกลกว่า ส่วน 5 GHz มีแบนด์วิดท์กว้างและสัญญาณรบกวนน้อยกว่า'
        },
        {
          q: 'คำว่า SSID ในการตั้งค่า Wireless Access Point หมายถึงข้อใด?',
          options: ['รหัสผ่านเข้าเครื่อง Windows', 'ชื่อของเครือข่ายไร้สายที่แสดงให้ผู้ใช้เลือกเชื่อมต่อ', 'หมายเลข MAC Address ของเครื่องพิมพ์', 'ความเร็วสายใยแก้วนำแสง'],
          ans: 1,
          exp: 'SSID (Service Set Identifier) คือชื่อประจำเครือข่าย Wi-Fi ที่ Access Point ประกาศออกมา'
        },
        {
          q: 'เทคโนโลยี MU-MIMO ในมาตรฐาน Wi-Fi สมัยใหม่ (802.11ac Wave 2 / 802.11ax) มีข้อดีอย่างไร?',
          options: ['ทำให้ Access Point ส่งข้อมูลถึงอุปกรณ์ลูกข่ายหลายเครื่องพร้อมกันในเวลาเดียวกัน', 'ทำให้ไม่ต้องใช้สายไฟฟ้าเลี้ยงเราเตอร์', 'เปลี่ยนคลื่นวิทยุเป็นสายใยแก้วนำแสง', 'ทำให้ใช้งานได้เฉพาะเครื่องเดียวต่อ AP'],
          ans: 0,
          exp: 'MU-MIMO (Multi-User MIMO) ช่วยให้ AP รับส่งข้อมูลกับอุปกรณ์หลายเครื่องพร้อมกัน ลดอาการหน่วงเมื่อมีผู้ใช้งานหนาแน่น'
        },
        {
          q: 'อุปกรณ์ใดทำหน้าที่รับสัญญาณ Wi-Fi เดิมแล้วทวนสัญญาณขยายขอบเขตให้ครอบคลุมพื้นที่อับสัญญาณมากขึ้น?',
          options: ['Range Extender / Wireless Repeater', 'Patch Panel', 'Crimping Tool', 'UPS'],
          ans: 0,
          exp: 'Range Extender (Repeater) รับสัญญาณจาก AP หลักแล้วส่งต่อเพื่อขยายพื้นที่ครอบคลุมในจุดอับสัญญาณ'
        },
        {
          q: 'การเชื่อมต่อไร้สายโดยตรงระหว่างอุปกรณ์ 2 เครื่องโดยไม่ผ่าน Access Point (เช่น AirDrop หรือ Wi-Fi Direct) เรียกว่าโหมดใด?',
          options: ['Infrastructure Mode', 'Ad-Hoc Mode', 'Trunk Mode', 'Bridge VLAN Mode'],
          ans: 1,
          exp: 'Ad-Hoc Mode เป็นการเชื่อมต่อแบบ Peer-to-Peer ระหว่างอุปกรณ์ไร้สายโดยตรง ไม่ต้องอาศัย Access Point กลาง'
        },
        {
          q: 'ฟีเจอร์ MAC Address Filtering บนเราเตอร์ไร้สายใช้เพื่อวัตถุประสงค์ใด?',
          options: ['จำกัดสิทธิ์เฉพาะอุปกรณ์ที่มีหมายเลข MAC ที่อนุญาต (หรือบล็อกเครื่องที่ไม่ต้องการ) ให้เชื่อมต่อ Wi-Fi', 'เพิ่มความเร็วอินเทอร์เน็ตจาก 100 Mbps เป็น 1 Gbps', 'เปลี่ยนชื่อโดเมนเว็บไซต์', 'สำรองข้อมูลไฟล์บนคลาวด์'],
          ans: 0,
          exp: 'MAC Filtering เป็นมาตรการเสริมความปลอดภัยด้วยการกำหนดรายการอนุญาต (Allow List) หรือปฏิเสธ (Deny List) ตามหมายเลข MAC ของอุปกรณ์'
        }
      ]
    },

    /* ===================== UNIT 06 ===================== */
    {
      id: 6,
      code: 'UNIT 06',
      title: 'การใช้งานเครือข่ายในระบบปฏิบัติการวินโดวส์',
      subtitle: 'ชื่อเครื่อง Workgroup, ตั้ง IP, แชร์โฟลเดอร์/เครื่องพิมพ์ และเชื่อม Wi-Fi',
      color: '#3b82f6',
      zoneName: 'ศูนย์ควบคุม Windows LAN',
      boss: {
        name: 'Window Phantom',
        thName: 'ภูตหน้าต่างเครือข่าย',
        sprite: 'win_phantom',
        hp: 230,
        atk: 22,
        taunt: 'ตั้ง IP ผิดวงหรือลืมกำหนดสิทธิ์แชร์โฟลเดอร์ เจ้าจะไม่มีวันมองเห็นเครื่องเพื่อนในวง LAN!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#3b82f6" stroke-width="4"/>
          <rect x="24" y="24" width="286" height="192" fill="#111c36" stroke="#38bdf8" stroke-width="2"/>
          <text x="167" y="46" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">WINDOWS NETWORK SETUP</text>
          <text x="40" y="76" fill="#e2e8f0" font-size="11">1. Computer Name: LAB-PC01</text>
          <text x="40" y="100" fill="#e2e8f0" font-size="11">2. Workgroup: WORKGROUP / ROOM301</text>
          <text x="40" y="124" fill="#4ade80" font-size="11">3. IPv4: 192.168.10.20 /24</text>
          <text x="40" y="148" fill="#4ade80" font-size="11">   Gateway: 192.168.10.1</text>
          <text x="40" y="172" fill="#facc15" font-size="11">   DNS: 8.8.8.8 / 1.1.1.1</text>
          <text x="40" y="198" fill="#94a3b8" font-size="10">Network Discovery: ON | File Sharing: ON</text>

          <rect x="330" y="24" width="286" height="192" fill="#111c36" stroke="#f59e0b" stroke-width="2"/>
          <text x="473" y="46" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">FILE &amp; PRINTER SHARING</text>
          <rect x="352" y="62" width="242" height="44" fill="#1e293b" stroke="#22c55e"/>
          <text x="473" y="80" fill="#4ade80" font-size="11" font-weight="bold" text-anchor="middle">📁 Share Folder + Permissions</text>
          <text x="473" y="96" fill="#cbd5e1" font-size="10" text-anchor="middle">Read / Change / Full Control</text>
          <rect x="352" y="116" width="242" height="40" fill="#1e293b" stroke="#38bdf8"/>
          <text x="473" y="140" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">🖨️ Printer Properties → Sharing</text>
          <rect x="352" y="166" width="242" height="36" fill="#0f172a" stroke="#a855f7"/>
          <text x="473" y="188" fill="#e9d5ff" font-size="11" font-weight="bold" text-anchor="middle">Run (Win+R): \\\\LAB-PC01\\Share</text>
        </svg>
      `,
      codexCards: [
        {
          title: '1-2. ขั้นตอนเปลี่ยนชื่อเครื่องและเปลี่ยนชื่อเครือข่าย (Workgroup)',
          bullets: [
            '<b>เปลี่ยนชื่อเครื่อง (4 ขั้นตอน)</b>: (1) เปิด <code>Settings → System → About</code> (หรือคลิกขวา This PC → Properties / รัน <code>sysdm.cpl</code>) → (2) คลิก <b>Rename this PC</b> (หรือแท็บ Computer Name → Change) → (3) พิมพ์ชื่อเครื่องใหม่ที่ไม่ซ้ำในวง LAN แล้วกด Next/OK → (4) <b>Restart</b> เครื่องเพื่อให้มีผล',
            '<b>เปลี่ยนชื่อเครือข่าย Workgroup (4 ขั้นตอน)</b>: (1) เปิด <code>sysdm.cpl</code> → (2) เลือกแท็บ <b>Computer Name</b> แล้วคลิก <b>Change</b> → (3) เลือก <b>Workgroup</b> แล้วพิมพ์ชื่อกลุ่มงานเดียวกันทุกเครื่องในห้อง → (4) กด OK และ <b>Restart</b> เครื่อง'
          ]
        },
        {
          title: '3. ขั้นตอนการเปลี่ยนหมายเลข IP Address ใน Windows 10/11',
          bullets: [
            '(1) เปิด <code>Control Panel → Network and Sharing Center → Change adapter settings</code> (หรือกด <code>Win+R</code> พิมพ์ <code>ncpa.cpl</code>)',
            '(2) คลิกขวาที่การ์ดเครือข่าย (<b>Ethernet</b> หรือ <b>Wi-Fi</b>) → เลือก <b>Properties</b>',
            '(3) ดับเบิลคลิก <b>Internet Protocol Version 4 (TCP/IPv4)</b>',
            '(4) เลือก <b>Use the following IP address</b> กรอก <b>IP Address, Subnet Mask, Default Gateway</b> และ <b>DNS Server</b> แล้วกด OK'
          ]
        },
        {
          title: '4. ขั้นตอนการแชร์โฟลเดอร์และการแชร์เครื่องพิมพ์ใน Windows 10/11',
          bullets: [
            '<b>แชร์โฟลเดอร์ (4 ขั้นตอน)</b>: (1) คลิกขวาโฟลเดอร์ → Properties → แท็บ <b>Sharing</b> → (2) คลิก <b>Advanced Sharing</b> ติ๊ก <b>Share this folder</b> → (3) คลิก <b>Permissions</b> กำหนดสิทธิ์ (Read/Change/Full Control) → (4) เปิด <b>Network Discovery & File Sharing</b> แล้วทดสอบเข้าถึงผ่าน <code>\\\\ชื่อเครื่อง\\ชื่อแชร์</code>',
            '<b>แชร์เครื่องพิมพ์ (4 ขั้นตอน)</b>: (1) เปิด <code>Control Panel → Devices and Printers</code> → (2) คลิกขวาเครื่องพิมพ์ → <b>Printer properties</b> → (3) แท็บ <b>Sharing</b> ติ๊ก <b>Share this printer</b> ตั้งชื่อแชร์แล้วกด OK → (4) เครื่องลูกข่ายในวง LAN เชื่อมต่อผ่าน Network หรือ <code>\\\\ชื่อเครื่อง</code> และทดสอบสั่งพิมพ์'
          ]
        },
        {
          title: '5. การเข้าใช้งานทรัพยากรที่แชร์และเชื่อมต่อเครือข่ายไร้สาย',
          bullets: [
            '<b>UNC Path & Map Network Drive</b>: กด <code>Win+R</code> พิมพ์ <code>\\\\192.168.10.20\\Homework</code> หรือคลิก <b>Map Network Drive</b> เพื่อสร้างไดรฟ์เสมือนถาวร (เช่น ไดรฟ์ Z:)',
            '<b>เชื่อมต่อ Wi-Fi</b>: คลิกไอคอนเครือข่ายที่มุมขวาล่าง Taskbar → เลือกชื่อ SSID → กรอกรหัสผ่าน → ตั้งโปรไฟล์เป็น <b>Private Network</b> เมื่ออยู่ในเครือข่ายองค์กร/บ้าน'
          ]
        }
      ],
      quiz: [
        {
          q: 'หากต้องการเปิดหน้าต่างตั้งค่า Network Adapter (Ethernet / Wi-Fi) บน Windows อย่างรวดเร็วผ่านหน้าต่าง Run (Win+R) ควรพิมพ์คำสั่งใด?',
          options: ['calc', 'ncpa.cpl', 'mspaint', 'notepad'],
          ans: 1,
          exp: 'คำสั่ง ncpa.cpl จะเปิดหน้าต่าง Network Connections เพื่อตั้งค่า IPv4 ของการ์ดแลนและ Wi-Fi ได้ทันที'
        },
        {
          q: 'เมื่อต้องการเข้าถึงโฟลเดอร์ชื่อ "Docs" ที่แชร์ไว้บนเครื่อง IP 192.168.1.10 ผ่านหน้าต่าง Run (Win+R) ต้องพิมพ์รูปแบบใด?',
          options: ['http://192.168.1.10/Docs', '\\\\192.168.1.10\\Docs', 'C:\\192.168.1.10\\Docs', 'ping 192.168.1.10 Docs'],
          ans: 1,
          exp: 'การเข้าถึงไฟล์แชร์ในเครือข่าย Windows ใช้รูปแบบ UNC Path คือ \\\\ชื่อเครื่องหรือIP\\ชื่อโฟลเดอร์ที่แชร์'
        },
        {
          q: 'เพื่อให้เครื่องคอมพิวเตอร์ในห้องแล็บมองเห็นและแชร์ไฟล์ร่วมกันในวง LAN แบบ Peer-to-Peer ได้ง่าย ควรตั้งค่าใดให้เหมือนกันทุกเครื่อง?',
          options: ['ชื่อเครื่อง (Computer Name) เหมือนกันทุกเครื่อง', 'ชื่อกลุ่มงาน (Workgroup) เหมือนกัน แต่ชื่อเครื่องห้ามซ้ำกัน', 'หมายเลข IP Address ซ้ำกันทุกเครื่อง', 'MAC Address ซ้ำกันทุกเครื่อง'],
          ans: 1,
          exp: 'ทุกเครื่องควรอยู่ใน Workgroup เดียวกัน แต่ Computer Name และ IP Address ของแต่ละเครื่องต้องไม่ซ้ำกัน'
        },
        {
          q: 'สิทธิ์การแชร์โฟลเดอร์ระดับใดที่อนุญาตให้ผู้ใช้อื่นเปิดอ่านและคัดลอกไฟล์ได้ แต่ไม่สามารถแก้ไขหรือลบไฟล์ได้?',
          options: ['Full Control', 'Change', 'Read', 'Administrator'],
          ans: 2,
          exp: 'สิทธิ์ Read อนุญาตให้อ่านและคัดลอกไฟล์เท่านั้น ไม่สามารถบันทึกทับหรือลบไฟล์ในโฟลเดอร์แชร์ได้'
        },
        {
          q: 'หากต้องการให้โฟลเดอร์แชร์บนเครือข่ายปรากฏเป็นไดรฟ์ถาวร (เช่น ไดรฟ์ Z:) ใน File Explorer ควรใช้ฟีเจอร์ใด?',
          options: ['Disk Defragment', 'Map Network Drive', 'Format Drive', 'Device Manager'],
          ans: 1,
          exp: 'Map Network Drive ใช้ผูก UNC Path ของโฟลเดอร์ที่แชร์เข้ากับตัวอักษรไดรฟ์เพื่อให้เข้าใช้งานสะดวก'
        },
        {
          q: 'ข้อใดคือค่าที่ต้องกรอกครบถ้วนเมื่อกำหนดหมายเลข IP แบบ Static IPv4 เพื่อให้ใช้งานอินเทอร์เน็ตและเปิดเว็บไซต์ด้วยชื่อโดเมนได้?',
          options: ['IP Address อย่างเดียว', 'IP Address, Subnet Mask, Default Gateway และ DNS Server', 'MAC Address และ Workgroup', 'SSID และ Channel'],
          ans: 1,
          exp: 'ต้องกำหนด IP + Subnet Mask (ระบุวง LAN), Default Gateway (ออกนอกวงผ่าน Router) และ DNS (แปลงชื่อเว็บเป็น IP)'
        },
        {
          q: 'หากต้องการแชร์เครื่องพิมพ์ (Printer) บน Windows 10 ให้เครื่องอื่นในห้องแล็บสั่งพิมพ์ร่วมกันได้ ต้องเข้าไปเปิดใช้งานตัวเลือกใด?',
          options: ['Printer Properties → แท็บ Sharing → ติ๊ก Share this printer', 'Device Manager → Uninstall device', 'Display Settings → Night Light', 'Task Manager → Startup'],
          ans: 0,
          exp: 'การแชร์เครื่องพิมพ์ทำได้ที่ Control Panel / Settings → Printer Properties → แท็บ Sharing → เลือก Share this printer และตั้งชื่อแชร์'
        },
        {
          q: 'บน Windows หากต้องการให้เครื่องในวง LAN ค้นหากันเจอและมองเห็นโฟลเดอร์ที่แชร์ไว้ใน Network ต้องเปิดการตั้งค่าใดใน Advanced Sharing Settings?',
          options: ['Turn on network discovery และ Turn on file and printer sharing', 'Turn off Wi-Fi adapter', 'Enable Airplane Mode', 'Disable TCP/IPv4'],
          ans: 0,
          exp: 'Network Discovery ทำให้มองเห็นเครื่องอื่นในวง LAN และ File and Printer Sharing ทำให้เข้าถึงไฟล์/เครื่องพิมพ์ที่แชร์ได้'
        },
        {
          q: 'หลังเปลี่ยนชื่อคอมพิวเตอร์ (Computer Name) หรือเปลี่ยนชื่อ Workgroup บน Windows 10 ระบบจะต้องการขั้นตอนใดเพื่อให้มีผลสมบูรณ์?',
          options: ['รีสตาร์ตเครื่องคอมพิวเตอร์ (Restart)', 'ฟอร์แมตฮาร์ดดิสก์ใหม่', 'ถอดสาย LAN ออกถาวร', 'เปลี่ยนรหัสผ่าน Wi-Fi'],
          ans: 0,
          exp: 'การเปลี่ยนชื่อเครื่องหรือ Workgroup ใน Windows ต้องทำการ Restart เครื่องเพื่อให้ระบบบันทึกและประกาศชื่อใหม่ในเครือข่าย'
        },
        {
          q: 'เมื่อต้องการตั้งค่า IP แบบรับอัตโนมัติจาก DHCP Server ในหน้าต่าง Internet Protocol Version 4 (TCP/IPv4) Properties ควรเลือกตัวเลือกใด?',
          options: ['Obtain an IP address automatically', 'Use the following IP address', 'Disable IPv4', 'Manual MAC Override'],
          ans: 0,
          exp: 'Obtain an IP address automatically จะสั่งให้ Windows ขอรับหมายเลข IP จาก DHCP Server อัตโนมัติ'
        }
      ]
    },

    /* ===================== UNIT 07 ===================== */
    {
      id: 7,
      code: 'UNIT 07',
      title: 'ระบบปฏิบัติการเครือข่าย',
      subtitle: 'NOS, ซอฟต์แวร์ Server, เครื่องจำลอง (Virtualization) และการติดตั้งบน VM',
      color: '#6366f1',
      zoneName: 'ศูนย์ดาต้าเซ็นเตอร์จำลอง',
      boss: {
        name: 'Hypervisor Mech',
        thName: 'หุ่นยนต์ไฮเปอร์ไวเซอร์',
        sprite: 'hypervisor_mech',
        hp: 240,
        atk: 23,
        taunt: 'จัดสรร RAM ไม่พอหรือตั้งการ์ดแลน VM ผิดโหมด Server ของเจ้าจะไม่มีวันบูตขึ้น!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#6366f1" stroke-width="4"/>
          <text x="320" y="34" fill="#a5b4fc" font-size="13" font-weight="bold" text-anchor="middle">สถาปัตยกรรม Virtualization &amp; Network OS (NOS)</text>
          <rect x="44" y="48" width="170" height="62" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2"/>
          <text x="129" y="72" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">VM 1: Windows Server</text>
          <text x="129" y="92" fill="#cbd5e1" font-size="10" text-anchor="middle">AD DS / DNS / DHCP</text>

          <rect x="235" y="48" width="170" height="62" fill="#1e1b4b" stroke="#10b981" stroke-width="2"/>
          <text x="320" y="72" fill="#4ade80" font-size="11" font-weight="bold" text-anchor="middle">VM 2: Ubuntu Server</text>
          <text x="320" y="92" fill="#cbd5e1" font-size="10" text-anchor="middle">Web / DB / SSH</text>

          <rect x="426" y="48" width="170" height="62" fill="#1e1b4b" stroke="#f59e0b" stroke-width="2"/>
          <text x="511" y="72" fill="#facc15" font-size="11" font-weight="bold" text-anchor="middle">VM 3: Client Test</text>
          <text x="511" y="92" fill="#cbd5e1" font-size="10" text-anchor="middle">Windows 10/11</text>

          <rect x="44" y="122" width="552" height="36" fill="#312e81" stroke="#a855f7" stroke-width="2"/>
          <text x="320" y="144" fill="#e9d5ff" font-size="12" font-weight="bold" text-anchor="middle">Hypervisor (VirtualBox / VMware / Hyper-V / Proxmox)</text>

          <rect x="44" y="168" width="552" height="42" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
          <text x="320" y="186" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Host Hardware (CPU VT-x/AMD-V • RAM • SSD • NIC)</text>
          <text x="320" y="202" fill="#94a3b8" font-size="10" text-anchor="middle">Virtual Network: NAT (ออกเน็ตได้) | Bridged (รับ IP วง LAN จริง) | Host-Only (คุยเฉพาะเครื่องแม่)</text>
        </svg>
      `,
      codexCards: [
        {
          title: '1. ระบบปฏิบัติการเครือข่าย (NOS) และบริการหลัก 5 ประการ',
          bullets: [
            '<b>NOS (Network Operating System)</b>: ระบบปฏิบัติการสำหรับเครื่องแม่ข่าย (Server) เพื่อให้บริการและบริหารจัดการผู้ใช้/ความปลอดภัยแบบรวมศูนย์',
            '<b>บริการสำคัญใน NOS (5 บริการ)</b>: (1) <b>File & Print Services</b> แชร์ไฟล์/เครื่องพิมพ์, (2) <b>DHCP</b> แจก IP อัตโนมัติ, (3) <b>DNS</b> แปลงชื่อโดเมน, (4) <b>Web / Mail / FTP Services</b>, (5) <b>Active Directory / Directory Service</b> จัดการบัญชีผู้ใช้และสิทธิ์รวมศูนย์'
          ]
        },
        {
          title: '2. รายชื่อระบบปฏิบัติการเครือข่าย (NOS) และ Linux Server ยอดนิยม',
          bullets: [
            '<b>ชื่อระบบปฏิบัติการเครือข่าย (5 ชื่อ)</b>: (1) <b>Windows Server</b>, (2) <b>Linux Server</b>, (3) <b>UNIX / FreeBSD</b>, (4) <b>Novell NetWare</b>, (5) <b>macOS Server / Oracle Solaris</b>',
            '<b>Linux ที่นิยมใช้เป็น NOS (3+ ชื่อ)</b>: <b>Ubuntu Server</b>, <b>Debian</b>, <b>Red Hat Enterprise Linux (RHEL)</b>, <b>CentOS / Rocky Linux</b>, <b>openSUSE</b> (ฟรี Open-Source เสถียร กินทรัพยากรน้อย)'
          ]
        },
        {
          title: '3. ซอฟต์แวร์จำลองเครื่องคอมพิวเตอร์ (Virtual Machine / Hypervisor)',
          bullets: [
            '<b>ซอฟต์แวร์ VM ยอดนิยม</b>: <b>Oracle VM VirtualBox</b>, <b>VMware Workstation</b>, <b>Microsoft Hyper-V</b> (Type 2 สำหรับฝึกปฏิบัติ) และ <b>VMware ESXi / Proxmox VE</b> (Type 1 Bare-Metal สำหรับ Data Center)',
            '<b>ประโยชน์</b>: จำลองหลายเครื่องในพีซีเดียว ประหยัดฮาร์ดแวร์ และมีฟีเจอร์ <b>Snapshot</b> ย้อนสถานะได้ทันที'
          ]
        },
        {
          title: '4. ขั้นตอนการติดตั้งระบบปฏิบัติการบน VirtualBox',
          bullets: [
            '(1) เปิด <b>Oracle VirtualBox</b> คลิก <b>New</b> ตั้งชื่อ VM เลือกชนิด OS และจัดสรร <b>vCPU / RAM / Virtual Hard Disk (.vdi)</b>',
            '(2) เข้า <b>Settings → Storage</b> เพื่อ Mount ไฟล์ติดตั้ง <b>.ISO</b> และตั้งค่า <b>Network Adapter</b> (<b>NAT</b> ออกเน็ตผ่าน Host / <b>Bridged</b> รับ IP วง LAN จริง / <b>Host-Only</b> คุยเฉพาะเครื่องแม่)',
            '(3) กด <b>Start</b> เพื่อบูตจากไฟล์ .ISO และดำเนินการติดตั้งระบบปฏิบัติการเครือข่ายตามขั้นตอนจนเสร็จสมบูรณ์'
          ]
        }
      ],
      quiz: [
        {
          q: 'ระบบปฏิบัติการเครือข่าย (NOS) แตกต่างจากระบบปฏิบัติการทั่วไปอย่างไร?',
          options: ['ออกแบบมาเพื่อให้บริการเครือข่าย จัดการบัญชีผู้ใช้ และควบคุมสิทธิ์หลายเครื่องพร้อมกัน', 'ใช้เล่นเกมกราฟิก 3 มิติได้อย่างเดียว', 'ไม่ต้องใช้ CPU และ RAM', 'ไม่สามารถเชื่อมต่อเครือข่าย LAN ได้'],
          ans: 0,
          exp: 'NOS (เช่น Windows Server, Ubuntu Server) ถูกออกแบบให้เสถียรและบริหารจัดการบริการเครือข่ายและผู้ใช้แบบรวมศูนย์'
        },
        {
          q: 'ซอฟต์แวร์ใดจัดเป็น Hypervisor แบบ Type 2 (Hosted) ที่นิยมใช้สร้างเครื่องจำลองฝึกปฏิบัติในห้องเรียน?',
          options: ['Microsoft Paint', 'Oracle VirtualBox / VMware Workstation', 'WinRAR', 'VLC Media Player'],
          ans: 1,
          exp: 'VirtualBox และ VMware Workstation เป็น Hypervisor Type 2 ที่ติดตั้งบน Windows/macOS/Linux เพื่อจำลองเครื่อง VM'
        },
        {
          q: 'หากต้องการให้เครื่อง Server จำลอง (VM) ได้รับ IP Address อยู่ในวง LAN เดียวกับเครื่องจริงเพื่อให้เครื่องอื่นในห้องเชื่อมต่อเข้ามาได้ ควรตั้งค่า Virtual Network โหมดใด?',
          options: ['Host-Only', 'Bridged Adapter', 'Disconnected', 'Internal Only'],
          ans: 1,
          exp: 'Bridged Adapter จะเชื่อมต่อการ์ดแลนเสมือนของ VM เข้ากับวง LAN จริงโดยตรง ทำให้รับ IP และสื่อสารกับเครื่องอื่นในห้องได้'
        },
        {
          q: 'ฟีเจอร์ใดในโปรแกรมจำลองเครื่อง (VirtualBox / VMware) ที่ช่วยให้บันทึกสถานะของ VM ไว้ก่อนทดลองตั้งค่า และย้อนกลับมาได้ทันทีหากระบบพัง?',
          options: ['Format', 'Snapshot', 'Defragment', 'Bluetooth'],
          ans: 1,
          exp: 'Snapshot บันทึกจุดคืนค่าของ VM ทั้งสถานะดิสก์และการตั้งค่า ช่วยให้กู้คืนได้ภายในไม่กี่วินาที'
        },
        {
          q: 'ไฟล์ต้นฉบับที่ใช้ Mount เข้ากับไดรฟ์เสมือนของ VM เพื่อติดตั้ง Windows Server หรือ Ubuntu Server มักมีนามสกุลใด?',
          options: ['.mp3', '.jpg', '.iso', '.docx'],
          ans: 2,
          exp: 'ไฟล์ .ISO เป็นไฟล์อิมเมจแผ่นติดตั้งระบบปฏิบัติการที่ใช้บูตและติดตั้งบนเครื่องจำลอง'
        },
        {
          q: 'ข้อใดคือตัวอย่างซอฟต์แวร์ระบบปฏิบัติการเครือข่ายแบบ Open-Source ที่ไม่มีค่าลิขสิทธิ์?',
          options: ['Ubuntu Server / Debian', 'Windows 98', 'macOS Classic', 'MS-DOS'],
          ans: 0,
          exp: 'Ubuntu Server และ Debian เป็นระบบปฏิบัติการเครือข่ายตระกูล Linux แบบ Open-Source ที่ใช้งานแพร่หลายทั่วโลก'
        },
        {
          q: 'บริการใดใน Windows Server ที่ทำหน้าที่จัดการบัญชีผู้ใช้ กลุ่มผู้ใช้ และนโยบายความปลอดภัย (Group Policy) ของทั้งองค์กรแบบรวมศูนย์?',
          options: ['Active Directory Domain Services (AD DS)', 'Windows Media Player', 'Paint 3D', 'Disk Defragmenter'],
          ans: 0,
          exp: 'Active Directory (AD DS) เป็นหัวใจสำคัญของ Windows Server ในการจัดการโดเมน บัญชีผู้ใช้ และสิทธิ์เข้าถึงแบบรวมศูนย์'
        },
        {
          q: 'Hypervisor แบบ Type 1 (Bare-Metal) เช่น VMware ESXi หรือ Proxmox VE แตกต่างจาก Type 2 (VirtualBox) อย่างไร?',
          options: ['Type 1 ติดตั้งลงบนฮาร์ดแวร์เครื่องเซิร์ฟเวอร์โดยตรง ไม่ต้องผ่าน OS หลัก จึงมีประสิทธิภาพสูงกว่า', 'Type 1 ทำงานได้เฉพาะบนโทรศัพท์มือถือ', 'Type 2 เร็วกว่าและใช้ใน Data Center ใหญ่เสมอ', 'Type 1 ไม่สามารถสร้างเครื่องจำลองได้'],
          ans: 0,
          exp: 'Bare-Metal Hypervisor (Type 1) รันบนฮาร์ดแวร์โดยตรง ลดภาระของ Host OS เหมาะกับงานเซิร์ฟเวอร์จริงในองค์กร'
        },
        {
          q: 'หากตั้งค่า Virtual Network ของ VM เป็นโหมด NAT (Network Address Translation) เครื่อง VM จะมีลักษณะการเชื่อมต่ออย่างไร?',
          options: ['VM สามารถออกอินเทอร์เน็ตผ่านเครื่อง Host ได้ แต่เครื่องอื่นในวง LAN ภายนอกไม่สามารถเชื่อมต่อตรงเข้า VM ได้ง่าย', 'VM ไม่สามารถเชื่อมต่อเครือข่ายใดๆ ได้เลย', 'VM จะได้ IP จริงจาก ISP โดยตรง', 'เครื่อง Host จะใช้งานอินเทอร์เน็ตไม่ได้'],
          ans: 0,
          exp: 'โหมด NAT เหมาะสำหรับการให้ VM ออกอินเทอร์เน็ตได้อย่างปลอดภัยโดยอาศัย IP ของเครื่อง Host แปลงที่อยู่ให้'
        },
        {
          q: 'ในขั้นตอนการสร้างเครื่องจำลอง (VM) บน VirtualBox หากเครื่องจริงมี RAM 8 GB ควรจัดสรร RAM ให้ VM อย่างเหมาะสมอย่างไร?',
          options: ['จัดสรรประมาณ 2–4 GB (อยู่ในแถบสีเขียว) เพื่อเหลือ RAM ให้เครื่อง Host ทำงานได้เสถียร', 'จัดสรรให้เต็ม 8 GB 100% เพื่อให้ VM เร็วที่สุด', 'จัดสรร 16 GB เกินกว่าที่มีจริง', 'ไม่ต้องจัดสรร RAM ให้ VM'],
          ans: 0,
          exp: 'ควรแบ่ง RAM ให้ VM ไม่เกินครึ่งหนึ่งของเครื่อง Host (อยู่ในโซนสีเขียว) เพื่อไม่ให้เครื่องจริงค้างหรือทำงานช้า'
        }
      ]
    },

    /* ===================== UNIT 08 ===================== */
    {
      id: 8,
      code: 'UNIT 08',
      title: 'การออกแบบ ติดตั้ง ตรวจสอบ และแก้ปัญหาเครือข่าย',
      subtitle: 'แผนผังเครือข่าย, คำสั่ง CLI, Troubleshooting, ซอฟต์แวร์ช่วยงาน และ Remote',
      color: '#06b6d4',
      zoneName: 'ศูนย์ปฏิบัติการ NOC & CLI',
      boss: {
        name: 'Subnet Glitch Lich',
        thName: 'ลิชบั๊กเครือข่ายล่ม',
        sprite: 'subnet_lich',
        hp: 250,
        atk: 24,
        taunt: 'Request Timed Out! ถ้าเจ้าวิเคราะห์ CLI และรีโมตแก้ปัญหาไม่เป็น เครือข่ายจะล่มตลอดกาล!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#06b6d4" stroke-width="4"/>
          <rect x="24" y="24" width="320" height="192" fill="#020617" stroke="#22c55e" stroke-width="2"/>
          <text x="184" y="46" fill="#4ade80" font-size="12" font-weight="bold" text-anchor="middle">CLI DIAGNOSTIC COMMANDS</text>
          <text x="40" y="74" fill="#38bdf8" font-size="11" font-family="monospace">C:\&gt; ipconfig /all</text>
          <text x="52" y="90" fill="#cbd5e1" font-size="10">ดู IP, Subnet, Gateway, DNS, MAC</text>
          <text x="40" y="114" fill="#38bdf8" font-size="11" font-family="monospace">C:\&gt; ping 192.168.10.1</text>
          <text x="52" y="130" fill="#cbd5e1" font-size="10">ทดสอบการเชื่อมต่อ ICMP Echo</text>
          <text x="40" y="154" fill="#38bdf8" font-size="11" font-family="monospace">C:\&gt; tracert 8.8.8.8</text>
          <text x="52" y="170" fill="#cbd5e1" font-size="10">ตรวจเส้นทาง Router ทีละ Hop</text>
          <text x="40" y="194" fill="#38bdf8" font-size="11" font-family="monospace">C:\&gt; nslookup google.com</text>

          <rect x="360" y="24" width="256" height="90" fill="#111c36" stroke="#f59e0b" stroke-width="2"/>
          <text x="488" y="46" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">ซอฟต์แวร์ช่วยงานเครือข่าย</text>
          <text x="488" y="68" fill="#e2e8f0" font-size="11" text-anchor="middle">• Wireshark (จับ/วิเคราะห์แพ็กเก็ต)</text>
          <text x="488" y="86" fill="#e2e8f0" font-size="11" text-anchor="middle">• Advanced IP Scanner (สแกน IP)</text>
          <text x="488" y="104" fill="#e2e8f0" font-size="11" text-anchor="middle">• Packet Tracer (จำลองออกแบบ)</text>

          <rect x="360" y="126" width="256" height="90" fill="#111c36" stroke="#a855f7" stroke-width="2"/>
          <text x="488" y="148" fill="#c084fc" font-size="12" font-weight="bold" text-anchor="middle">ซอฟต์แวร์ควบคุมระยะไกล</text>
          <text x="488" y="170" fill="#e2e8f0" font-size="11" text-anchor="middle">• RDP (Port 3389 - Windows)</text>
          <text x="488" y="188" fill="#e2e8f0" font-size="11" text-anchor="middle">• AnyDesk / TeamViewer / VNC</text>
          <text x="488" y="206" fill="#e2e8f0" font-size="11" text-anchor="middle">• SSH / PuTTY (Port 22 - CLI)</text>
        </svg>
      `,
      svgDiagram2: `
        <svg viewBox="0 0 640 165" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="165" fill="#0b1224"/>
          <rect x="6" y="6" width="628" height="153" fill="none" stroke="#06b6d4" stroke-width="3"/>
          <text x="320" y="26" fill="#22d3ee" font-size="12" font-weight="bold" text-anchor="middle">Cisco 3-Layer Hierarchical Network Design Model</text>
          <rect x="190" y="36" width="260" height="34" fill="#7c3aed" stroke="#c084fc" stroke-width="2"/>
          <text x="320" y="57" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">1. Core Layer (ชั้นแกนหลักความเร็วสูง)</text>
          <rect x="115" y="78" width="410" height="34" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
          <text x="320" y="99" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">2. Distribution Layer (ชั้นกระจายสัญญาณ • Routing / VLAN / Policy)</text>
          <rect x="40" y="120" width="560" height="30" fill="#0d9488" stroke="#5eead4" stroke-width="2"/>
          <text x="320" y="139" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">3. Access Layer (ชั้นการเชื่อมต่ออุปกรณ์ปลายทาง • PC / Printer / Access Point)</text>
        </svg>
      `,
      codexCards: [
        {
          title: '1. การออกแบบเครือข่าย 3 ชั้น (Cisco) และเครื่องมือเขียนแผนผัง',
          bullets: [
            '<b>Cisco 3-Layer Model</b>: (1) <b>Core Layer (ชั้นแกนหลัก)</b> ส่งผ่านข้อมูลความเร็วสูงเสถียรสุด, (2) <b>Distribution Layer (ชั้นกระจายสัญญาณ)</b> จัดเส้นทาง Routing/VLAN/นโยบาย, (3) <b>Access Layer (ชั้นการเชื่อมต่อ)</b> ต่อเครื่องผู้ใช้ปลายทาง (PC/Printer/AP)',
            '<b>เครื่องมือเขียนแผนผังเครือข่าย</b>: <b>Microsoft Visio</b>, <b>Cisco Packet Tracer</b>, <b>draw.io (diagrams.net)</b>, <b>SmartDraw</b>, <b>Lucidchart</b>'
          ]
        },
        {
          title: '2. ตู้ Rack และการเดินสาย LAN',
          bullets: [
            '<b>ตู้ Rack แบ่งตามการติดตั้ง</b>: แบบตั้งพื้น (<b>Floor/Close Rack</b>), แบบติดผนัง (<b>Wall Rack</b>) และแบบโครงเปิด (<b>Open Rack</b>)',
            '<b>ตู้ Rack แบ่งตามขนาด</b>: หน้ากว้างมาตรฐาน <b>19 นิ้ว</b> แบ่งความสูงเป็นหน่วย <b>U</b> (เช่น 6U, 9U, 15U, 27U, 42U) และความลึก (60/80/100 ซม.)',
            '<b>วิธีเดินสาย LAN</b>: เดินในรางเก็บสาย (Wireway), เดินในท่อร้อยสาย (PVC/EMT), เดินบนฝ้าเพดาน หรือเดินใต้พื้นยก (Raised Floor) พร้อมติดป้ายกำกับสาย'
          ]
        },
        {
          title: '3. คำสั่ง CLI ตรวจสอบเครือข่าย (5 คำสั่ง) และปัญหาที่พบบ่อย',
          bullets: [
            '<b>5 คำสั่งสำคัญ</b>: <code>ping</code> (ตรวจสอบการเชื่อมต่อ), <code>netstat</code> (ค้นหาจุดบกพร่อง/แสดงสถิติและพอร์ต), <code>ipconfig</code> (แสดงชื่อเครื่องและ IP), <code>tracert</code> (ตรวจสอบเส้นทางแต่ละ Hop), <code>nslookup</code> (ตรวจสอบระบบ Domain Name / DNS)',
            '<b>ปัญหาสาย UTP</b>: สายขาดใน/หักงอ, เข้าหัว RJ-45 หลวม/เรียงสีผิด, เดินสายยาวเกิน 100 ม. หรือใกล้แหล่ง EMI | <b>ปัญหา Switch Hub</b>: พอร์ตเสีย, อะแดปเตอร์/ไฟดับ, เครื่องร้อนค้าง (Hang), เกิด <b>Network Loop</b> (Broadcast Storm)'
          ]
        },
        {
          title: '4. ซอฟต์แวร์ช่วยงานเครือข่าย (Utility 4 กลุ่ม)',
          bullets: [
            '<b>1) ตรวจสอบการทำงานเครือข่าย</b>: Wireshark, Advanced IP Scanner, Nmap, PRTG Network Monitor',
            '<b>2) โอนย้ายไฟล์ข้อมูลในเครือข่าย</b>: FileZilla, WinSCP, CuteFTP',
            '<b>3) ควบคุมเครือข่ายระยะไกล</b>: TeamViewer, AnyDesk, Windows Remote Desktop (RDP - Port 3389), VNC, PuTTY (SSH)',
            '<b>4) ดูแลความปลอดภัยเครือข่าย</b>: Windows Defender Firewall, ESET, Kaspersky, Bitdefender, Snort (IDS/IPS)'
          ]
        }
      ],
      quiz: [
        {
          q: 'เมื่อพิมพ์คำสั่ง ipconfig แล้วพบว่าเครื่องได้รับ IP 169.254.12.45 (APIPA) แสดงว่าเกิดปัญหาใด?',
          options: ['อินเทอร์เน็ตเร็วขึ้นเป็นพิเศษ', 'เครื่องไม่สามารถติดต่อขอรับ IP จาก DHCP Server ได้', 'การ์ดจอเสีย', 'DNS ทำงานสมบูรณ์'],
          ans: 1,
          exp: 'หมายเลข 169.254.x.x (APIPA) เกิดขึ้นเมื่อ Windows ตั้งรับ IP อัตโนมัติแต่ไม่สามารถติดต่อ DHCP Server ได้'
        },
        {
          q: 'หาก ping 8.8.8.8 ได้รับการตอบกลับปกติ แต่เปิดเว็บไซต์ www.google.com ไม่ได้ ควรตรวจสอบส่วนใดเป็นอันดับแรก?',
          options: ['สายไฟปลั๊กคอมพิวเตอร์', 'การตั้งค่า DNS Server', 'ความสว่างหน้าจอ', 'หัวต่อเครื่องพิมพ์'],
          ans: 1,
          exp: 'ping ด้วยหมายเลข IP ผ่านแต่เข้าชื่อเว็บไม่ได้ เป็นอาการคลาสสิกของการตั้งค่า DNS Server ผิดพลาด'
        },
        {
          q: 'คำสั่งใดใช้ตรวจสอบเส้นทางการส่งแพ็กเก็ตผ่าน Router แต่ละจุด (Hop) ไปจนถึงปลายทาง?',
          options: ['tracert (หรือ traceroute)', 'cls', 'mkdir', 'calc'],
          ans: 0,
          exp: 'คำสั่ง tracert แสดงรายชื่อ Router และระยะเวลาของทุก Hop เพื่อหาจุดที่สัญญาณขาดหาย'
        },
        {
          q: 'ซอฟต์แวร์ใดนิยมใช้สำหรับจับและวิเคราะห์แพ็กเก็ตข้อมูล (Packet Sniffer) ที่วิ่งผ่านเครือข่าย?',
          options: ['Wireshark', 'Microsoft Excel', 'Adobe Photoshop', 'Notepad++'],
          ans: 0,
          exp: 'Wireshark เป็นเครื่องมือวิเคราะห์แพ็กเก็ตเครือข่ายมาตรฐานที่ช่วยให้เห็นโปรโตคอลและทราฟฟิกเชิงลึก'
        },
        {
          q: 'โปรโตคอล Remote Desktop (RDP) ที่ติดตั้งมากับระบบปฏิบัติการ Windows ใช้หมายเลขพอร์ตมาตรฐานใด?',
          options: ['Port 21', 'Port 80', 'Port 3389', 'Port 53'],
          ans: 2,
          exp: 'Windows Remote Desktop Protocol (RDP) ทำงานบน TCP/UDP Port 3389'
        },
        {
          q: 'ในขั้นตอนการออกแบบและติดตั้งเครือข่าย การติดป้ายกำกับสายสัญญาณ (Cable Labeling) มีประโยชน์หลักอย่างไร?',
          options: ['ทำให้ความเร็วเน็ตเพิ่มขึ้น 10 เท่า', 'ช่วยให้ตรวจสอบ ไล่สาย และแก้ปัญหาในอนาคตได้รวดเร็วแม่นยำ', 'ป้องกันไวรัสคอมพิวเตอร์', 'ไม่ต้องใช้ Switch'],
          ans: 1,
          exp: 'การติดป้ายกำกับปลายสายทั้งสองฝั่งช่วยลดเวลาไล่สายและลดความผิดพลาดเมื่อต้องซ่อมบำรุง'
        },
        {
          q: 'ในแนวทางการออกแบบเครือข่ายแบบ 3 ชั้นของ Cisco (Hierarchical Model) ชั้นใดทำหน้าที่รับส่งข้อมูลความเร็วสูงมากที่เป็นกระดูกสันหลัง (Backbone) ขององค์กร?',
          options: ['Core Layer (ชั้นแกนหลัก)', 'Distribution Layer (ชั้นกระจายสัญญาณ)', 'Access Layer (ชั้นการเชื่อมต่อผู้ใช้)', 'Physical Layer'],
          ans: 0,
          exp: 'Core Layer เป็นกระดูกสันหลังความเร็วสูง เชื่อมต่อระหว่างอาคาร/โซนหลักด้วยความเสถียรสูงสุด (Access เชื่อมเครื่องผู้ใช้, Distribution กรองนโยบายและ Routing)'
        },
        {
          q: 'คำสั่ง Command Prompt ใดใช้ตรวจสอบระบบชื่อโดเมน (Domain Name System) เพื่อดูว่าชื่อเว็บไซต์แปลงเป็นหมายเลข IP ใด?',
          options: ['nslookup', 'chkdsk', 'mkdir', 'format'],
          ans: 0,
          exp: 'คำสั่ง nslookup (Name Server Lookup) ใช้ทดสอบและสืบค้นการแปลงชื่อโดเมนกับ DNS Server โดยตรง'
        },
        {
          q: 'คำสั่งใดใช้ตรวจสอบการเชื่อมต่อและวัดเวลาตอบกลับ (Latency) จากเครื่องปลายทางโดยส่งแพ็กเก็ต ICMP Echo Request?',
          options: ['ping', 'ipconfig', 'net user', 'calc'],
          ans: 0,
          exp: 'คำสั่ง ping ส่งแพ็กเก็ต ICMP เพื่อทดสอบว่าปลายทางตอบกลับหรือไม่ พร้อมแสดงค่าเวลา (ms) และ Packet Loss'
        },
        {
          q: 'ตู้ Rack มาตรฐานที่ติดตั้งอุปกรณ์เครือข่าย (Switch, Patch Panel, UPS) นิยมระบุขนาดความสูงของช่องติดตั้งด้วยหน่วยใด?',
          options: ['U (Rack Unit) เช่น 6U, 9U, 15U, 42U', 'GB (Gigabyte)', 'MHz (Megahertz)', 'dBm'],
          ans: 0,
          exp: 'ขนาดความสูงของตู้ Rack และอุปกรณ์ติดตั้งแร็กระบุเป็นหน่วย U โดย 1U เท่ากับ 1.75 นิ้ว (44.45 มม.)'
        }
      ]
    },

    /* ===================== UNIT 09 ===================== */
    {
      id: 9,
      code: 'UNIT 09',
      title: 'ความปลอดภัยในระบบเครือข่าย',
      subtitle: 'ภัยคุกคาม, การป้องกัน, มาตรการ, Antivirus, Firewall และ Windows Firewall',
      color: '#ef4444',
      zoneName: 'ป้อมปราการไซเบอร์',
      boss: {
        name: 'Ransomware Overlord',
        thName: 'จอมมารมัลแวร์เรียกค่าไถ่',
        sprite: 'ransom_overlord',
        hp: 260,
        atk: 25,
        taunt: 'ปิด Windows Firewall เมื่อไหร่ กองทัพมัลแวร์และพอร์ตเถื่อนจะยึดระบบเจ้าทันที!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#ef4444" stroke-width="4"/>
          <rect x="24" y="24" width="220" height="192" fill="#111c36" stroke="#f59e0b" stroke-width="2"/>
          <text x="134" y="46" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">CIA TRIAD &amp; DEFENSE</text>
          <text x="134" y="76" fill="#38bdf8" font-size="11" text-anchor="middle">🔒 Confidentiality (ความลับ)</text>
          <text x="134" y="102" fill="#4ade80" font-size="11" text-anchor="middle">✅ Integrity (ความถูกต้อง)</text>
          <text x="134" y="128" fill="#facc15" font-size="11" text-anchor="middle">⚡ Availability (พร้อมใช้งาน)</text>
          <text x="134" y="160" fill="#e2e8f0" font-size="10" text-anchor="middle">Antivirus + 2FA + Patch Update</text>
          <text x="134" y="180" fill="#e2e8f0" font-size="10" text-anchor="middle">Offline Backup (3-2-1 Rule)</text>
          <text x="134" y="200" fill="#fb7185" font-size="10" text-anchor="middle">สกัด Virus / Phishing / Ransomware</text>

          <rect x="260" y="24" width="356" height="192" fill="#111c36" stroke="#ef4444" stroke-width="2"/>
          <text x="438" y="46" fill="#fca5a5" font-size="12" font-weight="bold" text-anchor="middle">WINDOWS DEFENDER FIREWALL</text>
          <rect x="278" y="64" width="96" height="44" fill="#1e293b" stroke="#22c55e"/><text x="326" y="90" fill="#4ade80" font-size="11" text-anchor="middle">HTTPS :443</text>
          <rect x="278" y="118" width="96" height="44" fill="#1e293b" stroke="#ef4444"/><text x="326" y="144" fill="#fca5a5" font-size="11" text-anchor="middle">Telnet :23</text>
          <rect x="278" y="168" width="96" height="36" fill="#1e293b" stroke="#ef4444"/><text x="326" y="190" fill="#fca5a5" font-size="11" text-anchor="middle">SMB :445</text>

          <rect x="404" y="64" width="76" height="140" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/>
          <text x="442" y="128" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">FIREWALL</text>
          <text x="442" y="146" fill="#fde047" font-size="10" text-anchor="middle">Inbound/</text>
          <text x="442" y="162" fill="#fde047" font-size="10" text-anchor="middle">Outbound</text>

          <text x="546" y="90" fill="#4ade80" font-size="11" font-weight="bold" text-anchor="middle">✔ ALLOW</text>
          <text x="546" y="144" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">✖ BLOCK</text>
          <text x="546" y="190" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">✖ BLOCK</text>
        </svg>
      `,
      svgDiagram2: `
        <svg viewBox="0 0 640 160" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="160" fill="#0b1224"/>
          <rect x="6" y="6" width="628" height="148" fill="none" stroke="#f59e0b" stroke-width="3"/>
          <text x="320" y="26" fill="#facc15" font-size="12" font-weight="bold" text-anchor="middle">ประเภทของ Firewall (ตามการทำงาน &amp; การติดตั้ง)</text>
          <rect x="20" y="38" width="190" height="50" fill="#111c36" stroke="#38bdf8"/><text x="115" y="58" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">1. Packet Filtering</text><text x="115" y="76" fill="#cbd5e1" font-size="9" text-anchor="middle">ตรวจสอบและกลั่นกรองแพ็กเกต</text>
          <rect x="225" y="38" width="190" height="50" fill="#111c36" stroke="#a855f7"/><text x="320" y="58" fill="#c084fc" font-size="11" font-weight="bold" text-anchor="middle">2. Application Gateway</text><text x="320" y="76" fill="#cbd5e1" font-size="9" text-anchor="middle">คุมแอปพลิเคชันติดต่อภายนอก (Proxy)</text>
          <rect x="430" y="38" width="190" height="50" fill="#111c36" stroke="#10b981"/><text x="525" y="58" fill="#4ade80" font-size="11" font-weight="bold" text-anchor="middle">3. Stateful Inspection</text><text x="525" y="76" fill="#cbd5e1" font-size="9" text-anchor="middle">บันทึกสถานะและรายละเอียดเข้า-ออก</text>
          <rect x="20" y="98" width="290" height="44" fill="#1e293b" stroke="#ef4444"/><text x="165" y="116" fill="#fca5a5" font-size="11" font-weight="bold" text-anchor="middle">🏢 Network Firewall</text><text x="165" y="132" fill="#e2e8f0" font-size="9" text-anchor="middle">ป้องกันทั้งวง LAN • ติดตั้งที่ Gateway/Router ขอบเครือข่าย</text>
          <rect x="330" y="98" width="290" height="44" fill="#1e293b" stroke="#22c55e"/><text x="475" y="116" fill="#4ade80" font-size="11" font-weight="bold" text-anchor="middle">💻 Personal Firewall</text><text x="475" y="132" fill="#e2e8f0" font-size="9" text-anchor="middle">ซอฟต์แวร์ป้องกันเฉพาะเครื่อง • ติดตั้งบน PC แต่ละเครื่อง</text>
        </svg>
      `,
      codexCards: [
        {
          title: '1. ภัยคุกคาม 3 ลักษณะ และมัลแวร์สำคัญ (Virus / Trojan / Spyware)',
          bullets: [
            '<b>ภัยคุกคาม 3 ลักษณะ</b>: (1) ภัยจากมนุษย์/ผู้บุกรุก (แฮกเกอร์, Phishing, ความประมาท), (2) ภัยจากซอฟต์แวร์/มัลแวร์ (Virus, Worm, Trojan, Ransomware, DDoS), (3) ภัยทางกายภาพและธรรมชาติ (ไฟดับ/น้ำท่วม/ไฟไหม้/ฮาร์ดแวร์เสีย)',
            '<b>ไวรัสคอมพิวเตอร์</b>: แฝงเข้ากับไฟล์อื่น คัดลอกตัวเองแพร่กระจายเมื่อเปิดไฟล์และทำลายข้อมูล | <b>โทรจัน (Trojan)</b>: ปลอมเป็นโปรแกรมปกติหลอกให้ติดตั้งแล้วเปิด Backdoor ควบคุมเครื่อง | <b>สปายแวร์ (Spyware)</b>: แอบดักจับพฤติกรรมและขโมยรหัสผ่าน/ข้อมูลส่วนตัว'
          ]
        },
        {
          title: '2. วิธีป้องกันซอฟต์แวร์-ข้อมูล และหน้าที่ Anti-Virus / Firewall / Anti-Spyware',
          bullets: [
            '<b>วิธีป้องกันด้านซอฟต์แวร์และข้อมูล</b>: (1) ติดตั้ง Antivirus & อัปเดต Patch สม่ำเสมอ, (2) สำรองข้อมูล (Offline/Cloud Backup 3-2-1), (3) ตั้งรหัสผ่านแข็งแรง + เปิด 2FA และไม่คลิกลิงก์/โปรแกรมเถื่อน',
            '<b>หน้าที่ 3 โปรแกรม</b>: <b>Anti-Virus</b> (สแกน ตรวจจับ กักกัน Quarantine และกำจัดไวรัส), <b>Firewall</b> (คัดกรองทราฟฟิกขาเข้า-ขาออกตาม IP/Port), <b>Anti-Spyware</b> (ตรวจจับและลบสปายแวร์ที่แอบดักข้อมูล)',
            '<b>ซอฟต์แวร์ป้องกันไวรัสยอดนิยม</b>: Microsoft Windows Defender, ESET NOD32, Kaspersky, Bitdefender, Norton, Avast'
          ]
        },
        {
          title: '3. ประเภทของ Firewall ตามการทำงาน (3 ประเภท)',
          bullets: [
            '<b>1) Packet Filtering Firewall</b>: ตรวจสอบและกลั่นกรองแพ็กเกตตาม IP ต้นทาง-ปลายทาง และหมายเลข Port',
            '<b>2) Application-Level Gateway (Proxy Firewall)</b>: ควบคุมการเข้าถึงระดับแอปพลิเคชันที่จะติดต่อกับภายนอก',
            '<b>3) Stateful Inspection Firewall</b>: มีการบันทึกข้อมูลสถานะและรายละเอียดการเชื่อมต่อขาเข้า-ขาออกเพื่อตรวจสอบความถูกต้อง'
          ]
        },
        {
          title: '4. Network Firewall vs Personal Firewall และ Windows Firewall',
          bullets: [
            '<b>Network Firewall</b>: ป้องกันทั้งวงเครือข่าย (มักเป็นฮาร์ดแวร์/Router เฉพาะทาง) ติดตั้งไว้ที่จุดเชื่อมต่อขอบเครือข่าย (<b>Gateway</b>) ระหว่าง LAN กับอินเทอร์เน็ต',
            '<b>Personal Firewall</b>: ซอฟต์แวร์ป้องกันเฉพาะเครื่อง (เช่น <b>Windows Defender Firewall</b> ตั้งกฎละเอียดได้ที่ <code>wf.msc</code> แบ่ง 3 โปรไฟล์ Domain/Private/Public) ติดตั้งไว้บนเครื่องคอมพิวเตอร์แต่ละเครื่อง'
          ]
        }
      ],
      quiz: [
        {
          q: 'มัลแวร์ประเภทใดที่เข้ารหัสไฟล์สำคัญบนเครื่องเหยื่อแล้วบังคับให้จ่ายเงินเพื่อแลกกุญแจปลดล็อก?',
          options: ['Adware', 'Ransomware', 'Cookies', 'Firmware'],
          ans: 1,
          exp: 'Ransomware คือมัลแวร์เรียกค่าไถ่ การป้องกันและรับมือที่ดีที่สุดคือการสำรองข้อมูล (Offline Backup) สม่ำเสมอ'
        },
        {
          q: 'การโจมตีแบบ DDoS (Distributed Denial of Service) ส่งผลกระทบโดยตรงต่อหลัก CIA Triad ข้อใด?',
          options: ['Confidentiality (ความลับ)', 'Integrity (ความถูกต้อง)', 'Availability (ความพร้อมใช้งาน)', 'Authentication'],
          ans: 2,
          exp: 'DDoS ถล่มส่งคำขอจำนวนมหาศาลจนเซิร์ฟเวอร์ล่ม ทำให้ผู้ใช้จริงไม่สามารถใช้งานได้ (กระทบ Availability)'
        },
        {
          q: 'ในโปรแกรม Antivirus การนำไฟล์ต้องสงสัยไปเก็บแยกไว้ในพื้นที่ปลอดภัยเพื่อไม่ให้แพร่กระจาย เรียกว่าอะไร?',
          options: ['Quarantine (การกักกัน)', 'Overclock', 'Defragment', 'Sharing'],
          ans: 0,
          exp: 'Quarantine จะแยกและปิดการทำงานของไฟล์ต้องสงสัยไว้ชั่วคราวเพื่อให้ตรวจสอบหรือลบอย่างปลอดภัย'
        },
        {
          q: 'คำสั่งใดใน Windows ใช้เปิดหน้าต่าง Windows Defender Firewall with Advanced Security เพื่อตั้งค่า Inbound/Outbound Rules?',
          options: ['wf.msc', 'calc.exe', 'mspaint.exe', 'winver'],
          ans: 0,
          exp: 'wf.msc เปิดหน้าต่าง Windows Firewall with Advanced Security สำหรับสร้างกฎควบคุม Port และโปรแกรมอย่างละเอียด'
        },
        {
          q: 'กฎ Firewall ใดเหมาะสมที่สุดสำหรับการรักษาความปลอดภัยเครื่องในเครือข่ายสาธารณะ?',
          options: ['เปิด Allow ทุกพอร์ตขาเข้า (Inbound All)', 'บล็อกพอร์ตเสี่ยง เช่น Telnet (23) และเปิดเฉพาะพอร์ตที่จำเป็น เช่น HTTPS (443)', 'ปิด Firewall ตลอดเวลา', 'ปิด Antivirus ก่อนเปิดเว็บ'],
          ans: 1,
          exp: 'หลักความปลอดภัยคือเปิดเฉพาะบริการที่จำเป็นและบล็อกพอร์ตที่ไม่ปลอดภัยหรือไม่ใช้งาน'
        },
        {
          q: 'หากได้รับอีเมลปลอมหลอกให้คลิกลิงก์เพื่อกรอกรหัสผ่านธนาคาร จัดเป็นภัยคุกคามรูปแบบใด?',
          options: ['Phishing', 'Packet Switching', 'DHCP Snooping', 'Virtualization'],
          ans: 0,
          exp: 'Phishing คือการหลอกลวงทางจิตวิทยาให้เหยื่อกรอกข้อมูลสำคัญหรือรหัสผ่านบนหน้าเว็บ/อีเมลปลอม'
        },
        {
          q: 'มัลแวร์ประเภทใดที่ปลอมตัวเป็นโปรแกรมปกติหรือเกมฟรีเพื่อให้ผู้ใช้หลงกลติดตั้ง แล้วแอบเปิดช่องทาง (Backdoor) ให้ผู้โจมตีควบคุมเครื่อง?',
          options: ['โทรจัน (Trojan Horse)', 'ไฟร์วอลล์ (Firewall)', 'ซับเน็ตมาสก์ (Subnet Mask)', 'แคช (Cache)'],
          ans: 0,
          exp: 'Trojan Horse แฝงตัวมากับโปรแกรมที่ดูเหมือนปลอดภัยเพื่อหลอกให้ผู้ใช้ติดตั้งเอง ไม่ได้แพร่กระจายตัวเองเหมือน Worm'
        },
        {
          q: 'มัลแวร์ประเภทสปายแวร์ (Spyware) มีพฤติกรรมหลักอย่างไร?',
          options: ['แอบดักจับพฤติกรรมการใช้งาน การพิมพ์รหัสผ่าน (Keylogger) หรือข้อมูลส่วนตัวส่งกลับให้ผู้ไม่หวังดี', 'ช่วยเพิ่มความเร็วอินเทอร์เน็ตให้เครื่อง', 'ทำความสะอาดไฟล์ขยะในฮาร์ดดิสก์', 'สำรองข้อมูลขึ้นระบบคลาวด์อัตโนมัติ'],
          ans: 0,
          exp: 'Spyware แอบฝังตัวเพื่อสอดแนมและขโมยข้อมูลสำคัญ เช่น รหัสผ่าน บัญชีธนาคาร หรือประวัติการใช้งาน'
        },
        {
          q: 'ความแตกต่างระหว่าง Network Firewall กับ Personal Firewall คือข้อใด?',
          options: ['Network Firewall ติดตั้งที่ขอบเครือข่ายเพื่อป้องกันทั้งองค์กร ส่วน Personal Firewall ติดตั้งบนเครื่องคอมพิวเตอร์แต่ละเครื่อง', 'Personal Firewall ใช้ได้เฉพาะกับเครื่องเซิร์ฟเวอร์ขนาดใหญ่เท่านั้น', 'Network Firewall ป้องกันได้แค่เครื่องเดียว', 'ทั้งสองแบบไม่สามารถกรองแพ็กเก็ตได้'],
          ans: 0,
          exp: 'Network Firewall (Hardware/Gateway) ปกป้องทั้งเครือข่ายที่จุดเชื่อมต่ออินเทอร์เน็ต ส่วน Personal Firewall (เช่น Windows Defender Firewall) ปกป้องเฉพาะเครื่องนั้น'
        },
        {
          q: 'หลักความปลอดภัยด้านสารสนเทศ CIA Triad ข้อ "Confidentiality" (การรักษาความลับ) หมายถึงข้อใด?',
          options: ['ข้อมูลต้องเปิดให้ทุกคนเข้าถึงได้โดยไม่ต้องใช้รหัสผ่าน', 'ข้อมูลต้องถูกปกป้องให้เฉพาะผู้ที่มีสิทธิ์เท่านั้นจึงจะเปิดอ่านหรือเข้าถึงได้', 'ระบบต้องเปิดใช้งานได้ตลอด 24 ชั่วโมง', 'ข้อมูลต้องถูกบีบอัดให้มีขนาดเล็กที่สุด'],
          ans: 1,
          exp: 'CIA Triad ประกอบด้วย Confidentiality (ความลับ), Integrity (ความถูกต้องสมบูรณ์ของข้อมูล) และ Availability (ความพร้อมใช้งาน)'
        }
      ]
    },

    /* ===================== UNIT 10 ===================== */
    {
      id: 10,
      code: 'UNIT 10',
      title: 'การสร้างบัญชีผู้ใช้และการใช้งาน',
      subtitle: 'ประโยชน์, สร้างบัญชีผู้ใช้, สร้างกลุ่มผู้ใช้, กำหนดสิทธิ์ และใช้งานใน Windows',
      color: '#eab308',
      zoneName: 'หอคอยสิทธิ์และบัญชีผู้ใช้',
      boss: {
        name: 'Access Sovereign',
        thName: 'จักรพรรดิควบคุมสิทธิ์',
        sprite: 'access_sovereign',
        hp: 270,
        atk: 26,
        taunt: 'ให้สิทธิ์ Administrator กับทุกคนเมื่อไหร่ ระบบจะถูกทำลายจากภายในทันที!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#eab308" stroke-width="4"/>
          <rect x="24" y="24" width="184" height="192" fill="#111c36" stroke="#38bdf8" stroke-width="2"/>
          <text x="116" y="46" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">1. USER ACCOUNTS</text>
          <text x="116" y="76" fill="#facc15" font-size="11" text-anchor="middle">👑 Administrator</text>
          <text x="116" y="94" fill="#cbd5e1" font-size="10" text-anchor="middle">ควบคุมระบบทั้งหมด</text>
          <text x="116" y="126" fill="#4ade80" font-size="11" text-anchor="middle">👤 Standard User</text>
          <text x="116" y="144" fill="#cbd5e1" font-size="10" text-anchor="middle">ใช้งานทั่วไป ปลอดภัยกว่า</text>
          <text x="116" y="176" fill="#94a3b8" font-size="11" text-anchor="middle">🚪 Guest Account</text>
          <text x="116" y="194" fill="#cbd5e1" font-size="10" text-anchor="middle">ใช้ชั่วคราว (ควรปิดไว้)</text>

          <rect x="228" y="24" width="184" height="192" fill="#111c36" stroke="#a855f7" stroke-width="2"/>
          <text x="320" y="46" fill="#c084fc" font-size="12" font-weight="bold" text-anchor="middle">2. USER GROUPS</text>
          <rect x="246" y="64" width="148" height="44" fill="#1e293b" stroke="#facc15"/>
          <text x="320" y="82" fill="#facc15" font-size="11" font-weight="bold" text-anchor="middle">Group: Teachers</text>
          <text x="320" y="98" fill="#cbd5e1" font-size="10" text-anchor="middle">teacher01, teacher02</text>
          <rect x="246" y="120" width="148" height="44" fill="#1e293b" stroke="#38bdf8"/>
          <text x="320" y="138" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">Group: Students</text>
          <text x="320" y="154" fill="#cbd5e1" font-size="10" text-anchor="middle">student01, student02</text>
          <text x="320" y="192" fill="#94a3b8" font-size="10" text-anchor="middle">จัดการสิทธิ์เป็นกลุ่ม สะดวก/แม่นยำ</text>

          <rect x="432" y="24" width="184" height="192" fill="#111c36" stroke="#10b981" stroke-width="2"/>
          <text x="524" y="46" fill="#4ade80" font-size="12" font-weight="bold" text-anchor="middle">3. NTFS PERMISSIONS</text>
          <text x="524" y="76" fill="#facc15" font-size="11" text-anchor="middle">Full Control (ควบคุมหมด)</text>
          <text x="524" y="100" fill="#38bdf8" font-size="11" text-anchor="middle">Modify (แก้ไข/ลบได้)</text>
          <text x="524" y="124" fill="#4ade80" font-size="11" text-anchor="middle">Read &amp; Execute (อ่าน/รัน)</text>
          <text x="524" y="148" fill="#e2e8f0" font-size="11" text-anchor="middle">Write (สร้าง/เขียนเพิ่ม)</text>
          <text x="524" y="182" fill="#fb7185" font-size="11" font-weight="bold" text-anchor="middle">⚠️ กฎเหล็ก: DENY ชนะ ALLOW</text>
          <text x="524" y="200" fill="#94a3b8" font-size="10" text-anchor="middle">ยึดหลัก Least Privilege</text>
        </svg>
      `,
      svgDiagram2: `
        <svg viewBox="0 0 640 165" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="165" fill="#0b1224"/>
          <rect x="6" y="6" width="628" height="153" fill="none" stroke="#eab308" stroke-width="3"/>
          <text x="320" y="26" fill="#facc15" font-size="12" font-weight="bold" text-anchor="middle">ตารางสรุปสิทธิ์ NTFS Permissions ทั้ง 6 ระดับ</text>
          <rect x="18" y="38" width="194" height="50" fill="#111c36" stroke="#facc15"/><text x="115" y="56" fill="#facc15" font-size="11" font-weight="bold" text-anchor="middle">1. Full Control</text><text x="115" y="74" fill="#cbd5e1" font-size="9" text-anchor="middle">คุมทั้งหมด + เปลี่ยนสิทธิ์/เจ้าของได้</text>
          <rect x="223" y="38" width="194" height="50" fill="#111c36" stroke="#38bdf8"/><text x="320" y="56" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">2. Modify</text><text x="320" y="74" fill="#cbd5e1" font-size="9" text-anchor="middle">อ่าน เขียน แก้ไข และลบไฟล์ได้</text>
          <rect x="428" y="38" width="194" height="50" fill="#111c36" stroke="#4ade80"/><text x="525" y="56" fill="#4ade80" font-size="11" font-weight="bold" text-anchor="middle">3. Read &amp; Execute</text><text x="525" y="74" fill="#cbd5e1" font-size="9" text-anchor="middle">อ่านไฟล์และสั่งรันโปรแกรมได้</text>
          <rect x="18" y="98" width="194" height="48" fill="#111c36" stroke="#a855f7"/><text x="115" y="116" fill="#c084fc" font-size="11" font-weight="bold" text-anchor="middle">4. List Folder Contents</text><text x="115" y="134" fill="#cbd5e1" font-size="9" text-anchor="middle">ดูรายชื่อไฟล์/โฟลเดอร์ย่อยข้างใน</text>
          <rect x="223" y="98" width="194" height="48" fill="#111c36" stroke="#10b981"/><text x="320" y="116" fill="#6ee7b7" font-size="11" font-weight="bold" text-anchor="middle">5. Read</text><text x="320" y="134" fill="#cbd5e1" font-size="9" text-anchor="middle">เปิดอ่านและคัดลอกเท่านั้น</text>
          <rect x="428" y="98" width="194" height="48" fill="#111c36" stroke="#f97316"/><text x="525" y="116" fill="#fdba74" font-size="11" font-weight="bold" text-anchor="middle">6. Write</text><text x="525" y="134" fill="#cbd5e1" font-size="9" text-anchor="middle">สร้างไฟล์/โฟลเดอร์และเขียนเพิ่มได้</text>
        </svg>
      `,
      codexCards: [
        {
          title: '1. ประโยชน์ของการสร้างบัญชีผู้ใช้ และข้อดีของกลุ่มผู้ใช้',
          bullets: [
            '<b>ประโยชน์ของบัญชีผู้ใช้ (3 ข้อ)</b>: (1) ยืนยันตัวตน (Authentication) ป้องกันผู้ไม่มีสิทธิ์เข้าถึง, (2) แยกพื้นที่ไฟล์และการตั้งค่าส่วนตัว (User Profile), (3) กำหนดขอบเขตสิทธิ์ (Authorization) และตรวจสอบย้อนหลังได้ (Auditing)',
            '<b>ข้อดีของการสร้างกลุ่มผู้ใช้ (User Groups)</b>: กำหนดและปรับเปลี่ยนสิทธิ์ให้ผู้ใช้หลายคนพร้อมกันในครั้งเดียว (เช่น กลุ่ม Teachers / Students) สะดวก เป็นระเบียบ และลดความผิดพลาด'
          ]
        },
        {
          title: '2. รายละเอียดและตัวเลือก 4 แบบในการสร้างบัญชีผู้ใช้ (lusrmgr.msc)',
          bullets: [
            '<b>ข้อมูลสำคัญ 4 ช่อง</b>: <b>User name</b> (ชื่อล็อกอินห้ามซ้ำ), <b>Full Name</b> (ชื่อ-นามสกุลจริงที่แสดงผล), <b>Description</b> (คำอธิบายตำแหน่ง/ห้อง), <b>Password</b> (รหัสผ่านยืนยันตัวตน)',
            '<b>ตัวเลือกบัญชี 4 แบบ</b>: (1) <b>User must change password at next logon</b> = บังคับเปลี่ยนรหัสผ่านเมื่อล็อกอินครั้งถัดไป, (2) <b>User cannot change password</b> = ห้ามผู้ใช้เปลี่ยนรหัสผ่านเอง, (3) <b>Password never expires</b> = รหัสผ่านไม่มีวันหมดอายุ, (4) <b>Account is disabled</b> = ปิด/ระงับบัญชีชั่วคราวโดยไม่ลบข้อมูล'
          ]
        },
        {
          title: '3. ขั้นตอนการแชร์โฟลเดอร์ในเครือข่ายและการใช้งานตามบัญชี',
          bullets: [
            '<b>4 ขั้นตอนแชร์โฟลเดอร์</b>: (1) คลิกขวาโฟลเดอร์ → Properties → แท็บ <b>Sharing</b> → (2) คลิก <b>Advanced Sharing</b> ติ๊ก <b>Share this folder</b> → (3) คลิก <b>Permissions</b> เพิ่มบัญชี/กลุ่มผู้ใช้และกำหนดสิทธิ์ → (4) ตรวจ/กำหนดสิทธิ์ในแท็บ <b>Security (NTFS)</b> ให้สอดคล้องกัน กด OK แล้วทดสอบเข้าใช้งานผ่าน <code>\\\\ชื่อเครื่อง\\ชื่อแชร์</code>',
            '<b>หลักสิทธิ์น้อยที่สุด (Least Privilege)</b>: ให้นักเรียนใช้ <b>Standard User</b> แทน Administrator และจำกฎเหล็กว่า <b>Explicit Deny ชนะ Allow เสมอ</b> และเมื่อใช้ Share + NTFS ร่วมกันจะยึดสิทธิ์ที่<b>เข้มงวดกว่า</b>'
          ]
        },
        {
          title: '4. รายละเอียดการกำหนดสิทธิ์ NTFS Permissions ทั้ง 6 ระดับ',
          bullets: [
            '<b>1) Full Control</b>: ควบคุมสูงสุด อ่าน/เขียน/แก้ไข/ลบ/รัน และเปลี่ยนสิทธิ์หรือความเป็นเจ้าของได้ | <b>2) Modify</b>: อ่าน เขียน แก้ไข สร้าง และลบไฟล์ได้ (แต่เปลี่ยนสิทธิ์ไม่ได้)',
            '<b>3) Read & Execute</b>: เปิดอ่านและสั่งรันโปรแกรมได้ | <b>4) List Folder Contents</b>: ดูรายชื่อไฟล์และโฟลเดอร์ย่อยภายในโฟลเดอร์ได้',
            '<b>5) Read</b>: เปิดอ่านและคัดลอกออกไปได้เท่านั้น | <b>6) Write</b>: สร้างไฟล์/โฟลเดอร์ใหม่และเขียนข้อมูลเพิ่มได้'
          ]
        }
      ],
      quiz: [
        {
          q: 'เครื่องมือใดใน Windows (รุ่น Pro/Server) ที่ใช้จัดการบัญชีผู้ใช้และกลุ่มผู้ใช้ (Local Users and Groups) โดยตรงผ่านหน้าต่าง Run?',
          options: ['lusrmgr.msc', 'mspaint', 'calc', 'charmap'],
          ans: 0,
          exp: 'คำสั่ง lusrmgr.msc เปิดหน้าต่าง Local Users and Groups เพื่อสร้าง User และจัดกลุ่ม Group ได้โดยตรง'
        },
        {
          q: 'หลักการให้สิทธิ์เฉพาะเท่าที่จำเป็นต่อการทำงาน (เช่น ให้นักเรียนใช้บัญชี Standard User แทน Administrator) เรียกว่าหลักการใด?',
          options: ['Full Control Always', 'Least Privilege', 'Broadcast Storm', 'Overclocking'],
          ans: 1,
          exp: 'Principle of Least Privilege ช่วยลดความเสียหายหากบัญชีถูกขโมยหรือติดมัลแวร์'
        },
        {
          q: 'หากผู้ใช้คนหนึ่งอยู่ในกลุ่มที่ได้รับสิทธิ์ Allow Read แต่ถูกกำหนดสิทธิ์ Explicit Deny Read ไว้ด้วย ผลลัพธ์สุดท้ายจะเป็นอย่างไร?',
          options: ['สามารถอ่านไฟล์ได้ปกติ', 'ถูกปฏิเสธการเข้าถึง (Deny ชนะ Allow เสมอ)', 'ได้สิทธิ์ Full Control ทันที', 'ไฟล์จะถูกลบอัตโนมัติ'],
          ans: 1,
          exp: 'ในระบบสิทธิ์ NTFS ของ Windows กฎ Explicit Deny มีลำดับความสำคัญเหนือ Allow เสมอ'
        },
        {
          q: 'ข้อใดคือประโยชน์หลักของการสร้าง "กลุ่มผู้ใช้ (User Groups)" เช่น กลุ่ม Teachers และกลุ่ม Students?',
          options: ['ทำให้เครื่องคอมพิวเตอร์มีขนาดฮาร์ดดิสก์เพิ่มขึ้น', 'ช่วยให้กำหนดและปรับเปลี่ยนสิทธิ์การใช้งานให้กับผู้ใช้หลายคนพร้อมกันได้อย่างเป็นระบบ', 'ทำให้ไม่ต้องตั้งรหัสผ่าน', 'เพิ่มความเร็วอินเทอร์เน็ต'],
          ans: 1,
          exp: 'การจัดกลุ่มผู้ใช้ทำให้ผู้ดูแลระบบมอบสิทธิ์ที่ระดับกลุ่มครั้งเดียว ลดความผิดพลาดและดูแลรักษาง่าย'
        },
        {
          q: 'คำสั่ง Command Prompt ใดใช้สร้างบัญชีผู้ใช้ชื่อ student01 รหัสผ่าน P@ss1234 บน Windows?',
          options: ['net user student01 P@ss1234 /add', 'ping student01 /add', 'ipconfig /user student01', 'dir student01'],
          ans: 0,
          exp: 'คำสั่ง net user <username> <password> /add ใช้สร้างบัญชีผู้ใช้ใหม่ผ่าน Command Prompt (Run as Administrator)'
        },
        {
          q: 'เมื่อเข้าถึงโฟลเดอร์แชร์ผ่านเครือข่ายซึ่งมีทั้ง Share Permission = Full Control และ NTFS Permission = Read ผู้ใช้จะได้สิทธิ์ใช้งานจริงระดับใด?',
          options: ['Full Control', 'Modify', 'Read (ยึดสิทธิ์ที่เข้มงวดกว่า)', 'Write Only'],
          ans: 2,
          exp: 'เมื่อ Share Permission และ NTFS Permission ทำงานร่วมกัน ระบบจะเลือกใช้สิทธิ์ที่เข้มงวดกว่า (Most Restrictive) คือ Read'
        },
        {
          q: 'ในการสร้างบัญชีผู้ใช้บน Windows ตัวเลือก "User must change password at next logon" มีความหมายว่าอย่างไร?',
          options: ['บังคับให้ผู้ใช้ต้องตั้งรหัสผ่านใหม่ทันทีเมื่อลงชื่อเข้าใช้งานครั้งแรก', 'ห้ามผู้ใช้เปลี่ยนรหัสผ่านตลอดไป', 'รหัสผ่านไม่มีวันหมดอายุ', 'ระงับบัญชีผู้ใช้ชั่วคราว'],
          ans: 0,
          exp: 'ตัวเลือกนี้ช่วยให้ผู้ดูแลตั้งรหัสผ่านชั่วคราวให้ แล้วบังคับผู้ใช้เปลี่ยนเป็นรหัสลับของตนเองเมื่อล็อกอินครั้งแรก'
        },
        {
          q: 'หากต้องการปิดการใช้งานบัญชีผู้ใช้ชั่วคราวโดยไม่ลบบัญชีและข้อมูลเดิมทิ้ง ควรติ๊กตัวเลือกใดใน User Properties?',
          options: ['Account is disabled', 'Password never expires', 'User cannot change password', 'Full Control'],
          ans: 0,
          exp: 'Account is disabled จะระงับไม่ให้บัญชีนั้นล็อกอินเข้าใช้งานได้ชั่วคราว แต่ยังคงเก็บโปรไฟล์และไฟล์เดิมไว้ครบถ้วน'
        },
        {
          q: 'สิทธิ์ NTFS Permission ระดับ "Modify" แตกต่างจาก "Full Control" อย่างไร?',
          options: ['Modify อ่าน เขียน แก้ไข และลบไฟล์ได้ แต่ไม่สามารถเปลี่ยนสิทธิ์ (Change Permissions) หรือยึดสิทธิ์เจ้าของ (Take Ownership) ได้เหมือน Full Control', 'Modify อ่านไฟล์ได้อย่างเดียว ห้ามแก้ไข', 'Modify ลบไฟล์ไม่ได้', 'Full Control ไม่สามารถอ่านไฟล์ได้'],
          ans: 0,
          exp: 'Full Control มีสิทธิ์สูงสุดรวมถึงการกำหนดสิทธิ์ NTFS ให้ผู้อื่นและการเป็นเจ้าของไฟล์ (Take Ownership) ซึ่ง Modify ทำไม่ได้'
        },
        {
          q: 'สิทธิ์ NTFS ระดับ "Read & Execute" เหมาะสมกับการกำหนดให้ผู้ใช้กลุ่มใดมากที่สุด?',
          options: ['กลุ่มผู้ใช้ทั่วไปที่ต้องการเปิดอ่านเอกสารและรันโปรแกรมได้ แต่ห้ามแก้ไขหรือลบไฟล์ต้นฉบับ', 'ผู้ดูแลระบบที่ต้องการลบไฟล์ทั้งเซิร์ฟเวอร์', 'ผู้ใช้ที่ถูกห้ามไม่ให้เข้าโฟลเดอร์เลย', 'ผู้ใช้ที่ต้องการเปลี่ยนสิทธิ์ของโฟลเดอร์'],
          ans: 0,
          exp: 'Read & Execute อนุญาตให้เปิดดู อ่านไฟล์ และเรียกใช้งานโปรแกรม/สคริปต์ได้ แต่ป้องกันไม่ให้แก้ไขหรือลบไฟล์สำคัญ'
        }
      ]
    }
  ];

  const INITIAL_LEADERBOARD = [
    { name: 'ธนกฤต วงศ์เครือข่าย', studentId: '6720901001', classRoom: 'ห้อง 2/1', heroClass: 'paladin', level: 8, xp: 4120, unitsCleared: 10, badgeCount: 14, arcadeHighScore: 1250, updatedAt: '2026-11-19' },
    { name: 'กัญญาณัฐ ไฟเบอร์ออปติก', studentId: '6720901014', classRoom: 'ห้อง 2/1', heroClass: 'mage', level: 7, xp: 3380, unitsCleared: 8, badgeCount: 11, arcadeHighScore: 950, updatedAt: '2026-11-19' },
    { name: 'ภานุพงศ์ แพ็กเก็ตมาสเตอร์', studentId: '6720901022', classRoom: 'ห้อง 2/2', heroClass: 'ninja', level: 6, xp: 2490, unitsCleared: 6, badgeCount: 8, arcadeHighScore: 725, updatedAt: '2026-11-18' },
    { name: 'สุพิชชา เราเตอร์เรนเจอร์', studentId: '6720901035', classRoom: 'ห้อง 1/1', heroClass: 'ranger', level: 4, xp: 1320, unitsCleared: 3, badgeCount: 5, arcadeHighScore: 450, updatedAt: '2026-11-18' }
  ];

  const ENCYCLOPEDIA_PORTS = [
    { port: '20 / 21', proto: 'FTP', desc: 'รับ-ส่งไฟล์ (File Transfer Protocol)' },
    { port: '22', proto: 'SSH', desc: 'รีโมตควบคุมเครื่องแบบเข้ารหัสปลอดภัย' },
    { port: '23', proto: 'Telnet', desc: 'รีโมตแบบไม่เข้ารหัส (เสี่ยงถูกดักจับ)' },
    { port: '25', proto: 'SMTP', desc: 'ส่งอีเมลระหว่างเซิร์ฟเวอร์' },
    { port: '53', proto: 'DNS', desc: 'แปลงชื่อโดเมนเว็บไซต์เป็น IP Address' },
    { port: '67 / 68', proto: 'DHCP', desc: 'แจก IP Address อัตโนมัติแก่เครื่องลูกข่าย' },
    { port: '80', proto: 'HTTP', desc: 'บริการเว็บเพจแบบไม่เข้ารหัส' },
    { port: '443', proto: 'HTTPS', desc: 'บริการเว็บเพจแบบเข้ารหัส SSL/TLS' },
    { port: '445', proto: 'SMB', desc: 'แชร์ไฟล์และเครื่องพิมพ์ในเครือข่าย Windows' },
    { port: '3389', proto: 'RDP', desc: 'Remote Desktop ควบคุมหน้าจอ Windows ระยะไกล' }
  ];

  const SKILL_EXERCISES = {
    1: {
      title: 'แบบฝึกทักษะบทเรียนที่ 1: ความรู้เกี่ยวกับระบบเครือข่ายคอมพิวเตอร์',
      instruction: 'คำชี้แจง: ให้นักเรียนตอบคำถามต่อไปนี้ให้ครบถ้วน (ระบบบันทึกคำตอบอัตโนมัติ สามารถกดตรวจและเทียบแนวคำตอบได้)',
      writtenSections: [
        {
          no: 1,
          prompt: 'จงบอกประโยชน์ของระบบเครือข่ายคอมพิวเตอร์',
          items: [
            { id: 'u1_q1_1', label: '1)', keywords: ['ทรัพยากร', 'เครื่องพิมพ์', 'ไฟล์', 'ร่วมกัน', 'อินเทอร์เน็ต', 'แชร์'], placeholder: 'เช่น ใช้ทรัพยากรร่วมกัน (เครื่องพิมพ์/ไฟล์/อินเทอร์เน็ต)...', model: 'ใช้ทรัพยากรร่วมกัน เช่น เครื่องพิมพ์ ไฟล์ข้อมูล และอินเทอร์เน็ต' },
            { id: 'u1_q1_2', label: '2)', keywords: ['สื่อสาร', 'อีเมล', 'แชต', 'รวดเร็ว', 'ติดต่อ', 'ประชุม'], placeholder: 'เช่น ติดต่อสื่อสารสะดวกรวดเร็ว...', model: 'ติดต่อสื่อสารระหว่างผู้ใช้ได้รวดเร็ว เช่น อีเมล แชต ประชุมออนไลน์' },
            { id: 'u1_q1_3', label: '3)', keywords: ['ต้นทุน', 'ประหยัด', 'ลดค่าใช้จ่าย', 'ราคา'], placeholder: 'เช่น ลดต้นทุนในการจัดซื้ออุปกรณ์...', model: 'ช่วยลดต้นทุนในการจัดซื้อฮาร์ดแวร์และซอฟต์แวร์' },
            { id: 'u1_q1_4', label: '4)', keywords: ['สำรอง', 'ปลอดภัย', 'รวมศูนย์', 'จัดเก็บ', 'ข้อมูล', 'backup'], placeholder: 'เช่น จัดเก็บและสำรองข้อมูลแบบรวมศูนย์...', model: 'จัดเก็บ ดูแลรักษา และสำรองข้อมูลได้อย่างเป็นระบบและปลอดภัย' }
          ]
        },
        {
          no: 2,
          prompt: 'จงบอกองค์ประกอบของระบบเครือข่ายคอมพิวเตอร์',
          items: [
            { id: 'u1_q2_1', label: '1)', keywords: ['ผู้ส่ง', 'ผู้รับ', 'sender', 'receiver', 'คอมพิวเตอร์', 'เครื่อง'], placeholder: 'เช่น ผู้ส่งข้อมูล (Sender)...', model: 'ผู้ส่งข้อมูล (Sender) และผู้รับข้อมูล (Receiver)' },
            { id: 'u1_q2_2', label: '2)', keywords: ['ข้อมูล', 'ข่าวสาร', 'message', 'data', 'ผู้รับ'], placeholder: 'เช่น ข้อมูลข่าวสาร (Message)...', model: 'ข้อมูลข่าวสาร (Message)' },
            { id: 'u1_q2_3', label: '3)', keywords: ['สื่อกลาง', 'สาย', 'ไร้สาย', 'medium', 'utp', 'fiber', 'คลื่น'], placeholder: 'เช่น สื่อกลางนำสัญญาณ (Transmission Medium)...', model: 'สื่อกลางนำสัญญาณ (Transmission Medium) เช่น สาย UTP, Fiber, คลื่นวิทยุ' },
            { id: 'u1_q2_4', label: '4)', keywords: ['โปรโตคอล', 'protocol', 'อุปกรณ์', 'switch', 'router', 'ซอฟต์แวร์'], placeholder: 'เช่น โปรโตคอล (Protocol) / อุปกรณ์เครือข่าย...', model: 'โปรโตคอล (Protocol) และอุปกรณ์เครือข่าย เช่น Switch, Router' }
          ]
        },
        {
          no: 3,
          prompt: 'จงบอกความแตกต่างของเครือข่ายแต่ละประเภท',
          items: [
            { id: 'u1_q3_1', label: '1) เครือข่าย LAN คือ', keywords: ['ท้องถิ่น', 'ห้อง', 'อาคาร', 'ใกล้', 'วิทยาลัย', 'local'], placeholder: 'อธิบายขอบเขตและลักษณะของ LAN...', model: 'เครือข่ายท้องถิ่น เชื่อมโยงในระยะใกล้ เช่น ห้องเรียน อาคาร หรือวิทยาลัยเดียวกัน ความเร็วสูง' },
            { id: 'u1_q3_2', label: '2) เครือข่าย MAN คือ', keywords: ['เมือง', 'จังหวัด', 'วิทยาเขต', 'หลายอาคาร', 'metropolitan'], placeholder: 'อธิบายขอบเขตและลักษณะของ MAN...', model: 'เครือข่ายระดับเมือง เชื่อมโยงหลายอาคารหรือหลายวิทยาเขตภายในเมืองหรือจังหวัดเดียวกัน' },
            { id: 'u1_q3_3', label: '3) เครือข่าย WAN คือ', keywords: ['กว้าง', 'ประเทศ', 'ทั่วโลก', 'อินเทอร์เน็ต', 'ข้าม', 'wide'], placeholder: 'อธิบายขอบเขตและลักษณะของ WAN...', model: 'เครือข่ายบริเวณกว้าง เชื่อมโยงข้ามจังหวัด ข้ามประเทศ หรือทั่วโลก เช่น อินเทอร์เน็ต' },
            { id: 'u1_q3_4', label: '4) เครือข่าย PAN คือ', keywords: ['ส่วนบุคคล', 'ใกล้', 'bluetooth', '10', 'บลูทูธ', 'personal'], placeholder: 'อธิบายขอบเขตและลักษณะของ PAN...', model: 'เครือข่ายส่วนบุคคล ระยะใกล้ประมาณ 1–10 เมตร เช่น Bluetooth เชื่อมมือถือกับหูฟัง/สมาร์ตวอตช์' }
          ]
        },
        {
          no: 4,
          prompt: 'จงบอกความแตกต่างของลักษณะการใช้งานเครือข่ายคอมพิวเตอร์ต่อไปนี้',
          items: [
            { id: 'u1_q4_1', label: '1) เครือข่ายแบบ Peer to Peer คือ', multiline: true, keywords: ['เท่าเทียม', 'ไม่มี', 'server', 'ขนาดเล็ก', 'แม่ข่าย', 'workgroup'], placeholder: 'อธิบายลักษณะของ Peer-to-Peer...', model: 'ทุกเครื่องมีสิทธิ์เท่าเทียมกัน ไม่มีเครื่องแม่ข่ายกลาง (Server) ติดตั้งง่าย ประหยัด เหมาะกับเครือข่ายขนาดเล็กไม่เกิน 10 เครื่อง' },
            { id: 'u1_q4_2', label: '2) เครือข่ายแบบ Client-Server คือ', multiline: true, keywords: ['แม่ข่าย', 'server', 'ลูกข่าย', 'client', 'รวมศูนย์', 'ควบคุม', 'บริการ'], placeholder: 'อธิบายลักษณะของ Client-Server...', model: 'มีเครื่องแม่ข่าย (Server) ทำหน้าที่ให้บริการและควบคุมสิทธิ์ความปลอดภัยแบบรวมศูนย์ และมีเครื่องลูกข่าย (Client) ร้องขอใช้บริการ เหมาะกับองค์กรขนาดกลาง-ใหญ่' }
          ]
        },
        {
          no: 5,
          prompt: 'จงบอกลักษณะการเชื่อมต่อเครือข่าย (Network Topology) ต่อไปนี้ โดยสังเขป',
          items: [
            { id: 'u1_q5_1', label: '1) การเชื่อมต่อแบบ Bus Topology', keywords: ['สายหลัก', 'เส้นเดียว', 'backbone', 'terminator', 'ล่ม', 'ประหยัด'], placeholder: 'อธิบายลักษณะของ Bus Topology...', model: 'เชื่อมต่อทุกเครื่องเข้ากับสายหลักเส้นเดียว (Backbone) มี Terminator ปิดหัวท้าย ประหยัดสายแต่สายหลักขาดจะล่มทั้งเครือข่าย' },
            { id: 'u1_q5_2', label: '2) การเชื่อมต่อแบบ Star Topology', keywords: ['ศูนย์กลาง', 'switch', 'hub', 'ตรงกลาง', 'แยกสาย', 'เครื่องเดียว'], placeholder: 'อธิบายลักษณะของ Star Topology...', model: 'ทุกเครื่องเชื่อมต่อแยกสายเข้าสู่อุปกรณ์ศูนย์กลาง (Switch/Hub) หากสายเครื่องใดขาดจะกระทบเฉพาะเครื่องนั้น นิยมใช้มากที่สุด' },
            { id: 'u1_q5_3', label: '3) การเชื่อมต่อแบบ Ring Topology', keywords: ['วงแหวน', 'ทิศทางเดียว', 'token', 'วน', 'วงกลม'], placeholder: 'อธิบายลักษณะของ Ring Topology...', model: 'เชื่อมต่อเป็นวงแหวนส่งข้อมูลวนทิศทางเดียวผ่าน Token ลดการชนกันของข้อมูล แต่หากสายหรือเครื่องใดเสียอาจกระทบทั้งวง' }
          ]
        }
      ],
      connectorPart: null
    },
    2: {
      title: 'แบบฝึกทักษะบทเรียนที่ 2: อุปกรณ์และสื่อนำสัญญาณ',
      instruction: 'ตอนที่ 1 ให้นักเรียนตอบคำถามต่อไปนี้ และตอนที่ 2 ระบุชื่อหัวต่อสายพร้อมประเภทสายที่ใช้จากรูปภาพทั้ง 6 ข้อ',
      writtenSections: [
        {
          no: 1,
          prompt: 'จงบอกชื่ออุปกรณ์ในระบบเครือข่ายที่นิยมใช้งานทั่วไปจำนวน 3 ชื่อ',
          items: [
            { id: 'u2_q1_1', label: '1)', keywords: ['switch', 'สวิตช์', 'router', 'เราเตอร์', 'hub', 'ฮับ', 'access point', 'ap', 'nic', 'modem', 'โมเด็ม', 'การ์ดแลน', 'bridge', 'repeater'], placeholder: 'เช่น Switch (สวิตช์)...', model: 'Switch (สวิตช์เครือข่าย)' },
            { id: 'u2_q1_2', label: '2)', keywords: ['switch', 'สวิตช์', 'router', 'เราเตอร์', 'hub', 'ฮับ', 'access point', 'ap', 'nic', 'modem', 'โมเด็ม', 'การ์ดแลน', 'bridge', 'repeater'], placeholder: 'เช่น Router (เราเตอร์)...', model: 'Router (เราเตอร์)' },
            { id: 'u2_q1_3', label: '3)', keywords: ['switch', 'สวิตช์', 'router', 'เราเตอร์', 'hub', 'ฮับ', 'access point', 'ap', 'nic', 'modem', 'โมเด็ม', 'การ์ดแลน', 'bridge', 'repeater'], placeholder: 'เช่น Access Point / NIC / Modem...', model: 'Access Point (จุดกระจายสัญญาณไร้สาย) หรือ NIC / Modem' }
          ]
        },
        {
          no: 2,
          prompt: 'สายโคแอกเชียล มีข้อดี-ข้อเสียอย่างไร และที่ใช้ในเครือข่ายคอมพิวเตอร์มีกี่ชนิด',
          items: [
            { id: 'u2_q2_1', label: 'คำตอบ:', multiline: true, keywords: ['2', 'สอง', 'บาง', 'หนา', 'thin', 'thick', 'รบกวน', 'ไกล', 'แข็ง', 'ยาก'], placeholder: 'ระบุข้อดี ข้อเสีย และชนิดของสายโคแอกเชียล (เช่น Thicknet / Thinnet)...', model: 'ข้อดี: ป้องกันสัญญาณรบกวนได้ดี เดินสายได้ไกลกว่า UTP | ข้อเสีย: สายแข็ง ติดตั้งและเข้าหัวยากกว่า UTP | ชนิดที่ใช้ในเครือข่ายมี 2 ชนิด คือ แบบบาง (Thinnet / 10BASE2) และแบบหนา (Thicknet / 10BASE5)' }
          ]
        },
        {
          no: 3,
          prompt: 'สายคู่บิดเกลียวแบบ STP กับ UTP มีข้อแตกต่างกันอย่างไร',
          items: [
            { id: 'u2_q3_1', label: 'คำตอบ:', multiline: true, keywords: ['ฉนวน', 'หุ้ม', 'ฟอยล์', 'โลหะ', 'shield', 'รบกวน', 'emi', 'ถูก', 'แพง'], placeholder: 'เปรียบเทียบฉนวนป้องกันสัญญาณรบกวน ราคา และการใช้งาน...', model: 'สาย STP (Shielded Twisted Pair) มีแผ่นโลหะ/ฟอยล์หุ้มป้องกันสัญญาณรบกวนแม่เหล็กไฟฟ้า (EMI) ได้ดีกว่าแต่ราคาแพงกว่าและแข็งกว่า ส่วนสาย UTP (Unshielded) ไม่มีฉนวนโลหะหุ้ม ราคาถูก ติดตั้งง่าย นิยมใช้ใน LAN ทั่วไป' }
          ]
        },
        {
          no: 4,
          prompt: 'สายใยแก้วนำแสง (Fiber Optic) มีกี่แบบ มีข้อดีและข้อจำกัดอย่างไร',
          items: [
            { id: 'u2_q4_1', label: 'คำตอบ:', multiline: true, keywords: ['2', 'single', 'multi', 'แสง', 'เร็ว', 'ไกล', 'แพง', 'เปราะ', 'หัก', 'รบกวน'], placeholder: 'ระบุชนิด (Single-Mode / Multi-Mode), ข้อดี และข้อจำกัด...', model: 'มี 2 แบบ คือ Single-Mode (SMF เดินสายไกลหลาย กม.) และ Multi-Mode (MMF ระยะใกล้กว่า) | ข้อดี: ความเร็วสูงมาก ไม่ถูกรบกวนจากคลื่นแม่เหล็กไฟฟ้า ส่งได้ไกล | ข้อจำกัด: ราคาอุปกรณ์สูง สายเปราะบางหักงอไม่ได้ เข้าหัวสายยากต้องใช้ช่างชำนาญ' }
          ]
        },
        {
          no: 5,
          prompt: 'การสื่อสารข้อมูลโดยใช้คลื่นไมโครเวฟ (Microwave) กับ คลื่นบลูทูธ (Bluetooth) และคลื่นอินฟราเรด (Infrared) ใช้งานแตกต่างกันอย่างไร',
          items: [
            { id: 'u2_q5_1', label: 'คำตอบ:', multiline: true, keywords: ['ไกล', 'ใกล้', 'แนวสายตา', 'los', 'สิ่งกีดขวาง', 'รีโมต', '10', 'pan', 'อาคาร'], placeholder: 'เปรียบเทียบระยะทาง ลักษณะการใช้งาน และสิ่งกีดขวางของทั้ง 3 คลื่น...', model: 'ไมโครเวฟ: ส่งข้อมูลระยะไกลระดับกิโลเมตรเชื่อมระหว่างอาคาร/สถานีแบบแนวสายตา (LOS) | บลูทูธ: ส่งระยะใกล้ 1–10 ม. (PAN) ทะลุสิ่งกีดขวางเบาได้ ใช้กับหูฟัง/อุปกรณ์พกพา | อินฟราเรด: ส่งระยะใกล้มาก ห้ามมีสิ่งกีดขวางกั้นแนวสายตา เช่น รีโมตคอนโทรล' }
          ]
        }
      ],
      connectorPart: {
        title: 'ตอนที่ 2 จากรูปภาพต่อไปนี้ ให้นักเรียนเลือกชื่อหัวต่อสาย พร้อมทั้งระบุว่าใช้กับสายประเภทใด',
        nameOptions: ['BNC', 'RJ-45', 'ST', 'FC', 'LC', 'SC'],
        cableOptions: [
          'สายโคแอกเชียล (Coaxial)',
          'สายคู่บิดเกลียว (UTP / STP)',
          'สายใยแก้วนำแสง (Fiber Optic)'
        ],
        rows: [
          {
            no: 1,
            ansName: 'BNC',
            ansCable: 'สายโคแอกเชียล (Coaxial)',
            svg: `<svg viewBox="0 0 180 76" width="160" height="68" shape-rendering="crispEdges"><rect width="180" height="76" fill="#0f172a"/><rect x="108" y="29" width="60" height="18" fill="#1e293b" stroke="#475569"/><rect x="70" y="25" width="38" height="26" fill="#94a3b8" stroke="#e2e8f0"/><rect x="44" y="23" width="26" height="30" fill="#cbd5e1" stroke="#64748b"/><circle cx="38" cy="38" r="12" fill="#475569" stroke="#e2e8f0" stroke-width="2"/><circle cx="38" cy="38" r="4" fill="#facc15"/><line x1="52" y1="26" x2="62" y2="26" stroke="#0f172a" stroke-width="2"/></svg>`
          },
          {
            no: 2,
            ansName: 'RJ-45',
            ansCable: 'สายคู่บิดเกลียว (UTP / STP)',
            svg: `<svg viewBox="0 0 180 76" width="160" height="68" shape-rendering="crispEdges"><rect width="180" height="76" fill="#0f172a"/><rect x="24" y="34" width="58" height="24" fill="#cbd5e1" fill-opacity="0.35" stroke="#e2e8f0" stroke-width="2"/><polygon points="36,34 62,22 68,26 46,34" fill="#e2e8f0" fill-opacity="0.6" stroke="#cbd5e1"/><rect x="26" y="40" width="8" height="14" fill="#f59e0b"/><rect x="112" y="16" width="34" height="44" fill="#cbd5e1" fill-opacity="0.35" stroke="#e2e8f0" stroke-width="2"/><rect x="118" y="18" width="22" height="10" fill="#f59e0b"/><line x1="121" y1="18" x2="121" y2="28" stroke="#0f172a"/><line x1="125" y1="18" x2="125" y2="28" stroke="#0f172a"/><line x1="129" y1="18" x2="129" y2="28" stroke="#0f172a"/><line x1="133" y1="18" x2="133" y2="28" stroke="#0f172a"/><line x1="137" y1="18" x2="137" y2="28" stroke="#0f172a"/></svg>`
          },
          {
            no: 3,
            ansName: 'ST',
            ansCable: 'สายใยแก้วนำแสง (Fiber Optic)',
            svg: `<svg viewBox="0 0 180 76" width="160" height="68" shape-rendering="crispEdges"><rect width="180" height="76" fill="#0f172a"/><polygon points="94,30 164,33 164,43 94,46" fill="#1e293b" stroke="#475569"/><rect x="50" y="25" width="44" height="26" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/><path d="M58 34 L70 34 L70 28" fill="none" stroke="#0f172a" stroke-width="3"/><rect x="24" y="34" width="26" height="8" fill="#f8fafc" stroke="#94a3b8"/></svg>`
          },
          {
            no: 4,
            ansName: 'FC',
            ansCable: 'สายใยแก้วนำแสง (Fiber Optic)',
            svg: `<svg viewBox="0 0 180 76" width="160" height="68" shape-rendering="crispEdges"><rect width="180" height="76" fill="#0f172a"/><polygon points="94,28 164,33 164,43 94,48" fill="#2563eb" stroke="#60a5fa"/><rect x="52" y="24" width="42" height="28" fill="#94a3b8" stroke="#e2e8f0" stroke-width="2"/><line x1="58" y1="24" x2="58" y2="52" stroke="#334155" stroke-width="2"/><line x1="65" y1="24" x2="65" y2="52" stroke="#334155" stroke-width="2"/><line x1="72" y1="24" x2="72" y2="52" stroke="#334155" stroke-width="2"/><line x1="79" y1="24" x2="79" y2="52" stroke="#334155" stroke-width="2"/><rect x="30" y="34" width="22" height="8" fill="#f8fafc" stroke="#94a3b8"/></svg>`
          },
          {
            no: 5,
            ansName: 'LC',
            ansCable: 'สายใยแก้วนำแสง (Fiber Optic)',
            svg: `<svg viewBox="0 0 180 76" width="160" height="68" shape-rendering="crispEdges"><rect width="180" height="76" fill="#0f172a"/><polygon points="104,31 164,34 164,42 104,45" fill="#e2e8f0" stroke="#94a3b8"/><rect x="44" y="26" width="60" height="24" fill="#1d4ed8" stroke="#60a5fa" stroke-width="2"/><polygon points="56,26 88,12 94,16 68,26" fill="#2563eb" stroke="#93c5fd"/><rect x="28" y="34" width="16" height="8" fill="#f8fafc" stroke="#94a3b8"/></svg>`
          },
          {
            no: 6,
            ansName: 'SC',
            ansCable: 'สายใยแก้วนำแสง (Fiber Optic)',
            svg: `<svg viewBox="0 0 180 76" width="160" height="68" shape-rendering="crispEdges"><rect width="180" height="76" fill="#0f172a"/><polygon points="104,30 164,34 164,42 104,46" fill="#15803d" stroke="#4ade80"/><rect x="42" y="22" width="62" height="32" fill="#16a34a" stroke="#86efac" stroke-width="2"/><rect x="54" y="28" width="38" height="20" fill="#14532d" stroke="#4ade80"/><rect x="26" y="33" width="16" height="10" fill="#f8fafc" stroke="#94a3b8"/></svg>`
          }
        ]
      }
    },
    3: {
      title: 'แบบฝึกทักษะบทเรียนที่ 3: มาตรฐานและโปรโตคอลของระบบเครือข่าย',
      instruction: 'ทำครบทั้ง 4 ตอน: ตอนที่ 1 ระบุชื่อองค์กร (8 ข้อ), ตอนที่ 2 จับคู่ A–J (10 ข้อ), ตอนที่ 3 ลำดับชั้น OSI Model & หน้าที่ (7 ชั้น) และตอนที่ 4 จับคู่โปรโตคอล (8 ข้อ)',
      writtenSections: [
        {
          no: 1,
          prompt: 'ตอนที่ 1 ให้นักเรียนเขียนชื่อองค์กรจากรายละเอียดต่อไปนี้',
          items: [
            { id: 'u3_p1_1', label: '1. เป็นองค์กรกำหนดมาตรฐาน กฎระเบียบ และพัฒนาด้านการสื่อสารโทรคมนาคม รวมไปถึงบริการแถบคลื่นความถี่วิทยุ', keywords: ['itu', 'international telecommunication'], placeholder: 'ระบุชื่อย่อองค์กร เช่น ITU...', model: 'ITU (International Telecommunication Union)' },
            { id: 'u3_p1_2', label: '2. เป็นองค์กรวิชาชีพระดับนานาชาติ ทำหน้าที่ดูแลเทคโนโลยี งานวิจัย และพัฒนาต่าง ๆ ที่เกี่ยวกับไฟฟ้า และคอมพิวเตอร์', keywords: ['ieee'], placeholder: 'ระบุชื่อย่อองค์กร เช่น IEEE...', model: 'IEEE (Institute of Electrical and Electronics Engineers)' },
            { id: 'u3_p1_3', label: '3. เป็นองค์กรกำหนดมาตรฐานอุตสาหกรรมระหว่างชาติ', keywords: ['iso'], placeholder: 'ระบุชื่อย่อองค์กร เช่น ISO...', model: 'ISO (International Organization for Standardization)' },
            { id: 'u3_p1_4', label: '4. เป็นองค์กรกำหนดมาตรฐานที่เกี่ยวข้องกับอุปกรณ์ด้านฮาร์ดแวร์ อุปกรณ์ทางด้านโทรคมนาคม และอุปกรณ์การสื่อสารในเครือข่ายคอมพิวเตอร์', keywords: ['eia', 'tia'], placeholder: 'ระบุชื่อย่อองค์กร เช่น EIA หรือ EIA/TIA...', model: 'EIA (Electronic Industries Alliance) / TIA' },
            { id: 'u3_p1_5', label: '5. เป็นองค์กรกำหนดมาตรฐาน OSI Model', keywords: ['iso'], placeholder: 'ระบุชื่อย่อองค์กร...', model: 'ISO (International Organization for Standardization)' },
            { id: 'u3_p1_6', label: '6. เป็นองค์กรกำหนดมาตรฐานการจัดเรียงสาย TIA T568', keywords: ['tia', 'eia'], placeholder: 'ระบุชื่อย่อองค์กร...', model: 'TIA (Telecommunications Industry Association)' },
            { id: 'u3_p1_7', label: '7. เป็นองค์กรกำหนดมาตรฐานของเครือข่าย 802', keywords: ['ieee'], placeholder: 'ระบุชื่อย่อองค์กร...', model: 'IEEE' },
            { id: 'u3_p1_8', label: '8. เป็นองค์กรกำหนดมาตรฐานระบบโทรคมนาคม', keywords: ['itu', 'tia'], placeholder: 'ระบุชื่อย่อองค์กร...', model: 'ITU (หรือ TIA)' }
          ]
        },
        {
          no: 3,
          prompt: 'ตอนที่ 3 ให้นักเรียนเขียนลำดับชั้นของ OSI Model รวมไปถึงให้รายละเอียดหน้าที่โดยสังเขป (ลำดับที่ 1 ตัวอย่าง: Application Layer — กำหนดมาตรฐานการติดต่อกับซอฟต์แวร์)',
          items: [
            { id: 'u3_p3_n_2', label: 'ลำดับที่ 2 — ชื่อชั้น OSI (ภาษาอังกฤษ):', keywords: ['presentation'], placeholder: 'เช่น Presentation Layer', model: 'Presentation Layer' },
            { id: 'u3_p3_d_2', label: 'ลำดับที่ 2 — หน้าที่โดยสังเขป:', keywords: ['แปลง', 'รูปแบบ', 'เข้ารหัส', 'บีบอัด', 'encrypt', 'format'], placeholder: 'อธิบายหน้าที่ชั้นที่ 2...', model: 'แปลงรูปแบบข้อมูล เข้ารหัส (Encryption) และบีบอัดข้อมูล' },
            { id: 'u3_p3_n_3', label: 'ลำดับที่ 3 — ชื่อชั้น OSI (ภาษาอังกฤษ):', keywords: ['session'], placeholder: 'เช่น Session Layer', model: 'Session Layer' },
            { id: 'u3_p3_d_3', label: 'ลำดับที่ 3 — หน้าที่โดยสังเขป:', keywords: ['สร้าง', 'ควบคุม', 'เชื่อมต่อ', 'เซสชัน', 'session', 'ปิด'], placeholder: 'อธิบายหน้าที่ชั้นที่ 3...', model: 'สร้าง ควบคุม และสิ้นสุดการเชื่อมต่อ (Session) ระหว่างเครื่องต้นทาง-ปลายทาง' },
            { id: 'u3_p3_n_4', label: 'ลำดับที่ 4 — ชื่อชั้น OSI (ภาษาอังกฤษ):', keywords: ['transport'], placeholder: 'เช่น Transport Layer', model: 'Transport Layer' },
            { id: 'u3_p3_d_4', label: 'ลำดับที่ 4 — หน้าที่โดยสังเขป:', keywords: ['แบ่ง', 'รับ', 'ส่ง', 'tcp', 'udp', 'segment', 'ถูกต้อง', 'ครบถ้วน'], placeholder: 'อธิบายหน้าที่ชั้นที่ 4...', model: 'แบ่งข้อมูลเป็น Segment และควบคุมการรับ-ส่งข้อมูลให้ครบถ้วนถูกต้อง (TCP/UDP)' },
            { id: 'u3_p3_n_5', label: 'ลำดับที่ 5 — ชื่อชั้น OSI (ภาษาอังกฤษ):', keywords: ['network'], placeholder: 'เช่น Network Layer', model: 'Network Layer' },
            { id: 'u3_p3_d_5', label: 'ลำดับที่ 5 — หน้าที่โดยสังเขป:', keywords: ['ip', 'เส้นทาง', 'routing', 'packet', 'router', 'ที่อยู่'], placeholder: 'อธิบายหน้าที่ชั้นที่ 5...', model: 'กำหนดหมายเลข IP Address และเลือกเส้นทางส่งแพ็กเก็ตข้ามเครือข่าย (Routing)' },
            { id: 'u3_p3_n_6', label: 'ลำดับที่ 6 — ชื่อชั้น OSI (ภาษาอังกฤษ):', keywords: ['data link', 'datalink'], placeholder: 'เช่น Data Link Layer', model: 'Data Link Layer' },
            { id: 'u3_p3_d_6', label: 'ลำดับที่ 6 — หน้าที่โดยสังเขป:', keywords: ['mac', 'frame', 'เฟรม', 'ตรวจสอบ', 'ผิดพลาด', 'switch'], placeholder: 'อธิบายหน้าที่ชั้นที่ 6...', model: 'จัดรูปแบบเฟรมข้อมูล อ้างอิง MAC Address และตรวจสอบข้อผิดพลาดในการส่ง' },
            { id: 'u3_p3_n_7', label: 'ลำดับที่ 7 — ชื่อชั้น OSI (ภาษาอังกฤษ):', keywords: ['physical'], placeholder: 'เช่น Physical Layer', model: 'Physical Layer' },
            { id: 'u3_p3_d_7', label: 'ลำดับที่ 7 — หน้าที่โดยสังเขป:', keywords: ['บิต', 'bit', 'สัญญาณ', 'สาย', 'กายภาพ', 'ไฟฟ้า', 'แสง'], placeholder: 'อธิบายหน้าที่ชั้นที่ 7...', model: 'รับ-ส่งสัญญาณบิต (0/1) ผ่านสื่อนำสัญญาณทางกายภาพ เช่น สาย UTP, Fiber, คลื่นวิทยุ' }
          ]
        }
      ],
      connectorPart: null,
      matchingParts: [
        {
          id: 'p2',
          title: 'ตอนที่ 2 ให้นักเรียนจับคู่คำตอบกับคำถามต่อไปนี้ให้เหมาะสมกัน (A – J)',
          options: [
            { value: 'A', label: 'A. Private IP' },
            { value: 'B', label: 'B. Public IP' },
            { value: 'C', label: 'C. IEEE 802.11' },
            { value: 'D', label: 'D. AppleTalk' },
            { value: 'E', label: 'E. NetBEUI' },
            { value: 'F', label: 'F. IEEE 802.3' },
            { value: 'G', label: 'G. IPX/SPX' },
            { value: 'H', label: 'H. IEEE 802.15' },
            { value: 'I', label: 'I. NAT' },
            { value: 'J', label: 'J. Protocol' }
          ],
          rows: [
            { id: 'u3_p2_1', no: 1, prompt: 'ข้อกำหนดหรือข้อตกลงในการติดต่อสื่อสารข้อมูล', ans: 'J' },
            { id: 'u3_p2_2', no: 2, prompt: 'เหมาะกับเครือข่ายขนาดเล็ก ไม่มีความสามารถในการกำหนดเส้นทางการส่งข้อมูล', ans: 'E' },
            { id: 'u3_p2_3', no: 3, prompt: 'ใช้ระบบปฏิบัติการเครือข่าย Netware', ans: 'G' },
            { id: 'u3_p2_4', no: 4, prompt: 'ใช้ในระบบเครือข่ายคอมพิวเตอร์ Macintosh', ans: 'D' },
            { id: 'u3_p2_5', no: 5, prompt: 'ไอพีแอดเดรสที่ใช้งานกับเครือข่ายอินเทอร์เน็ต', ans: 'B' },
            { id: 'u3_p2_6', no: 6, prompt: 'ไอพีแอดเดรสที่ใช้งานในเครือข่ายภายในองค์กร', ans: 'A' },
            { id: 'u3_p2_7', no: 7, prompt: 'การแปลง Private IP เป็น Public IP', ans: 'I' },
            { id: 'u3_p2_8', no: 8, prompt: 'มาตรฐานการสื่อสารข้อมูล Ethernet', ans: 'F' },
            { id: 'u3_p2_9', no: 9, prompt: 'มาตรฐานเกี่ยวกับระบบเครือข่ายไร้สาย', ans: 'C' },
            { id: 'u3_p2_10', no: 10, prompt: 'มาตรฐานการเชื่อมต่อเครือข่ายไร้สายระยะใกล้', ans: 'H' }
          ]
        },
        {
          id: 'p4',
          title: 'ตอนที่ 4 ให้นักเรียนจับคู่ชื่อโปรโตคอลที่เกี่ยวข้องกับข้อมูลการปฏิบัติงานต่อไปนี้',
          options: [
            { value: 'TCP/IP', label: 'TCP/IP' },
            { value: 'NetBEUI', label: 'NetBEUI' },
            { value: 'AppleTalk', label: 'AppleTalk' },
            { value: 'IPX/SPX', label: 'IPX/SPX' }
          ],
          rows: [
            { id: 'u3_p4_1', no: 1, prompt: 'ใช้ในระบบเครือข่ายอินเทอร์เน็ต', ans: 'TCP/IP' },
            { id: 'u3_p4_2', no: 2, prompt: 'ใช้กับเครือข่ายขนาดเล็ก', ans: 'NetBEUI' },
            { id: 'u3_p4_3', no: 3, prompt: 'กำหนดหมายเลขด้วย IP Address', ans: 'TCP/IP' },
            { id: 'u3_p4_4', no: 4, prompt: 'ใช้กับระบบเครือข่ายคอมพิวเตอร์ Macintosh', ans: 'AppleTalk' },
            { id: 'u3_p4_5', no: 5, prompt: 'ไม่มีความสามารถในการค้นหาเส้นทาง', ans: 'NetBEUI' },
            { id: 'u3_p4_6', no: 6, prompt: 'พัฒนาโดยบริษัท Novell', ans: 'IPX/SPX' },
            { id: 'u3_p4_7', no: 7, prompt: 'ใช้ในระบบปฏิบัติการ Netware', ans: 'IPX/SPX' },
            { id: 'u3_p4_8', no: 8, prompt: 'Ether Talk และ Token Talk', ans: 'AppleTalk' }
          ]
        }
      ]
    },
    4: {
      title: 'แบบฝึกทักษะบทเรียนที่ 4: เครือข่าย LAN แบบใช้สาย',
      instruction: 'ทำครบทั้ง 3 ตอน: ตอนที่ 1 ตอบคำถาม 5 ข้อ, ตอนที่ 2 เรียงสีสาย UTP มาตรฐาน TIA-568A & TIA-568B (16 ช่อง) และตอนที่ 3 เรียงลำดับขั้นตอนการเข้าหัวสาย RJ-45 (8 ขั้นตอน)',
      writtenSections: [
        {
          no: 1,
          prompt: 'ตอนที่ 1 ให้นักเรียนตอบคำถามต่อไปนี้',
          items: [
            { id: 'u4_q1', label: '1. การรับส่งข้อมูลแบบอีเทอร์เน็ต (Ethernet) มีลักษณะอย่างไร', multiline: true, keywords: ['802.3', 'csma', 'cd', 'ชน', 'ตรวจ', 'สาย', 'ว่าง', 'full-duplex', 'switch'], placeholder: 'อธิบายหลักการทำงานของ Ethernet (IEEE 802.3 / CSMA/CD)...', model: 'ทำงานตามมาตรฐาน IEEE 802.3 ใช้กลไก CSMA/CD ตรวจสอบว่าสายสัญญาณว่างก่อนส่งข้อมูล หากเกิดการชนกันจะหยุดรอแล้วสุ่มเวลาส่งใหม่ (ปัจจุบันผ่าน Switch แบบ Full-Duplex)' },
            { id: 'u4_q2', label: '2. การรับส่งข้อมูลแบบโทเค็นพาส (Token Pass) มีลักษณะอย่างไร', multiline: true, keywords: ['token', 'โทเค็น', 'สิทธิ์', 'วน', 'วงแหวน', 'ring', 'ชน'], placeholder: 'อธิบายหลักการส่งผ่าน Token...', model: 'ส่งรหัสสิทธิ์ (Token) วนไปตามลำดับในเครือข่าย (เช่น Ring Topology) เฉพาะเครื่องที่ถือ Token จึงมีสิทธิ์ส่งข้อมูลได้ ช่วยป้องกันการชนกันของข้อมูล' },
            { id: 'u4_q3_1', label: '3. ชื่ออุปกรณ์ที่ใช้กับเครือข่ายอีเทอร์เน็ตแบบใช้สาย — 1)', keywords: ['switch', 'สวิตช์', 'hub', 'ฮับ', 'nic', 'การ์ด', 'utp', 'rj-45', 'rj45', 'patch', 'router'], placeholder: 'เช่น Switch (สวิตช์เครือข่าย)...', model: 'Switch (สวิตช์เครือข่าย)' },
            { id: 'u4_q3_2', label: '3. ชื่ออุปกรณ์ที่ใช้กับเครือข่ายอีเทอร์เน็ตแบบใช้สาย — 2)', keywords: ['switch', 'สวิตช์', 'hub', 'ฮับ', 'nic', 'การ์ด', 'utp', 'rj-45', 'rj45', 'patch', 'router'], placeholder: 'เช่น การ์ดแลน (NIC) / สาย UTP...', model: 'การ์ดแลน (NIC) และสาย UTP พร้อมหัวต่อ RJ-45' },
            { id: 'u4_q3_3', label: '3. ชื่ออุปกรณ์ที่ใช้กับเครือข่ายอีเทอร์เน็ตแบบใช้สาย — 3)', keywords: ['switch', 'สวิตช์', 'hub', 'ฮับ', 'nic', 'การ์ด', 'utp', 'rj-45', 'rj45', 'patch', 'router'], placeholder: 'เช่น Patch Panel / Router / Hub...', model: 'Patch Panel หรือ Router / Hub' },
            { id: 'u4_q4_1', label: '4.1) 10BASE-T — ระบุมาตรฐาน IEEE / สายที่ใช้ / แบบ:', keywords: ['802.3', 'utp', 'baseband'], placeholder: 'เช่น IEEE 802.3i / สาย UTP / แบบ Baseband', model: 'IEEE 802.3i | ใช้กับสาย UTP (Cat3/Cat5) | แบบ Baseband (10 Mbps)' },
            { id: 'u4_q4_2', label: '4.2) 100BASE-TX — ระบุมาตรฐาน IEEE / สายที่ใช้ / แบบ:', keywords: ['802.3u', '802.3', 'utp', 'baseband'], placeholder: 'เช่น IEEE 802.3u / สาย UTP / แบบ Baseband', model: 'IEEE 802.3u | ใช้กับสาย UTP (Cat5/Cat5e) | แบบ Baseband (100 Mbps)' },
            { id: 'u4_q4_3', label: '4.3) 100BASE-FX — ระบุมาตรฐาน IEEE / สายที่ใช้ / แบบ:', keywords: ['802.3u', '802.3', 'fiber', 'ใยแก้ว', 'baseband'], placeholder: 'เช่น IEEE 802.3u / สาย Fiber Optic / แบบ Baseband', model: 'IEEE 802.3u | ใช้กับสาย Fiber Optic (Multi-Mode) | แบบ Baseband (100 Mbps)' },
            { id: 'u4_q4_4', label: '4.4) 1000Base-SX — ระบุมาตรฐาน IEEE / สายที่ใช้ / แบบ:', keywords: ['802.3z', '802.3', 'fiber', 'ใยแก้ว', 'multi', 'baseband'], placeholder: 'เช่น IEEE 802.3z / สาย Fiber Optic (Multi-Mode) / แบบ Baseband', model: 'IEEE 802.3z | ใช้กับสาย Fiber Optic (Multi-Mode คลื่นสั้น) | แบบ Baseband (1 Gbps)' },
            { id: 'u4_q4_5', label: '4.5) 1000Base-LX — ระบุมาตรฐาน IEEE / สายที่ใช้ / แบบ:', keywords: ['802.3z', '802.3', 'fiber', 'ใยแก้ว', 'single', 'baseband'], placeholder: 'เช่น IEEE 802.3z / สาย Fiber Optic (Single/Multi-Mode) / แบบ Baseband', model: 'IEEE 802.3z | ใช้กับสาย Fiber Optic (Single/Multi-Mode คลื่นยาว) | แบบ Baseband (1 Gbps)' },
            { id: 'u4_q4_6', label: '4.6) 1000Base-T — ระบุมาตรฐาน IEEE / สายที่ใช้ / แบบ:', keywords: ['802.3ab', '802.3', 'utp', 'cat5e', 'cat6', 'baseband'], placeholder: 'เช่น IEEE 802.3ab / สาย UTP Cat5e-Cat6 / แบบ Baseband', model: 'IEEE 802.3ab | ใช้กับสาย UTP (Cat5e/Cat6) | แบบ Baseband (1 Gbps)' },
            { id: 'u4_q4_7', label: '4.7) 1000Base-LX10 — ระบุมาตรฐาน IEEE / สายที่ใช้ / แบบ:', keywords: ['802.3ah', '802.3', 'fiber', 'ใยแก้ว', 'single', '10', 'baseband'], placeholder: 'เช่น IEEE 802.3ah / สาย Fiber Optic Single-Mode / แบบ Baseband', model: 'IEEE 802.3ah | ใช้กับสาย Fiber Optic (Single-Mode ระยะ 10 กม.) | แบบ Baseband (1 Gbps)' },
            { id: 'u4_q5', label: '5. จงบอกรายละเอียดมาตรฐานการจัดเรียงสาย UTP และลักษณะการเข้าสาย', multiline: true, keywords: ['568a', '568b', 'ตรง', 'ไขว้', 'straight', 'cross'], placeholder: 'อธิบายมาตรฐาน TIA-568A/568B และสายตรง (Straight-Through) กับสายไขว้ (Crossover)...', model: 'มาตรฐานการจัดเรียงสีสายมี 2 แบบคือ TIA-568A และ TIA-568B โดยลักษณะการเข้าสายแบ่งเป็น สายตรง (Straight-Through: เข้าหัวเหมือนกันทั้งสองข้าง ต่ออุปกรณ์ต่างชนิด เช่น PC–Switch) และสายไขว้ (Crossover: เข้าหัว A–B ต่ออุปกรณ์ชนิดเดียวกัน เช่น PC–PC)' }
          ]
        }
      ],
      connectorPart: null,
      matchingParts: [
        {
          id: 'u4_p2a',
          title: 'ตอนที่ 2 (ซ้าย) ลำดับการจัดเรียงสาย UTP ตามมาตรฐาน TIA-568A (ลำดับที่ 1 – 8)',
          options: [
            { value: 'ขาว-เขียว', label: 'ขาว-เขียว' },
            { value: 'เขียว', label: 'เขียว' },
            { value: 'ขาว-ส้ม', label: 'ขาว-ส้ม' },
            { value: 'ส้ม', label: 'ส้ม' },
            { value: 'น้ำเงิน', label: 'น้ำเงิน' },
            { value: 'ขาว-น้ำเงิน', label: 'ขาว-น้ำเงิน' },
            { value: 'ขาว-น้ำตาล', label: 'ขาว-น้ำตาล' },
            { value: 'น้ำตาล', label: 'น้ำตาล' }
          ],
          rows: [
            { id: 'u4_568a_1', no: 1, prompt: 'TIA-568A ลำดับที่ 1', ans: 'ขาว-เขียว' },
            { id: 'u4_568a_2', no: 2, prompt: 'TIA-568A ลำดับที่ 2', ans: 'เขียว' },
            { id: 'u4_568a_3', no: 3, prompt: 'TIA-568A ลำดับที่ 3', ans: 'ขาว-ส้ม' },
            { id: 'u4_568a_4', no: 4, prompt: 'TIA-568A ลำดับที่ 4', ans: 'น้ำเงิน' },
            { id: 'u4_568a_5', no: 5, prompt: 'TIA-568A ลำดับที่ 5', ans: 'ขาว-น้ำเงิน' },
            { id: 'u4_568a_6', no: 6, prompt: 'TIA-568A ลำดับที่ 6', ans: 'ส้ม' },
            { id: 'u4_568a_7', no: 7, prompt: 'TIA-568A ลำดับที่ 7', ans: 'ขาว-น้ำตาล' },
            { id: 'u4_568a_8', no: 8, prompt: 'TIA-568A ลำดับที่ 8', ans: 'น้ำตาล' }
          ]
        },
        {
          id: 'u4_p2b',
          title: 'ตอนที่ 2 (ขวา) ลำดับการจัดเรียงสาย UTP ตามมาตรฐาน TIA-568B (ลำดับที่ 1 – 8)',
          options: [
            { value: 'ขาว-ส้ม', label: 'ขาว-ส้ม' },
            { value: 'ส้ม', label: 'ส้ม' },
            { value: 'ขาว-เขียว', label: 'ขาว-เขียว' },
            { value: 'เขียว', label: 'เขียว' },
            { value: 'น้ำเงิน', label: 'น้ำเงิน' },
            { value: 'ขาว-น้ำเงิน', label: 'ขาว-น้ำเงิน' },
            { value: 'ขาว-น้ำตาล', label: 'ขาว-น้ำตาล' },
            { value: 'น้ำตาล', label: 'น้ำตาล' }
          ],
          rows: [
            { id: 'u4_568b_1', no: 1, prompt: 'TIA-568B ลำดับที่ 1', ans: 'ขาว-ส้ม' },
            { id: 'u4_568b_2', no: 2, prompt: 'TIA-568B ลำดับที่ 2', ans: 'ส้ม' },
            { id: 'u4_568b_3', no: 3, prompt: 'TIA-568B ลำดับที่ 3', ans: 'ขาว-เขียว' },
            { id: 'u4_568b_4', no: 4, prompt: 'TIA-568B ลำดับที่ 4', ans: 'น้ำเงิน' },
            { id: 'u4_568b_5', no: 5, prompt: 'TIA-568B ลำดับที่ 5', ans: 'ขาว-น้ำเงิน' },
            { id: 'u4_568b_6', no: 6, prompt: 'TIA-568B ลำดับที่ 6', ans: 'เขียว' },
            { id: 'u4_568b_7', no: 7, prompt: 'TIA-568B ลำดับที่ 7', ans: 'ขาว-น้ำตาล' },
            { id: 'u4_568b_8', no: 8, prompt: 'TIA-568B ลำดับที่ 8', ans: 'น้ำตาล' }
          ]
        },
        {
          id: 'u4_p3',
          title: 'ตอนที่ 3 ให้นักเรียนเรียงลำดับการเข้าสาย UTP CAT5e กับหัวต่อ RJ-45 ให้ถูกต้อง (ลำดับที่ 1 – 8)',
          options: [
            { value: 'ปอกเปลือกหุ้มสาย', label: 'ปอกเปลือกหุ้มสาย' },
            { value: 'คลี่สายออกมา', label: 'คลี่สายออกมา' },
            { value: 'จัดเรียงสายตามมาตรฐาน', label: 'จัดเรียงสายตามมาตรฐาน' },
            { value: 'จัดสายให้เรียงชิดกัน', label: 'จัดสายให้เรียงชิดกัน' },
            { value: 'ตัดปลายสายเป็นแนวตรง', label: 'ตัดปลายสายเป็นแนวตรง' },
            { value: 'สอดเข้าไปในหัวต่อ', label: 'สอดเข้าไปในหัวต่อ' },
            { value: 'ใช้คีมบีบหัวต่อที่เข้าสายให้แน่น', label: 'ใช้คีมบีบหัวต่อที่เข้าสายให้แน่น' },
            { value: 'ใช้เครื่องมือตรวจสอบการเข้าสาย', label: 'ใช้เครื่องมือตรวจสอบการเข้าสาย' }
          ],
          rows: [
            { id: 'u4_p3_1', no: 1, prompt: 'ขั้นตอนลำดับที่ 1', ans: 'ปอกเปลือกหุ้มสาย' },
            { id: 'u4_p3_2', no: 2, prompt: 'ขั้นตอนลำดับที่ 2', ans: 'คลี่สายออกมา' },
            { id: 'u4_p3_3', no: 3, prompt: 'ขั้นตอนลำดับที่ 3', ans: 'จัดเรียงสายตามมาตรฐาน' },
            { id: 'u4_p3_4', no: 4, prompt: 'ขั้นตอนลำดับที่ 4', ans: 'จัดสายให้เรียงชิดกัน' },
            { id: 'u4_p3_5', no: 5, prompt: 'ขั้นตอนลำดับที่ 5', ans: 'ตัดปลายสายเป็นแนวตรง' },
            { id: 'u4_p3_6', no: 6, prompt: 'ขั้นตอนลำดับที่ 6', ans: 'สอดเข้าไปในหัวต่อ' },
            { id: 'u4_p3_7', no: 7, prompt: 'ขั้นตอนลำดับที่ 7', ans: 'ใช้คีมบีบหัวต่อที่เข้าสายให้แน่น' },
            { id: 'u4_p3_8', no: 8, prompt: 'ขั้นตอนลำดับที่ 8', ans: 'ใช้เครื่องมือตรวจสอบการเข้าสาย' }
          ]
        }
      ]
    },
    5: {
      title: 'แบบฝึกทักษะบทเรียนที่ 5: เครือข่าย LAN แบบไร้สาย',
      instruction: 'คำชี้แจง: ให้นักเรียนตอบคำถามต่อไปนี้ให้ครบถ้วน (รองรับระบบส่งงาน Cloud, Auto-Check และพิมพ์ PDF)',
      writtenSections: [
        {
          no: 1,
          prompt: 'จงบอกข้อดีของเครือข่ายแบบไร้สาย',
          items: [
            { id: 'u5_q1_1', label: '1)', keywords: ['สะดวก', 'เคลื่อนย้าย', 'พกพา', 'ไม่จำกัด', 'อิสระ'], placeholder: 'เช่น เคลื่อนย้ายอุปกรณ์ได้สะดวกไม่ต้องต่อสาย...', model: 'สะดวกในการใช้งานและเคลื่อนย้ายอุปกรณ์ได้อิสระโดยไม่ต้องต่อสายสัญญาณ' },
            { id: 'u5_q1_2', label: '2)', keywords: ['ติดตั้ง', 'ง่าย', 'รวดเร็ว', 'ขยาย', 'สาย'], placeholder: 'เช่น ติดตั้งง่ายและขยายเครือข่ายได้รวดเร็ว...', model: 'ติดตั้งง่าย รวดเร็ว ไม่ต้องเดินสายสัญญาณให้ยุ่งยาก และขยายเครือข่ายได้ง่าย' },
            { id: 'u5_q1_3', label: '3)', keywords: ['พื้นที่', 'ประหยัด', 'หลายเครื่อง', 'รองรับ', 'ต้นทุน'], placeholder: 'เช่น รองรับอุปกรณ์พกพาหลากหลายและลดค่าเดินสาย...', model: 'รองรับอุปกรณ์พกพาหลายชนิด (สมาร์ตโฟน/โน้ตบุ๊ก/แท็บเล็ต) และลดต้นทุนการเดินสาย' }
          ]
        },
        {
          no: 2,
          prompt: 'มาตรฐานเครือข่ายไร้สายต่อไปนี้ ส่งข้อมูลที่ความเร็วสูงสุดเท่าใด และเทียบกับ Wi-Fi ใดบ้าง',
          items: [
            { id: 'u5_q2_1', label: '1) IEEE 802.11n (ความเร็วสูงสุด / เทียบได้กับ Wi-Fi):', keywords: ['600', '4', 'wi-fi 4', 'wifi 4'], placeholder: 'เช่น 600 Mbps / Wi-Fi 4', model: 'ส่งข้อมูลความเร็วสูงสุด 600 Mbps เทียบได้กับ Wi-Fi 4' },
            { id: 'u5_q2_2', label: '2) IEEE 802.11ac (ความเร็วสูงสุด / เทียบได้กับ Wi-Fi):', keywords: ['6.9', '6933', '1.3', '3.5', '5', 'wi-fi 5', 'wifi 5'], placeholder: 'เช่น 6.9 Gbps (หรือ 1.3–6.9 Gbps) / Wi-Fi 5', model: 'ส่งข้อมูลความเร็วสูงสุดประมาณ 6.9 Gbps เทียบได้กับ Wi-Fi 5' },
            { id: 'u5_q2_3', label: '3) IEEE 802.11ax (ความเร็วสูงสุด / เทียบได้กับ Wi-Fi):', keywords: ['9.6', '6', 'wi-fi 6', 'wifi 6'], placeholder: 'เช่น 9.6 Gbps / Wi-Fi 6', model: 'ส่งข้อมูลความเร็วสูงสุด 9.6 Gbps เทียบได้กับ Wi-Fi 6' }
          ]
        },
        {
          no: 3,
          prompt: 'จงบอกลักษณะและความแตกต่างของเทคนิคการส่งข้อมูลไร้สายต่อไปนี้',
          items: [
            { id: 'u5_q3_1', label: '1) SU-MIMO:', keywords: ['ทีละ', 'เครื่องเดียว', 'single', '1', 'หนึ่ง'], placeholder: 'อธิบายการทำงานของ SU-MIMO...', model: 'Single-User MIMO ส่งข้อมูลด้วยหลายเสาอากาศให้ลูกข่ายได้ทีละ 1 เครื่องต่อครั้ง' },
            { id: 'u5_q3_2', label: '2) MU-MIMO:', keywords: ['หลาย', 'พร้อมกัน', 'multi', 'มากกว่า'], placeholder: 'อธิบายการทำงานของ MU-MIMO...', model: 'Multi-User MIMO ส่งข้อมูลให้ลูกข่ายหลายเครื่องพร้อมกันในเวลาเดียวกัน ลดความหน่วง' }
          ]
        },
        {
          no: 4,
          prompt: 'จงบอกหน้าที่ของอุปกรณ์เครือข่ายไร้สายต่อไปนี้',
          items: [
            { id: 'u5_q4_1', label: '1) Access Point ทำหน้าที่:', keywords: ['กระจาย', 'เชื่อม', 'lan', 'สัญญาณ', 'จุด'], placeholder: 'อธิบายหน้าที่ของ Access Point...', model: 'เป็นจุดกระจายสัญญาณไร้สายเพื่อเชื่อมต่ออุปกรณ์ไร้สายเข้ากับเครือข่าย LAN แบบใช้สาย' },
            { id: 'u5_q4_2', label: '2) Range Extender ทำหน้าที่:', keywords: ['ขยาย', 'ทวน', 'ไกล', 'พื้นที่', 'สัญญาณ'], placeholder: 'อธิบายหน้าที่ของ Range Extender...', model: 'รับสัญญาณ Wi-Fi เดิมแล้วขยาย/ทวนสัญญาณให้ครอบคลุมพื้นที่ใช้งานได้ไกลขึ้น' },
            { id: 'u5_q4_3', label: '3) Wireless Bridge ทำหน้าที่:', keywords: ['เชื่อม', 'วง', 'อาคาร', '2', 'สอง', 'สะพาน'], placeholder: 'อธิบายหน้าที่ของ Wireless Bridge...', model: 'เชื่อมต่อเครือข่าย LAN สองวงหรือสองอาคารเข้าด้วยกันแบบไร้สายโดยไม่ต้องเดินสาย' }
          ]
        },
        {
          no: 5,
          prompt: 'จงบอกรูปแบบการเชื่อมต่อระบบเครือข่ายไร้สายว่ามีแบบใดบ้าง',
          items: [
            { id: 'u5_q5_1', label: '1)', keywords: ['ad-hoc', 'adhoc', 'peer', 'ibss', 'ตรง'], placeholder: 'เช่น Ad-Hoc Mode (Peer-to-Peer)...', model: 'แบบ Ad-Hoc (IBSS / Peer-to-Peer) เชื่อมต่อตรงระหว่างอุปกรณ์โดยไม่ผ่าน AP' },
            { id: 'u5_q5_2', label: '2)', keywords: ['infrastructure', 'bss', 'ap', 'access point'], placeholder: 'เช่น Infrastructure Mode (ผ่าน AP)...', model: 'แบบ Infrastructure (BSS) เชื่อมต่อลูกข่ายผ่าน Access Point เป็นศูนย์กลาง' },
            { id: 'u5_q5_3', label: '3)', keywords: ['ess', 'bridge', 'mesh', 'point', 'หลาย'], placeholder: 'เช่น ESS (หลาย AP) / Point-to-Point / Mesh...', model: 'แบบ Extended Service Set (ESS) ใช้ AP หลายตัวเชื่อมกัน หรือแบบ Point-to-Point / Mesh' }
          ]
        },
        {
          no: 6,
          prompt: 'จงบอกวิธีการรักษาความปลอดภัยของเครือข่ายไร้สายว่ามีวิธีใดบ้าง',
          items: [
            { id: 'u5_q6_1', label: '1)', keywords: ['wpa', 'wpa2', 'wpa3', 'เข้ารหัส', 'รหัสผ่าน'], placeholder: 'เช่น เปิดการเข้ารหัส WPA2-AES / WPA3...', model: 'กำหนดการเข้ารหัสความปลอดภัยด้วย WPA2-PSK (AES) หรือ WPA3 และตั้งรหัสผ่านให้คาดเดายาก' },
            { id: 'u5_q6_2', label: '2)', keywords: ['mac', 'filter', 'กรอง'], placeholder: 'เช่น เปิดใช้งาน MAC Address Filtering...', model: 'กำหนดสิทธิ์การเชื่อมต่อด้วย MAC Address Filtering' },
            { id: 'u5_q6_3', label: '3)', keywords: ['ssid', 'ซ่อน', 'admin', 'wps', 'firmware', 'guest'], placeholder: 'เช่น ซ่อน SSID / เปลี่ยนรหัส Admin / ปิด WPS...', model: 'ซ่อนชื่อ SSID, เปลี่ยนรหัสผ่านผู้ดูแล Router, ปิด WPS และอัปเดต Firmware สม่ำเสมอ' }
          ]
        }
      ],
      connectorPart: null
    },
    6: {
      title: 'แบบฝึกทักษะบทเรียนที่ 6: การใช้งานเครือข่ายในระบบปฏิบัติการวินโดวส์',
      instruction: 'คำชี้แจง: ให้นักเรียนอธิบายขั้นตอนการตั้งค่าเครือข่ายใน Windows 10/11 โดยสังเขปทั้ง 5 ข้อ',
      writtenSections: [
        {
          no: 1,
          prompt: 'จงบอกขั้นตอนการตรวจสอบชื่อและเปลี่ยนชื่อเครื่องคอมพิวเตอร์โดยสังเขป',
          items: [
            { id: 'u6_q1_1', label: '1)', keywords: ['this pc', 'settings', 'system', 'sysdm', 'คลิกขวา', 'properties'], placeholder: 'ขั้นที่ 1 เช่น คลิกขวา This PC → Properties หรือ Settings → System...', model: 'เปิด Settings → System → About (หรือคลิกขวา This PC → Properties / รัน sysdm.cpl)' },
            { id: 'u6_q1_2', label: '2)', keywords: ['rename', 'change', 'computer name', 'เปลี่ยน'], placeholder: 'ขั้นที่ 2 เช่น กดปุ่ม Rename this PC หรือ Change...', model: 'คลิกปุ่ม Rename this PC (หรือแท็บ Computer Name → Change)' },
            { id: 'u6_q1_3', label: '3)', keywords: ['พิมพ์', 'ชื่อ', 'กรอก', 'ใหม่', 'ok', 'next'], placeholder: 'ขั้นที่ 3 เช่น พิมพ์ชื่อเครื่องใหม่ที่ไม่ซ้ำในวง LAN...', model: 'พิมพ์ชื่อเครื่องคอมพิวเตอร์ใหม่ที่ไม่ซ้ำกับเครื่องอื่น แล้วคลิก Next / OK' },
            { id: 'u6_q1_4', label: '4)', keywords: ['restart', 'รีสตาร์ต', 'เริ่มใหม่'], placeholder: 'ขั้นที่ 4 เช่น รีสตาร์ตเครื่องเพื่อให้มีผล...', model: 'รีสตาร์ตเครื่องคอมพิวเตอร์ (Restart now) เพื่อให้การเปลี่ยนชื่อมีผล' }
          ]
        },
        {
          no: 2,
          prompt: 'จงบอกขั้นตอนการตรวจสอบและเปลี่ยนชื่อเครือข่าย (Workgroup) โดยสังเขป',
          items: [
            { id: 'u6_q2_1', label: '1)', keywords: ['this pc', 'properties', 'sysdm', 'advanced', 'system'], placeholder: 'ขั้นที่ 1 เช่น เปิด System Properties (sysdm.cpl)...', model: 'เปิดหน้าต่าง System Properties (รัน sysdm.cpl หรือ Advanced system settings)' },
            { id: 'u6_q2_2', label: '2)', keywords: ['computer name', 'change', 'แท็บ'], placeholder: 'ขั้นที่ 2 เช่น เลือกแท็บ Computer Name แล้วคลิก Change...', model: 'เลือกแท็บ Computer Name แล้วคลิกปุ่ม Change' },
            { id: 'u6_q2_3', label: '3)', keywords: ['workgroup', 'ชื่อ', 'พิมพ์', 'กรอก'], placeholder: 'ขั้นที่ 3 เช่น พิมพ์ชื่อ Workgroup ใหม่ให้ตรงกับทุกเครื่อง...', model: 'ในช่อง Member of เลือก Workgroup แล้วพิมพ์ชื่อกลุ่มเครือข่ายที่ต้องการ จากนั้นกด OK' },
            { id: 'u6_q2_4', label: '4)', keywords: ['restart', 'รีสตาร์ต', 'เริ่มใหม่'], placeholder: 'ขั้นที่ 4 เช่น รีสตาร์ตเครื่อง...', model: 'รีสตาร์ตเครื่องคอมพิวเตอร์เพื่อให้เข้าสู่ Workgroup ใหม่สมบูรณ์' }
          ]
        },
        {
          no: 3,
          prompt: 'จงบอกขั้นตอนการเปลี่ยนหมายเลขไอพีของเครื่องโดยสังเขป',
          items: [
            { id: 'u6_q3_1', label: '1)', keywords: ['control panel', 'network', 'ncpa', 'adapter', 'settings'], placeholder: 'ขั้นที่ 1 เช่น เปิด Network Connections (ncpa.cpl)...', model: 'เปิด Control Panel → Network and Sharing Center → Change adapter settings (หรือรัน ncpa.cpl)' },
            { id: 'u6_q3_2', label: '2)', keywords: ['ethernet', 'wi-fi', 'คลิกขวา', 'properties'], placeholder: 'ขั้นที่ 2 เช่น คลิกขวา Ethernet/Wi-Fi → Properties...', model: 'คลิกขวาที่การ์ดเครือข่าย (Ethernet หรือ Wi-Fi) แล้วเลือก Properties' },
            { id: 'u6_q3_3', label: '3)', keywords: ['ipv4', 'tcp/ip', 'internet protocol'], placeholder: 'ขั้นที่ 3 เช่น ดับเบิลคลิก Internet Protocol Version 4 (TCP/IPv4)...', model: 'เลือก Internet Protocol Version 4 (TCP/IPv4) แล้วคลิก Properties' },
            { id: 'u6_q3_4', label: '4)', keywords: ['ip', 'subnet', 'gateway', 'dns', 'ok', 'static'], placeholder: 'ขั้นที่ 4 เช่น กรอก IP, Subnet Mask, Gateway, DNS แล้วกด OK...', model: 'เลือก Use the following IP address กรอก IP Address, Subnet Mask, Default Gateway และ DNS แล้วกด OK' }
          ]
        },
        {
          no: 4,
          prompt: 'จงบอกขั้นตอนการแชร์โฟลเดอร์ในวินโดวส์ 10 โดยสังเขป',
          items: [
            { id: 'u6_q4_1', label: '1)', keywords: ['คลิกขวา', 'โฟลเดอร์', 'properties', 'sharing'], placeholder: 'ขั้นที่ 1 เช่น คลิกขวาโฟลเดอร์ที่ต้องการ → Properties...', model: 'คลิกขวาโฟลเดอร์ที่ต้องการแชร์ → เลือก Properties → ไปที่แท็บ Sharing' },
            { id: 'u6_q4_2', label: '2)', keywords: ['advanced sharing', 'share', 'ติ๊ก'], placeholder: 'ขั้นที่ 2 เช่น คลิก Advanced Sharing แล้วติ๊ก Share this folder...', model: 'คลิก Advanced Sharing แล้วติ๊กเลือก Share this folder พร้อมตั้งชื่อแชร์' },
            { id: 'u6_q4_3', label: '3)', keywords: ['permissions', 'สิทธิ์', 'everyone', 'read', 'change', 'full'], placeholder: 'ขั้นที่ 3 เช่น คลิก Permissions กำหนดสิทธิ์ Read/Change/Full Control...', model: 'คลิก Permissions เพื่อกำหนดสิทธิ์ผู้ใช้ (เช่น Everyone = Read หรือ Change) แล้วกด Apply / OK' },
            { id: 'u6_q4_4', label: '4)', keywords: ['discovery', '\\\\', 'ทดสอบ', 'unc', 'security', 'ok'], placeholder: 'ขั้นที่ 4 เช่น เปิด Network Discovery และทดสอบเข้าผ่าน \\\\IP...', model: 'ตรวจสอบให้เปิด Network Discovery & File Sharing แล้วทดสอบเข้าถึงจากเครื่องอื่นผ่าน \\\\ชื่อเครื่อง\\ชื่อแชร์' }
          ]
        },
        {
          no: 5,
          prompt: 'จงบอกขั้นตอนการแชร์เครื่องพิมพ์ในวินโดวส์ 10 โดยสังเขป',
          items: [
            { id: 'u6_q5_1', label: '1)', keywords: ['control panel', 'devices', 'printers', 'settings', 'เครื่องพิมพ์'], placeholder: 'ขั้นที่ 1 เช่น เปิด Control Panel → Devices and Printers...', model: 'เปิด Control Panel → Devices and Printers (หรือ Settings → Printers & scanners)' },
            { id: 'u6_q5_2', label: '2)', keywords: ['คลิกขวา', 'printer properties', 'manage', 'properties'], placeholder: 'ขั้นที่ 2 เช่น คลิกขวาเครื่องพิมพ์ → Printer properties...', model: 'คลิกขวาที่เครื่องพิมพ์ที่ต้องการแชร์ แล้วเลือก Printer properties' },
            { id: 'u6_q5_3', label: '3)', keywords: ['sharing', 'share this printer', 'ติ๊ก', 'ชื่อ'], placeholder: 'ขั้นที่ 3 เช่น ไปที่แท็บ Sharing ติ๊ก Share this printer...', model: 'เลือกแท็บ Sharing ติ๊กเลือก Share this printer และกำหนดชื่อแชร์เครื่องพิมพ์ แล้วกด OK' },
            { id: 'u6_q5_4', label: '4)', keywords: ['connect', 'เชื่อมต่อ', 'add', '\\\\', 'ทดสอบ', 'พิมพ์'], placeholder: 'ขั้นที่ 4 เช่น เครื่องอื่นเชื่อมต่อเครื่องพิมพ์ที่แชร์และทดสอบพิมพ์...', model: 'เครื่องลูกข่ายในวง LAN เข้าไปเชื่อมต่อเครื่องพิมพ์ผ่าน Network หรือ \\\\ชื่อเครื่อง แล้วทดสอบสั่งพิมพ์' }
          ]
        }
      ],
      connectorPart: null
    },
    7: {
      title: 'แบบฝึกทักษะบทเรียนที่ 7: ระบบปฏิบัติการเครือข่าย',
      instruction: 'คำชี้แจง: ให้นักเรียนตอบคำถามเกี่ยวกับระบบปฏิบัติการเครือข่าย (NOS) และเครื่องจำลอง (VM) ให้ครบทั้ง 5 ข้อ',
      writtenSections: [
        {
          no: 1,
          prompt: 'จงบอกชื่อบริการที่มีในระบบปฏิบัติการเครือข่าย (5 บริการ)',
          items: [
            { id: 'u7_q1_1', label: '1)', keywords: ['file', 'ไฟล์', 'print', 'พิมพ์', 'dhcp', 'dns', 'web', 'mail', 'ad', 'active directory', 'ftp'], placeholder: 'เช่น File & Print Server...', model: 'บริการแชร์ไฟล์และเครื่องพิมพ์ (File & Print Services)' },
            { id: 'u7_q1_2', label: '2)', keywords: ['dhcp', 'dns', 'web', 'mail', 'ad', 'active directory', 'file', 'ftp', 'vpn'], placeholder: 'เช่น DHCP Server (แจก IP อัตโนมัติ)...', model: 'บริการแจกหมายเลข IP อัตโนมัติ (DHCP Service)' },
            { id: 'u7_q1_3', label: '3)', keywords: ['dns', 'dhcp', 'web', 'mail', 'ad', 'active directory', 'file', 'ftp', 'vpn'], placeholder: 'เช่น DNS Server (แปลงชื่อโดเมน)...', model: 'บริการแปลงชื่อโดเมนเป็น IP (DNS Service)' },
            { id: 'u7_q1_4', label: '4)', keywords: ['web', 'http', 'iis', 'apache', 'mail', 'ad', 'active directory', 'file', 'dhcp', 'dns'], placeholder: 'เช่น Web Server (IIS/Apache)...', model: 'บริการเว็บเซิร์ฟเวอร์ (Web Service / HTTP-HTTPS)' },
            { id: 'u7_q1_5', label: '5)', keywords: ['ad', 'active directory', 'user', 'บัญชี', 'mail', 'ftp', 'backup', 'vpn', 'security'], placeholder: 'เช่น Active Directory (จัดการบัญชีผู้ใช้)...', model: 'บริการจัดการบัญชีผู้ใช้และสิทธิ์แบบรวมศูนย์ (Active Directory / Directory Service)' }
          ]
        },
        {
          no: 2,
          prompt: 'จงบอกชื่อระบบปฏิบัติการเครือข่าย (5 ชื่อ)',
          items: [
            { id: 'u7_q2_1', label: '1)', keywords: ['windows server', 'windows', 'linux', 'ubuntu', 'unix', 'netware', 'freebsd', 'macos'], placeholder: 'เช่น Windows Server...', model: 'Windows Server (เช่น 2019 / 2022)' },
            { id: 'u7_q2_2', label: '2)', keywords: ['linux', 'ubuntu', 'debian', 'centos', 'red hat', 'unix', 'freebsd', 'netware'], placeholder: 'เช่น Linux Server (Ubuntu / Debian)...', model: 'Linux Server (Ubuntu Server / Red Hat)' },
            { id: 'u7_q2_3', label: '3)', keywords: ['unix', 'freebsd', 'solaris', 'netware', 'novell', 'macos', 'linux', 'centos'], placeholder: 'เช่น UNIX / FreeBSD...', model: 'UNIX / FreeBSD' },
            { id: 'u7_q2_4', label: '4)', keywords: ['netware', 'novell', 'macos', 'freebsd', 'solaris', 'ubuntu', 'debian', 'rocky'], placeholder: 'เช่น Novell NetWare...', model: 'Novell NetWare' },
            { id: 'u7_q2_5', label: '5)', keywords: ['macos', 'solaris', 'freebsd', 'debian', 'centos', 'red hat', 'fedora', 'suse'], placeholder: 'เช่น macOS Server / Solaris...', model: 'macOS Server / Oracle Solaris' }
          ]
        },
        {
          no: 3,
          prompt: 'จงบอกชื่อระบบปฏิบัติการ Linux ที่นิยมใช้เป็นระบบปฏิบัติการเครือข่าย (3 ชื่อ)',
          items: [
            { id: 'u7_q3_1', label: '1)', keywords: ['ubuntu', 'debian', 'red hat', 'rhel', 'centos', 'rocky', 'fedora', 'suse', 'alma'], placeholder: 'เช่น Ubuntu Server...', model: 'Ubuntu Server' },
            { id: 'u7_q3_2', label: '2)', keywords: ['ubuntu', 'debian', 'red hat', 'rhel', 'centos', 'rocky', 'fedora', 'suse', 'alma'], placeholder: 'เช่น Debian / CentOS / Rocky Linux...', model: 'Debian (หรือ CentOS / Rocky Linux)' },
            { id: 'u7_q3_3', label: '3)', keywords: ['ubuntu', 'debian', 'red hat', 'rhel', 'centos', 'rocky', 'fedora', 'suse', 'alma'], placeholder: 'เช่น Red Hat Enterprise Linux (RHEL) / SUSE...', model: 'Red Hat Enterprise Linux (RHEL) หรือ openSUSE' }
          ]
        },
        {
          no: 4,
          prompt: 'จงบอกชื่อซอฟต์แวร์จำลองเครื่องคอมพิวเตอร์ (Virtual Machine) ที่นิยมใช้งาน (2 ชื่อ)',
          items: [
            { id: 'u7_q4_1', label: '1)', keywords: ['virtualbox', 'vmware', 'hyper-v', 'proxmox', 'kvm', 'qemu', 'parallels'], placeholder: 'เช่น Oracle VirtualBox...', model: 'Oracle VM VirtualBox' },
            { id: 'u7_q4_2', label: '2)', keywords: ['vmware', 'virtualbox', 'hyper-v', 'proxmox', 'kvm', 'qemu', 'parallels'], placeholder: 'เช่น VMware Workstation / Microsoft Hyper-V...', model: 'VMware Workstation (หรือ Microsoft Hyper-V)' }
          ]
        },
        {
          no: 5,
          prompt: 'จงบอกขั้นตอนในการติดตั้งระบบปฏิบัติการบนเครื่องจำลอง VirtualBox (3 ขั้นตอนหลัก)',
          items: [
            { id: 'u7_q5_1', label: '1)', keywords: ['สร้าง', 'new', 'vm', 'ram', 'disk', 'hard', 'จัดสรร'], placeholder: 'ขั้นที่ 1 เช่น กด New สร้าง VM และจัดสรร RAM / Virtual Hard Disk...', model: 'คลิก New เพื่อสร้างเครื่องจำลอง (VM) ตั้งชื่อ เลือกชนิด OS และจัดสรร RAM / Virtual Hard Disk' },
            { id: 'u7_q5_2', label: '2)', keywords: ['iso', 'mount', 'storage', 'network', 'bridged', 'ตั้งค่า'], placeholder: 'ขั้นที่ 2 เช่น ใส่ไฟล์ .ISO ใน Storage และตั้งค่า Virtual Network...', model: 'เข้าไปที่ Settings → Storage เพื่อ Mount ไฟล์ติดตั้ง .ISO และตั้งโหมด Network (NAT/Bridged)' },
            { id: 'u7_q5_3', label: '3)', keywords: ['start', 'boot', 'ติดตั้ง', 'install', 'เปิด'], placeholder: 'ขั้นที่ 3 เช่น กด Start บูตจาก .ISO แล้วดำเนินการติดตั้ง OS จนเสร็จ...', model: 'กดปุ่ม Start เพื่อบูตเครื่องจำลองจากไฟล์ .ISO และดำเนินการติดตั้งระบบปฏิบัติการตามขั้นตอนจนเสร็จ' }
          ]
        }
      ],
      connectorPart: null
    },
    8: {
      title: 'แบบฝึกทักษะบทเรียนที่ 8: การออกแบบ ติดตั้ง ตรวจสอบ และแก้ปัญหาเครือข่าย',
      instruction: 'คำชี้แจง: ให้นักเรียนตอบคำถามครบทั้ง 7 ข้อ (รวมซอฟต์แวร์ช่วยงาน Utility ในข้อ 7)',
      writtenSections: [
        {
          no: 1,
          prompt: 'จงบอกรายละเอียดการแบ่งชั้นเครือข่ายเป็น 3 ชั้น ตามแนวทางการออกแบบของ Cisco',
          items: [
            { id: 'u8_q1_1', label: '1) ชั้นแกนหลัก (Core Layer) คือ', keywords: ['เร็ว', 'แกน', 'หลัก', 'ส่งผ่าน', 'backbone', 'ความเร็วสูง'], placeholder: 'อธิบายหน้าที่ของ Core Layer...', model: 'ชั้นแกนหลักความเร็วสูง ทำหน้าที่ส่งผ่านข้อมูลระหว่างพื้นที่ต่าง ๆ อย่างรวดเร็วและเสถียรสูงสุด' },
            { id: 'u8_q1_2', label: '2) ชั้นกระจายสัญญาณ (Distribution Layer) คือ', keywords: ['กระจาย', 'เชื่อม', 'นโยบาย', 'routing', 'vlan', 'กรอง', 'ควบคุม'], placeholder: 'อธิบายหน้าที่ของ Distribution Layer...', model: 'ชั้นกลางเชื่อมระหว่าง Core กับ Access ทำหน้าที่จัดเส้นทาง (Routing), แบ่ง VLAN และควบคุมสิทธิ์/นโยบาย' },
            { id: 'u8_q1_3', label: '3) ชั้นการเชื่อมต่อ (Access Layer) คือ', keywords: ['ผู้ใช้', 'ปลายทาง', 'เครื่อง', 'switch', 'ap', 'เชื่อมต่อ'], placeholder: 'อธิบายหน้าที่ของ Access Layer...', model: 'ชั้นล่างสุดที่เชื่อมต่ออุปกรณ์ของผู้ใช้ปลายทาง (PC, Printer, Access Point) เข้าสู่เครือข่าย' }
          ]
        },
        {
          no: 2,
          prompt: 'จงบอกชื่อเครื่องมือที่ใช้ในการเขียนแผนผังเครือข่าย',
          items: [
            { id: 'u8_q2', label: 'คำตอบ:', keywords: ['visio', 'draw.io', 'packet tracer', 'lucidchart', 'dia', 'smartdraw', 'canva'], placeholder: 'เช่น Microsoft Visio, Cisco Packet Tracer, draw.io, Lucidchart...', model: 'Microsoft Visio, Cisco Packet Tracer, diagrams.net (draw.io), SmartDraw, Lucidchart' }
          ]
        },
        {
          no: 3,
          prompt: 'จงตอบคำถามเกี่ยวกับการเดินสายและติดตั้งต่อไปนี้',
          items: [
            { id: 'u8_q3_1', label: '1) อุปกรณ์ตู้ Rack แบ่งตามลักษณะการติดตั้งได้เป็น', keywords: ['ตั้งพื้น', 'ติดผนัง', 'open', 'wall', 'close', 'floor'], placeholder: 'เช่น ตู้แบบตั้งพื้น (Close/Floor Rack), ตู้ติดผนัง (Wall Rack), แบบเปิด (Open Rack)...', model: 'แบบตั้งพื้น (Floor/Close Rack), แบบติดผนัง (Wall Rack) และแบบโครงเปิด (Open Rack)' },
            { id: 'u8_q3_2', label: '2) อุปกรณ์ตู้ Rack แบ่งตามขนาดและการใส่อุปกรณ์ได้เป็น', keywords: ['u', 'นิ้ว', '19', '6u', '9u', '15u', '27u', '42u', 'ความสูง', 'ความลึก'], placeholder: 'เช่น ขนาดมาตรฐานหน้ากว้าง 19 นิ้ว แบ่งความสูงเป็นหน่วย U (6U, 9U, 15U, 27U, 42U)...', model: 'มาตรฐานกว้าง 19 นิ้ว แบ่งตามความสูงเป็นหน่วย U (เช่น 6U, 9U, 15U, 27U, 42U) และความลึก (60/80/100 ซม.)' },
            { id: 'u8_q3_3', label: '3) การเดินสาย LAN สามารถใช้วิธี', keywords: ['ราง', 'ท่อ', 'ฝ้า', 'พื้น', 'ลอย', 'ฝัง'], placeholder: 'เช่น เดินในรางสายไฟ/ท่อร้อยสาย, เดินบนฝ้าเพดาน, เดินใต้พื้นยก...', model: 'เดินในรางเก็บสาย (Wireway), เดินในท่อร้อยสาย (PVC/EMT), เดินบนฝ้าเพดาน หรือเดินใต้พื้นยก (Raised Floor)' }
          ]
        },
        {
          no: 4,
          prompt: 'จงบอกชื่อคำสั่งในการดำเนินการต่อไปนี้',
          items: [
            { id: 'u8_q4_1', label: '1) ตรวจสอบการเชื่อมต่อ ใช้คำสั่ง', keywords: ['ping'], placeholder: 'เช่น ping', model: 'ping' },
            { id: 'u8_q4_2', label: '2) ค้นหาจุดบกพร่องและแสดงสถิติการทำงานของเครือข่าย ใช้คำสั่ง', keywords: ['netstat', 'pathping'], placeholder: 'เช่น netstat', model: 'netstat (หรือ pathping)' },
            { id: 'u8_q4_3', label: '3) แสดงชื่อเครื่องและหมายเลข IP ของเครื่อง ใช้คำสั่ง', keywords: ['ipconfig', 'hostname'], placeholder: 'เช่น ipconfig /all', model: 'ipconfig (หรือ ipconfig /all)' },
            { id: 'u8_q4_4', label: '4) ตรวจสอบเส้นทางการเดินทางว่าผ่านเส้นทางใดบ้าง ใช้คำสั่ง', keywords: ['tracert', 'traceroute'], placeholder: 'เช่น tracert', model: 'tracert (Windows) / traceroute (Linux)' },
            { id: 'u8_q4_5', label: '5) ตรวจสอบระบบ Domain Name ใช้คำสั่ง', keywords: ['nslookup', 'dig'], placeholder: 'เช่น nslookup', model: 'nslookup' }
          ]
        },
        {
          no: 5,
          prompt: 'จงบอกปัญหาที่เกิดจากสาย UTP (3 ข้อ)',
          items: [
            { id: 'u8_q5_1', label: '1)', keywords: ['ขาด', 'หัก', 'ชำรุด', 'หลวม', 'เข้าหัว', 'สลับ', 'เกิน 100', 'รบกวน'], placeholder: 'เช่น สายขาดใน/หักงอ...', model: 'สายสัญญาณขาดใน หักงอ หรือฉนวนชำรุด' },
            { id: 'u8_q5_2', label: '2)', keywords: ['หัว', 'rj-45', 'rj45', 'หลวม', 'สลับ', 'สี', 'ย้ำ', 'ขาด'], placeholder: 'เช่น เข้าหัว RJ-45 หลวมหรือเรียงสีผิด...', model: 'เข้าหัวต่อ RJ-45 ไม่แน่น ย้ำไม่สนิท หรือเรียงสีสายผิดมาตรฐาน' },
            { id: 'u8_q5_3', label: '3)', keywords: ['100', 'ยาว', 'ระยะ', 'รบกวน', 'emi', 'ไฟฟ้า'], placeholder: 'เช่น เดินสายยาวเกิน 100 เมตร หรือใกล้สายไฟแรงสูง...', model: 'เดินสายยาวเกินระยะมาตรฐาน 100 เมตร หรือวางใกล้แหล่งคลื่นแม่เหล็กไฟฟ้ารบกวน' }
          ]
        },
        {
          no: 6,
          prompt: 'จงบอกสาเหตุปัญหาที่เกิดของอุปกรณ์ Switch Hub (3 ข้อ)',
          items: [
            { id: 'u8_q6_1', label: '1)', keywords: ['พอร์ต', 'port', 'เสีย', 'ไฟ', 'ดับ', 'หลวม'], placeholder: 'เช่น พอร์ตเสียหรือสายหลวม...', model: 'พอร์ตเชื่อมต่อ (Port) ชำรุดหรือเสีย ไฟสถานะไม่ติด' },
            { id: 'u8_q6_2', label: '2)', keywords: ['ไฟ', 'ปลั๊ก', 'adapter', 'ร้อน', 'แฮงก์', 'ค้าง', 'power'], placeholder: 'เช่น แหล่งจ่ายไฟ/อะแดปเตอร์มีปัญหา หรือเครื่องร้อนค้าง...', model: 'แหล่งจ่ายไฟ/อะแดปเตอร์ชำรุด หรืออุปกรณ์ทำงานหนักจนร้อนและค้าง (Hang)' },
            { id: 'u8_q6_3', label: '3)', keywords: ['loop', 'วน', 'broadcast', 'ชน', 'bandwidth', 'สาย'], placeholder: 'เช่น เกิด Network Loop เสียบสายวนเข้าหากัน...', model: 'เกิด Network Loop (เสียบสายแลนวนเข้าพอร์ตเดียวกัน/Switch เดียวกัน) จนเกิด Broadcast Storm' }
          ]
        },
        {
          no: 7,
          prompt: 'จงยกตัวอย่างซอฟต์แวร์ช่วยงาน (Utility) ต่อไปนี้',
          items: [
            { id: 'u8_q7_1', label: '1) ตรวจสอบการทำงานของเครือข่าย ได้แก่', keywords: ['wireshark', 'ip scanner', 'nmap', 'ping', 'prtg', 'netscan', 'solarwinds'], placeholder: 'เช่น Wireshark, Advanced IP Scanner, Nmap...', model: 'Wireshark, Advanced IP Scanner, Nmap, PRTG Network Monitor' },
            { id: 'u8_q7_2', label: '2) โอนย้ายไฟล์ข้อมูลในเครือข่าย ได้แก่', keywords: ['filezilla', 'winscp', 'ftp', 'scp', 'cuteftp'], placeholder: 'เช่น FileZilla, WinSCP...', model: 'FileZilla, WinSCP, CuteFTP' },
            { id: 'u8_q7_3', label: '3) ควบคุมเครือข่ายในระยะไกล ได้แก่', keywords: ['anydesk', 'teamviewer', 'rdp', 'remote', 'vnc', 'putty', 'ssh'], placeholder: 'เช่น TeamViewer, AnyDesk, Remote Desktop (RDP), PuTTY...', model: 'TeamViewer, AnyDesk, Windows Remote Desktop (RDP), VNC, PuTTY' },
            { id: 'u8_q7_4', label: '4) ดูแลความปลอดภัยของเครือข่าย ได้แก่', keywords: ['firewall', 'defender', 'antivirus', 'kaspersky', 'eset', 'norton', 'snort', 'bitdefender'], placeholder: 'เช่น Windows Defender, Firewall, ESET, Kaspersky, Snort...', model: 'Windows Defender Firewall, ESET, Kaspersky, Bitdefender, Snort (IDS/IPS)' }
          ]
        }
      ],
      connectorPart: null
    },
    9: {
      title: 'แบบฝึกทักษะบทเรียนที่ 9: ความปลอดภัยในระบบเครือข่าย',
      instruction: 'คำชี้แจง: ให้นักเรียนตอบคำถามเกี่ยวกับภัยคุกคาม มัลแวร์ Antivirus และ Firewall ให้ครบทั้ง 7 ข้อ',
      writtenSections: [
        {
          no: 1,
          prompt: 'ภัยคุกคามที่สร้างปัญหาให้กับระบบเครือข่ายคอมพิวเตอร์ อาจแบ่งได้เป็น 3 ลักษณะ ได้แก่',
          items: [
            { id: 'u9_q1_1', label: '1)', keywords: ['มนุษย์', 'บุคคล', 'แฮกเกอร์', 'เจาะ', 'ขโมย', 'ไวรัส', 'มัลแวร์', 'ฮาร์ดแวร์'], placeholder: 'เช่น ภัยจากมนุษย์/ผู้ไม่หวังดี (แฮกเกอร์/การโจรกรรม)...', model: 'ภัยคุกคามจากมนุษย์/ผู้บุกรุก (การแฮก, Phishing, ความประมาทของผู้ใช้)' },
            { id: 'u9_q1_2', label: '2)', keywords: ['มัลแวร์', 'ไวรัส', 'ซอฟต์แวร์', 'โปรแกรม', 'โจมตี', 'ddos'], placeholder: 'เช่น ภัยจากโปรแกรมไม่พึงประสงค์ (มัลแวร์/ไวรัส/แรนซัมแวร์)...', model: 'ภัยคุกคามจากซอฟต์แวร์และมัลแวร์ (Virus, Worm, Trojan, Ransomware, DDoS)' },
            { id: 'u9_q1_3', label: '3)', keywords: ['ธรรมชาติ', 'ไฟ', 'น้ำ', 'ฮาร์ดแวร์', 'อุปกรณ์', 'กายภาพ'], placeholder: 'เช่น ภัยจากธรรมชาติและฮาร์ดแวร์ชำรุด (ไฟดับ/น้ำท่วม/ไฟไหม้)...', model: 'ภัยคุกคามทางกายภาพและธรรมชาติ (ไฟฟ้าดับ/ไฟกระชาก, อุทกภัย, อัคคีภัย, อุปกรณ์ชำรุด)' }
          ]
        },
        {
          no: 2,
          prompt: 'จงบอกลักษณะมัลแวร์ต่อไปนี้โดยสังเขป',
          items: [
            { id: 'u9_q2_1', label: '1) ไวรัสคอมพิวเตอร์:', keywords: ['แพร่', 'ทำลาย', 'แฝง', 'ไฟล์', 'สำเนา', 'เสียหาย'], placeholder: 'อธิบายลักษณะของไวรัสคอมพิวเตอร์...', model: 'โปรแกรมที่แฝงตัวเข้ากับไฟล์อื่น สามารถคัดลอกตัวเองแพร่กระจายเมื่อเปิดไฟล์ และทำลายข้อมูลหรือระบบให้เสียหาย' },
            { id: 'u9_q2_2', label: '2) โทรจัน (Trojan):', keywords: ['หลอก', 'แฝง', 'โปรแกรม', 'ประตูหลัง', 'backdoor', 'ควบคุม', 'ขโมย'], placeholder: 'อธิบายลักษณะของม้าโทรจัน...', model: 'มัลแวร์ที่ปลอมตัวเป็นโปรแกรมปกติหลอกให้ผู้ใช้ติดตั้ง เมื่อรันจะเปิดช่องทางลับ (Backdoor) ให้แฮกเกอร์ควบคุมหรือขโมยข้อมูล' },
            { id: 'u9_q2_3', label: '3) สปายแวร์ (Spyware):', keywords: ['แอบ', 'ดัก', 'ขโมย', 'ติดตาม', 'รหัสผ่าน', 'พฤติกรรม'], placeholder: 'อธิบายลักษณะของสปายแวร์...', model: 'โปรแกรมที่แอบติดตั้งเพื่อติดตามพฤติกรรม ดักจับการพิมพ์ (Keylogger) และขโมยรหัสผ่านหรือข้อมูลส่วนตัวส่งให้ผู้โจมตี' }
          ]
        },
        {
          no: 3,
          prompt: 'จงบอกวิธีการป้องกันและรักษาความปลอดภัยด้านซอฟต์แวร์และข้อมูลมา 3 ข้อ',
          items: [
            { id: 'u9_q3_1', label: '1)', keywords: ['antivirus', 'ไวรัส', 'firewall', 'อัปเดต', 'patch', 'backup', 'สำรอง', 'รหัสผ่าน'], placeholder: 'เช่น ติดตั้งและอัปเดต Antivirus / OS Patch สม่ำเสมอ...', model: 'ติดตั้งโปรแกรม Antivirus และอัปเดตระบบปฏิบัติการ (Patch Update) ให้เป็นปัจจุบันเสมอ' },
            { id: 'u9_q3_2', label: '2)', keywords: ['backup', 'สำรอง', 'รหัสผ่าน', '2fa', 'firewall', 'เข้ารหัส'], placeholder: 'เช่น สำรองข้อมูล (Backup) อย่างสม่ำเสมอ...', model: 'สำรองข้อมูลสำคัญ (Offline/Cloud Backup) อย่างสม่ำเสมอตามกฎ 3-2-1' },
            { id: 'u9_q3_3', label: '3)', keywords: ['รหัสผ่าน', '2fa', 'สิทธิ์', 'เข้ารหัส', 'firewall', 'ไม่คลิก', 'ลิขสิทธิ์'], placeholder: 'เช่น ตั้งรหัสผ่านแข็งแรง + เปิด 2FA และใช้ซอฟต์แวร์ถูกลิขสิทธิ์...', model: 'ตั้งรหัสผ่านที่แข็งแรง เปิดยืนยันตัวตน 2 ชั้น (2FA) และไม่ดาวน์โหลดซอฟต์แวร์เถื่อนหรือคลิกลิงก์แปลกปลอม' }
          ]
        },
        {
          no: 4,
          prompt: 'จงบอกลักษณะหน้าที่ของโปรแกรมป้องกันและกำจัดไวรัสต่อไปนี้',
          items: [
            { id: 'u9_q4_1', label: '1) Anti-Virus:', keywords: ['ตรวจจับ', 'สแกน', 'กำจัด', 'กักกัน', 'ป้องกัน', 'ไวรัส'], placeholder: 'อธิบายหน้าที่ของ Anti-Virus...', model: 'สแกน ตรวจจับ กักกัน (Quarantine) และกำจัดไวรัสหรือมัลแวร์ออกจากเครื่องคอมพิวเตอร์' },
            { id: 'u9_q4_2', label: '2) Firewall:', keywords: ['กรอง', 'บล็อก', 'อนุญาต', 'พอร์ต', 'เข้าออก', 'ทราฟฟิก', 'กั้น'], placeholder: 'อธิบายหน้าที่ของ Firewall...', model: 'คัดกรองและควบคุมทราฟฟิกข้อมูลขาเข้า-ขาออกตามกฎ IP และ Port เพื่อป้องกันผู้บุกรุกจากภายนอก' },
            { id: 'u9_q4_3', label: '3) Anti-Spyware:', keywords: ['สปายแวร์', 'ดัก', 'แอบ', 'ตรวจจับ', 'ลบ', 'ขโมย'], placeholder: 'อธิบายหน้าที่ของ Anti-Spyware...', model: 'ตรวจจับและลบสปายแวร์/แอดแวร์ที่แอบดักจับข้อมูลส่วนตัวหรือรหัสผ่านออกจากระบบ' }
          ]
        },
        {
          no: 5,
          prompt: 'จงบอกชื่อซอฟต์แวร์ป้องกันไวรัสที่นิยมใช้มา 3 ชื่อ',
          items: [
            { id: 'u9_q5_1', label: '1)', keywords: ['defender', 'windows', 'kaspersky', 'eset', 'nod32', 'norton', 'bitdefender', 'avast', 'avg', 'mcafee', 'malwarebytes'], placeholder: 'เช่น Windows Defender (Microsoft Security)...', model: 'Microsoft Windows Defender' },
            { id: 'u9_q5_2', label: '2)', keywords: ['defender', 'kaspersky', 'eset', 'nod32', 'norton', 'bitdefender', 'avast', 'avg', 'mcafee', 'malwarebytes'], placeholder: 'เช่น ESET NOD32 / Kaspersky...', model: 'ESET NOD32 Antivirus หรือ Kaspersky' },
            { id: 'u9_q5_3', label: '3)', keywords: ['defender', 'kaspersky', 'eset', 'nod32', 'norton', 'bitdefender', 'avast', 'avg', 'mcafee', 'malwarebytes'], placeholder: 'เช่น Bitdefender / Norton / Avast...', model: 'Bitdefender หรือ Norton / Avast' }
          ]
        },
        {
          no: 6,
          prompt: 'จงบอกประเภทของ Firewall ตามลักษณะการทำงาน',
          items: [
            { id: 'u9_q6_1', label: '1) ตรวจสอบและกลั่นกรองแพ็กเกต:', keywords: ['packet', 'filter', 'แพ็กเกต'], placeholder: 'เช่น Packet Filtering Firewall...', model: 'Packet Filtering Firewall' },
            { id: 'u9_q6_2', label: '2) ควบคุมการเข้าถึงแอปพลิเคชันที่จะติดต่อกับภายนอก:', keywords: ['application', 'proxy', 'gateway', 'แอป'], placeholder: 'เช่น Application Gateway (Proxy Firewall)...', model: 'Application-Level Gateway (Proxy Firewall)' },
            { id: 'u9_q6_3', label: '3) มีการบันทึกข้อมูลรายละเอียดการเข้าออก:', keywords: ['stateful', 'inspection', 'สถานะ', 'circuit'], placeholder: 'เช่น Stateful Inspection Firewall...', model: 'Stateful Inspection Firewall' }
          ]
        },
        {
          no: 7,
          prompt: 'จงบอกความแตกต่างของ Firewall ต่อไปนี้ รวมถึงการติดตั้งใช้งาน',
          items: [
            { id: 'u9_q7_1', label: '1) Network Firewall (คือ / ติดตั้งไว้ที่):', keywords: ['เครือข่าย', 'องค์กร', 'gateway', 'router', 'กั้น', 'ฮาร์ดแวร์', 'ขอบ'], placeholder: 'เช่น ป้องกันทั้งวงเครือข่าย / ติดตั้งไว้ที่จุดเชื่อมต่อระหว่าง LAN กับอินเทอร์เน็ต (Gateway/Router)...', model: 'ไฟร์วอลล์ป้องกันทั้งเครือข่าย (มักเป็นอุปกรณ์เฉพาะ/Router) | ติดตั้งไว้ที่จุดเชื่อมต่อขอบเครือข่าย (Gateway) ระหว่าง LAN กับอินเทอร์เน็ต' },
            { id: 'u9_q7_2', label: '2) Personal Firewall (คือ / ติดตั้งไว้ที่):', keywords: ['เครื่อง', 'ส่วนบุคคล', 'ซอฟต์แวร์', 'pc', 'คอมพิวเตอร์', 'windows'], placeholder: 'เช่น ซอฟต์แวร์ป้องกันเฉพาะเครื่อง / ติดตั้งไว้ที่เครื่องคอมพิวเตอร์ผู้ใช้แต่ละเครื่อง...', model: 'ไฟร์วอลล์แบบซอฟต์แวร์ป้องกันเฉพาะเครื่อง (เช่น Windows Defender Firewall) | ติดตั้งไว้บนเครื่องคอมพิวเตอร์ของผู้ใช้แต่ละเครื่อง' }
          ]
        }
      ],
      connectorPart: null
    },
    10: {
      title: 'แบบฝึกทักษะบทเรียนที่ 10: การสร้างบัญชีผู้ใช้และการใช้งาน',
      instruction: 'คำชี้แจง: ให้นักเรียนตอบคำถามครบทั้ง 6 ข้อ (รวมรายละเอียดการกำหนดสิทธิ์ NTFS 6 ระดับในข้อ 6)',
      writtenSections: [
        {
          no: 1,
          prompt: 'จงบอกประโยชน์ของการสร้างบัญชีผู้ใช้ (3 ข้อ)',
          items: [
            { id: 'u10_q1_1', label: '1)', keywords: ['ยืนยัน', 'ตัวตน', 'ปลอดภัย', 'ป้องกัน', 'รหัสผ่าน', 'สิทธิ์'], placeholder: 'เช่น ยืนยันตัวตนและป้องกันผู้ไม่มีสิทธิ์เข้าถึงระบบ...', model: 'ยืนยันตัวตน (Authentication) ป้องกันไม่ให้ผู้ไม่ได้รับอนุญาตเข้าใช้งานเครื่องหรือเครือข่าย' },
            { id: 'u10_q1_2', label: '2)', keywords: ['แยก', 'ไฟล์', 'ส่วนตัว', 'โปรไฟล์', 'พื้นที่', 'ตั้งค่า'], placeholder: 'เช่น แยกพื้นที่จัดเก็บไฟล์และการตั้งค่าส่วนตัวของแต่ละคน...', model: 'แยกพื้นที่จัดเก็บไฟล์และสภาพแวดล้อมการทำงานส่วนตัว (User Profile) ของผู้ใช้แต่ละคน' },
            { id: 'u10_q1_3', label: '3)', keywords: ['สิทธิ์', 'ควบคุม', 'ตรวจสอบ', 'ย้อนหลัง', 'ขอบเขต'], placeholder: 'เช่น กำหนดขอบเขตสิทธิ์และตรวจสอบการใช้งานย้อนหลังได้...', model: 'กำหนดขอบเขตสิทธิ์การใช้งาน (Authorization) และตรวจสอบประวัติการใช้งานย้อนหลังได้' }
          ]
        },
        {
          no: 2,
          prompt: 'การสร้างกลุ่มผู้ใช้มีข้อดีอย่างไร',
          items: [
            { id: 'u10_q2', label: 'คำตอบ:', multiline: true, keywords: ['สะดวก', 'พร้อมกัน', 'หลายคน', 'สิทธิ์', 'จัดระเบียบ', 'ลด', 'ง่าย'], placeholder: 'อธิบายข้อดีของการจัดกลุ่มผู้ใช้ (User Groups)...', model: 'ช่วยให้ผู้ดูแลระบบกำหนดหรือปรับเปลี่ยนสิทธิ์การเข้าถึงทรัพยากรให้กับผู้ใช้จำนวนมากพร้อมกันได้ในครั้งเดียว สะดวก เป็นระเบียบ และลดความผิดพลาด' }
          ]
        },
        {
          no: 3,
          prompt: 'จงบอกรายละเอียดในการสร้างบัญชีผู้ใช้',
          items: [
            { id: 'u10_q3_1', label: '1) User name คือ', keywords: ['ชื่อ', 'ล็อกอิน', 'เข้าสู่ระบบ', 'บัญชี', 'login'], placeholder: 'อธิบายความหมายของ User name...', model: 'ชื่อบัญชีสำหรับใช้พิมพ์เข้าสู่ระบบ (Logon Name) ต้องไม่ซ้ำกันในเครื่องหรือโดเมน' },
            { id: 'u10_q3_2', label: '2) Full Name คือ', keywords: ['เต็ม', 'นามสกุล', 'ชื่อจริง', 'แสดง'], placeholder: 'อธิบายความหมายของ Full Name...', model: 'ชื่อ-นามสกุลจริงของผู้ใช้งานที่แสดงบนหน้าจอและข้อมูลบัญชี' },
            { id: 'u10_q3_3', label: '3) Description คือ', keywords: ['อธิบาย', 'รายละเอียด', 'ตำแหน่ง', 'แผนก', 'หมายเหตุ'], placeholder: 'อธิบายความหมายของ Description...', model: 'คำอธิบายเพิ่มเติมเกี่ยวกับผู้ใช้ เช่น ตำแหน่ง แผนก หรือห้องเรียน' },
            { id: 'u10_q3_4', label: '4) Password คือ', keywords: ['รหัสผ่าน', 'ยืนยัน', 'ตัวตน', 'เข้าสู่ระบบ'], placeholder: 'อธิบายความหมายของ Password...', model: 'รหัสผ่านส่วนตัวสำหรับยืนยันตัวตนในการเข้าสู่ระบบให้ปลอดภัย' }
          ]
        },
        {
          no: 4,
          prompt: 'จงอธิบายความหมายของตัวเลือกต่าง ๆ ต่อไปนี้ ในการสร้างบัญชีผู้ใช้',
          items: [
            { id: 'u10_q4_1', label: '1) User must change password at next logon คือ', keywords: ['เปลี่ยน', 'รหัสผ่าน', 'ครั้งถัดไป', 'ครั้งแรก', 'บังคับ'], placeholder: 'อธิบายความหมาย...', model: 'บังคับให้ผู้ใช้ต้องเปลี่ยนรหัสผ่านใหม่ทันทีเมื่อล็อกอินเข้าใช้งานในครั้งถัดไป' },
            { id: 'u10_q4_2', label: '2) User cannot change password หมายถึง', keywords: ['ไม่', 'ห้าม', 'เปลี่ยน', 'รหัสผ่าน'], placeholder: 'อธิบายความหมาย...', model: 'ไม่อนุญาตให้ผู้ใช้เปลี่ยนรหัสผ่านเองได้ (เฉพาะผู้ดูแลระบบเท่านั้นที่เปลี่ยนให้ได้)' },
            { id: 'u10_q4_3', label: '3) Password never expires หมายถึง', keywords: ['ไม่หมดอายุ', 'หมดอายุ', 'ตลอด', 'ไม่มี'], placeholder: 'อธิบายความหมาย...', model: 'รหัสผ่านของบัญชีนี้จะไม่มีวันหมดอายุ ใช้งานได้ต่อเนื่องโดยระบบไม่บังคับเปลี่ยนตามรอบเวลา' },
            { id: 'u10_q4_4', label: '4) Account is disabled หมายถึง', keywords: ['ปิด', 'ระงับ', 'ชั่วคราว', 'ไม่สามารถ', 'เข้าใช้งาน'], placeholder: 'อธิบายความหมาย...', model: 'ระงับหรือปิดการใช้งานบัญชีนี้ชั่วคราว ไม่สามารถล็อกอินได้แต่ข้อมูลบัญชียังไม่ถูกลบ' }
          ]
        },
        {
          no: 5,
          prompt: 'จงบอกขั้นตอนในการแชร์โฟลเดอร์ในเครือข่ายโดยสังเขป (4 ขั้นตอน)',
          items: [
            { id: 'u10_q5_1', label: '1)', keywords: ['คลิกขวา', 'properties', 'โฟลเดอร์', 'sharing'], placeholder: 'ขั้นที่ 1 เช่น คลิกขวาโฟลเดอร์ → Properties → แท็บ Sharing...', model: 'คลิกขวาโฟลเดอร์ที่ต้องการแชร์ → เลือก Properties → คลิกแท็บ Sharing' },
            { id: 'u10_q5_2', label: '2)', keywords: ['advanced sharing', 'share', 'ติ๊ก'], placeholder: 'ขั้นที่ 2 เช่น คลิก Advanced Sharing ติ๊ก Share this folder...', model: 'คลิกปุ่ม Advanced Sharing แล้วติ๊กเลือก Share this folder' },
            { id: 'u10_q5_3', label: '3)', keywords: ['permissions', 'สิทธิ์', 'add', 'ผู้ใช้', 'กลุ่ม'], placeholder: 'ขั้นที่ 3 เช่น กด Permissions เพิ่มผู้ใช้/กลุ่มและกำหนดสิทธิ์...', model: 'คลิก Permissions เพิ่มบัญชีผู้ใช้หรือกลุ่มผู้ใช้ และกำหนดสิทธิ์ที่อนุญาต (Read/Change/Full Control)' },
            { id: 'u10_q5_4', label: '4)', keywords: ['security', 'ntfs', 'ok', 'apply', 'ทดสอบ'], placeholder: 'ขั้นที่ 4 เช่น กำหนดสิทธิ์แท็บ Security (NTFS) แล้วกด OK และทดสอบ...', model: 'ตรวจสอบ/กำหนดสิทธิ์ในแท็บ Security (NTFS) ให้สอดคล้องกัน กด Apply/OK แล้วทดสอบเข้าใช้งาน' }
          ]
        },
        {
          no: 6,
          prompt: 'จงบอกรายละเอียดของการกำหนดสิทธิ (NTFS Permissions) ต่อไปนี้',
          items: [
            { id: 'u10_q6_1', label: '1) Full Control หมายถึง', keywords: ['ทั้งหมด', 'เต็ม', 'ลบ', 'แก้', 'สิทธิ์', 'เจ้าของ', 'ควบคุม'], placeholder: 'อธิบายสิทธิ์ Full Control...', model: 'สิทธิ์ควบคุมสูงสุด อ่าน เขียน แก้ไข ลบ รันโปรแกรม รวมถึงเปลี่ยนสิทธิ์ (Permissions) และความเป็นเจ้าของไฟล์ได้' },
            { id: 'u10_q6_2', label: '2) Modify หมายถึง', keywords: ['แก้ไข', 'ลบ', 'เขียน', 'อ่าน', 'เปลี่ยนแปลง'], placeholder: 'อธิบายสิทธิ์ Modify...', model: 'สิทธิ์อ่าน เขียน แก้ไข สร้าง และลบไฟล์หรือโฟลเดอร์ย่อยได้ (แต่เปลี่ยนสิทธิ์ Permissions ไม่ได้)' },
            { id: 'u10_q6_3', label: '3) Read & Execute หมายถึง', keywords: ['อ่าน', 'รัน', 'ประมวลผล', 'เปิด', 'โปรแกรม'], placeholder: 'อธิบายสิทธิ์ Read & Execute...', model: 'สิทธิ์เปิดดูข้อมูลในไฟล์และสั่งรันไฟล์โปรแกรม (.exe/.bat) ได้ แต่แก้ไขหรือลบไม่ได้' },
            { id: 'u10_q6_4', label: '4) List Folder Contents หมายถึง', keywords: ['รายชื่อ', 'ดู', 'โฟลเดอร์', 'แสดง', 'รายการ'], placeholder: 'อธิบายสิทธิ์ List Folder Contents...', model: 'สิทธิ์มองเห็นรายชื่อไฟล์และโฟลเดอร์ย่อยที่อยู่ภายในโฟลเดอร์ได้' },
            { id: 'u10_q6_5', label: '5) Read หมายถึง', keywords: ['อ่าน', 'ดู', 'คัดลอก', 'เปิด'], placeholder: 'อธิบายสิทธิ์ Read...', model: 'สิทธิ์เปิดอ่าน ดูคุณสมบัติ และคัดลอกไฟล์ออกไปได้เท่านั้น ไม่สามารถแก้ไขหรือลบได้' },
            { id: 'u10_q6_6', label: '6) Write หมายถึง', keywords: ['เขียน', 'สร้าง', 'เพิ่ม', 'บันทึก'], placeholder: 'อธิบายสิทธิ์ Write...', model: 'สิทธิ์สร้างไฟล์หรือโฟลเดอร์ใหม่และเขียนข้อมูลเพิ่มเติมลงไปได้' }
          ]
        }
      ],
      connectorPart: null
    }
  };

  const UNIT_FUN_FACTS = {
    1: [
      '💡 <b>Bus vs Star Topology</b>: ให้นึกถึง <b>ไฟประดับปีใหม่แบบอนุกรม</b> (หลอดขาด 1 ดวง ดับทั้งสาย = Bus) เทียบกับ <b>ไฟในบ้านแบบขนาน</b> (หลอดห้องนอนขาด ไฟห้องนั่งเล่นยังสว่างปกติ = Star)',
      '🗺️ <b>จำขนาด PAN → LAN → MAN → WAN ง่าย ๆ</b>: โต๊ะเรียน (PAN ระยะแขน) → ห้องเรียน/ตึก (LAN) → ทั้งจังหวัด (MAN) → ทั่วโลก (WAN)',
      '🏢 <b>Peer-to-Peer vs Client-Server</b>: เหมือนกลุ่มเพื่อนช่วยกันแชร์โน้ตเรียนเอง (Peer-to-Peer) เทียบกับห้องสมุดที่มีบรรณารักษ์คอยควบคุมการยืม-คืน (Client-Server)'
    ],
    2: [
      '📣 <b>Hub vs Switch vs Router</b>: <b>Hub</b> เหมือนตะโกนใส่โทรโข่งได้ยินทั้งห้อง, <b>Switch</b> เหมือนเดินไปส่งจดหมายถึงโต๊ะเพื่อนโดยตรง, ส่วน <b>Router</b> เหมือนศูนย์ไปรษณีย์ที่ส่งพัสดุข้ามจังหวัด',
      '⚡ <b>UTP vs Fiber Optic</b>: สายทองแดง UTP ส่งสัญญาณไฟฟ้าจึงโดนคลื่นแม่เหล็กจากหม้อแปลงรบกวนได้ ส่วน <b>Fiber Optic</b> ส่งด้วยพัลส์แสงความเร็วสูง จึงไม่กลัวสัญญาณไฟฟ้ารบกวนเลย',
      '📡 <b>Microwave vs Bluetooth vs Infrared</b>: ไมโครเวฟเหมือนส่องสปอตไลต์ข้ามตึก (ไกลแต่ต้องไม่โดนบัง), บลูทูธเหมือนคุยกันในห้อง (ใกล้ ๆ 1–10 ม.), อินฟราเรดเหมือนรีโมตทีวี (เอามือบังปุ๊บกดไม่ติด!)'
    ],
    3: [
      '📦 <b>OSI 7 Layers เหมือนส่งพัสดุออนไลน์</b>: เขียนข้อความ (L7) → แปล/ซีลซอง (L6) → โทรนัดรับ (L5) → แบ่งกล่องติดเลขชิ้น (L4) → จ่าหน้าบ้านเลขที่ IP (L3) → แยกถุงส่งในซอย MAC (L2) → รถวิ่งบนถนน (L1)',
      '📮 <b>TCP vs UDP</b>: <b>TCP</b> เหมือนส่งไปรษณีย์ EMS ที่มีใบเซ็นรับครบทุกชิ้น ส่วน <b>UDP</b> เหมือนตะโกนบอกคะแนนบอลข้ามสนาม เร็วทันใจแต่ไม่ได้เช็กว่าฟังทันทุกคำไหม',
      '☎️ <b>NAT ทำงานยังไง?</b>: เหมือนวิทยาลัยมีเบอร์ต่อภายใน 100 เครื่อง (Private IP) แต่เวลาโทรออกภายนอกจะแชร์เบอร์โทรศัพท์หลักเบอร์เดียว (Public IP) ผ่านตู้สาขา (Router)'
    ],
    4: [
      '🎤 <b>Ethernet (CSMA/CD) vs Token Pass</b>: Ethernet เหมือนห้องประชุมที่ใครเห็นจังหวะว่างก็พูดได้เลย (ถ้าพูดชนกันก็หยุดแล้วค่อยพูดใหม่) ส่วน Token Pass เหมือนส่งไมโครโฟน 1 ตัววนเป็นวงกลม ใครถือไมค์ถึงพูดได้',
      '🔌 <b>ทำไมสายตรงกับสายไขว้ต่างกัน?</b>: อุปกรณ์ต่างชนิด (PC กับ Switch) ช่องส่งกับช่องรับวางสลับรอไว้อยู่แล้วจึงใช้<b>สายตรง</b> แต่ถ้าต่อ PC ชน PC โดยตรง ช่องส่งจะชนช่องส่ง จึงต้องใช้<b>สายไขว้</b>สลับพิน 1-3 และ 2-6!',
      '📏 <b>กฎ 100 เมตรของสาย UTP</b>: เปรียบเหมือนตะโกนเรียกเพื่อน ยิ่งไกลเสียงยิ่งเบา เกิน 100 เมตรสัญญาณไฟฟ้าจะอ่อนจนข้อมูลเพี้ยน ต้องมี Switch คั่นกลางหรือเปลี่ยนเป็น Fiber Optic'
    ],
    5: [
      '🏎️ <b>Wi-Fi 2.4 GHz vs 5 GHz</b>: 2.4 GHz เหมือนเสียงเบสทุ้ม ๆ ทะลุกำแพงไปได้ไกลแต่ช่องจราจรแน่น ส่วน 5 GHz เหมือนทางด่วนหลายเลน วิ่งเร็วมากแต่ทะลุกำแพงหนาได้สั้นกว่า',
      '🛒 <b>SU-MIMO vs MU-MIMO</b>: <b>SU-MIMO</b> เหมือนเคาน์เตอร์คิดเงิน 1 ช่อง คิดเงินเร็วแต่ต้องต่อคิวทีละคน ส่วน <b>MU-MIMO</b> เหมือนเปิด 4 ช่องคิดเงินพร้อมกัน คิวไม่ติดขัดแม้คนเต็มห้องเรียน!',
      '🔒 <b>ทำไมห้ามใช้ WEP?</b>: WEP เปรียบเหมือนแม่กุญแจพลาสติกยุคเก่าที่แฮกเกอร์ไขออกได้ในไม่กี่นาที ส่วน <b>WPA2-AES / WPA3</b> เหมือนตู้เซฟรหัสหลายชั้นที่ปลอดภัยกว่ามาก'
    ],
    6: [
      '🏷️ <b>Workgroup & Computer Name</b>: เหมือนคนในครอบครัวเดียวกันต้องใช้<b>นามสกุลเดียวกัน</b> (Workgroup) เพื่อหากันเจอง่าย แต่<b>ชื่อเล่นแต่ละคนห้ามซ้ำกัน</b> (Computer Name)',
      '🚪 <b>จำ 3 ค่า IPv4 ง่าย ๆ</b>: <b>IP Address</b> = บ้านเลขที่ของเรา, <b>Default Gateway</b> = ประตูหมู่บ้านสำหรับออกถนนใหญ่, <b>DNS Server</b> = สมุดโทรศัพท์ที่แปลงชื่อเว็บเป็นหมายเลข IP',
      '🗺️ <b>Map Network Drive</b>: เปรียบเหมือนทำปุ่มทางลัดวางไว้บนโต๊ะทำงาน กดทีเดียวเปิดโฟลเดอร์แชร์ของเพื่อนได้เหมือนเป็นไดรฟ์ Z: ในเครื่องตัวเอง'
    ],
    7: [
      '🏢 <b>Virtual Machine (VM) คืออะไร?</b>: เหมือนเรามีอาคารคอนโด 1 ตึก (เครื่องคอมพิวเตอร์จริง) แล้วกั้นเป็นหลายห้องพักอิสระ (VM) ห้องหนึ่งลง Windows Server อีกห้องลง Ubuntu Server โดยไม่รบกวนกัน',
      '📸 <b>Snapshot = จุดเซฟเกม!</b>: ก่อนทดลองตั้งค่า Server ยาก ๆ ให้กด Snapshot ไว้เสมอ ถ้าตั้งค่าพลาดจนระบบพังก็กดโหลดเซฟย้อนกลับมาใน 5 วินาที',
      '🏠 <b>NAT vs Bridged ใน VM</b>: โหมด <b>NAT</b> เหมือนอยู่หอพักที่ใช้ที่อยู่ส่วนกลาง (ออกเน็ตได้แต่คนนอกหาห้องไม่เจอ) ส่วน <b>Bridged</b> เหมือนมีบ้านเลขที่ติดถนนใหญ่เอง เพื่อนในห้องแล็บเชื่อมต่อเข้ามาได้ตรง ๆ'
    ],
    8: [
      '🛣️ <b>Cisco 3-Layer Model</b>: <b>Access Layer</b> = ถนนซอยหน้าบ้าน, <b>Distribution Layer</b> = ถนนสายหลักที่มีไฟแดงคอยจัดระเบียบรถ (Routing/VLAN), <b>Core Layer</b> = ทางด่วนมอเตอร์เวย์วิ่งตรงความเร็วสูง',
      '🩺 <b>ping vs tracert</b>: <code>ping</code> เหมือนโทรไปถามเพื่อนว่า "อยู่บ้านไหม?" ส่วน <code>tracert</code> เหมือนเปิด GPS ดูทีละสี่แยกว่าพัสดุติดขัดอยู่ที่จุดไหน',
      '🔁 <b>ระวัง Network Loop!</b>: การเผลอเสียบสายแลน 2 ปลายเข้า Switch ตัวเดียวกัน เหมือนไมโครโฟนจ่อลำโพงแล้วหอนไม่หยุด แพ็กเก็ตจะวนจนเครือข่ายล่มทั้งห้องในไม่กี่วินาที'
    ],
    9: [
      '🦠 <b>จำ 3 มัลแวร์ง่าย ๆ</b>: <b>Virus</b> = ไข้หวัดที่แพร่ติดไฟล์อื่น, <b>Trojan</b> = ม้าไม้เมืองทรอยที่ดูเหมือนของขวัญดี ๆ แต่แอบซ่อนโจรไว้ข้างใน, <b>Spyware</b> = กล้องแอบถ่ายที่คอยจดรหัสผ่านส่งให้คนร้าย',
      '🛡️ <b>Network Firewall vs Personal Firewall</b>: <b>Network Firewall</b> เหมือน รปภ. หน้าประตูรั้ววิทยาลัยคอยคัดกรองคนเข้า-ออกทั้งสถาบัน ส่วน <b>Personal Firewall</b> เหมือนกลอนประตูห้องเรียนแต่ละห้องที่ป้องกันเฉพาะเครื่องนั้น',
      '💾 <b>กฎสำรองข้อมูล 3-2-1</b>: เก็บข้อมูลไว้ <b>3</b> ชุด บนสื่อ <b>2</b> ชนิด และเก็บแยกไว้นอกเครือข่าย <b>1</b> ชุด — ต่อให้เจอ Ransomware ก็กู้คืนได้โดยไม่ต้องจ่ายเงิน!'
    ],
    10: [
      '👥 <b>ทำไมต้องสร้าง Group?</b>: แทนที่จะเดินแจกสิทธิ์ให้นักศึกษาทีละ 40 คน ให้จัดเข้ากลุ่ม <code>Students</code> แล้วกำหนดสิทธิ์ที่กลุ่มครั้งเดียว เหมือนประกาศกฎให้ทั้งห้องพร้อมกัน',
      '🗝️ <b>หลัก Least Privilege</b>: เหมือนให้นักเรียนถือเฉพาะกุญแจห้องเรียน ไม่แจกกุญแจห้องการเงินให้ทุกคน ช่วยลดความเสียหายหากบัญชีถูกขโมยหรือติดไวรัส',
      '🚫 <b>กฎเหล็ก: Explicit Deny ชนะ Allow เสมอ</b>: ต่อให้คุณมีบัตรสมาชิกเข้าห้องสมุด (Allow) แต่ถ้ามีคำสั่งห้ามเข้าเฉพาะบุคคล (Deny) แปะไว้หน้าประตู คุณจะเข้าไม่ได้ทันที!'
    ]
  };

  global.GameData = {
    RANKS,
    CLASSES,
    SHOP_ITEMS,
    BADGES,
    DAILY_QUESTS,
    T568B,
    T568A_ORDER,
    T568B_ORDER,
    UNITS,
    INITIAL_LEADERBOARD,
    ENCYCLOPEDIA_PORTS,
    SKILL_EXERCISES,
    UNIT_FUN_FACTS
  };
})(window);
