/**
 * NetQuest 16-Bit: Procedural Crisp Pixel Art Sprite Engine
 * Renders crisp 16x16 / 20x16 SVG pixel-grid sprites with zero external dependencies.
 */
(function (global) {
  'use strict';

  const PALETTES = {
    paladin: {
      '.': null,
      'K': '#0b1020',
      'H': '#38bdf8', // cyan visor/trim
      'B': '#1d4ed8', // royal blue armor
      'L': '#93c5fd', // highlight armor
      'S': '#f3c6a5', // skin
      'G': '#f59e0b', // gold crest
      'W': '#e2e8f0', // white steel
      'D': '#334155'  // dark steel
    },
    mage: {
      '.': null,
      'K': '#0b1020',
      'P': '#7c3aed', // violet robe
      'V': '#c084fc', // light violet
      'H': '#38bdf8', // cyan glow
      'S': '#f3c6a5', // skin
      'G': '#fbbf24', // gold orb/trim
      'W': '#f8fafc', // white
      'D': '#312e81'  // deep indigo
    },
    ranger: {
      '.': null,
      'K': '#0b1020',
      'E': '#10b981', // emerald cloak
      'M': '#047857', // dark green
      'L': '#6ee7b7', // mint visor
      'S': '#f3c6a5', // skin
      'B': '#92400e', // leather
      'G': '#f59e0b', // gold buckle
      'D': '#1e293b'  // dark pants
    },
    ninja: {
      '.': null,
      'K': '#0b1020',
      'N': '#1e293b', // stealth suit
      'D': '#0f172a', // shadow
      'R': '#f43f5e', // cyber crimson scarf
      'H': '#22d3ee', // cyan eyes
      'S': '#f3c6a5', // skin
      'W': '#cbd5e1', // blade
      'G': '#f59e0b'  // gold
    },
    slime_king: {
      '.': null,
      'K': '#0b1020',
      'G': '#22c55e', // slime green
      'L': '#86efac', // highlight
      'D': '#15803d', // shadow green
      'Y': '#facc15', // gold crown
      'R': '#ef4444', // red eyes/gem
      'W': '#ffffff'
    },
    wire_golem: {
      '.': null,
      'K': '#0b1020',
      'M': '#64748b', // metal body
      'L': '#cbd5e1', // light metal
      'D': '#334155', // dark metal
      'O': '#f97316', // orange wire
      'C': '#06b6d4', // cyan wire
      'R': '#ef4444', // glowing eye
      'Y': '#facc15'  // spark
    },
    osi_hydra: {
      '.': null,
      'K': '#0b1020',
      'V': '#8b5cf6', // purple scales
      'P': '#c084fc', // light purple
      'D': '#4c1d95', // dark purple
      'C': '#22d3ee', // cyan core
      'R': '#fb7185', // eyes
      'Y': '#fde047'
    },
    subnet_lich: {
      '.': null,
      'K': '#0b1020',
      'B': '#1e1b4b', // dark robe
      'C': '#38bdf8', // neon cyan skull/aura
      'W': '#e2e8f0', // bone
      'G': '#10b981', // binary green
      'P': '#a855f7', // magic orb
      'R': '#f43f5e'
    },
    wifi_dragon: {
      '.': null,
      'K': '#0b1020',
      'B': '#0284c7', // sky dragon
      'L': '#7dd3fc', // light wing
      'D': '#0c4a6e', // deep blue
      'Y': '#facc15', // signal gold
      'R': '#f43f5e', // eye
      'W': '#f8fafc'
    },
    ransom_overlord: {
      '.': null,
      'K': '#0b1020',
      'R': '#dc2626', // crimson armor
      'L': '#fca5a5', // bright red
      'D': '#450a0a', // dark crimson
      'P': '#a855f7', // dark violet cape
      'Y': '#facc15', // crown/lock
      'C': '#22d3ee', // cyber core
      'W': '#ffffff'
    },
    cable_titan: {
      '.': null,
      'K': '#0b1020',
      'T': '#0d9488', // teal steel
      'L': '#5eead4', // bright teal
      'D': '#134e4a', // dark teal
      'G': '#f59e0b', // gold RJ-45 pins
      'O': '#f97316', // orange UTP wire
      'B': '#3b82f6', // blue UTP wire
      'R': '#ef4444'  // visor
    },
    win_phantom: {
      '.': null,
      'K': '#0b1020',
      'B': '#2563eb', // windows blue
      'C': '#38bdf8', // cyan pane
      'D': '#1e3a8a', // deep blue cloak
      'W': '#f8fafc', // glowing eyes/frame
      'G': '#22c55e', // pane accent
      'Y': '#facc15', // pane accent
      'R': '#f43f5e'  // pane accent
    },
    hypervisor_mech: {
      '.': null,
      'K': '#0b1020',
      'S': '#475569', // server chassis
      'L': '#94a3b8', // highlight steel
      'D': '#1e293b', // dark chassis
      'E': '#10b981', // VM status green LED
      'C': '#06b6d4', // cyan core
      'P': '#a855f7', // hypervisor energy
      'Y': '#facc15'
    },
    access_sovereign: {
      '.': null,
      'K': '#0b1020',
      'G': '#d97706', // gold armor
      'Y': '#fde047', // bright gold crown/key
      'P': '#6d28d9', // royal purple robe
      'V': '#c084fc', // highlight violet
      'D': '#3b0764', // shadow purple
      'C': '#38bdf8', // auth eye
      'W': '#ffffff'
    },
    items: {
      '.': null,
      'K': '#0b1020',
      'R': '#ef4444',
      'L': '#fca5a5',
      'W': '#f8fafc',
      'C': '#38bdf8',
      'B': '#2563eb',
      'G': '#10b981',
      'M': '#6ee7b7',
      'Y': '#f59e0b',
      'Z': '#fde047',
      'P': '#a855f7',
      'D': '#334155',
      'S': '#94a3b8',
      'O': '#f97316'
    }
  };

  const GRIDS = {
    paladin: [
      '....KKKKKK......',
      '...KGGGGGGK.....',
      '..KBWWWWWWBK....',
      '..KBKHHHHKBK....',
      '..KBKSSSSKBK....',
      '...KBBBBBBK..KW.',
      '..KLLBBBBLLK.KW.',
      '.KGGKBBBBKGGKKW.',
      '.KBKKBGGKBKKBKK.',
      '.KBBKBBBBKBBK...',
      '..KKKDDDDKKK....',
      '....KBBBBK......',
      '....KB..BK......',
      '...KDD..DDK.....',
      '...KKK..KKK.....',
      '................'
    ],
    mage: [
      '.....KKKK.......',
      '....KPPPPK......',
      '...KPPVVPPK.....',
      '..KPPPPPPPPK....',
      '.KGGGGGGGGGGK...',
      '...KSSSSSSK.....',
      '...KSKHHKSK.....',
      '...KPPPPPPK..KG.',
      '..KPVVPPVVPKKHK.',
      '..KPPPPPPPPK.KB.',
      '..KDPPPPPPDK.KB.',
      '...KPPPPPPK..KB.',
      '...KDD..DDK..KB.',
      '...KGG..GGK..KK.',
      '...KKK..KKK.....',
      '................'
    ],
    ranger: [
      '....KKKKKK......',
      '...KEEEEEEMK....',
      '..KEEMMMMMMEK...',
      '..KEKLLLLLKEK...',
      '..KEKSSSSSKEK...',
      '...KBBBBBBK..KG.',
      '..KEEEEEEEKK.KY.',
      '.KEMMEGGGEMEK.K.',
      '.KEKKEEEEEKEK.K.',
      '.KBKKBBBBBBKK...',
      '...KDDDDDDK.....',
      '...KDD..DDK.....',
      '...KBB..BBK.....',
      '..KKKB..BKKK....',
      '................',
      '................'
    ],
    ninja: [
      '....KKKKKK......',
      '...KNNNNNNK.....',
      '..KNNDDDDNNK....',
      '..KNKHHHHKNK....',
      '..KRRRRRRRRK....',
      '..KRRRRRRRRK..KW',
      '..KNNNNNNNNK.KW.',
      '.KDNKRRRRKNDKKW.',
      '.KDKKNNNNKKDKK..',
      '..KKKNNNNKKK....',
      '....KDDDDK......',
      '...KDD..DDK.....',
      '...KNN..NNK.....',
      '..KRRK..KRRK....',
      '................',
      '................'
    ],
    slime_king: [
      '....K.KK.K......',
      '...KYYYYYYK.....',
      '...KYRYYRYK.....',
      '...KYYYYYYK.....',
      '..KKGGGGGGKK....',
      '.KGLLGGGGGGGK...',
      'KGLLGGGGGGGGDK..',
      'KGGGWWGGWWGGDK..',
      'KGGGWKGGWKGGDK..',
      'KGGGGGGGGGGGDK..',
      'KGGDRRRRRRDGGK..',
      'KGGDDDDDDDDGGK..',
      '.KGGGGGGGGGGK...',
      '..KKKKKKKKKK....',
      '................',
      '................'
    ],
    wire_golem: [
      '...KKKKKKKK.....',
      '..KMLLLLLLMK....',
      '..KMDDRRDDMK....',
      '..KMDDDDDDMK....',
      '.KKMMMMMMMMKK...',
      'KOMMCCCCCCMMOK..',
      'KOMMMYYYYMMMOK..',
      'KOMMDDDDDDMMOK..',
      '.KKKMMMMMMKKK...',
      '..KMCOOOOCMK....',
      '..KMDDDDDDMK....',
      '..KMMK..KMMK....',
      '..KDDK..KDDK....',
      '.KKKKK..KKKKK...',
      '................',
      '................'
    ],
    osi_hydra: [
      '.KKK........KKK.',
      'KVVVK..KK..KVVVK',
      'KVVRK.KCCK.KRVVK',
      'KVVVK.KYYK.KVVVK',
      '.KPVK.KCCK.KVPK.',
      '..KVVVVVVVVVVK..',
      '..KVPPCCCCPPVK..',
      '.KVVVCCCCCCVVVK.',
      '.KDVVVVVVVVVVDK.',
      '..KDDDDDDDDDDK..',
      '..KVVVV..VVVVK..',
      '.KVVVK....KVVVK.',
      '.KDDK......KDDK.',
      '.KKKK......KKKK.',
      '................',
      '................'
    ],
    subnet_lich: [
      '....KKKKKK......',
      '...KCCCCCCK.....',
      '..KCWWWWWWCK....',
      '..KCWKRRKWCW....',
      '..KCWWWWWWCK....',
      '...KCWKKWCK..KP.',
      '..KBBBBBBBBK.KC.',
      '.KBBGGGGGGGBBKP.',
      '.KBBGBBBBGBBBK..',
      '.KBBGGGGGGGBBK..',
      '..KBBBBBBBBBK...',
      '..KBBBBBBBBBK...',
      '...KBB..BBK.....',
      '...KCC..CCK.....',
      '................',
      '................'
    ],
    wifi_dragon: [
      '.KK..........KK.',
      'KLLK..KKKK..KLLK',
      'KLLBKYYYYYYKBLLK',
      'KLLBKYBBBBYKBLLK',
      '.KLBKBBWWBBKBLK.',
      '.KBBBBBRRBBBBBK.',
      '..KBBBBBBBBBBK..',
      '..KBLLLLLLLLBK..',
      '...KBBBBBBBBK...',
      '...KBDYYYYDBK...',
      '..KBBDDDDDDBBK..',
      '..KBK......KBK..',
      '.KYYK......KYYK.',
      '.KKKK......KKKK.',
      '................',
      '................'
    ],
    ransom_overlord: [
      '..K..KKKK..K....',
      '.KYKYYYYYYKYK...',
      '.KYYYYYYYYYYK...',
      '..KRRRRRRRRK....',
      '..KRKWWWWKRK....',
      '..KRKCCCCKRK....',
      '.KPRRRRRRRRPWK..',
      'KPPRRDYYDRRPPK..',
      'KPPRDYKKYDRPPK..',
      'KPPRRYYYYRRPPK..',
      '.KPRRRRRRRRPK...',
      '..KDDDDDDDDK....',
      '..KRRR..RRRK....',
      '.KYYY....YYYK...',
      '.KKKK....KKKK...',
      '................'
    ],
    potion: [
      '......KKKK......',
      '.....KSSSSK.....',
      '......KWWK......',
      '.....KWWWWK.....',
      '....KWRRRRWK....',
      '...KWRRRRRRWK...',
      '...KWRLLRRRWK...',
      '...KWRRRRRRWK...',
      '...KWRRRRRRWK...',
      '....KRRRRRRK....',
      '.....KKKKKK.....',
      '................'
    ],
    analyzer: [
      '....KKKKKKKK....',
      '...KDDDDDDDDK...',
      '..KDCCCCCCCCDK..',
      '..KDCWWCCWWCDK..',
      '..KDCCCCCCCCDK..',
      '...KDDDDDDDDK...',
      '......KSSK......',
      '......KSSK......',
      '.....KYYYYK.....',
      '....KYYYYYYK....',
      '.....KKKKKK.....',
      '................'
    ],
    clock: [
      '....KKKKKKKK....',
      '...KYYYYYYYYK...',
      '..KYWWWWWWWWYK..',
      '..KYWWWKWWWWYK..',
      '..KYWWWKWWWWYK..',
      '..KYWWWKKKWYYK..',
      '..KYWWWWWWWWYK..',
      '...KYYYYYYYYK...',
      '....KKKKKKKK....',
      '................',
      '................',
      '................'
    ],
    shield: [
      '...KKKKKKKKKK...',
      '..KCCCCCCCCCCK..',
      '..KCBBBBBBBBCK..',
      '..KCBWWWWWWBCK..',
      '..KCBWCCCCWBCK..',
      '..KCBWCCCCWBCK..',
      '...KCBWWWWBCK...',
      '...KCBBBBBBCK...',
      '....KCCCCCCK....',
      '.....KCCCCK.....',
      '......KKKK......',
      '................'
    ],
    golden_crimper: [
      '.......KKK......',
      '......KYYYK.....',
      '.....KYZZZYK....',
      '....KYYYYYK.....',
      '...KYYKSSSK.....',
      '..KYYKSSSSK.....',
      '.KYYKSSSK.......',
      '.KYKSSSK........',
      '..KYYK..........',
      '..KYYK..........',
      '...KK...........',
      '................'
    ],
    fiber_boots: [
      '................',
      '....KKKK........',
      '...KCCCCK.......',
      '...KCWWCK.......',
      '...KCCCCK.......',
      '...KBBBBKKKK....',
      '..KBBBBBBBBBK...',
      '..KYYYYYYYYYK...',
      '..KKKKKKKKKKK...',
      '................',
      '................',
      '................'
    ],
    packet_goggles: [
      '................',
      '................',
      '.KKKKKKKKKKKKKK.',
      'KDDDDDDDDDDDDDDK',
      'KDGGGGKDDKGGGGDK',
      'KDGMMGKDDKGMGGDK',
      'KDGGGGKDDKGGGGDK',
      'KDDDDDKDDKDDDDDK',
      '.KKKKK....KKKKK.',
      '................',
      '................',
      '................'
    ],
    firewall_armor: [
      '..KKKK....KKKK..',
      '.KRRRRK..KRRRRK.',
      'KRRRRRRKKRRRRRRK',
      'KRRROOOOOOOORRRK',
      'KRRROZZZZZZORRRK',
      'KRRROZZZZZZORRRK',
      '.KRRROOOOOORRRK.',
      '.KRRRRRRRRRRRRK.',
      '..KDDDDDDDDDDK..',
      '...KKKKKKKKKK...',
      '................',
      '................'
    ],
    router: [
      '..K..........K..',
      '..K..........K..',
      '..K..........K..',
      '.KKKKKKKKKKKKKK.',
      'KBBBBBBBBBBBBBBK',
      'KBWWWWWWWWWWWWBK',
      'KBBBBBBBBBBBBBBK',
      'KBGGBGGBCBBBBBBK',
      'KDDDDDDDDDDDDDDK',
      '.KKKKKKKKKKKKKK.',
      '................',
      '................'
    ],
    switch: [
      '................',
      '................',
      '.KKKKKKKKKKKKKK.',
      'KDDDDDDDDDDDDDDK',
      'KDGKGKGKGKGKGKDK',
      'KDDDDDDDDDDDDDDK',
      'KDCKCKCKCKCKCKDK',
      'KSSSSSSSSSSSSSSK',
      '.KKKKKKKKKKKKKK.',
      '................',
      '................',
      '................'
    ],
    server: [
      '...KKKKKKKKKK...',
      '..KDDDDDDDDDDK..',
      '..KDGGGGGGGGDK..',
      '..KDDDDDDDDDDK..',
      '..KDCCCCCCCCDK..',
      '..KDDDDDDDDDDK..',
      '..KDYYYYYYYYDK..',
      '..KDDDDDDDDDDK..',
      '..KSSSSSSSSSSK..',
      '...KKKKKKKKKK...',
      '................',
      '................'
    ],
    pc: [
      '..KKKKKKKKKKKK..',
      '.KSSSSSSSSSSSSK.',
      '.KSCCCCCCCCCCSK.',
      '.KSCWWWWWWWWCSK.',
      '.KSCWCCCCCCWCSK.',
      '.KSCCCCCCCCCCSK.',
      '.KSSSSSSSSSSSSK.',
      '..KKKKKKKKKKKK..',
      '......KSSK......',
      '...KKKKKKKKKK...',
      '................',
      '................'
    ],
    ap: [
      '.....K....K.....',
      '....K.K..K.K....',
      '......KKKK......',
      '...KKKWWWWKKK...',
      '..KWWWWWWWWWWK..',
      '..KWWCCCCGGWWK..',
      '..KWWWWWWWWWWK..',
      '...KKKKKKKKKK...',
      '................',
      '................',
      '................',
      '................'
    ],
    firewall: [
      '.KKKKKKKKKKKKKK.',
      'KRRRRKRRRRKRRRRK',
      'KRRRRKRRRRKRRRRK',
      'KKKKKKKKKKKKKKKK',
      'KOOOKOOOOOKOOOOK',
      'KOOOKOOOOOKOOOOK',
      'KKKKKKKKKKKKKKKK',
      'KRRRRKRRRRKRRRRK',
      'KRRRRKRRRRKRRRRK',
      '.KKKKKKKKKKKKKK.',
      '................',
      '................'
    ],
    cable_titan: [
      '..KKKKKKKKKKKK..',
      '.KGGKGGKGGKGGGK.',
      '.KTTTTTTTTTTTTK.',
      '.KTLKRRRRRRKLTK.',
      '.KTTTTTTTTTTTTK.',
      'KKDDDDDDDDDDDDKK',
      'KOOTTTTGGTTTTOOK',
      'KBBTTTTGGTTTTBBK',
      'KOOTTTTTTTTTTOOK',
      '.KKDDDDDDDDDDKK.',
      '..KTTTOBBOTTTK..',
      '..KTTK....KTTK..',
      '..KDDK....KDDK..',
      '.KKKKK....KKKKK.',
      '................',
      '................'
    ],
    win_phantom: [
      '....KKKKKKKK....',
      '...KBBBBBBBBK...',
      '..KBBCCCCCCBBK..',
      '..KBKWWKKWWKBK..',
      '..KBBBBBBBBBBK..',
      '.KDDKRRKKGGKDDK.',
      '.KDDKRRKKGGKDDK.',
      '.KDDKKKKKKKKDDK.',
      '.KDDKCCKKYYKDDK.',
      '.KDDKCCKKYYKDDK.',
      '..KDDDDDDDDDDK..',
      '..KDBKDDDDKBDK..',
      '...KK.KDDK.KK...',
      '......K..K......',
      '................',
      '................'
    ],
    hypervisor_mech: [
      '..KKKKKKKKKKKK..',
      '.KLLLLLLLLLLLLK.',
      '.KSDDDDDDDDDDSK.',
      '.KSDKEEKCCKEDSK.',
      '.KSDDDDDDDDDDSK.',
      'KKSSSSSSSSSSSSKK',
      'KPPSSCCCCCCSSPPK',
      'KPPSSCEEEECSSPPK',
      'KKKSSCCCCCCSSKKK',
      '..KSDDDDDDDDSK..',
      '..KSSEEYYEESSK..',
      '..KSSK....KSSK..',
      '..KDDK....KDDK..',
      '.KKKKK....KKKKK.',
      '................',
      '................'
    ],
    access_sovereign: [
      '...K..K..K..K...',
      '..KYYYYYYYYYYK..',
      '..KYGYGYYGYGYK..',
      '...KGGGGGGGGK...',
      '..KPPKCKKCKPPK..',
      '..KPPPPPPPPPPK..',
      '.KGGKVVVVVVKKGGK',
      '.KPPKPVYYVPKPPK.',
      '.KDPKPVYYVPKPDK.',
      '..KKKPPPPPPKKK..',
      '...KDDGGGGDDK...',
      '...KPPK..KPPK...',
      '...KGGK..KGGK...',
      '..KKKKK..KKKKK..',
      '................',
      '................'
    ]
  };

  function getPalette(name) {
    if (PALETTES[name]) return PALETTES[name];
    return PALETTES.items;
  }

  function renderPixelSVG(name, size = 64, extraClass = '') {
    const grid = GRIDS[name] || GRIDS.potion;
    const palette = getPalette(name);
    const rows = grid.length;
    const cols = grid[0].length;
    let rects = '';
    for (let y = 0; y < rows; y++) {
      const row = grid[y];
      for (let x = 0; x < cols; x++) {
        const ch = row[x];
        const color = palette[ch];
        if (color) {
          rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;
        }
      }
    }
    return `<svg class="pixel-svg ${extraClass}" width="${size}" height="${size}" viewBox="0 0 ${cols} ${rows}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
  }

  global.PixelSprites = {
    render: renderPixelSVG,
    has: (name) => Boolean(GRIDS[name])
  };
})(window);
