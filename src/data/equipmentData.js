/**
 * FitHer 器材教学 — 完整数据
 *
 * 结构：
 *   mainCategories[]         顶层分类胶囊
 *   categoryDetailMap[id]    每个分类的详情（标题/副标题/子分类/视频列表）
 *   allVideos[]              所有视频的扁平列表（供"全部"tab + 搜索）
 *
 * 视频卡片字段：
 *   id, title, level, duration, cover (占位渐变色), bilibiliUrl, category, subcategory
 */

/* ========== 占位封面色板（每个子分类一组柔和渐变） ========== */
const COVERS = {
  strength: ['#F9E4EC', '#FDE8EF', '#FDF0F4', '#FBE0E8', '#FCE4EE'],
  stretch: ['#E8F0FE', '#EDF3FC', '#E3ECFA', '#EEF4FD', '#E5EDF9'],
  treadmill: ['#FFF3E0', '#FFF8ED', '#FEF5E8', '#FFF6EA', '#FFF4E5'],
  freeWeight: ['#F3E5F5', '#F8EDFA', '#F0E0F3', '#F5E8F7', '#EDDEF0'],
  glutes: ['#E8F5E9', '#EDF8EE', '#E3F0E4', '#F0FAF1', '#E6F3E7'],
  chestBack: ['#FCE4EC', '#FDE8EF', '#FBE0E8', '#FEF0F4', '#FDEAF0'],
  core: ['#FFF8E1', '#FFFDE7', '#FEF9E8', '#FFFAED', '#FFFCEF'],
};

/* ========== 顶层分类 ========== */
export const mainCategories = [
  { id: 'all',           name: '全部',       icon: '📋', count: 55 },
  { id: 'stretch',       name: '拉伸教学',   icon: '🧘', count: 4 },
  { id: 'treadmill',     name: '跑步机',     icon: '🏃', count: 8 },
  { id: 'strength',      name: '力量器材',   icon: '🏋️', count: 19 },
  { id: 'free-weight',   name: '自由重量',   icon: '💪', count: 9 },
  { id: 'glutes-legs',   name: '臀腿训练',   icon: '🍑', count: 7 },
  { id: 'chest-back',    name: '胸肩背',     icon: '🎯', count: 7 },
  { id: 'core',          name: '核心训练',   icon: '🔥', count: 7 },
];

/* ========== 各分类详情 ========== */
export const categoryDetailMap = {

  /* ───── 力量器材 ───── */
  strength: {
    title: '力量器材',
    subtitle: '适合健身房固定器械训练',
    description: '固定器械轨迹稳定，安全性高，新手也能放心使用。掌握每个器械的正确用法，让训练更高效。',
    totalVideos: 19,
    subcategories: [
      {
        name: '新手入门',
        videos: [
          { id: 'st-xx-back',    title: 'XiaoXiao背部器械+爬坡跟练', level: '初级', duration: '49 分钟', rating: 5, category: 'strength', subcategory: '新手入门', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1nhTy6LEJ3', cover: 'https://i0.hdslb.com/bfs/archive/46f3632a53ed555c901755c70bcaf109c42e9212.jpg' },
          { id: 'st-xx-leg',     title: 'XiaoXiao固定器械练腿教程', level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '新手入门', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1hVbTzZET5', cover: 'https://i2.hdslb.com/bfs/archive/36de6f49a7e6789b18781e688591d5a3235a4589.jpg' },
          { id: 'st-xx-guide',   title: 'XiaoXiao固定器械使用教程', level: '初级', duration: '2 分钟', rating: 5, category: 'strength', subcategory: '新手入门', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1nX8dzJEu9', cover: 'https://i1.hdslb.com/bfs/archive/c05161e3c9eb74ee51037ee803081eb80ec82b1a.jpg' },
        ],
      },
      {
        name: '胸部',
        videos: [
          { id: 'chest-press',    title: '坐姿推胸',    level: '初级', duration: '6 分钟', rating: 5, category: 'strength', subcategory: '胸部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1t54y1V7v2', cover: '' },
          { id: 'pec-fly',        title: '蝴蝶夹胸',    level: '中级', duration: '5 分钟', rating: 5, category: 'strength', subcategory: '胸部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1t54y1V7v2', cover: '' },
          { id: 'incline-press',  title: '上斜推胸',    level: '中级', duration: '7 分钟', rating: 4, category: 'strength', subcategory: '胸部', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '背部',
        videos: [
          { id: 'lat-pulldown',   title: '高位下拉',    level: '初级', duration: '6 分钟', rating: 5, category: 'strength', subcategory: '背部', bilibiliUrl: '', cover: '' },
          { id: 'seated-row',     title: '坐姿划船',    level: '初级', duration: '5 分钟', rating: 5, category: 'strength', subcategory: '背部', bilibiliUrl: '', cover: '' },
          { id: 'reverse-fly',    title: '反向飞鸟',    level: '中级', duration: '7 分钟', rating: 4, category: 'strength', subcategory: '背部', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '腿部',
        videos: [
          { id: 'leg-press',      title: '腿举机',      level: '初级', duration: '5 分钟', rating: 5, category: 'strength', subcategory: '腿部', bilibiliUrl: '', cover: '' },
          { id: 'hack-squat',     title: '倒蹬机',      level: '初级', duration: '6 分钟', rating: 5, category: 'strength', subcategory: '腿部', bilibiliUrl: '', cover: '' },
          { id: 'leg-extension',  title: '腿屈伸',      level: '初级', duration: '4 分钟', rating: 4, category: 'strength', subcategory: '腿部', bilibiliUrl: '', cover: '' },
          { id: 'leg-curl',       title: '腿弯举',      level: '初级', duration: '4 分钟', rating: 4, category: 'strength', subcategory: '腿部', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '肩部',
        videos: [
          { id: 'shoulder-press', title: '肩推机',      level: '初级', duration: '5 分钟', rating: 4, category: 'strength', subcategory: '肩部', bilibiliUrl: '', cover: '' },
          { id: 'lateral-raise',  title: '侧平举器械',  level: '中级', duration: '5 分钟', rating: 4, category: 'strength', subcategory: '肩部', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '综合',
        videos: [
          { id: 'smith-machine',  title: '史密斯机',    level: '中级', duration: '8 分钟', rating: 5, category: 'strength', subcategory: '综合', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1wM4y1a7YW', cover: '' },
          { id: 'cable-machine',  title: '龙门架',      level: '中级', duration: '8 分钟', rating: 5, category: 'strength', subcategory: '综合', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1yT4y1S7hF', cover: '' },
        ],
      },
    ],
  },

  /* ───── 拉伸教学（仅2条安娜视频）───── */
  stretch: {
    title: '拉伸教学',
    subtitle: '安娜(growingannanas) — 训练前后拉伸跟练',
    description: '运动前动态激活 + 运动后全身放松，仅需2节课，科学拉伸不伤身。',
    totalVideos: 4,
    subcategories: [
      {
        name: '训练后放松',
        videos: [
          { id: 'st-xx-cool',    title: 'XiaoXiao爬坡后拉伸跟练', level: '初级', duration: '4 分钟', rating: 5, category: 'stretch', subcategory: '训练后放松', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1oFxuzeEVN', cover: 'https://i1.hdslb.com/bfs/archive/06e946e2b1353617d21b5fb83101c7b0ccd7474c.jpg' },
        ],
      },
      {
        name: '训练前热身',
        videos: [
          { id: 'wu-anna',         title: '安娜5分钟快速拉伸',  level: '初级', duration: '5 分钟', rating: 5, category: 'stretch', subcategory: '训练前热身', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1jM4y177oN', cover: 'https://i2.hdslb.com/bfs/archive/0fee648cdc0d068e65dfa29e75a529f0977ed725.jpg' },
          { id: 'wu-anna2',        title: '安娜10分钟拉伸练习',  level: '初级', duration: '10 分钟', rating: 5, category: 'stretch', subcategory: '训练前热身', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1UH4y1H7Wc', cover: 'https://i0.hdslb.com/bfs/archive/b1508116df1d4b2c2c31079551c89bdb706553d7.jpg' },
        ],
      },
      {
        name: '训练后拉伸',
        videos: [
          { id: 'cd-anna',         title: '安娜15分钟放松拉伸',  level: '初级', duration: '15 分钟', rating: 5, category: 'stretch', subcategory: '训练后拉伸', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1ev421y7PD', cover: 'https://i1.hdslb.com/bfs/archive/8a05daf284197acd7de8df61443470a02760c3ec.jpg' },
        ],
      },
    ],
  },

  /* ───── 跑步机 ───── */
  treadmill: {
    title: '跑步机',
    subtitle: '从新手到进阶，科学跑步不伤膝',
    description: '跑步机是最常见的有氧器械，但正确的使用方式很多人并不了解。从基础走路到高强度间歇，系统学习每一种模式。',
    totalVideos: 8,
    subcategories: [
      {
        name: '爬坡跟练',
        videos: [
          { id: 'tm-xx-45',      title: 'XiaoXiao45分钟爬坡跟练', level: '初级', duration: '48 分钟', rating: 5, category: 'treadmill', subcategory: '爬坡跟练', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1naAHzQESL', cover: 'https://i0.hdslb.com/bfs/archive/c3fa942a5f322b7ea05207e75fa978081d849ad9.jpg' },
          { id: 'tm-xx-35',      title: 'XiaoXiao35分钟爬坡跟练', level: '初级', duration: '35 分钟', rating: 5, category: 'treadmill', subcategory: '爬坡跟练', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1rHrsBzEsU', cover: 'https://i2.hdslb.com/bfs/archive/28cf1712804fb7e3b0c010efff4f5c1fa72188c8.jpg' },
        ],
      },
      {
        name: '新手走路',
        videos: [
          { id: 'tm-walk',       title: '新手快走入门',    level: '初级', duration: '15 分钟', rating: 5, category: 'treadmill', subcategory: '新手走路', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '减脂慢跑',
        videos: [
          { id: 'tm-jog',        title: '燃脂慢跑计划',    level: '初级', duration: '20 分钟', rating: 5, category: 'treadmill', subcategory: '减脂慢跑', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '间歇训练',
        videos: [
          { id: 'tm-hiit',       title: 'HIIT 间歇跑',     level: '中级', duration: '15 分钟', rating: 5, category: 'treadmill', subcategory: '间歇训练', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '坡度训练',
        videos: [
          { id: 'tm-incline',    title: '爬坡燃脂训练',    level: '中级', duration: '20 分钟', rating: 4, category: 'treadmill', subcategory: '坡度训练', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '心肺提升',
        videos: [
          { id: 'tm-cardio',     title: '心肺耐力进阶',    level: '中级', duration: '25 分钟', rating: 4, category: 'treadmill', subcategory: '心肺提升', bilibiliUrl: '', cover: '' },
          { id: 'tm-tempo',      title: '节奏跑训练',      level: '高级', duration: '20 分钟', rating: 4, category: 'treadmill', subcategory: '心肺提升', bilibiliUrl: '', cover: '' },
        ],
      },
    ],
  },

  /* ───── 自由重量 ───── */
  'free-weight': {
    title: '自由重量',
    subtitle: '哑铃、杠铃、壶铃、弹力带 — 自由掌控力量',
    description: '自由重量训练能激活更多稳定肌群，是塑形和增肌的高效方式。学会正确姿势，安全训练。',
    totalVideos: 9,
    subcategories: [
      {
        name: '哑铃',
        videos: [
          { id: 'fw-dumbbell',   title: '哑铃全身训练',    level: '初级', duration: '12 分钟', rating: 5, category: 'free-weight', subcategory: '哑铃', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1VJ4m1M7qE', cover: '' },
          { id: 'fw-db-upper',   title: '哑铃上肢塑形',    level: '中级', duration: '10 分钟', rating: 4, category: 'free-weight', subcategory: '哑铃', bilibiliUrl: '', cover: '' },
          { id: 'fw-anna-full',  title: '安娜30分钟全身哑铃', level: '中级', duration: '30 分钟', rating: 5, category: 'free-weight', subcategory: '哑铃', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1dx4y1U7Lf', cover: 'https://i1.hdslb.com/bfs/archive/f9fe35fbfbf7a4990f02a1eb93691e6ff647320c.jpg' },
          { id: 'fw-anna-arm',   title: '安娜20分钟哑铃手臂', level: '初级', duration: '20 分钟', rating: 5, category: 'free-weight', subcategory: '哑铃', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1PS411K7wT', cover: 'https://i2.hdslb.com/bfs/archive/1472c8561b76b895aae205a356d15b6feb07274c.jpg' },
          { id: 'fw-anna-stand', title: '安娜25分钟站立哑铃', level: '初级', duration: '25 分钟', rating: 5, category: 'free-weight', subcategory: '哑铃', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1AuZPYiEK1', cover: 'https://i2.hdslb.com/bfs/archive/55e07aa63ef18c9dc409c82e26eddfa7a410c8cb.jpg' },
        ],
      },
      {
        name: '杠铃',
        videos: [
          { id: 'fw-barbell',    title: '杠铃基础动作',    level: '中级', duration: '15 分钟', rating: 5, category: 'free-weight', subcategory: '杠铃', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '壶铃',
        videos: [
          { id: 'fw-kettlebell', title: '壶铃摆荡教学',    level: '中级', duration: '8 分钟', rating: 5, category: 'free-weight', subcategory: '壶铃', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1KV4y1q7rM', cover: '' },
        ],
      },
      {
        name: '弹力带',
        videos: [
          { id: 'fw-band',       title: '弹力带臀腿训练',  level: '初级', duration: '10 分钟', rating: 5, category: 'free-weight', subcategory: '弹力带', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1aG411k7pE', cover: '' },
          { id: 'fw-band-upper', title: '弹力带上肢训练',  level: '初级', duration: '8 分钟',  rating: 4, category: 'free-weight', subcategory: '弹力带', bilibiliUrl: '', cover: '' },
        ],
      },
    ],
  },

  /* ───── 臀腿训练 ───── */
  'glutes-legs': {
    title: '臀腿训练',
    subtitle: '打造完美臀腿线条',
    description: '针对臀部和腿部的专项训练，涵盖经典动作与进阶变式，塑造紧致有型的下肢曲线。',
    totalVideos: 7,
    subcategories: [
      {
        name: '有氧燃脂',
        videos: [
          { id: 'gl-anna-hiit',  title: '安娜30分钟无跳跃HIIT', level: '中级', duration: '30 分钟', rating: 5, category: 'glutes-legs', subcategory: '有氧燃脂', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV12R4y1E7iC', cover: 'https://i2.hdslb.com/bfs/archive/42b36bbd27ca481d0cf293131efcbc627303e29c.jpg' },
        ],
      },
      {
        name: '臀桥',
        videos: [
          { id: 'gl-bridge',      title: '臀桥全面教学',    level: '初级', duration: '8 分钟',  rating: 5, category: 'glutes-legs', subcategory: '臀桥', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '深蹲',
        videos: [
          { id: 'gl-squat',       title: '深蹲标准教学',    level: '初级', duration: '10 分钟', rating: 5, category: 'glutes-legs', subcategory: '深蹲', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '箭步蹲',
        videos: [
          { id: 'gl-lunge',       title: '箭步蹲训练指南',  level: '中级', duration: '8 分钟',  rating: 5, category: 'glutes-legs', subcategory: '箭步蹲', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '臀推',
        videos: [
          { id: 'gl-thrust',      title: '臀推标准动作',    level: '中级', duration: '8 分钟',  rating: 5, category: 'glutes-legs', subcategory: '臀推', bilibiliUrl: '', cover: '' },
          { id: 'gl-thrust-adv',  title: '臀推进阶变式',    level: '高级', duration: '10 分钟', rating: 4, category: 'glutes-legs', subcategory: '臀推', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '腿后侧',
        videos: [
          { id: 'gl-hamstring',   title: '腿后侧链训练',    level: '中级', duration: '10 分钟', rating: 4, category: 'glutes-legs', subcategory: '腿后侧', bilibiliUrl: '', cover: '' },
        ],
      },
    ],
  },

  /* ───── 胸肩背 ───── */
  'chest-back': {
    title: '胸肩背',
    subtitle: '塑造优美上身线条',
    description: '针对胸部、肩部和背部的综合训练，改善体态，打造挺拔优雅的上半身。',
    totalVideos: 7,
    subcategories: [
      {
        name: '全身综合',
        videos: [
          { id: 'cb-anna-low',   title: '安娜30分钟全身力量',   level: '初级', duration: '30 分钟', rating: 5, category: 'chest-back', subcategory: '全身综合', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1RpP7zNEE2', cover: 'https://i0.hdslb.com/bfs/archive/1362b070eb623388f5d506ebe6118ebfa0455ca3.jpg' },
        ],
      },
      {
        name: '胸部训练',
        videos: [
          { id: 'cb-chest',       title: '胸部塑形训练',    level: '初级', duration: '12 分钟', rating: 5, category: 'chest-back', subcategory: '胸部训练', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '肩部训练',
        videos: [
          { id: 'cb-shoulder',    title: '直角肩训练',      level: '初级', duration: '10 分钟', rating: 5, category: 'chest-back', subcategory: '肩部训练', bilibiliUrl: '', cover: '' },
          { id: 'cb-delts',       title: '肩部全方位雕刻',  level: '中级', duration: '12 分钟', rating: 4, category: 'chest-back', subcategory: '肩部训练', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '背部训练',
        videos: [
          { id: 'cb-back',        title: '背部线条训练',    level: '初级', duration: '12 分钟', rating: 5, category: 'chest-back', subcategory: '背部训练', bilibiliUrl: '', cover: '' },
          { id: 'cb-back-adv',    title: '背部力量进阶',    level: '中级', duration: '15 分钟', rating: 4, category: 'chest-back', subcategory: '背部训练', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '体态改善',
        videos: [
          { id: 'cb-posture',     title: '圆肩驼背矫正',    level: '初级', duration: '10 分钟', rating: 5, category: 'chest-back', subcategory: '体态改善', bilibiliUrl: '', cover: '' },
        ],
      },
    ],
  },

  /* ───── 核心训练 ───── */
  core: {
    title: '核心训练',
    subtitle: '稳定核心，激活全身力量',
    description: '核心是身体的动力中心。从基础卷腹到进阶动作，系统强化腹部和腰部肌群。',
    totalVideos: 7,
    subcategories: [
      {
        name: '高强度燃脂',
        videos: [
          { id: 'cr-anna-tabata', title: '安娜20分钟TABATA腹肌', level: '中级', duration: '20 分钟', rating: 5, category: 'core', subcategory: '高强度燃脂', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1fF4m1j7Yr', cover: 'https://i0.hdslb.com/bfs/archive/390be5f44a067f3a134e0e5c05aa20e397e9c346.jpg' },
        ],
      },
      {
        name: '卷腹',
        videos: [
          { id: 'cr-crunch',       title: '卷腹标准教学',    level: '初级', duration: '6 分钟',  rating: 5, category: 'core', subcategory: '卷腹', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '平板支撑',
        videos: [
          { id: 'cr-plank',        title: '平板支撑进阶',    level: '初级', duration: '8 分钟',  rating: 5, category: 'core', subcategory: '平板支撑', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '俄罗斯转体',
        videos: [
          { id: 'cr-russian',      title: '俄罗斯转体教学',  level: '中级', duration: '5 分钟',  rating: 4, category: 'core', subcategory: '俄罗斯转体', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '死虫',
        videos: [
          { id: 'cr-deadbug',      title: '死虫式核心训练',  level: '初级', duration: '6 分钟',  rating: 5, category: 'core', subcategory: '死虫', bilibiliUrl: '', cover: '' },
        ],
      },
      {
        name: '侧桥',
        videos: [
          { id: 'cr-side-plank',   title: '侧桥稳定训练',    level: '中级', duration: '5 分钟',  rating: 4, category: 'core', subcategory: '侧桥', bilibiliUrl: '', cover: '' },
          { id: 'cr-side-adv',     title: '侧桥旋转进阶',    level: '高级', duration: '6 分钟',  rating: 4, category: 'core', subcategory: '侧桥', bilibiliUrl: '', cover: '' },
        ],
      },
    ],
  },

};

/* ========== 扁平化所有视频（按导航栏分类顺序排列） ========== */
export const allVideos = (() => {
  const list = [];
  /* 按 mainCategories 顺序（跳过 'all'）逐分类收集 */
  mainCategories.forEach((mc) => {
    if (mc.id === 'all') return;
    const cat = categoryDetailMap[mc.id];
    if (!cat) return;
    (cat.subcategories || []).forEach((sub) => {
      (sub.videos || []).forEach((v) => list.push(v));
    });
  });
  return list;
})();

/* ========== 按 category id 获取所有视频 ========== */
export function getVideosByCategory(categoryId) {
  const detail = categoryDetailMap[categoryId];
  if (!detail) return [];
  const list = [];
  (detail.subcategories || []).forEach((sub) => {
    (sub.videos || []).forEach((v) => list.push(v));
  });
  return list;
}

/* ========== 占位封面背景（每个子分类分配不同颜色） ========== */
export function getCoverStyle(video, indexInSub) {
  const palette = COVERS[video.category] || COVERS.strength;
  const c = palette[indexInSub % palette.length];
  const c2 = c; // 单色柔和渐变
  return {
    background: `linear-gradient(135deg, ${c} 0%, ${c} 60%, #fff 100%)`,
  };
}
