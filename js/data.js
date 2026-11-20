/**
 * NetQuest 16-Bit: Comprehensive Computer Network Curriculum & Game Data (ปวช.)
 * Covers 6 core vocational units, 36+ boss quiz items, classes, shop items, badges, and pixel infographics.
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
      price: 60,
      sprite: 'potion',
      effect: 'heal'
    },
    {
      id: 'analyzer',
      type: 'consumable',
      name: 'Packet Sniffer (50/50)',
      desc: 'ตัดตัวเลือกที่ผิดออก 2 ข้อ ในศึกบอส',
      price: 85,
      sprite: 'analyzer',
      effect: 'fifty'
    },
    {
      id: 'clock',
      type: 'consumable',
      name: 'Overclock Crystal (+15s)',
      desc: 'เพิ่มเวลาตอบข้อปัจจุบันอีก 15 วินาที',
      price: 70,
      sprite: 'clock',
      effect: 'time'
    },
    {
      id: 'shield',
      type: 'consumable',
      name: 'Firewall Shield (กันดาเมจ)',
      desc: 'ป้องกันดาเมจจากการตอบผิดได้ 1 ครั้ง',
      price: 95,
      sprite: 'shield',
      effect: 'shield'
    },
    {
      id: 'golden_crimper',
      type: 'equipment',
      name: 'คีมย้ำสายทองคำ (Equip)',
      desc: 'เพิ่มพลังโจมตีถาวร +12 ต่อบอสทุกตัว',
      price: 260,
      sprite: 'golden_crimper',
      stat: { atk: 12 }
    },
    {
      id: 'fiber_boots',
      type: 'equipment',
      name: 'รองเท้าไฟเบอร์ (Equip)',
      desc: 'เพิ่มเวลาตอบคำถามถาวร +6 วินาทีทุกข้อ',
      price: 240,
      sprite: 'fiber_boots',
      stat: { time: 6 }
    },
    {
      id: 'packet_goggles',
      type: 'equipment',
      name: 'แว่นสแกนแพ็กเก็ต (Equip)',
      desc: 'เพิ่มโอกาส Critical Hit +18% และ XP +15%',
      price: 300,
      sprite: 'packet_goggles',
      stat: { crit: 0.18, xp: 0.15 }
    },
    {
      id: 'firewall_armor',
      type: 'equipment',
      name: 'เกราะไฟร์วอลล์ (Equip)',
      desc: 'เพิ่ม Max HP ถาวร +35 และลดดาเมจบอส 25%',
      price: 320,
      sprite: 'firewall_armor',
      stat: { hp: 35, def: 0.25 }
    }
  ];

  const BADGES = [
    { id: 'first_login', name: 'นักผจญภัยหน้าใหม่', desc: 'สร้างตัวละครและเข้าสู่โลก NetQuest', icon: '🎮', color: '#38bdf8' },
    { id: 'unit1_clear', name: 'สถาปนิกผังเครือข่าย', desc: 'ผ่านปฏิบัติการและบอส หน่วยที่ 1', icon: '🌐', color: '#22c55e' },
    { id: 'unit2_clear', name: 'ปรมาจารย์เข้าหัวสาย RJ-45', desc: 'เข้าหัวสาย T568A/B และปราบบอส หน่วยที่ 2', icon: '🔌', color: '#f97316' },
    { id: 'unit3_clear', name: 'ผู้พิทักษ์หอคอย OSI', desc: 'เรียง OSI 7 Layers และปราบบอส หน่วยที่ 3', icon: '🗼', color: '#a855f7' },
    { id: 'unit4_clear', name: 'หมอรักษา IP & CLI', desc: 'แก้ปัญหา IPv4 ด้วย ipconfig/ping หน่วยที่ 4', icon: '💻', color: '#06b6d4' },
    { id: 'unit5_clear', name: 'จ้าวแห่งคลื่นไร้สาย Wi-Fi', desc: 'ตั้งค่า WLAN & DHCP DORA หน่วยที่ 5', icon: '📡', color: '#0ea5e9' },
    { id: 'unit6_clear', name: 'ผู้บัญชาการไซเบอร์', desc: 'ตั้งกฎ Firewall สกัดภัยคุกคาม หน่วยที่ 6', icon: '🛡️', color: '#ef4444' },
    { id: 'combo_master', name: 'คอมโบสายฟ้าฟาด', desc: 'ตอบคำถามถูกติดต่อกัน 4 ข้อ (Combo x4)', icon: '⚡', color: '#facc15' },
    { id: 'perfect_crimper', name: 'มือทองเข้าหัวสาย', desc: 'ผ่านการทดสอบสาย LAN T568B ในครั้งแรก', icon: '🔧', color: '#fbbf24' },
    { id: 'shopaholic', name: 'นักช้อปอุปกรณ์เทพ', desc: 'ซื้อไอเทมหรืออุปกรณ์จาก Pixel Shop', icon: '🛒', color: '#ec4899' },
    { id: 'arcade_hero', name: 'ราชาตู้อาร์เคด', desc: 'ทำคะแนนโหมด Endless Arcade ตั้งแต่ 500 ขึ้นไป', icon: '🕹️', color: '#8b5cf6' },
    { id: 'grand_champion', name: 'บัณฑิตเครือข่าย ปวช.', desc: 'พิชิตครบทั้ง 6 หน่วยการเรียนรู้!', icon: '👑', color: '#f59e0b' }
  ];

  const DAILY_QUESTS = [
    { id: 'dq_lab', title: 'ทำห้อง Lab จำลองสำเร็จ 1 หน่วย', rewardXp: 120, rewardCoins: 80, target: 1, metric: 'labsCompletedToday' },
    { id: 'dq_boss', title: 'พิชิตบอสประจำหน่วย 1 ตัว', rewardXp: 150, rewardCoins: 100, target: 1, metric: 'bossesDefeatedToday' },
    { id: 'dq_combo', title: 'ทำคอมโบตอบถูกต่อเนื่อง 3 ข้อ', rewardXp: 100, rewardCoins: 75, target: 3, metric: 'bestComboToday' },
    { id: 'dq_arcade', title: 'เข้าเล่นโหมด Endless Arcade 1 รอบ', rewardXp: 90, rewardCoins: 60, target: 1, metric: 'arcadeRunsToday' }
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
    {
      id: 1,
      code: 'UNIT 01',
      title: 'พื้นฐานเครือข่ายและ Topology',
      subtitle: 'PAN / LAN / MAN / WAN และโครงสร้างการเชื่อมต่อ',
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
          <!-- LAN vs MAN vs WAN -->
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

          <!-- BUS -->
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

          <!-- MESH -->
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
          title: 'ขนาดของเครือข่าย (PAN → LAN → MAN → WAN)',
          bullets: [
            '<b>PAN (Personal Area Network)</b>: ระยะใกล้ไม่เกิน 10 เมตร เช่น Bluetooth, หูฟังไร้สาย, Smartwatch',
            '<b>LAN (Local Area Network)</b>: ภายในห้อง อาคาร หรือวิทยาลัยเดียวกัน ความเร็วสูง ต้นทุนต่ำ',
            '<b>MAN (Metropolitan Area Network)</b>: เชื่อมระดับเมืองหรือจังหวัด เช่น เครือข่ายเทศบาล/มหาวิทยาลัยหลายวิทยาเขต',
            '<b>WAN (Wide Area Network)</b>: ข้ามประเทศ/ทั่วโลก เช่น ระบบอินเทอร์เน็ต สาขาธนาคารข้ามทวีป'
          ]
        },
        {
          title: 'โครงสร้างเครือข่าย (Network Topologies)',
          bullets: [
            '<b>Star Topology</b>: นิยมมากที่สุดใน LAN ปัจจุบัน ทุกเครื่องต่อเข้า Switch ตรงกลาง สายขาด 1 เส้นกระทบเฉพาะเครื่องนั้น',
            '<b>Bus Topology</b>: ใช้สายหลักเส้นเดียว (Backbone) + Terminator ปิดหัวท้าย ราคาถูกแต่สายหลักขาดล่มทั้งวง',
            '<b>Ring Topology</b>: ส่งข้อมูลเป็นวงแหวนทิศทางเดียว (Token Passing) ชนกันน้อย แต่แก้ไขสายยาก',
            '<b>Mesh Topology</b>: เชื่อมโยงสลับกันหลายเส้นทาง (Full Mesh = N(N-1)/2 เส้น) เสถียรสุด เหมาะกับ Server/WAN'
          ]
        }
      ],
      quiz: [
        {
          q: 'วิทยาลัยอาชีวศึกษาต้องการเชื่อมคอมพิวเตอร์ 40 เครื่องภายในห้องปฏิบัติการคอมพิวเตอร์เดียวกัน ควรจัดเป็นเครือข่ายประเภทใด?',
          options: ['PAN (Personal Area Network)', 'LAN (Local Area Network)', 'MAN (Metropolitan Area Network)', 'WAN (Wide Area Network)'],
          ans: 1,
          exp: 'การเชื่อมต่อภายในอาคารหรือห้องเดียวกันเป็นเครือข่ายท้องถิ่น (LAN: Local Area Network) ที่ให้ความเร็วสูงและดูแลง่าย'
        },
        {
          q: 'หากสายสัญญาณจาก PC-03 ไปยัง Switch ในระบบ Star Topology ขาด จะเกิดผลอย่างไร?',
          options: ['เครือข่ายล่มทั้งห้องทันที', 'กระทบเฉพาะ PC-03 เครื่องเดียว เครื่องอื่นใช้งานได้ปกติ', 'ข้อมูลจะย้อนกลับทาง Token Ring', 'Switch จะระเบิด'],
          ans: 1,
          exp: 'จุดเด่นของ Star Topology คืออุปกรณ์แต่ละเครื่องมีสายแยกเข้าสู่ Switch ตรงกลาง หากสายเครื่องใดขาด จะกระทบเฉพาะเครื่องนั้น'
        },
        {
          q: 'โครงสร้างแบบใดที่มีอุปกรณ์ Terminator ปิดหัวท้ายสายหลัก และหากสายแกนกลางขาดจะล่มทั้งเครือข่าย?',
          options: ['Star Topology', 'Mesh Topology', 'Bus Topology', 'Tree Topology'],
          ans: 2,
          exp: 'Bus Topology ใช้สายหลัก (Backbone) ร่วมกันและต้องมี Terminator ปิดหัวท้ายเพื่อกันสัญญาณสะท้อน'
        },
        {
          q: 'การเชื่อมต่อหูฟังไร้สาย Bluetooth เข้ากับสมาร์ตโฟนในระยะ 3 เมตร จัดเป็นเครือข่ายชนิดใด?',
          options: ['PAN', 'LAN', 'MAN', 'SAN'],
          ans: 0,
          exp: 'PAN (Personal Area Network) เป็นเครือข่ายส่วนบุคคลระยะใกล้ประมาณ 1–10 เมตร'
        },
        {
          q: 'สูตรคำนวณจำนวนสายเชื่อมต่อแบบ Full Mesh Topology สำหรับอุปกรณ์จำนวน N เครื่อง คือข้อใด?',
          options: ['N + 1', 'N × 2', 'N(N - 1) / 2', 'N²'],
          ans: 2,
          exp: 'Full Mesh เชื่อมทุกเครื่องเข้าหากันโดยตรง จึงใช้สายเท่ากับ N(N - 1) / 2 เส้น (เช่น 4 เครื่อง = 4×3/2 = 6 เส้น)'
        },
        {
          q: 'เครือข่ายอินเทอร์เน็ตที่เชื่อมโยงเซิร์ฟเวอร์ข้ามทวีปและทั่วโลก จัดอยู่ในกลุ่มใด?',
          options: ['LAN', 'PAN', 'CAN', 'WAN'],
          ans: 3,
          exp: 'WAN (Wide Area Network) ครอบคลุมระยะทางกว้างไกลระดับประเทศหรือทั่วโลก เช่น อินเทอร์เน็ต'
        }
      ]
    },
    {
      id: 2,
      code: 'UNIT 02',
      title: 'สื่อนำสัญญาณ RJ-45 และอุปกรณ์เครือข่าย',
      subtitle: 'UTP T568A/B, Fiber Optic, Hub, Switch, Router, AP',
      color: '#f97316',
      zoneName: 'โรงงานเข้าหัวสายแลน',
      boss: {
        name: 'Wire Golem MK-II',
        thName: 'โกเลมสายสัญญาณพันกัน',
        sprite: 'wire_golem',
        hp: 120,
        atk: 20,
        taunt: 'เรียงสีสาย Pin 1-8 ผิดแม้แต่เส้นเดียว แพ็กเก็ตเจ้าก็จะหายไป!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#f97316" stroke-width="4"/>
          <text x="165" y="34" fill="#fb923c" font-size="13" font-weight="bold" text-anchor="middle">มาตรฐานสีสาย RJ-45 : T568B (นิยมสุด)</text>
          <!-- 8 Pins T568B -->
          <rect x="28" y="48" width="28" height="110" fill="#ffedd5" stroke="#f97316" stroke-width="2"/>
          <rect x="28" y="80" width="28" height="12" fill="#f97316"/>
          <text x="42" y="176" fill="#fff" font-size="10" text-anchor="middle">1:ข-ส</text>

          <rect x="62" y="48" width="28" height="110" fill="#f97316" stroke="#fff" stroke-width="1"/>
          <text x="76" y="176" fill="#fff" font-size="10" text-anchor="middle">2:ส้ม</text>

          <rect x="96" y="48" width="28" height="110" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
          <rect x="96" y="80" width="28" height="12" fill="#22c55e"/>
          <text x="110" y="176" fill="#fff" font-size="10" text-anchor="middle">3:ข-ข</text>

          <rect x="130" y="48" width="28" height="110" fill="#2563eb" stroke="#fff" stroke-width="1"/>
          <text x="144" y="176" fill="#fff" font-size="10" text-anchor="middle">4:น้ำเงิน</text>

          <rect x="164" y="48" width="28" height="110" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
          <rect x="164" y="80" width="28" height="12" fill="#2563eb"/>
          <text x="178" y="176" fill="#fff" font-size="10" text-anchor="middle">5:ข-น</text>

          <rect x="198" y="48" width="28" height="110" fill="#22c55e" stroke="#fff" stroke-width="1"/>
          <text x="212" y="176" fill="#fff" font-size="10" text-anchor="middle">6:เขียว</text>

          <rect x="232" y="48" width="28" height="110" fill="#fef3c7" stroke="#92400e" stroke-width="2"/>
          <rect x="232" y="80" width="28" height="12" fill="#92400e"/>
          <text x="246" y="176" fill="#fff" font-size="10" text-anchor="middle">7:ข-ต</text>

          <rect x="266" y="48" width="28" height="110" fill="#92400e" stroke="#fff" stroke-width="1"/>
          <text x="280" y="176" fill="#fff" font-size="10" text-anchor="middle">8:น้ำตาล</text>

          <text x="165" y="206" fill="#94a3b8" font-size="11" text-anchor="middle">Straight-Through: 568B ทั้ง 2 ข้าง | Cross-Over: 568A ↔ 568B</text>

          <!-- Devices comparison -->
          <rect x="330" y="24" width="286" height="192" fill="#111c36" stroke="#38bdf8" stroke-width="2"/>
          <text x="473" y="46" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">อุปกรณ์เครือข่ายหลัก</text>
          <text x="346" y="74" fill="#fbbf24" font-size="12" font-weight="bold">• HUB (Layer 1):</text>
          <text x="356" y="92" fill="#cbd5e1" font-size="11">กระจายสัญญาณทุกพอร์ต (Broadcast) เกิด Collision</text>
          <text x="346" y="116" fill="#22c55e" font-size="12" font-weight="bold">• SWITCH (Layer 2):</text>
          <text x="356" y="134" fill="#cbd5e1" font-size="11">อ่าน MAC Address ส่งตรงเฉพาะเครื่องเป้าหมาย</text>
          <text x="346" y="158" fill="#38bdf8" font-size="12" font-weight="bold">• ROUTER (Layer 3):</text>
          <text x="356" y="176" fill="#cbd5e1" font-size="11">อ่าน IP Address เชื่อมต่างเครือข่าย/ออกเน็ต</text>
          <text x="346" y="200" fill="#c084fc" font-size="12" font-weight="bold">• ACCESS POINT: <tspan fill="#cbd5e1" font-weight="normal">กระจายสัญญาณ Wi-Fi</tspan></text>
        </svg>
      `,
      codexCards: [
        {
          title: 'สายสัญญาณและการเข้าหัว RJ-45 (EIA/TIA 568A & 568B)',
          bullets: [
            '<b>สาย UTP (Unshielded Twisted Pair)</b>: ใช้หัว RJ-45 เดินสายได้ไกลสูงสุด 100 เมตร (เช่น Cat5e 1Gbps, Cat6 รองรับ 10Gbps ระยะสั้น)',
            '<b>มาตรฐาน T568B (นิยมใช้มากที่สุด)</b>: 1.ขาว-ส้ม, 2.ส้ม, 3.ขาว-เขียว, 4.น้ำเงิน, 5.ขาว-น้ำเงิน, 6.เขียว, 7.ขาว-น้ำตาล, 8.น้ำตาล',
            '<b>มาตรฐาน T568A</b>: สลับคู่ส้มกับคู่เขียว (1.ขาว-เขียว, 2.เขียว, 3.ขาว-ส้ม, 4.น้ำเงิน, 5.ขาว-น้ำเงิน, 6.ส้ม, 7.ขาว-น้ำตาล, 8.น้ำตาล)',
            '<b>สาย Fiber Optic</b>: ส่งข้อมูลด้วยแสง ไม่ถูกรบกวนจากคลื่นแม่เหล็กไฟฟ้า (EMI) เดินระยะไกลหลายกิโลเมตร'
          ]
        },
        {
          title: 'อุปกรณ์เครือข่ายสำคัญ (Network Devices)',
          bullets: [
            '<b>Hub</b>: ทำงานชั้น 1 ส่งข้อมูลทุกพอร์ตพร้อมกัน แบ่งแบนด์วิดท์ ช้าและไม่ปลอดภัย',
            '<b>Switch</b>: ทำงานชั้น 2 จำตาราง MAC Address ส่งข้อมูลตรงพอร์ตปลายทาง ลดการชนกันของข้อมูล',
            '<b>Router</b>: ทำงานชั้น 3 หาเส้นทางด้วย IP Address เชื่อมต่อต่างเครือข่ายและออกอินเทอร์เน็ต',
            '<b>Access Point (AP)</b>: แปลงสัญญาณจากสาย LAN เป็นคลื่นไร้สาย Wi-Fi ให้มือถือและโน้ตบุ๊ก'
          ]
        }
      ],
      quiz: [
        {
          q: 'ลำดับสีสาย UTP ตามมาตรฐาน T568B จาก Pin 1 ถึง Pin 8 ข้อใดถูกต้อง?',
          options: [
            'ขาว-เขียว, เขียว, ขาว-ส้ม, น้ำเงิน, ขาว-น้ำเงิน, ส้ม, ขาว-น้ำตาล, น้ำตาล',
            'ขาว-ส้ม, ส้ม, ขาว-เขียว, น้ำเงิน, ขาว-น้ำเงิน, เขียว, ขาว-น้ำตาล, น้ำตาล',
            'ขาว-ส้ม, ส้ม, ขาว-น้ำเงิน, น้ำเงิน, ขาว-เขียว, เขียว, ขาว-น้ำตาล, น้ำตาล',
            'ส้ม, ขาว-ส้ม, เขียว, ขาว-เขียว, น้ำเงิน, ขาว-น้ำเงิน, น้ำตาล, ขาว-น้ำตาล'
          ],
          ans: 1,
          exp: 'T568B เรียงคือ: 1.ขาว-ส้ม 2.ส้ม 3.ขาว-เขียว 4.น้ำเงิน 5.ขาว-น้ำเงิน 6.เขียว 7.ขาว-น้ำตาล 8.น้ำตาล'
        },
        {
          q: 'สาย UTP (Cat5e / Cat6) มีระยะเดินสายมาตรฐานสูงสุดไม่เกินกี่เมตรก่อนสัญญาณลดทอน?',
          options: ['50 เมตร', '100 เมตร', '500 เมตร', '2,000 เมตร'],
          ans: 1,
          exp: 'มาตรฐานสายทองแดงคู่บิดเกลียว Ethernet (UTP) กำหนดระยะสายสูงสุดไม่เกิน 100 เมตร'
        },
        {
          q: 'อุปกรณ์ใดที่อ่านค่า MAC Address เพื่อส่งข้อมูลไปยังพอร์ตปลายทางโดยตรง?',
          options: ['Repeater', 'Hub', 'Switch', 'Modem'],
          ans: 2,
          exp: 'Switch ทำงานที่ Layer 2 (Data Link) ใช้ MAC Address Table ส่ง Frame ตรงไปยังพอร์ตเป้าหมาย'
        },
        {
          q: 'หากต้องเชื่อมสายเครือข่ายระหว่างอาคาร 2 หลังที่ห่างกัน 800 เมตรและมีสายไฟฟ้าแรงสูงพาดผ่าน ควรเลือกใช้สายใด?',
          options: ['สาย UTP Cat5e', 'สาย Fiber Optic', 'สาย Coaxial RG-58', 'สายโทรศัพท์ RJ-11'],
          ans: 1,
          exp: 'Fiber Optic ส่งข้อมูลด้วยลำแสง จึงไม่ถูกรบกวนจากคลื่นแม่เหล็กไฟฟ้า (EMI) และเดินระยะไกลได้หลายกิโลเมตร'
        },
        {
          q: 'การเข้าหัวสายตรง (Straight-Through Cable) สำหรับต่อ PC เข้า Switch ต้องเข้าหัวอย่างไร?',
          options: ['T568B ทั้ง 2 ด้าน (หรือ T568A ทั้ง 2 ด้าน)', 'ด้านหนึ่ง T568A อีกด้าน T568B', 'เข้าเพียง 4 เส้นกลาง', 'สลับพิน 1-8 ย้อนกลับ'],
          ans: 0,
          exp: 'สายตรง (Straight-Through) ใช้มาตรฐานเดียวกันทั้งสองด้าน (นิยม T568B ทั้ง 2 ด้าน)'
        },
        {
          q: 'อุปกรณ์ใดทำหน้าที่เชื่อมต่อเครือข่ายต่างวง (ต่าง Network ID) และหาเส้นทางที่ดีที่สุดด้วย IP Address?',
          options: ['Switch Layer 2', 'Router', 'Hub', 'RJ-45 Coupler'],
          ans: 1,
          exp: 'Router ทำงานที่ Layer 3 (Network) เพื่อหาเส้นทาง (Routing) เชื่อมต่อระหว่างเครือข่าย'
        }
      ]
    },
    {
      id: 3,
      code: 'UNIT 03',
      title: 'OSI 7 Layers & TCP/IP โปรโตคอล',
      subtitle: 'ชั้นสื่อสาร 7 ระดับ, PDU และ Encapsulation',
      color: '#a855f7',
      zoneName: 'หอคอยโปรโตคอล OSI',
      boss: {
        name: 'OSI Seven-Headed Hydra',
        thName: 'ไฮดราเจ็ดเศียร OSI',
        sprite: 'osi_hydra',
        hp: 130,
        atk: 22,
        taunt: 'เจ้าแยกออกไหมว่า TCP อยู่ชั้นไหน แล้ว MAC Address อยู่ชั้นไหน?!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#a855f7" stroke-width="4"/>
          <text x="210" y="28" fill="#c084fc" font-size="12" font-weight="bold" text-anchor="middle">OSI 7 LAYERS MODEL</text>
          <text x="515" y="28" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">PDU / โปรโตคอล / อุปกรณ์</text>
          <!-- 7 Bars -->
          <rect x="28" y="38" width="350" height="23" fill="#be123c"/><text x="40" y="54" fill="#fff" font-size="11" font-weight="bold">L7: Application (ติดต่อผู้ใช้)</text><text x="394" y="54" fill="#fda4af" font-size="11">Data | HTTP, HTTPS, FTP, DNS</text>
          <rect x="28" y="65" width="350" height="23" fill="#c2410c"/><text x="40" y="81" fill="#fff" font-size="11" font-weight="bold">L6: Presentation (แปลงรหัส/เข้ารหัส)</text><text x="394" y="81" fill="#fdba74" font-size="11">Data | SSL/TLS, JPEG, ASCII</text>
          <rect x="28" y="92" width="350" height="23" fill="#b45309"/><text x="40" y="108" fill="#fff" font-size="11" font-weight="bold">L5: Session (เปิด-ปิดการเชื่อมต่อ)</text><text x="394" y="108" fill="#fde047" font-size="11">Data | NetBIOS, RPC, SQL Session</text>
          <rect x="28" y="119" width="350" height="23" fill="#047857"/><text x="40" y="135" fill="#fff" font-size="11" font-weight="bold">L4: Transport (ควบคุมส่ง End-to-End)</text><text x="394" y="135" fill="#6ee7b7" font-size="11">Segment | TCP, UDP, Port</text>
          <rect x="28" y="146" width="350" height="23" fill="#0369a1"/><text x="40" y="162" fill="#fff" font-size="11" font-weight="bold">L3: Network (จัดเส้นทาง IP)</text><text x="394" y="162" fill="#7dd3fc" font-size="11">Packet | IP, ICMP, Router</text>
          <rect x="28" y="173" width="350" height="23" fill="#4338ca"/><text x="40" y="189" fill="#fff" font-size="11" font-weight="bold">L2: Data Link (เฟรม &amp; MAC)</text><text x="394" y="189" fill="#a5b4fc" font-size="11">Frame | Ethernet, MAC, Switch</text>
          <rect x="28" y="200" width="350" height="23" fill="#6d28d9"/><text x="40" y="216" fill="#fff" font-size="11" font-weight="bold">L1: Physical (สัญญาณไฟฟ้า/แสง)</text><text x="394" y="216" fill="#e9d5ff" font-size="11">Bits (0/1) | สาย UTP, Fiber, Hub</text>
        </svg>
      `,
      codexCards: [
        {
          title: 'เทคนิคจำ OSI 7 Layers จากบนลงล่าง (7 → 1)',
          bullets: [
            '<b>7. Application</b> — ส่วนติดต่อแอปพลิเคชัน (HTTP, FTP, DNS, SMTP)',
            '<b>6. Presentation</b> — เข้ารหัส/บีบอัด/แปลงรูปแบบข้อมูล (SSL/TLS, MP4, UTF-8)',
            '<b>5. Session</b> — ควบคุมเซสชันการเปิด-ปิดการสนทนา (Session ID)',
            '<b>4. Transport</b> — แบ่งข้อมูลเป็น <b>Segment</b> ควบคุมด้วย TCP (ชัวร์) / UDP (เร็ว)',
            '<b>3. Network</b> — ห่อเป็น <b>Packet</b> ระบุ IP Address และ Router หาเส้นทาง',
            '<b>2. Data Link</b> — ห่อเป็น <b>Frame</b> ระบุ MAC Address (Switch)',
            '<b>1. Physical</b> — ส่งเป็น <b>Bits (0, 1)</b> ผ่านสายแลน ไฟเบอร์ หรือคลื่นวิทยุ'
          ]
        },
        {
          title: 'TCP/IP Model 4 ชั้น และ TCP vs UDP',
          bullets: [
            '<b>TCP/IP 4 Layers</b>: Application (รวม OSI 5-7) → Transport (OSI 4) → Internet (OSI 3) → Network Access (รวม OSI 1-2)',
            '<b>TCP (Transmission Control Protocol)</b>: มี 3-Way Handshake ตรวจสอบความถูกต้อง เหมาะกับเว็บ/โอนไฟล์',
            '<b>UDP (User Datagram Protocol)</b>: ส่งไว ไม่รอเช็กซ้ำ เหมาะกับสตรีมวิดีโอ เกมออนไลน์ Voice Call'
          ]
        }
      ],
      quiz: [
        {
          q: 'หน่วยข้อมูล (PDU) ของชั้น Layer 3 (Network) และ Layer 2 (Data Link) เรียงตามลำดับคือข้อใด?',
          options: ['Segment และ Bits', 'Packet และ Frame', 'Frame และ Packet', 'Data และ Segment'],
          ans: 1,
          exp: 'L4=Segment, L3=Packet, L2=Frame, L1=Bits (จำง่ายๆ: Don’t Some People Fear Birthdays)'
        },
        {
          q: 'การเข้ารหัสข้อมูล (Encryption) และการบีบอัดข้อมูล (Compression) เกิดขึ้นที่ชั้นใดของ OSI Model?',
          options: ['Layer 7 Application', 'Layer 6 Presentation', 'Layer 5 Session', 'Layer 4 Transport'],
          ans: 1,
          exp: 'Layer 6 Presentation ทำหน้าที่แปลงรูปแบบข้อมูล เข้ารหัส (SSL/TLS) และบีบอัดข้อมูล'
        },
        {
          q: 'โปรโตคอล TCP และ UDP ทำงานอยู่ในชั้นใดของ OSI Model?',
          options: ['Layer 2 Data Link', 'Layer 3 Network', 'Layer 4 Transport', 'Layer 7 Application'],
          ans: 2,
          exp: 'Layer 4 Transport รับผิดชอบการส่งข้อมูลแบบ End-to-End ด้วย TCP และ UDP พร้อมหมายเลข Port'
        },
        {
          q: 'หากต้องการสร้างระบบถ่ายทอดสดเกมออนไลน์ (Live Streaming) ที่ต้องการความเร็วสูงและลดความหน่วง (Latency) ควรใช้โปรโตคอลใด?',
          options: ['UDP', 'TCP', 'FTP', 'ARP'],
          ans: 0,
          exp: 'UDP ส่งข้อมูลรวดเร็วโดยไม่เสียเวลาทำ Handshake หรือขอส่งซ้ำ จึงเหมาะกับเกมและสตรีมมิงสด'
        },
        {
          q: 'Switch ปกติทำงานที่ Layer ใด และ Router ทำงานที่ Layer ใด?',
          options: ['Switch L1 / Router L2', 'Switch L2 / Router L3', 'Switch L3 / Router L4', 'Switch L4 / Router L7'],
          ans: 1,
          exp: 'Switch ทำงานชั้น 2 (MAC Address) ส่วน Router ทำงานชั้น 3 (IP Address)'
        },
        {
          q: 'โปรโตคอล DNS (Domain Name System) ทำหน้าที่อะไร?',
          options: ['แจก IP อัตโนมัติ', 'แปลงชื่อโดเมนเว็บไซต์ให้เป็น IP Address', 'เข้ารหัส Wi-Fi', 'ตรวจสอบสายแลนขาด'],
          ans: 1,
          exp: 'DNS เปรียบเสมือนสมุดโทรศัพท์ ช่วยแปลงชื่อโดเมนเช่น google.com ให้เป็นหมายเลข IP'
        }
      ]
    },
    {
      id: 4,
      code: 'UNIT 04',
      title: 'IPv4, Subnet Mask และการแก้ปัญหา CLI',
      subtitle: 'Class A/B/C, Network ID, ipconfig, ping, tracert',
      color: '#06b6d4',
      zoneName: 'ป้อมปราการ Subnet Matrix',
      boss: {
        name: 'Binary Lich of IP Conflict',
        thName: 'จอมเวทโครงกระดูก IP ชน',
        sprite: 'subnet_lich',
        hp: 140,
        atk: 24,
        taunt: 'IP ชน Gateway แล้ว! มาดูกันว่าเจ้าจะใช้คำสั่ง ping กับ ipconfig แก้ได้ไหม!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#06b6d4" stroke-width="4"/>
          <text x="320" y="32" fill="#22d3ee" font-size="13" font-weight="bold" text-anchor="middle">โครงสร้าง IPv4 (32 Bits = 4 Octets) และ Class พื้นฐาน</text>
          <!-- IPv4 Example -->
          <rect x="44" y="46" width="130" height="42" fill="#0369a1" stroke="#7dd3fc" stroke-width="2"/><text x="109" y="72" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">192</text>
          <rect x="184" y="46" width="130" height="42" fill="#0369a1" stroke="#7dd3fc" stroke-width="2"/><text x="249" y="72" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">168</text>
          <rect x="324" y="46" width="130" height="42" fill="#0369a1" stroke="#7dd3fc" stroke-width="2"/><text x="389" y="72" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">10</text>
          <rect x="464" y="46" width="130" height="42" fill="#047857" stroke="#6ee7b7" stroke-width="2"/><text x="529" y="72" fill="#fff" font-size="16" font-weight="bold" text-anchor="middle">25</text>
          <text x="249" y="108" fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle">◀─── Network ID (255.255.255) ───▶</text>
          <text x="529" y="108" fill="#6ee7b7" font-size="12" font-weight="bold" text-anchor="middle">◀ Host ID (.0) ▶</text>

          <!-- Class table & CLI -->
          <rect x="28" y="124" width="286" height="94" fill="#111c36" stroke="#38bdf8" stroke-width="2"/>
          <text x="40" y="144" fill="#fbbf24" font-size="11" font-weight="bold">Class A (1-126)   : Mask 255.0.0.0 (/8)</text>
          <text x="40" y="164" fill="#22c55e" font-size="11" font-weight="bold">Class B (128-191) : Mask 255.255.0.0 (/16)</text>
          <text x="40" y="184" fill="#38bdf8" font-size="11" font-weight="bold">Class C (192-223) : Mask 255.255.255.0 (/24)</text>
          <text x="40" y="204" fill="#cbd5e1" font-size="10">127.0.0.1 = Loopback ทดสอบการ์ดแลนตัวเอง</text>

          <rect x="326" y="124" width="286" height="94" fill="#020617" stroke="#22c55e" stroke-width="2"/>
          <text x="338" y="144" fill="#4ade80" font-size="11" font-family="monospace">C:\&gt; ipconfig /all  (ดู IP, Mask, Gateway)</text>
          <text x="338" y="164" fill="#4ade80" font-size="11" font-family="monospace">C:\&gt; ping 192.168.10.1 (เช็กการเชื่อมต่อ)</text>
          <text x="338" y="184" fill="#4ade80" font-size="11" font-family="monospace">C:\&gt; tracert 8.8.8.8 (ไล่เส้นทางแต่ละ Hop)</text>
          <text x="338" y="204" fill="#94a3b8" font-size="10">Private IP: 10.x, 172.16-31.x, 192.168.x</text>
        </svg>
      `,
      codexCards: [
        {
          title: 'IPv4 Address & Class A / B / C',
          bullets: [
            '<b>IPv4</b>: ยาว 32 บิต แบ่งเป็น 4 ชุด (Octet) ค่า 0–255 คั่นด้วยจุด เช่น `192.168.10.15`',
            '<b>Class A</b> (1–126): Mask `255.0.0.0` (/8) รองรับเครื่องลูก ~16 ล้านเครื่อง',
            '<b>Class B</b> (128–191): Mask `255.255.0.0` (/16) รองรับ ~65,534 เครื่อง',
            '<b>Class C</b> (192–223): Mask `255.255.255.0` (/24) นิยมใช้ในองค์กร/บ้าน มี IP ใช้งานได้ 254 เครื่อง (.1 ถึง .254)'
          ]
        },
        {
          title: 'การตรวจสอบและแก้ปัญหาด้วย CLI (`ipconfig` / `ping`)',
          bullets: [
            '<b>`ipconfig`</b>: ตรวจสอบ IP Address, Subnet Mask และ Default Gateway ของเครื่อง',
            '<b>`ping <IP>`</b>: ส่ง ICMP Echo ทดสอบว่าติดต่อปลายทางได้หรือไม่ (TTL, เวลา ms)',
            '<b>Request timed out</b>: ปลายทางไม่ตอบสนอง สายหลุด หรือ Firewall บล็อก',
            '<b>IP 169.254.x.x (APIPA)</b>: แปลว่าเครื่องขอรับ IP จาก DHCP Server ไม่สำเร็จ!'
          ]
        }
      ],
      quiz: [
        {
          q: 'หมายเลข IP `192.168.1.50` จัดอยู่ใน Class ใด และมี Default Subnet Mask เป็นค่าใด?',
          options: ['Class A / 255.0.0.0', 'Class B / 255.255.0.0', 'Class C / 255.255.255.0', 'Class D / 255.255.255.255'],
          ans: 2,
          exp: 'ชุดแรกอยู่ระหว่าง 192–223 เป็น Class C ซึ่งมี Default Subnet Mask คือ 255.255.255.0 (/24)'
        },
        {
          q: 'ในวงเครือข่าย `192.168.10.0 /24` สามารถกำหนด IP ให้เครื่องลูกข่าย (Usable Host IP) ได้มากที่สุดกี่เครื่อง?',
          options: ['256 เครื่อง', '254 เครื่อง', '128 เครื่อง', '64 เครื่อง'],
          ans: 1,
          exp: '2^8 - 2 = 254 เครื่อง (หัก .0 ซึ่งเป็น Network ID และ .255 ซึ่งเป็น Broadcast Address)'
        },
        {
          q: 'หากพิมพ์คำสั่ง `ipconfig` แล้วพบว่าเครื่องได้ IP `169.254.45.12` แสดงว่าเกิดปัญหาใด?',
          options: ['เครื่องติดไวรัสเรียกค่าไถ่', 'เครื่องไม่สามารถติดต่อขอรับ IP จาก DHCP Server ได้ (APIPA)', 'ได้ความเร็วอินเทอร์เน็ตระดับ Gigabit', 'Gateway ทำงานสมบูรณ์'],
          ans: 1,
          exp: '169.254.x.x คือช่วง IP อัตโนมัติ (APIPA) ที่ Windows กำหนดให้เมื่อติดต่อ DHCP Server ไม่สำเร็จ'
        },
        {
          q: 'หมายเลข IP `127.0.0.1` มีไว้ใช้ทำอะไร?',
          options: ['IP ของ Router Google', 'Loopback Address สำหรับทดสอบการ์ดเครือข่ายในเครื่องตัวเอง', 'Broadcast Address', 'Private IP สำหรับเครือข่าย WAN'],
          ans: 1,
          exp: '127.0.0.1 คือ Loopback Address ใช้ทดสอบการทำงานของ TCP/IP stack และการ์ด LAN ของเครื่องตนเอง'
        },
        {
          q: 'ข้อใดคือช่วง Private IP Address ที่ใช้ภายในองค์กรได้ฟรีโดยไม่ซ้ำกับ Public IP บนอินเทอร์เน็ต?',
          options: ['8.8.8.0/24', '192.168.0.0/16', '203.150.0.0/16', '172.32.0.0/16'],
          ans: 1,
          exp: 'Private IPv4 มี 3 ช่วงคือ 10.0.0.0/8, 172.16.0.0/12 (172.16–172.31), และ 192.168.0.0/16'
        },
        {
          q: 'คำสั่งใดใช้ตรวจสอบเส้นทางการเดินทางของแพ็กเก็ตว่าผ่าน Router กี่ Hop ก่อนถึงปลายทาง?',
          options: ['ipconfig /release', 'tracert (หรือ traceroute)', 'format c:', 'mkdir'],
          ans: 1,
          exp: 'tracert (Windows) หรือ traceroute (Linux) แสดงรายการ Router แต่ละจุด (Hop) จนถึงปลายทาง'
        }
      ]
    },
    {
      id: 5,
      code: 'UNIT 05',
      title: 'เครือข่ายไร้สาย (Wi-Fi) และบริการ DHCP/DNS/VLAN',
      subtitle: 'คลื่น 2.4/5 GHz, WPA3, กระบวนการ DHCP DORA และ VLAN',
      color: '#0ea5e9',
      zoneName: 'หอคอยคลื่นไร้สายและบริการหลัก',
      boss: {
        name: 'Wi-Fi Jammer Wyvern',
        thName: 'มังกรรบกวนสัญญาณ Wi-Fi',
        sprite: 'wifi_dragon',
        hp: 150,
        atk: 26,
        taunt: 'คลื่น 2.4GHz ชนกันเละเทะ แถม DHCP Pool เต็มแล้ว!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#0ea5e9" stroke-width="4"/>
          <!-- DHCP DORA -->
          <rect x="24" y="24" width="290" height="192" fill="#111c36" stroke="#38bdf8" stroke-width="2"/>
          <text x="169" y="46" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">กระบวนการแจก IP ของ DHCP (DORA)</text>
          <rect x="44" y="62" width="250" height="30" fill="#1e3a8a"/><text x="169" y="82" fill="#fff" font-size="11" text-anchor="middle">1. DISCOVER (ลูกข่าย: มี DHCP ไหม?)</text>
          <rect x="44" y="100" width="250" height="30" fill="#0f766e"/><text x="169" y="120" fill="#fff" font-size="11" text-anchor="middle">2. OFFER (เซิร์ฟเวอร์: เสนอ IP ว่างให้)</text>
          <rect x="44" y="138" width="250" height="30" fill="#6d28d9"/><text x="169" y="158" fill="#fff" font-size="11" text-anchor="middle">3. REQUEST (ลูกข่าย: ขอใช้ IP นี้ครับ)</text>
          <rect x="44" y="176" width="250" height="30" fill="#15803d"/><text x="169" y="196" fill="#fff" font-size="11" text-anchor="middle">4. ACK (เซิร์ฟเวอร์: อนุมัติใช้งานได้!)</text>

          <!-- 2.4 vs 5 GHz & VLAN -->
          <rect x="330" y="24" width="286" height="192" fill="#111c36" stroke="#a855f7" stroke-width="2"/>
          <text x="473" y="46" fill="#c084fc" font-size="13" font-weight="bold" text-anchor="middle">Wi-Fi 2.4 vs 5 GHz &amp; VLAN / NAT</text>
          <text x="344" y="74" fill="#fbbf24" font-size="12" font-weight="bold">• คลื่น 2.4 GHz (Ch 1, 6, 11 ไม่ทับซ้อน):</text>
          <text x="354" y="92" fill="#cbd5e1" font-size="11">ทะลุกำแพงไกล แต่แชนแนลน้อย สัญญาณกวนง่าย</text>
          <text x="344" y="116" fill="#38bdf8" font-size="12" font-weight="bold">• คลื่น 5 GHz / 6 GHz (Wi-Fi 6/6E):</text>
          <text x="354" y="134" fill="#cbd5e1" font-size="11">ความเร็วสูงมาก สัญญาณสะอาด แต่ระยะสั้นกว่า</text>
          <text x="344" y="160" fill="#22c55e" font-size="12" font-weight="bold">• VLAN (Virtual LAN):</text>
          <text x="354" y="178" fill="#cbd5e1" font-size="11">แบ่งวง LAN เชิงตรรกะบน Switch แยกแผนกปลอดภัย</text>
          <text x="344" y="202" fill="#f472b6" font-size="12" font-weight="bold">• NAT: <tspan fill="#cbd5e1" font-weight="normal">แปลง Private IP ออกสู่ Public IP</tspan></text>
        </svg>
      `,
      codexCards: [
        {
          title: 'เครือข่ายไร้สาย Wi-Fi (IEEE 802.11)',
          bullets: [
            '<b>2.4 GHz</b>: ทะลุสิ่งกีดขวางดี ระยะไกล มี 3 ช่องสัญญาณที่ไม่ซ้อนทับกันคือ <b>Channel 1, 6, 11</b>',
            '<b>5 GHz</b>: ความเร็วสูง ช่องสัญญาณเยอะ ถูกรบกวนน้อย เหมาะกับห้องเรียนหนาแน่นและสตรีมมิง',
            '<b>มาตรฐานความปลอดภัย</b>: <b>WPA3</b> ปลอดภัยสูงสุด (ห้ามใช้ WEP เพราะถอดรหัสได้ง่ายมาก)'
          ]
        },
        {
          title: 'บริการสำคัญ: DHCP, NAT, และ VLAN',
          bullets: [
            '<b>DHCP (Port 67/68)</b>: แจก IP, Subnet Mask, Gateway, DNS อัตโนมัติด้วย 4 ขั้นตอน <b>DORA</b> (Discover → Offer → Request → Acknowledge)',
            '<b>NAT (Network Address Translation)</b>: แปลง Private IP ภายในองค์กรเป็น Public IP เพื่อออกอินเทอร์เน็ต',
            '<b>VLAN (Virtual LAN)</b>: แบ่งพอร์ตบน Switch ให้แยกวง Broadcast กัน เช่น VLAN 10 ครู / VLAN 20 นักศึกษา'
          ]
        }
      ],
      quiz: [
        {
          q: 'บนคลื่นความถี่ Wi-Fi 2.4 GHz ช่องสัญญาณ (Channel) ชุดใดที่ไม่ทับซ้อนกันเลย?',
          options: ['Channel 1, 2, 3', 'Channel 1, 6, 11', 'Channel 3, 5, 7', 'Channel 2, 8, 14'],
          ans: 1,
          exp: 'คลื่น 2.4 GHz มีช่องที่ไม่ทับซ้อนกัน 3 ช่องมาตรฐานคือ Channel 1, 6 และ 11'
        },
        {
          q: 'ลำดับขั้นตอนการทำงานของ DHCP Server ในการแจก IP Address (DORA) ข้อใดเรียงลำดับถูกต้อง?',
          options: ['Discover → Offer → Request → Acknowledge', 'Offer → Discover → Ack → Request', 'Request → Discover → Offer → Ack', 'Ack → Offer → Request → Discover'],
          ans: 0,
          exp: 'DORA ย่อมาจาก Discover (ค้นหา) → Offer (เสนอ) → Request (ขอใช้) → Acknowledge (ยืนยัน)'
        },
        {
          q: 'มาตรฐานการเข้ารหัสความปลอดภัยของ Wi-Fi ข้อใดปลอดภัยที่สุดในปัจจุบัน?',
          options: ['WEP', 'Open (No Password)', 'WPA3', 'MAC Filtering อย่างเดียว'],
          ans: 2,
          exp: 'WPA3 ใช้การแลกเปลี่ยนคีย์แบบ SAE ป้องกันการดักจับรหัสผ่านแบบออฟไลน์ได้ดีกว่า WPA2 และ WEP'
        },
        {
          q: 'บริการใดทำหน้าที่แปลง Private IP ของเครื่องลูกข่ายในวิทยาลัยให้เป็น Public IP เพื่อออกอินเทอร์เน็ต?',
          options: ['DNS', 'NAT', 'SMTP', 'ARP'],
          ans: 1,
          exp: 'NAT (Network Address Translation) แปลง IP ภายในให้ใช้อินเทอร์เน็ตร่วมกันผ่าน Public IP เดียวได้'
        },
        {
          q: 'ประโยชน์หลักของการทำ VLAN บน Switch คือข้อใด?',
          options: ['เพิ่มความสว่างหน้าจอคอมพิวเตอร์', 'แบ่งวงเครือข่ายแยกแผนก ลด Broadcast และเพิ่มความปลอดภัย', 'เปลี่ยนสาย UTP เป็นไฟเบอร์อัตโนมัติ', 'เพิ่มแรงดันไฟฟ้าในพอร์ต LAN'],
          ans: 1,
          exp: 'VLAN แยกกลุ่มผู้ใช้ออกจากกันทางตรรกะแม้ใช้ Switch ตัวเดียวกัน ช่วยลด Broadcast และเพิ่มความปลอดภัย'
        },
        {
          q: 'มาตรฐาน Wi-Fi 6 ตรงกับรหัสมาตรฐาน IEEE 802.11 ข้อใด?',
          options: ['802.11b', '802.11g', '802.11ax', '802.11a'],
          ans: 2,
          exp: 'Wi-Fi 4 = 802.11n, Wi-Fi 5 = 802.11ac, Wi-Fi 6 = 802.11ax'
        }
      ]
    },
    {
      id: 6,
      code: 'UNIT 06',
      title: 'ความมั่นคงปลอดภัยเครือข่าย & Firewall',
      subtitle: 'ภัยคุกคามไซเบอร์, Port สำคัญ, กฎ Firewall และ CIA Triad',
      color: '#ef4444',
      zoneName: 'ปราสาทแกนกลางไซเบอร์ (Final Boss)',
      boss: {
        name: 'Ransomware Overlord Z-0',
        thName: 'จอมมารแรนซัมแวร์ Z-0',
        sprite: 'ransom_overlord',
        hp: 180,
        atk: 30,
        taunt: 'ข้าจะเปิดพอร์ต Telnet ยิง DDoS และเข้ารหัสข้อมูลทั้งวิทยาลัย!'
      },
      svgDiagram: `
        <svg viewBox="0 0 640 240" class="pixel-infographic-svg" shape-rendering="crispEdges">
          <rect width="640" height="240" fill="#0b1224"/>
          <rect x="8" y="8" width="624" height="224" fill="none" stroke="#ef4444" stroke-width="4"/>
          <!-- CIA Triad -->
          <rect x="24" y="24" width="240" height="192" fill="#111c36" stroke="#f59e0b" stroke-width="2"/>
          <text x="144" y="46" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">หลักความปลอดภัย CIA TRIAD</text>
          <rect x="40" y="64" width="208" height="38" fill="#1e40af"/><text x="144" y="87" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">C - Confidentiality (รักษาความลับ)</text>
          <rect x="40" y="112" width="208" height="38" fill="#047857"/><text x="144" y="135" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">I - Integrity (ข้อมูลถูกต้องไม่ถูกแก้)</text>
          <rect x="40" y="160" width="208" height="38" fill="#b91c1c"/><text x="144" y="183" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">A - Availability (พร้อมใช้งานตลอดเวลา)</text>

          <!-- Firewall & Ports -->
          <rect x="280" y="24" width="336" height="192" fill="#111c36" stroke="#ef4444" stroke-width="2"/>
          <text x="448" y="46" fill="#f87171" font-size="13" font-weight="bold" text-anchor="middle">FIREWALL &amp; พอร์ตสำคัญที่ต้องรู้</text>
          <text x="296" y="74" fill="#22c55e" font-size="11" font-weight="bold">ALLOW: Port 443 (HTTPS เข้ารหัส), Port 53 (DNS), Port 22 (SSH)</text>
          <text x="296" y="96" fill="#ef4444" font-size="11" font-weight="bold">DENY : Port 23 (Telnet ไม่เข้ารหัส!), SMB 445 (เสี่ยงไวรัส)</text>
          <text x="296" y="126" fill="#38bdf8" font-size="11" font-weight="bold">• Phishing: <tspan fill="#cbd5e1" font-weight="normal">หลอกลวงขโมยรหัสผ่านผ่านอีเมล/เว็บปลอม</tspan></text>
          <text x="296" y="150" fill="#c084fc" font-size="11" font-weight="bold">• Ransomware: <tspan fill="#cbd5e1" font-weight="normal">มัลแวร์เข้ารหัสไฟล์เรียกค่าไถ่ (ต้อง Backup!)</tspan></text>
          <text x="296" y="174" fill="#fbbf24" font-size="11" font-weight="bold">• DDoS: <tspan fill="#cbd5e1" font-weight="normal">ยิง Request ถล่มจนระบบล่ม (โจมตี Availability)</tspan></text>
          <text x="296" y="198" fill="#6ee7b7" font-size="11" font-weight="bold">• VPN: <tspan fill="#cbd5e1" font-weight="normal">อุโมงค์เข้ารหัสข้อมูลปลอดภัยผ่านเครือข่ายสาธารณะ</tspan></text>
        </svg>
      `,
      codexCards: [
        {
          title: 'หลักความมั่นคงปลอดภัย CIA Triad และภัยคุกคาม',
          bullets: [
            '<b>Confidentiality</b> (ความลับ): เข้ารหัสข้อมูล (Encryption / HTTPS / VPN) ไม่ให้ผู้ไม่มีสิทธิ์อ่าน',
            '<b>Integrity</b> (ความถูกต้อง): ป้องกันการดัดแปลงแก้ไขข้อมูลระหว่างทาง (Hashing)',
            '<b>Availability</b> (ความพร้อมใช้): ระบบไม่ล่มจาก <b>DDoS</b> หรือฮาร์ดแวร์เสีย',
            '<b>Phishing vs Ransomware</b>: Phishing หลอกเอารหัสผ่าน, Ransomware ล็อกไฟล์เรียกค่าไถ่ (ป้องกันด้วย Backup 3-2-1 และไม่คลิกลิงก์แปลก)'
          ]
        },
        {
          title: 'Firewall และพอร์ตโปรโตคอลสำคัญ',
          bullets: [
            '<b>Firewall</b>: คัดกรอง Packet ขาเข้า/ขาออก ตามกฎ IP และ Port (Allow / Deny)',
            '<b>SSH (Port 22) vs Telnet (Port 23)</b>: SSH เข้ารหัสปลอดภัย ส่วน Telnet ส่งรหัสผ่านเป็นตัวอักษรดิบ (ไม่ปลอดภัย)',
            '<b>HTTPS (Port 443) vs HTTP (Port 80)</b>: HTTPS เข้ารหัสด้วย TLS/SSL ปลอดภัยกว่า HTTP'
          ]
        }
      ],
      quiz: [
        {
          q: 'การโจมตีแบบ DDoS (Distributed Denial of Service) เป็นการทำลายหลักการข้อใดของ CIA Triad มากที่สุด?',
          options: ['Confidentiality (ความลับ)', 'Integrity (ความถูกต้อง)', 'Availability (ความพร้อมใช้งาน)', 'Authentication'],
          ans: 2,
          exp: 'DDoS ถล่มส่งคำขอจำนวนมหาศาลให้เซิร์ฟเวอร์ล่ม ทำให้ผู้ใช้จริงไม่สามารถใช้งานได้ (กระทบ Availability)'
        },
        {
          q: 'โปรโตคอลใดที่ใช้รีโมตควบคุมอุปกรณ์เครือข่ายแบบเข้ารหัสอย่างปลอดภัย ผ่าน Port 22?',
          options: ['Telnet', 'SSH (Secure Shell)', 'FTP', 'HTTP'],
          ans: 1,
          exp: 'SSH ใช้ Port 22 และเข้ารหัสข้อมูลทั้งหมด ต่างจาก Telnet (Port 23) ที่ส่งข้อมูลเป็น Plain Text'
        },
        {
          q: 'เว็บไซต์ที่มีรูปแม่กุญแจและขึ้นต้นด้วย `https://` ทำงานบนหมายเลข Port มาตรฐานใด?',
          options: ['Port 21', 'Port 53', 'Port 80', 'Port 443'],
          ans: 3,
          exp: 'HTTPS ใช้ Port 443 (ส่วน HTTP ธรรมดาใช้ Port 80)'
        },
        {
          q: 'วิธีป้องกันความเสียหายจากมัลแวร์เรียกค่าไถ่ (Ransomware) ที่ได้ผลดีที่สุดหากเครื่องติดเชื้อแล้วคืออะไร?',
          options: ['จ่ายเงินค่าไถ่ให้แฮกเกอร์ทันที', 'กู้คืนข้อมูลจากระบบสำรองข้อมูลแบบ Offline (Backup)', 'ถอดสายจอภาพออก', 'เปลี่ยนชื่อไฟล์เป็น .txt'],
          ans: 1,
          exp: 'การสำรองข้อมูล (Backup) แยกไว้นอกเครือข่ายช่วยให้กู้คืนระบบได้โดยไม่ต้องยอมจ่ายค่าไถ่'
        },
        {
          q: 'หากได้รับอีเมลปลอมแจ้งว่า "บัญชีธนาคารจะถูกระงับ กรุณากรอกรหัสผ่านที่ลิงก์นี้" จัดเป็นภัยคุกคามแบบใด?',
          options: ['Phishing', 'Sniffing', 'Port Scanning', 'Defragmentation'],
          ans: 0,
          exp: 'Phishing คือการหลอกลวงทางจิตวิทยาให้เหยื่อกรอกข้อมูลสำคัญหรือรหัสผ่านบนหน้าเว็บ/อีเมลปลอม'
        },
        {
          q: 'เทคโนโลยีใดสร้าง "อุโมงค์เชื่อมต่อแบบเข้ารหัส" เพื่อให้พนักงานทำงานจากบ้านเข้าถึงระบบภายในองค์กรได้อย่างปลอดภัย?',
          options: ['Hub', 'VPN (Virtual Private Network)', 'Telnet', 'Repeater'],
          ans: 1,
          exp: 'VPN เข้ารหัสทราฟฟิกทั้งหมดผ่านเครือข่ายสาธารณะเสมือนต่ออยู่ในวง LAN ภายใน'
        }
      ]
    }
  ];

  const INITIAL_LEADERBOARD = [
    { name: 'ธนกฤต วงศ์เครือข่าย', studentId: '6720901001', classRoom: 'ปวช.2/1', heroClass: 'paladin', level: 8, xp: 4120, unitsCleared: 6, badgeCount: 10, updatedAt: '2026-11-19' },
    { name: 'กัญญาณัฐ ไฟเบอร์ออปติก', studentId: '6720901014', classRoom: 'ปวช.2/1', heroClass: 'mage', level: 7, xp: 3380, unitsCleared: 5, badgeCount: 8, updatedAt: '2026-11-19' },
    { name: 'ภานุพงศ์ แพ็กเก็ตมาสเตอร์', studentId: '6720901022', classRoom: 'ปวช.2/2', heroClass: 'ninja', level: 6, xp: 2490, unitsCleared: 4, badgeCount: 7, updatedAt: '2026-11-18' },
    { name: 'สุพิชชา เราเตอร์เรนเจอร์', studentId: '6720901035', classRoom: 'ปวช.1/1', heroClass: 'ranger', level: 4, xp: 1320, unitsCleared: 2, badgeCount: 5, updatedAt: '2026-11-18' }
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
    { port: '3389', proto: 'RDP', desc: 'Remote Desktop ของระบบ Windows' }
  ];

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
    ENCYCLOPEDIA_PORTS
  };
})(window);
