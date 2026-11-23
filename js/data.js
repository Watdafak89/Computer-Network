/**
 * NetQuest 16-Bit: Comprehensive Computer Network Curriculum & Game Data (ปวช.)
 * Covers all 10 vocational textbook units, 60+ boss quiz items, 16 badges,
 * classes, shop items, and custom pixel infographics.
 */
(function (global) {
  'use strict';

  const RANKS = [
    { level: 1, minXp: 0, title: 'เด็กฝึกหัดสายแลน (Cable Novice)', titleShort: 'Novice' },
    { level: 2, minXp: 250, title: 'ช่างเทคนิคสายสัญญาณ (Wire Tech)', titleShort: 'Wire Tech' },
    { level: 3, minXp: 600, title: 'ผู้พิทักษ์สวิตช์ (Switch Knight)', titleShort: 'Switch Knight' },
    { level: 4, minXp: 1050, title: 'นักวิเคราะห์แพ็กเก็ต (Packet Analyst)', titleShort: 'Analyst' },
    { level: 5, minXp: 1600, title: 'จอมเวทไอพีแอดเดรส (IP Wizard)', titleShort: 'IP Wizard' },
    { level: 6, minXp: 2250, title: 'วิศวกรเครือข่ายฝึกหัด (Net Engineer)', titleShort: 'Engineer' },
    { level: 7, minXp: 3000, title: 'ผู้เชี่ยวชาญโครงข่ายไร้สาย (Wi-Fi Master)', titleShort: 'Wi-Fi Master' },
    { level: 8, minXp: 3900, title: 'ผู้บัญชาการไฟร์วอลล์ (Firewall Commander)', titleShort: 'Commander' },
    { level: 9, minXp: 4900, title: 'ปรมาจารย์สถาปัตยกรรม (Cyber Architect)', titleShort: 'Architect' },
    { level: 10, minXp: 6000, title: 'ตำนานแห่งไซเบอร์ ปวช. (Grand Net Legend)', titleShort: 'Grand Legend' }
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
      xpMult: 1.2,
      coinMult: 1.0,
      timeBonus: 2,
      critBonus: 0.12,
      perk: 'โบนัสค่าประสบการณ์ XP +20% และพลังโจมตี +8'
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
    { id: 'grand_champion', name: 'บัณฑิตเครือข่าย ปวช.', desc: 'พิชิตครบทั้ง 10 บทเรียนในแผนที่อาณาจักรเครือข่าย!', icon: '👑', color: '#f59e0b' }
  ];

  const DAILY_QUESTS = [
    { id: 'dq_lab', title: 'ทำห้อง Lab จำลองสำเร็จ 1 หน่วย', rewardXp: 100, rewardCoins: 30, target: 1, metric: 'labsCompletedToday' },
    { id: 'dq_boss', title: 'พิชิตบอสประจำหน่วย 1 ตัว', rewardXp: 120, rewardCoins: 40, target: 1, metric: 'bossesDefeatedToday' },
    { id: 'dq_combo', title: 'ทำคอมโบตอบถูกต่อเนื่อง 3 ข้อ', rewardXp: 80, rewardCoins: 25, target: 3, metric: 'bestComboToday' },
    { id: 'dq_arcade', title: 'เข้าเล่นโหมด Endless Arcade 1 รอบ', rewardXp: 70, rewardCoins: 20, target: 1, metric: 'arcadeRunsToday' }
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
        hp: 100,
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
          title: '1-2. ประโยชน์ องค์ประกอบ และหลักการทำงาน',
          bullets: [
            '<b>ประโยชน์ของเครือข่าย</b>: ใช้ทรัพยากรร่วมกัน (เครื่องพิมพ์/ไฟล์/อินเทอร์เน็ต), สื่อสารรวดเร็ว (อีเมล/แชต/ประชุมออนไลน์), ลดต้นทุน และสำรองข้อมูลรวมศูนย์',
            '<b>องค์ประกอบหลัก 5 อย่าง</b>: ผู้ส่ง (Sender), ผู้รับ (Receiver), ข้อมูลข่าวสาร (Message), สื่อกลางนำสัญญาณ (Transmission Medium) และโปรโตคอล (Protocol)',
            '<b>ทิศทางการสื่อสาร</b>: Simplex (ทางเดียว เช่น วิทยุ), Half-Duplex (สลับรับส่ง เช่น วิทยุสื่อสาร), Full-Duplex (รับ-ส่งพร้อมกัน เช่น โทรศัพท์/Switch)'
          ]
        },
        {
          title: '3-4. ประเภทเครือข่ายและสถาปัตยกรรมเครือข่าย',
          bullets: [
            '<b>PAN</b> (ระยะ 1–10 ม. เช่น Bluetooth), <b>LAN</b> (ภายในห้อง/อาคาร ความเร็วสูง), <b>MAN</b> (ระดับเมือง/หลายวิทยาเขต), <b>WAN</b> (ข้ามประเทศ/อินเทอร์เน็ต)',
            '<b>Peer-to-Peer (Workgroup)</b>: ทุกเครื่องมีสิทธิ์เท่าเทียมกัน ไม่มี Server กลาง ติดตั้งง่าย ราคาถูก เหมาะกับเครือข่ายเล็ก ≤ 10 เครื่อง',
            '<b>Client-Server (Domain)</b>: มีเครื่องแม่ข่าย (Server) ควบคุมสิทธิ์ ฐานข้อมูล และความปลอดภัยแบบรวมศูนย์ เหมาะกับองค์กรและสถานศึกษา'
          ]
        },
        {
          title: '5. รูปแบบการเชื่อมต่อเครือข่าย (Network Topologies)',
          bullets: [
            '<b>Star</b>: นิยมมากที่สุด ทุกเครื่องต่อเข้า Switch ตรงกลาง สายขาด 1 เส้นกระทบเฉพาะเครื่องนั้น',
            '<b>Bus</b>: ใช้สายหลักเส้นเดียว (Backbone) + Terminator ปิดหัวท้าย ราคาถูกแต่สายหลักขาดล่มทั้งวง',
            '<b>Ring</b>: ส่งข้อมูลเป็นวงแหวนผ่าน Token Passing ชนกันน้อย แต่เพิ่ม/ถอดเครื่องทำได้ยาก',
            '<b>Mesh & Hybrid</b>: Full Mesh ใช้สาย N(N-1)/2 เส้น มีเส้นทางสำรองสูง ส่วน Hybrid ผสมผสานหลายรูปแบบตามความเหมาะสม'
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
        hp: 115,
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
      codexCards: [
        {
          title: '1. อุปกรณ์ในระบบเครือข่าย (Network Devices)',
          bullets: [
            '<b>NIC (Network Interface Card)</b>: การ์ดเครือข่ายประจำเครื่อง มีหมายเลข MAC Address เฉพาะตัว',
            '<b>Repeater & Hub (Layer 1)</b>: ทวนสัญญาณ/กระจายข้อมูลออกทุกพอร์ต (Broadcast) ทำให้เกิดการชนกันของข้อมูลสูง',
            '<b>Bridge & Switch (Layer 2)</b>: จดจำ MAC Address ส่งข้อมูลตรงถึงพอร์ตปลายทาง ลดการชนกันและทำงาน Full-Duplex',
            '<b>Router (Layer 3), Access Point & Modem</b>: Router เชื่อมต่างเครือข่ายและเลือกเส้นทางด้วย IP, AP กระจายสัญญาณไร้สาย, Modem แปลงสัญญาณจากผู้ให้บริการ (ISP)'
          ]
        },
        {
          title: '2. สื่อกลางแบบสาย (Guided Media)',
          bullets: [
            '<b>สายคู่บิดเกลียว (UTP / STP)</b>: นิยมใช้ใน LAN มากที่สุด ระยะมาตรฐานไม่เกิน 100 เมตร (STP มีฉนวนหุ้มกันสัญญาณรบกวน EMI ดีกว่า UTP)',
            '<b>สายโคแอกเชียล (Coaxial)</b>: มีแกนทองแดงตรงกลางและชิลด์หุ้ม นิยมใช้ในระบบทีวีเคเบิลและกล้องวงจรปิด',
            '<b>สายใยแก้วนำแสง (Fiber Optic)</b>: ส่งข้อมูลด้วยพัลส์แสง ความเร็วสูงมาก ไม่ถูกรบกวนจากคลื่นแม่เหล็กไฟฟ้า เดินสายข้ามอาคารได้ไกลหลายกิโลเมตร (SMF ไกลกว่า MMF)'
          ]
        },
        {
          title: '3-4. สื่อกลางแบบไร้สาย และหัวต่อสายสัญญาณ (Connectors)',
          bullets: [
            '<b>สื่อกลางแบบไร้สาย (Wireless Media)</b>: คลื่นวิทยุ (Wi-Fi/Bluetooth), ไมโครเวฟ (เชื่อมจุดต่อจุดข้ามอาคารแบบแนวสายตา LOS), อินฟราเรด (ระยะใกล้ ห้ามมีสิ่งกีดขวาง) และดาวเทียม',
            '<b>หัวต่อสายสัญญาณ</b>: <b>RJ-45</b> (8 ขา ใช้กับสาย UTP เครือข่าย LAN), <b>RJ-11</b> (4/6 ขา ใช้กับสายโทรศัพท์), <b>BNC</b> (ใช้กับสาย Coaxial), <b>SC / LC / ST</b> (ใช้กับสาย Fiber Optic)'
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
        hp: 130,
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
          title: '1-2. องค์กรกำหนดมาตรฐาน และแบบจำลอง OSI 7 Layers',
          bullets: [
            '<b>องค์กรมาตรฐานสำคัญ</b>: <b>ISO</b> (สร้าง OSI Model), <b>IEEE</b> (มาตรฐาน 802 LAN/WLAN), <b>IETF</b> (โปรโตคอลอินเทอร์เน็ต TCP/IP), <b>ITU</b> (โทรคมนาคม), <b>TIA/EIA</b> (มาตรฐานการเดินสาย T568A/B)',
            '<b>OSI 7 Layers (ล่างขึ้นบน)</b>: 1. Physical (Bits) → 2. Data Link (Frame/MAC) → 3. Network (Packet/IP) → 4. Transport (Segment/TCP-UDP) → 5. Session → 6. Presentation → 7. Application (Data)'
          ]
        },
        {
          title: '3-4. โปรโตคอลในการสื่อสารข้อมูล และ TCP/IP Model',
          bullets: [
            '<b>TCP/IP 4 ชั้น</b>: Network Access → Internet (IP/ICMP) → Transport (TCP/UDP) → Application (HTTP/HTTPS, FTP, SMTP, DNS, DHCP, SSH)',
            '<b>TCP vs UDP</b>: <b>TCP</b> เชื่อมต่อแบบ 3-Way Handshake ตรวจสอบความถูกต้องครบถ้วน (เว็บ/อีเมล/ไฟล์) ส่วน <b>UDP</b> ส่งเร็วไม่รอตอบรับ (สตรีมมิง/เกมออนไลน์/DNS)'
          ]
        },
        {
          title: '5-6. การกำหนด IPv4, การแบ่งคลาส และมาตรฐาน IEEE 802',
          bullets: [
            '<b>IPv4 (32 บิต = 4 ชุด 0–255)</b>: <b>Class A</b> (1–126, Mask 255.0.0.0), <b>Class B</b> (128–191, Mask 255.255.0.0), <b>Class C</b> (192–223, Mask 255.255.255.0), 127.0.0.1 = Loopback',
            '<b>Private IP</b>: 10.0.0.0/8, 172.16.0.0–172.31.255.255, 192.168.0.0/16 ใช้ในวง LAN ภายใน',
            '<b>มาตรฐาน IEEE 802</b>: <b>802.3</b> (Ethernet LAN), <b>802.11</b> (Wireless LAN / Wi-Fi), <b>802.15</b> (WPAN / Bluetooth), <b>802.1Q</b> (VLAN)'
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
        hp: 135,
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
      codexCards: [
        {
          title: '1-2. เทคโนโลยีเครือข่าย LAN และมาตรฐาน Ethernet',
          bullets: [
            '<b>Ethernet (IEEE 802.3)</b>: เทคโนโลยี LAN แบบใช้สายที่นิยมมากที่สุด เดิมใช้กลไกตรวจสอบการชนกัน <b>CSMA/CD</b> ปัจจุบันใช้ Switch ทำงานแบบ Full-Duplex จึงไม่เกิดการชน',
            '<b>มาตรฐานความเร็ว</b>: <b>10BASE-T</b> (10 Mbps), <b>100BASE-TX</b> (Fast Ethernet 100 Mbps), <b>1000BASE-T</b> (Gigabit 1 Gbps — Cat5e/Cat6), <b>10GBASE-T</b> (10 Gbps — Cat6a)'
          ]
        },
        {
          title: '3. อุปกรณ์ในเครือข่ายอีเทอร์เน็ตแบบใช้สาย UTP',
          bullets: [
            '<b>Switch</b>: ศูนย์กลางกระจายสายในห้อง/ชั้นอาคาร รองรับ 8, 16, 24 หรือ 48 พอร์ต',
            '<b>Patch Panel & Wall Outlet (Faceplate)</b>: แผงรวมสายในตู้ Rack และเต้ารับติดผนัง ช่วยให้เดินสายเป็นระเบียบและดูแลรักษาง่าย',
            '<b>เครื่องมือช่าง LAN</b>: คีมย้ำหัวสาย (Crimping Tool), ที่ปอกสาย (Wire Stripper), คีมตอกสาย (Punch Down Tool) และเครื่องทดสอบสาย (LAN Cable Tester)'
          ]
        },
        {
          title: '4. การเข้าสาย UTP กับหัวต่อ RJ-45 (T568A / T568B)',
          bullets: [
            '<b>T568B (นิยมที่สุด)</b>: 1.ขาว-ส้ม, 2.ส้ม, 3.ขาว-เขียว, 4.น้ำเงิน, 5.ขาว-น้ำเงิน, 6.เขียว, 7.ขาว-น้ำตาล, 8.น้ำตาล',
            '<b>T568A</b>: 1.ขาว-เขียว, 2.เขียว, 3.ขาว-ส้ม, 4.น้ำเงิน, 5.ขาว-น้ำเงิน, 6.ส้ม, 7.ขาว-น้ำตาล, 8.น้ำตาล',
            '<b>สายตรง (Straight-Through)</b>: เข้าหัวเหมือนกันทั้งสองข้าง (B-B) ใช้ต่ออุปกรณ์ต่างชนิด (PC ↔ Switch) | <b>สายไขว้ (Crossover)</b>: เข้าหัว A-B ใช้ต่ออุปกรณ์ชนิดเดียวกัน (PC ↔ PC)'
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
        hp: 140,
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
          title: '1-2. ระบบ WLAN และมาตรฐานเครือข่ายไร้สาย (IEEE 802.11)',
          bullets: [
            '<b>WLAN (Wireless LAN)</b>: เชื่อมต่อเครือข่ายด้วยคลื่นวิทยุ โดยมี <b>SSID</b> เป็นชื่อเครือข่าย และเลือก <b>Channel</b> ที่ไม่ซ้อนทับกัน (ย่าน 2.4 GHz ใช้ช่อง 1, 6, 11)',
            '<b>ย่านความถี่</b>: <b>2.4 GHz</b> ทะลุกำแพงไกลกว่าแต่สัญญาณรบกวนเยอะ | <b>5 GHz / 6 GHz</b> ความเร็วสูง สัญญาณกวนน้อย แต่ระยะสั้นกว่า',
            '<b>มาตรฐาน 802.11</b>: 802.11b/g (รุ่นเก่า) → <b>802.11n (Wi-Fi 4)</b> → <b>802.11ac (Wi-Fi 5)</b> → <b>802.11ax (Wi-Fi 6/6E)</b> รองรับหลายอุปกรณ์พร้อมกันด้วย OFDMA/MU-MIMO'
          ]
        },
        {
          title: '3-4. อุปกรณ์ไร้สายและรูปแบบการเชื่อมต่อ',
          bullets: [
            '<b>อุปกรณ์หลัก</b>: Wireless NIC (USB/PCIe/Built-in), <b>Access Point (AP)</b> ตัวกระจายสัญญาณเชื่อมกับวง LAN, <b>Wireless Router</b> (รวม Router+Switch+AP) และเสาอากาศ (Omni / Directional)',
            '<b>Ad-Hoc Mode (IBSS)</b>: อุปกรณ์เชื่อมต่อกันโดยตรงแบบ Peer-to-Peer ไม่ต้องใช้ Access Point',
            '<b>Infrastructure Mode (BSS / ESS)</b>: ทุกเครื่องเชื่อมต่อผ่าน Access Point (ถ้ามี AP หลายตัวใช้ SSID เดียวกันเพื่อ Roaming เรียกว่า ESS)'
          ]
        },
        {
          title: '5. การรักษาความปลอดภัยในเครือข่ายไร้สาย',
          bullets: [
            '<b>การเข้ารหัส</b>: ห้ามใช้ WEP/WPA เดิมเพราะถูกถอดรหัสได้ง่าย ควรใช้ <b>WPA2-PSK (AES)</b> หรือ <b>WPA3-Personal/Enterprise</b>',
            '<b>มาตรการเสริม</b>: เปลี่ยนรหัสผ่าน Admin ของ Router, ปิด WPS, ตั้ง <b>MAC Address Filtering</b>, แยกเครือข่าย Guest Wi-Fi และอัปเดต Firmware สม่ำเสมอ'
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
        hp: 145,
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
          title: '1-3. ชื่อเครื่อง, ชื่อเครือข่าย (Workgroup) และการตั้งค่า IPv4',
          bullets: [
            '<b>เปลี่ยนชื่อเครื่อง & Workgroup</b>: เข้า <code>Settings → System → About → Rename this PC</code> หรือ <code>sysdm.cpl → Computer Name → Change</code> เพื่อให้ทุกเครื่องในห้องอยู่ใน Workgroup เดียวกันและชื่อเครื่องไม่ซ้ำกัน',
            '<b>เปลี่ยนหมายเลข IP Address</b>: เข้า <code>ncpa.cpl</code> → คลิกขวาการ์ดแลน (Ethernet/Wi-Fi) → Properties → <b>Internet Protocol Version 4 (TCP/IPv4)</b> เลือกรับอัตโนมัติ (DHCP) หรือกำหนดเอง (Static IP, Subnet Mask, Default Gateway, DNS)'
          ]
        },
        {
          title: '4-5. การแชร์โฟลเดอร์และการแชร์เครื่องพิมพ์ใน Windows',
          bullets: [
            '<b>เปิดการแชร์ในเครือข่าย</b>: ตั้งค่าโปรไฟล์เป็น <b>Private Network</b> และเปิด <b>Network Discovery</b> + <b>File and Printer Sharing</b> ใน Advanced Sharing Settings',
            '<b>แชร์โฟลเดอร์</b>: คลิกขวาโฟลเดอร์ → Properties → แท็บ <b>Sharing → Advanced Sharing</b> → กำหนดชื่อแชร์และสิทธิ์ (Permissions: Read / Change / Full Control)',
            '<b>แชร์เครื่องพิมพ์</b>: เข้า <code>Control Panel → Devices and Printers</code> → คลิกขวาเครื่องพิมพ์ → Printer Properties → แท็บ <b>Sharing</b> → ติ๊ก <b>Share this printer</b>'
          ]
        },
        {
          title: '6-7. การเชื่อมต่อโฟลเดอร์/เครื่องพิมพ์ที่แชร์ และเครือข่ายไร้สาย',
          bullets: [
            '<b>เข้าใช้งานไฟล์/เครื่องพิมพ์ที่แชร์</b>: กด <code>Win + R</code> พิมพ์ UNC Path เช่น <code>\\\\192.168.10.20</code> หรือ <code>\\\\LAB-PC01\\Homework</code> หรือคลิก <b>Map Network Drive</b> เพื่อสร้างไดรฟ์เสมือน (เช่น ไดรฟ์ Z:)',
            '<b>เชื่อมต่อเครือข่ายไร้สาย (Wi-Fi)</b>: คลิกไอคอนเครือข่ายที่มุมขวาล่าง Taskbar → เลือกชื่อ SSID → ใส่รหัสผ่าน Security Key → เลือก Connect automatically (หากเป็นเครือข่ายองค์กร/บ้าน ให้เลือก Private Network)'
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
        hp: 150,
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
          title: '1-2. ระบบปฏิบัติการเครือข่าย (NOS) และซอฟต์แวร์ Server',
          bullets: [
            '<b>NOS (Network Operating System)</b>: ระบบปฏิบัติการที่ออกแบบสำหรับเครื่องแม่ข่าย (Server) เพื่อจัดการบัญชีผู้ใช้ บริการเครือข่าย (DNS, DHCP, File, Web) และความปลอดภัยแบบรวมศูนย์',
            '<b>ซอฟต์แวร์ NOS ยอดนิยม</b>: <b>Windows Server</b> (จัดการโดเมนด้วย Active Directory ใช้งานง่ายผ่าน GUI), <b>Linux Server</b> (Ubuntu Server, Debian, Rocky/RHEL — ฟรี Open-Source เสถียร กินทรัพยากรน้อย), <b>FreeBSD</b>'
          ]
        },
        {
          title: '3. ซอฟต์แวร์จำลองเครื่องคอมพิวเตอร์ (Virtualization)',
          bullets: [
            '<b>Hypervisor Type 1 (Bare-Metal)</b>: ติดตั้งบนฮาร์ดแวร์โดยตรง เช่น VMware ESXi, Proxmox VE, Microsoft Hyper-V Server (ใช้ใน Data Center)',
            '<b>Hypervisor Type 2 (Hosted)</b>: ติดตั้งเป็นโปรแกรมบน OS หลัก เช่น <b>Oracle VirtualBox</b>, <b>VMware Workstation</b> เหมาะสำหรับฝึกปฏิบัติในห้องเรียน',
            '<b>ประโยชน์</b>: ประหยัดฮาร์ดแวร์ จำลองเครือข่ายหลายเครื่องได้ในพีซีเครื่องเดียว และมีฟีเจอร์ <b>Snapshot</b> ย้อนสถานะได้ทันทีเมื่อตั้งค่าพลาด'
          ]
        },
        {
          title: '4. การติดตั้งระบบปฏิบัติการเครือข่ายบนเครื่องจำลอง (VM)',
          bullets: [
            '<b>ขั้นตอนสร้าง VM</b>: 1) เปิด Intel VT-x / AMD-V ใน BIOS → 2) สร้าง VM กำหนด vCPU, RAM (เช่น ≥ 2–4 GB) และ Virtual Hard Disk (.vdi/.vmdk) → 3) เลือกไฟล์ติดตั้ง <b>.ISO</b>',
            '<b>โหมดเครือข่าย VM (Virtual NIC)</b>: <b>NAT</b> (VM ออกเน็ตผ่าน Host ได้แต่เครื่องอื่นใน LAN เรียกเข้าไม่ได้), <b>Bridged Adapter</b> (VM ได้รับ IP วง LAN จริงเหมือนเครื่องจริง), <b>Internal / Host-Only</b> (ทดสอบระบบปิดเฉพาะเครื่องจำลอง)'
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
        hp: 155,
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
      codexCards: [
        {
          title: '1-2. การออกแบบแผนผังเครือข่ายและการติดตั้ง',
          bullets: [
            '<b>แผนผังเครือข่าย</b>: แบ่งเป็น <b>Physical Diagram</b> (ตำแหน่งวางตู้ Rack, เส้นทางเดินสาย, จุดติดตั้ง AP) และ <b>Logical Diagram</b> (การแบ่ง IP Plan, Subnet, VLAN, Gateway)',
            '<b>ขั้นตอนติดตั้งที่ดี</b>: สำรวจพื้นที่ → จัดทำรายการอุปกรณ์ (BOM) → เดินสายและติดป้ายกำกับ (Cable Labeling) → เข้าหัวสายและทดสอบด้วย Cable Tester → ตั้งค่าอุปกรณ์และทำเอกสารส่งมอบ'
          ]
        },
        {
          title: '3-4. การตรวจสอบ การวิเคราะห์ และแก้ปัญหาเครือข่าย',
          bullets: [
            '<b>คำสั่งตรวจสอบ (CLI)</b>: <code>ipconfig /all</code> (ดู IP/MAC/DNS), <code>ping</code> (ทดสอบเชื่อมต่อ), <code>tracert</code> (ไล่เส้นทางแต่ละ Hop), <code>nslookup</code> (ทดสอบ DNS), <code>netstat</code> (ดูพอร์ตที่เปิดอยู่)',
            '<b>หลักการแก้ปัญหาทีละชั้น (Bottom-Up)</b>: 1) ตรวจไฟสถานะสายแลน/พอร์ต Switch (Physical) → 2) ตรวจ IP ไม่ใช่ <code>169.254.x.x</code> (APIPA) → 3) <code>ping</code> Gateway → 4) <code>ping 8.8.8.8</code> → 5) ทดสอบ DNS'
          ]
        },
        {
          title: '5-6. ซอฟต์แวร์ช่วยงานและซอฟต์แวร์ควบคุมคอมพิวเตอร์ระยะไกล',
          bullets: [
            '<b>ซอฟต์แวร์ช่วยงานเครือข่าย</b>: <b>Wireshark</b> (จับและวิเคราะห์ Packet), <b>Advanced IP Scanner / Nmap</b> (สแกนอุปกรณ์ในวง LAN), <b>Cisco Packet Tracer</b> (จำลองออกแบบเครือข่าย), <b>PuTTY</b> (เชื่อมต่อ SSH/Serial)',
            '<b>ซอฟต์แวร์ควบคุมระยะไกล (Remote Control)</b>: <b>Remote Desktop (RDP - Port 3389)</b> ของ Windows, <b>AnyDesk / TeamViewer / Chrome Remote Desktop</b> (ควบคุมหน้าจอผ่านอินเทอร์เน็ตได้แม้ติด NAT), <b>VNC</b> และ <b>SSH</b>'
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
        hp: 165,
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
      codexCards: [
        {
          title: '1-3. ภัยคุกคาม การป้องกัน และมาตรการความปลอดภัย',
          bullets: [
            '<b>ภัยคุกคามสำคัญ</b>: <b>Malware</b> (Virus, Worm แพร่เองผ่านเครือข่าย, Trojan แฝงตัว, Spyware แอบดักข้อมูล, <b>Ransomware</b> เข้ารหัสเรียกค่าไถ่), <b>Phishing</b> (เว็บ/อีเมลปลอม), <b>DDoS</b> (ถล่มให้ระบบล่ม), <b>MITM</b> (ดักจับข้อมูลกลางทาง)',
            '<b>หลัก CIA Triad</b>: <b>Confidentiality</b> (ความลับ/การเข้ารหัส), <b>Integrity</b> (ความถูกต้องไม่ถูกแก้ไข), <b>Availability</b> (พร้อมใช้งานตลอดเวลา)',
            '<b>มาตรการความปลอดภัย</b>: นโยบายรหัสผ่านแข็งแรง + <b>2FA/MFA</b>, อัปเดต Patch สม่ำเสมอ, ใช้ <b>VPN</b> เมื่อต่อเน็ตสาธารณะ และสำรองข้อมูล <b>Backup แบบ Offline</b>'
          ]
        },
        {
          title: '4. โปรแกรมตรวจจับและกำจัดไวรัส (Antivirus)',
          bullets: [
            '<b>การทำงานของ Antivirus</b>: ตรวจจับแบบ <b>Signature-based</b> (เทียบฐานข้อมูลไวรัสที่รู้จัก), <b>Heuristic/Behavior</b> (ตรวจพฤติกรรมต้องสงสัย) และ <b>Real-time Protection</b>',
            '<b>การจัดการไฟล์ติดเชื้อ</b>: เมื่อพบไฟล์อันตราย ระบบจะย้ายไปกักกัน (<b>Quarantine</b>) หรือลบออก และต้องอัปเดต Virus Definition ให้เป็นปัจจุบันอยู่เสมอ (เช่น Windows Defender / Microsoft Security)'
          ]
        },
        {
          title: '5-6. การสร้างความปลอดภัยด้วย Firewall และ Windows Firewall',
          bullets: [
            '<b>Firewall</b>: กำแพงไฟคัดกรองทราฟฟิกขาเข้า (<b>Inbound Rules</b>) และขาออก (<b>Outbound Rules</b>) ตาม IP, Protocol และหมายเลข Port (เช่น Allow HTTPS 443/DNS 53, Block Telnet 23/SMB 445 จากภายนอก)',
            '<b>Windows Defender Firewall</b>: แบ่งโปรไฟล์ 3 แบบคือ <b>Domain</b>, <b>Private</b> และ <b>Public Network</b> สามารถอนุญาตเฉพาะโปรแกรม (Allow an app) หรือตั้งกฎพอร์ตละเอียดได้ที่ <code>wf.msc</code> (Windows Firewall with Advanced Security)'
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
        hp: 175,
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
      codexCards: [
        {
          title: '1-2. ประโยชน์และการสร้างบัญชีผู้ใช้งาน (User Accounts)',
          bullets: [
            '<b>ประโยชน์ของบัญชีผู้ใช้</b>: ยืนยันตัวตน (Authentication), แยกพื้นที่ไฟล์ส่วนตัว (User Profile), กำหนดขอบเขตสิทธิ์ (Authorization) และตรวจสอบย้อนหลังได้ (Auditing)',
            '<b>ประเภทบัญชีใน Windows</b>: <b>Administrator</b> (ติดตั้งโปรแกรม/แก้ระบบได้ทั้งหมด), <b>Standard User</b> (ใช้งานประจำวัน ปลอดภัยจากมัลแวร์มากกว่า), <b>Guest</b> (ใช้ชั่วคราว)',
            '<b>วิธีสร้างบัญชี</b>: เข้า <code>Settings → Accounts → Other users</code> หรือ <code>lusrmgr.msc</code> (Local Users and Groups) หรือคำสั่ง <code>net user ชื่อ รหัส /add</code>'
          ]
        },
        {
          title: '3-4. การสร้างกลุ่มผู้ใช้และการกำหนดสิทธิการใช้งาน',
          bullets: [
            '<b>การสร้างกลุ่มผู้ใช้ (User Groups)</b>: รวมบัญชีที่มีหน้าที่คล้ายกันไว้ในกลุ่มเดียว (เช่น กลุ่ม <code>Teachers</code>, <code>Students</code>, <code>Administrators</code>) แล้วกำหนดสิทธิ์ที่ระดับกลุ่มแทนการตั้งทีละคน',
            '<b>NTFS Permissions vs Share Permissions</b>: แท็บ <b>Security (NTFS)</b> คุมสิทธิ์ละเอียดระดับไฟล์/โฟลเดอร์ (Full Control, Modify, Read & Execute, Write) ส่วนแท็บ <b>Sharing</b> คุมสิทธิ์เมื่อเข้าผ่านเครือข่าย (เมื่อใช้ร่วมกันจะยึดสิทธิ์ที่<b>เข้มงวดกว่า</b>)',
            '<b>หลักสิทธิ์น้อยที่สุด (Least Privilege)</b>: ให้สิทธิ์เฉพาะเท่าที่จำเป็น และจำกฎสำคัญว่า <b>Explicit Deny จะชนะ Allow เสมอ</b>'
          ]
        },
        {
          title: '5. การใช้งานตามบัญชีผู้ใช้ในเครือข่ายวินโดวส์',
          bullets: [
            '<b>การสลับและลงชื่อเข้าใช้</b>: กด <code>Ctrl + Alt + Del</code> เพื่อ Sign out / Switch user หรือล็อกหน้าจอด้วย <code>Win + L</code> ทุกครั้งเมื่อลุกจากเครื่อง',
            '<b>การใช้งานข้ามเครือข่าย</b>: เมื่อเข้าถึงโฟลเดอร์แชร์บนเครื่องแม่ข่าย (เช่น <code>\\\\LAB-SRV\\Exam_Bank</code>) Windows จะถาม Username/Password ของบัญชีที่ได้รับอนุญาต หากใช้บัญชีกลุ่ม Students จะเปิดอ่านได้แต่แก้ไขไฟล์ข้อสอบไม่ได้'
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
        }
      ]
    }
  ];

  const INITIAL_LEADERBOARD = [
    { name: 'ธนกฤต วงศ์เครือข่าย', studentId: '6720901001', classRoom: 'ปวช.2/1', heroClass: 'paladin', level: 8, xp: 4120, unitsCleared: 10, badgeCount: 14, arcadeHighScore: 1250, updatedAt: '2026-11-19' },
    { name: 'กัญญาณัฐ ไฟเบอร์ออปติก', studentId: '6720901014', classRoom: 'ปวช.2/1', heroClass: 'mage', level: 7, xp: 3380, unitsCleared: 8, badgeCount: 11, arcadeHighScore: 950, updatedAt: '2026-11-19' },
    { name: 'ภานุพงศ์ แพ็กเก็ตมาสเตอร์', studentId: '6720901022', classRoom: 'ปวช.2/2', heroClass: 'ninja', level: 6, xp: 2490, unitsCleared: 6, badgeCount: 8, arcadeHighScore: 725, updatedAt: '2026-11-18' },
    { name: 'สุพิชชา เราเตอร์เรนเจอร์', studentId: '6720901035', classRoom: 'ปวช.1/1', heroClass: 'ranger', level: 4, xp: 1320, unitsCleared: 3, badgeCount: 5, arcadeHighScore: 450, updatedAt: '2026-11-18' }
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
            { id: 'u1_q1_1', label: '1)', placeholder: 'เช่น ใช้ทรัพยากรร่วมกัน (เครื่องพิมพ์/ไฟล์/อินเทอร์เน็ต)...', model: 'ใช้ทรัพยากรร่วมกัน เช่น เครื่องพิมพ์ ไฟล์ข้อมูล และอินเทอร์เน็ต' },
            { id: 'u1_q1_2', label: '2)', placeholder: 'เช่น ติดต่อสื่อสารสะดวกรวดเร็ว...', model: 'ติดต่อสื่อสารระหว่างผู้ใช้ได้รวดเร็ว เช่น อีเมล แชต ประชุมออนไลน์' },
            { id: 'u1_q1_3', label: '3)', placeholder: 'เช่น ลดต้นทุนในการจัดซื้ออุปกรณ์...', model: 'ช่วยลดต้นทุนในการจัดซื้อฮาร์ดแวร์และซอฟต์แวร์' },
            { id: 'u1_q1_4', label: '4)', placeholder: 'เช่น จัดเก็บและสำรองข้อมูลแบบรวมศูนย์...', model: 'จัดเก็บ ดูแลรักษา และสำรองข้อมูลได้อย่างเป็นระบบและปลอดภัย' }
          ]
        },
        {
          no: 2,
          prompt: 'จงบอกองค์ประกอบของระบบเครือข่ายคอมพิวเตอร์',
          items: [
            { id: 'u1_q2_1', label: '1)', placeholder: 'เช่น ผู้ส่งข้อมูล (Sender)...', model: 'ผู้ส่งข้อมูล (Sender) และผู้รับข้อมูล (Receiver)' },
            { id: 'u1_q2_2', label: '2)', placeholder: 'เช่น ข้อมูลข่าวสาร (Message)...', model: 'ข้อมูลข่าวสาร (Message)' },
            { id: 'u1_q2_3', label: '3)', placeholder: 'เช่น สื่อกลางนำสัญญาณ (Transmission Medium)...', model: 'สื่อกลางนำสัญญาณ (Transmission Medium) เช่น สาย UTP, Fiber, คลื่นวิทยุ' },
            { id: 'u1_q2_4', label: '4)', placeholder: 'เช่น โปรโตคอล (Protocol) / อุปกรณ์เครือข่าย...', model: 'โปรโตคอล (Protocol) และอุปกรณ์เครือข่าย เช่น Switch, Router' }
          ]
        },
        {
          no: 3,
          prompt: 'จงบอกความแตกต่างของเครือข่ายแต่ละประเภท',
          items: [
            { id: 'u1_q3_1', label: '1) เครือข่าย LAN คือ', placeholder: 'อธิบายขอบเขตและลักษณะของ LAN...', model: 'เครือข่ายท้องถิ่น เชื่อมโยงในระยะใกล้ เช่น ห้องเรียน อาคาร หรือวิทยาลัยเดียวกัน ความเร็วสูง' },
            { id: 'u1_q3_2', label: '2) เครือข่าย MAN คือ', placeholder: 'อธิบายขอบเขตและลักษณะของ MAN...', model: 'เครือข่ายระดับเมือง เชื่อมโยงหลายอาคารหรือหลายวิทยาเขตภายในเมืองหรือจังหวัดเดียวกัน' },
            { id: 'u1_q3_3', label: '3) เครือข่าย WAN คือ', placeholder: 'อธิบายขอบเขตและลักษณะของ WAN...', model: 'เครือข่ายบริเวณกว้าง เชื่อมโยงข้ามจังหวัด ข้ามประเทศ หรือทั่วโลก เช่น อินเทอร์เน็ต' },
            { id: 'u1_q3_4', label: '4) เครือข่าย PAN คือ', placeholder: 'อธิบายขอบเขตและลักษณะของ PAN...', model: 'เครือข่ายส่วนบุคคล ระยะใกล้ประมาณ 1–10 เมตร เช่น Bluetooth เชื่อมมือถือกับหูฟัง/สมาร์ตวอตช์' }
          ]
        },
        {
          no: 4,
          prompt: 'จงบอกความแตกต่างของลักษณะการใช้งานเครือข่ายคอมพิวเตอร์ต่อไปนี้',
          items: [
            { id: 'u1_q4_1', label: '1) เครือข่ายแบบ Peer to Peer คือ', multiline: true, placeholder: 'อธิบายลักษณะของ Peer-to-Peer...', model: 'ทุกเครื่องมีสิทธิ์เท่าเทียมกัน ไม่มีเครื่องแม่ข่ายกลาง (Server) ติดตั้งง่าย ประหยัด เหมาะกับเครือข่ายขนาดเล็กไม่เกิน 10 เครื่อง' },
            { id: 'u1_q4_2', label: '2) เครือข่ายแบบ Client-Server คือ', multiline: true, placeholder: 'อธิบายลักษณะของ Client-Server...', model: 'มีเครื่องแม่ข่าย (Server) ทำหน้าที่ให้บริการและควบคุมสิทธิ์ความปลอดภัยแบบรวมศูนย์ และมีเครื่องลูกข่าย (Client) ร้องขอใช้บริการ เหมาะกับองค์กรขนาดกลาง-ใหญ่' }
          ]
        },
        {
          no: 5,
          prompt: 'จงบอกลักษณะการเชื่อมต่อเครือข่าย (Network Topology) ต่อไปนี้ โดยสังเขป',
          items: [
            { id: 'u1_q5_1', label: '1) การเชื่อมต่อแบบ Bus Topology', placeholder: 'อธิบายลักษณะของ Bus Topology...', model: 'เชื่อมต่อทุกเครื่องเข้ากับสายหลักเส้นเดียว (Backbone) มี Terminator ปิดหัวท้าย ประหยัดสายแต่สายหลักขาดจะล่มทั้งเครือข่าย' },
            { id: 'u1_q5_2', label: '2) การเชื่อมต่อแบบ Star Topology', placeholder: 'อธิบายลักษณะของ Star Topology...', model: 'ทุกเครื่องเชื่อมต่อแยกสายเข้าสู่อุปกรณ์ศูนย์กลาง (Switch/Hub) หากสายเครื่องใดขาดจะกระทบเฉพาะเครื่องนั้น นิยมใช้มากที่สุด' },
            { id: 'u1_q5_3', label: '3) การเชื่อมต่อแบบ Ring Topology', placeholder: 'อธิบายลักษณะของ Ring Topology...', model: 'เชื่อมต่อเป็นวงแหวนส่งข้อมูลวนทิศทางเดียวผ่าน Token ลดการชนกันของข้อมูล แต่หากสายหรือเครื่องใดเสียอาจกระทบทั้งวง' }
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
            { id: 'u2_q1_1', label: '1)', placeholder: 'เช่น Switch (สวิตช์)...', model: 'Switch (สวิตช์เครือข่าย)' },
            { id: 'u2_q1_2', label: '2)', placeholder: 'เช่น Router (เราเตอร์)...', model: 'Router (เราเตอร์)' },
            { id: 'u2_q1_3', label: '3)', placeholder: 'เช่น Access Point / NIC / Modem...', model: 'Access Point (จุดกระจายสัญญาณไร้สาย) หรือ NIC / Modem' }
          ]
        },
        {
          no: 2,
          prompt: 'สายโคแอกเชียล มีข้อดี-ข้อเสียอย่างไร และที่ใช้ในเครือข่ายคอมพิวเตอร์มีกี่ชนิด',
          items: [
            { id: 'u2_q2_1', label: 'คำตอบ:', multiline: true, placeholder: 'ระบุข้อดี ข้อเสีย และชนิดของสายโคแอกเชียล (เช่น Thicknet / Thinnet)...', model: 'ข้อดี: ป้องกันสัญญาณรบกวนได้ดี เดินสายได้ไกลกว่า UTP | ข้อเสีย: สายแข็ง ติดตั้งและเข้าหัวยากกว่า UTP | ชนิดที่ใช้ในเครือข่ายมี 2 ชนิด คือ แบบบาง (Thinnet / 10BASE2) และแบบหนา (Thicknet / 10BASE5)' }
          ]
        },
        {
          no: 3,
          prompt: 'สายคู่บิดเกลียวแบบ STP กับ UTP มีข้อแตกต่างกันอย่างไร',
          items: [
            { id: 'u2_q3_1', label: 'คำตอบ:', multiline: true, placeholder: 'เปรียบเทียบฉนวนป้องกันสัญญาณรบกวน ราคา และการใช้งาน...', model: 'สาย STP (Shielded Twisted Pair) มีแผ่นโลหะ/ฟอยล์หุ้มป้องกันสัญญาณรบกวนแม่เหล็กไฟฟ้า (EMI) ได้ดีกว่าแต่ราคาแพงกว่าและแข็งกว่า ส่วนสาย UTP (Unshielded) ไม่มีฉนวนโลหะหุ้ม ราคาถูก ติดตั้งง่าย นิยมใช้ใน LAN ทั่วไป' }
          ]
        },
        {
          no: 4,
          prompt: 'สายใยแก้วนำแสง (Fiber Optic) มีกี่แบบ มีข้อดีและข้อจำกัดอย่างไร',
          items: [
            { id: 'u2_q4_1', label: 'คำตอบ:', multiline: true, placeholder: 'ระบุชนิด (Single-Mode / Multi-Mode), ข้อดี และข้อจำกัด...', model: 'มี 2 แบบ คือ Single-Mode (SMF เดินสายไกลหลาย กม.) และ Multi-Mode (MMF ระยะใกล้กว่า) | ข้อดี: ความเร็วสูงมาก ไม่ถูกรบกวนจากคลื่นแม่เหล็กไฟฟ้า ส่งได้ไกล | ข้อจำกัด: ราคาอุปกรณ์สูง สายเปราะบางหักงอไม่ได้ เข้าหัวสายยากต้องใช้ช่างชำนาญ' }
          ]
        },
        {
          no: 5,
          prompt: 'การสื่อสารข้อมูลโดยใช้คลื่นไมโครเวฟ (Microwave) กับ คลื่นบลูทูธ (Bluetooth) และคลื่นอินฟราเรด (Infrared) ใช้งานแตกต่างกันอย่างไร',
          items: [
            { id: 'u2_q5_1', label: 'คำตอบ:', multiline: true, placeholder: 'เปรียบเทียบระยะทาง ลักษณะการใช้งาน และสิ่งกีดขวางของทั้ง 3 คลื่น...', model: 'ไมโครเวฟ: ส่งข้อมูลระยะไกลระดับกิโลเมตรเชื่อมระหว่างอาคาร/สถานีแบบแนวสายตา (LOS) | บลูทูธ: ส่งระยะใกล้ 1–10 ม. (PAN) ทะลุสิ่งกีดขวางเบาได้ ใช้กับหูฟัง/อุปกรณ์พกพา | อินฟราเรด: ส่งระยะใกล้มาก ห้ามมีสิ่งกีดขวางกั้นแนวสายตา เช่น รีโมตคอนโทรล' }
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
    }
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
    SKILL_EXERCISES
  };
})(window);
