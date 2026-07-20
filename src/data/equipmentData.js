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
  cardio: ['#FFF0F0', '#FFF5F2', '#FEF2EE', '#FFF6F3', '#FEF3EF'],
};

/* ========== 顶层分类 ========== */
export const mainCategories = [
  { id: 'all',           name: '全部',       icon: '📋', count: 74 },
  { id: 'stretch',       name: '拉伸教学',   icon: '🧘', count: 6 },
  { id: 'treadmill',     name: '跑步机',     icon: '🏃', count: 6 },
  { id: 'strength',      name: '力量器材',   icon: '🏋️', count: 21 },
  { id: 'upper-body',    name: '上肢塑形',   icon: '💪', count: 17 },
  { id: 'cardio',        name: '有氧燃脂',   icon: '💦', count: 6 },
  { id: 'glutes-legs',   name: '臀腿训练',   icon: '🍑', count: 10 },
  { id: 'core',          name: '核心训练',   icon: '🔥', count: 8 },
];
/* ========== 各分类详情 ========== */
export const categoryDetailMap = {

  /* ───── 力量器材 ───── */
  strength: {
    title: '力量器材',
    subtitle: '适合健身房固定器械训练',
    description: '固定器械轨迹稳定，安全性高，新手也能放心使用。掌握每个器械的正确用法，让训练更高效。',
    totalVideos: 21,
    subcategories: [
      {
        name: '器械教学',
        videos: [
          { id: 'st-lbj-gwl',       title: '辣不加香菜·高位下拉',      level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1SZKHzyELs', cover: 'https://i0.hdslb.com/bfs/archive/02a775f941914bbdd67b76289d44316535ebd179.jpg' },
          { id: 'st-lbj-row',       title: '实肌娘娘·坐姿划船教学',    level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1i1tczUEN7', cover: 'https://i1.hdslb.com/bfs/archive/d019d06a1863285579a8645a056a1671d2303bd8.jpg' },
          { id: 'st-lbj-hack',      title: '实肌娘娘·哈克机教学',      level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1P8hyz8ER4', cover: 'https://i2.hdslb.com/bfs/archive/bee5dfe26f9ae6c54ea866c01cf0cac5a06cf2c5.jpg' },
          { id: 'st-lbj-cable-back',title: '辣不加香菜·龙门架练背',    level: '初级', duration: '4 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1xGgJzGEax', cover: 'https://i0.hdslb.com/bfs/archive/5b4f9f859dbe66ddc3be4670457f8de9dacd15c6.jpg' },
          { id: 'st-lbj-pullup',    title: '辣不加香菜·辅助引体',      level: '初级', duration: '2 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1gm8CzNEGZ', cover: 'https://i0.hdslb.com/bfs/archive/395dbdb6cba8eb76b2243166567764554b4f14cb.jpg' },
          { id: 'st-lbj-pec',       title: '实肌娘娘·蝴蝶机教学',      level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1dxbQztEa1', cover: 'https://i0.hdslb.com/bfs/archive/f60f540674396990084ffe99c936765f839c6ca8.jpg' },
          { id: 'st-lbj-revfly',    title: '辣不加香菜·反向蝴蝶机练肩',level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV166e9zsEjc', cover: 'https://i0.hdslb.com/bfs/archive/ab8fd08a0b29dcfac2276cee40741f4bf5ac68d3.jpg' },
          { id: 'st-lbj-hipabd',    title: '实肌娘娘·坐姿髋外展教学',  level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1uFbkzsEyW', cover: 'https://i0.hdslb.com/bfs/archive/62a7552e3d8de702734ec42b7fb0d254e66005dd.jpg' },
          { id: 'st-lbj-legadd',    title: '实肌娘娘·髋内收教学',      level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1k38AzqEfm', cover: 'https://i0.hdslb.com/bfs/archive/fe21555db357b9201a96eef00e600f0a706795bf.jpg' },
          { id: 'st-lbj-legpress',  title: '辣不加香菜·倒蹬机',        level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1nFpbzxE6B', cover: 'https://i1.hdslb.com/bfs/archive/90cd2aa52afe3a776d8132750c88b89cc0131a14.jpg' },
          { id: 'st-lbj-chest',     title: '辣不加香菜·坐姿推胸',      level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1XmHNz3E4d', cover: 'https://i0.hdslb.com/bfs/archive/c17a051459da979a255838e3b25eae9e79f23a12.jpg' },
          { id: 'st-lbj-goat',      title: '实肌娘娘·罗马椅教学',      level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV17K8BzZEV7', cover: 'https://i1.hdslb.com/bfs/archive/52eb8b2e7f21b351caab286c0062f569bc3cbbac.jpg' },
          { id: 'st-lbj-smith-kick',title: '辣不加香菜·史密斯后蹬',    level: '初级', duration: '2 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1BXUEBzEEy', cover: 'https://i0.hdslb.com/bfs/archive/b4c949ef0310d93c4884e01aa0a3a2685691038f.jpg' },
          { id: 'st-lbj-smith-squat',title:'实肌娘娘·史密斯深蹲教学',  level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1qwaNzuEp1', cover: 'https://i2.hdslb.com/bfs/archive/a92e59f85762ab8e72db96b960ec3b268fea19b4.jpg' },
          { id: 'st-lbj-facepull',  title: '实肌娘娘·绳索面拉教学',    level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV17wYRzjEAC', cover: 'https://i2.hdslb.com/bfs/archive/35608f95641227e53d71a0f25ac2e53c6fdad7ef.jpg' },
          { id: 'st-lbj-legext',    title: '实肌娘娘·坐姿腿屈伸教学',  level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1KCtpz8EL9', cover: 'https://i1.hdslb.com/bfs/archive/e377605c3d107389257b904feab440ce6d08486e.jpg' },
          { id: 'st-lbj-pushdown',  title: '实肌娘娘·直臂下压教学',    level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV169bKzrEgz', cover: 'https://i0.hdslb.com/bfs/archive/c5d4785ecd83477fcaf024e195354a449c5f0e4e.jpg' },
          { id: 'st-lbj-hipthrust', title: '实肌娘娘·臀推机教学',      level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1aYeEzGEyo', cover: 'https://i1.hdslb.com/bfs/archive/155c0ca975687519ecb9c7456a0b7d51120b9e8f.jpg' },
        ],
      },
      {
        name: '跟练课程',
        videos: [
          { id: 'st-xx-back',    title: 'XiaoXiao背部器械+爬坡跟练', level: '初级', duration: '49 分钟', rating: 5, category: 'strength', subcategory: '跟练课程', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1nhTy6LEJ3', cover: 'https://i0.hdslb.com/bfs/archive/46f3632a53ed555c901755c70bcaf109c42e9212.jpg' },
          { id: 'st-xx-leg',     title: 'XiaoXiao固定器械练腿教程', level: '初级', duration: '1 分钟', rating: 5, category: 'strength', subcategory: '跟练课程', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1hVbTzZET5', cover: 'https://i2.hdslb.com/bfs/archive/36de6f49a7e6789b18781e688591d5a3235a4589.jpg' },
          { id: 'st-xx-guide',   title: 'XiaoXiao固定器械使用教程', level: '初级', duration: '2 分钟', rating: 5, category: 'strength', subcategory: '跟练课程', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1nX8dzJEu9', cover: 'https://i1.hdslb.com/bfs/archive/c05161e3c9eb74ee51037ee803081eb80ec82b1a.jpg' },
        ],
      },




    ],
  },

  /* ───── 拉伸教学（仅2条安娜视频）───── */
  stretch: {
    title: '拉伸教学',
    subtitle: '安娜(growingannanas) — 训练前后拉伸跟练',
    description: '运动前动态激活 + 运动后全身放松，仅需2节课，科学拉伸不伤身。',
    totalVideos: 6,
    subcategories: [
      {
        name: '训练前热身',
        videos: [
          { id: 'wu-anna',         title: '安娜5分钟快速拉伸',  level: '初级', duration: '5 分钟', rating: 5, category: 'stretch', subcategory: '训练前热身', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1jM4y177oN', cover: 'https://i2.hdslb.com/bfs/archive/0fee648cdc0d068e65dfa29e75a529f0977ed725.jpg' },
          { id: 'cd-teagan',       title: 'Teagan Dixon·5分钟全身拉伸', level: '初级', duration: '5 分钟', rating: 5, category: 'stretch', subcategory: '训练前热身', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1qA411A7u3', cover: 'https://i0.hdslb.com/bfs/archive/275a50c3b9b1e5ab055049d093105b162b03ebd0.jpg' },
          { id: 'wu-anna2',        title: '安娜10分钟拉伸练习',  level: '初级', duration: '10 分钟', rating: 5, category: 'stretch', subcategory: '训练前热身', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1UH4y1H7Wc', cover: 'https://i0.hdslb.com/bfs/archive/b1508116df1d4b2c2c31079551c89bdb706553d7.jpg' },
        ],
      },
      {
        name: '帕梅拉拉伸',
        videos: [
          { id: 'st-pam-full',     title: '帕梅拉·10分钟全身拉伸',    level: '初级', duration: '11 分钟', rating: 5, category: 'stretch', subcategory: '帕梅拉拉伸', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1ga411w7i3', cover: 'https://i2.hdslb.com/bfs/archive/64a46fcd19aeb36e08ccf9ef2f544f624dc83a7d.jpg' },
          { id: 'st-pam-leg',      title: '帕梅拉·10分钟腿部拉伸',    level: '初级', duration: '10 分钟', rating: 5, category: 'stretch', subcategory: '帕梅拉拉伸', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV13v411y7v4', cover: 'https://i1.hdslb.com/bfs/archive/f6f59447a608f95ff0b715b83306b144635d58f1.jpg' },
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
    totalVideos: 9,
    subcategories: [
      {
        name: '器械教学',
        videos: [
          { id: 'tm-pro-treadmill',   title: '专业教练·跑步机使用教程', level: '初级', duration: '4 分钟', rating: 5, category: 'treadmill', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1Cg4y1q7rX', cover: 'https://i0.hdslb.com/bfs/archive/73e2bb547eee55459db5c7183962771dc0913cd8.jpg' },
          { id: 'tm-lbj-treadmill',  title: '辣不加香菜·跑步机爬坡', level: '初级', duration: '2 分钟', rating: 5, category: 'treadmill', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1gtnEzzEFK', cover: 'https://i0.hdslb.com/bfs/archive/3664e91e738983c8ecd2017339072bdd5665dd0d.jpg' },
          { id: 'tm-lbj-climb',      title: '辣不加香菜·爬楼机',     level: '初级', duration: '2 分钟', rating: 5, category: 'treadmill', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1bb6gByEcd', cover: 'https://i0.hdslb.com/bfs/archive/70a19649dc32887609d4beb88f9f63e13def9dde.jpg' },
          { id: 'tm-lbj-elliptical', title: '辣不加香菜·椭圆仪',     level: '初级', duration: '1 分钟', rating: 5, category: 'treadmill', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1JN1XBfEPD', cover: 'https://i0.hdslb.com/bfs/archive/3a26e41b05cb05f2e95a804e577685f7efbd8e00.jpg' },
        ],
      },
      {
        name: '爬坡跟练',
        videos: [
          { id: 'tm-xx-45',      title: 'XiaoXiao45分钟爬坡跟练', level: '初级', duration: '48 分钟', rating: 5, category: 'treadmill', subcategory: '爬坡跟练', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1naAHzQESL', cover: 'https://i0.hdslb.com/bfs/archive/c3fa942a5f322b7ea05207e75fa978081d849ad9.jpg' },
          { id: 'tm-xx-35',      title: 'XiaoXiao35分钟爬坡跟练', level: '初级', duration: '35 分钟', rating: 5, category: 'treadmill', subcategory: '爬坡跟练', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1rHrsBzEsU', cover: 'https://i2.hdslb.com/bfs/archive/28cf1712804fb7e3b0c010efff4f5c1fa72188c8.jpg' },
        ],
      },




    ],
  },


  /* ───── 有氧燃脂 ───── */
  cardio: {
    title: '有氧燃脂',
    subtitle: '安娜+帕梅拉 — 居家暴汗燃脂跟练',
    description: '无器械全身有氧，从新手入门到进阶暴汗，在家就能高效燃脂。',
    totalVideos: 6,
    subcategories: [
      {
        name: 'HIIT燃脂',
        videos: [
          { id: 'cd-anna-hiit',  title: '安娜30分钟无跳跃HIIT', level: '中级', duration: '30 分钟', rating: 5, category: 'cardio', subcategory: 'HIIT燃脂', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV12R4y1E7iC', cover: 'https://i2.hdslb.com/bfs/archive/42b36bbd27ca481d0cf293131efcbc627303e29c.jpg' },
          { id: 'cd-pam-jump',   title: '帕梅拉·15分钟跳跃有氧', level: '中级', duration: '15 分钟', rating: 5, category: 'cardio', subcategory: 'HIIT燃脂', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1QS4y1P7Yu', cover: 'https://i1.hdslb.com/bfs/archive/16cabdade9df66e50fe477d740c93ee2d66c22c1.jpg' },
        ],
      },
      {
        name: '新手入门',
        videos: [
          { id: 'cd-pam-day2',   title: '帕梅拉·新手全身燃脂26min', level: '初级', duration: '26 分钟', rating: 5, category: 'cardio', subcategory: '新手入门', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1854y1q7qW', cover: 'https://i2.hdslb.com/bfs/archive/0c2d820e7f5130ab166296e3e9611d2ea5a23926.jpg' },
          { id: 'cd-pam-hiit',   title: '帕梅拉·10分钟暴汗有氧', level: '初级', duration: '11 分钟', rating: 5, category: 'cardio', subcategory: '新手入门', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1R3411A7g4', cover: 'https://i2.hdslb.com/bfs/archive/173a6c38ab24f9a7b394c2bb6b5f7c1f14412610.jpg' },
        ],
      },
      {
        name: '舞蹈有氧',
        videos: [
          { id: 'cd-pam-dance',  title: '帕梅拉·10分钟帕比狂欢舞', level: '初级', duration: '9 分钟',  rating: 5, category: 'cardio', subcategory: '舞蹈有氧', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1hc411w7rr', cover: 'https://i2.hdslb.com/bfs/archive/cfe9457eef815eeb68b8672dd8dc0a56274869e0.jpg' },
          { id: 'cd-pam-fun',    title: '帕梅拉·12分钟趣味有氧', level: '中级', duration: '11 分钟', rating: 5, category: 'cardio', subcategory: '舞蹈有氧', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1e5411n7Mq', cover: 'https://i0.hdslb.com/bfs/archive/f053f26eb139dc849e7327980766f3f7de2d2609.jpg' },
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
        name: '安娜臀腿',
        videos: [
          { id: 'gl-anna-leg1',  title: '安娜·40分钟疯狂练腿日',   level: '中级', duration: '43 分钟', rating: 5, category: 'glutes-legs', subcategory: '安娜臀腿', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV11L4y1t7e6', cover: 'https://i2.hdslb.com/bfs/archive/f5c62d68cb69560272cdd9e1404ebff09cdca365.jpg' },
          { id: 'gl-anna-leg2',  title: '安娜·30分钟臀腿2合1',      level: '中级', duration: '45 分钟', rating: 5, category: 'glutes-legs', subcategory: '安娜臀腿', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1114y1a7NK', cover: 'https://i1.hdslb.com/bfs/archive/ab00569ae7e4bfbae6ba931c2ff6587065a04416.png' },
          { id: 'gl-anna-leg3',  title: '安娜·30分钟弹力带臀腿',    level: '中级', duration: '35 分钟', rating: 5, category: 'glutes-legs', subcategory: '安娜臀腿', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1nd4y1F72L', cover: 'https://i2.hdslb.com/bfs/archive/3d9a2c049a7a1e58e15a15047e76cc1787d92611.jpg' },
        ],
      },
      {
        name: '帕梅拉臀腿',
        videos: [
          { id: 'gl-pam-hip1',   title: '帕梅拉·10分钟臀部训练',    level: '初级', duration: '11 分钟', rating: 5, category: 'glutes-legs', subcategory: '帕梅拉臀腿', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1oK4y1a7rk', cover: 'https://i0.hdslb.com/bfs/archive/33311599c7056508f1350a9802751d942b57c8d0.jpg' },
          { id: 'gl-pam-hip2',   title: '帕梅拉·12分钟侧臀训练',    level: '初级', duration: '13 分钟', rating: 5, category: 'glutes-legs', subcategory: '帕梅拉臀腿', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1X5411d71V', cover: 'https://i1.hdslb.com/bfs/archive/58ace054e48e177502c221e5ec42c2c702e6add1.jpg' },
          { id: 'gl-pam-hip3',   title: '帕梅拉·10分钟黄金腰臀比',  level: '初级', duration: '11 分钟', rating: 5, category: 'glutes-legs', subcategory: '帕梅拉臀腿', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1SX4y117W2', cover: 'https://i0.hdslb.com/bfs/archive/4de170d5bdaabf807cb3bc4d3785c0444b660ae2.jpg' },
          { id: 'gl-pam-hip4',   title: '帕梅拉·10分钟蜜桃翘臀',    level: '初级', duration: '10 分钟', rating: 5, category: 'glutes-legs', subcategory: '帕梅拉臀腿', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV12f4y1q7Vm', cover: 'https://i0.hdslb.com/bfs/archive/4c176d674c1cb74d59f868addb3f688a40d68c16.jpg' },
          { id: 'gl-pam-hip5',   title: '帕梅拉·12分钟翘臀轰炸',    level: '中级', duration: '13 分钟', rating: 5, category: 'glutes-legs', subcategory: '帕梅拉臀腿', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1qZ421W7oc', cover: 'https://i1.hdslb.com/bfs/archive/373a52bacbf02acd0189e40c0487d8191aed9c59.jpg' },
          { id: 'gl-pam-hip6',   title: '帕梅拉·15分钟翘臀负重',    level: '中级', duration: '16 分钟', rating: 5, category: 'glutes-legs', subcategory: '帕梅拉臀腿', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1iF411978n', cover: 'https://i2.hdslb.com/bfs/archive/ec8964911f1116b66c09f017bd5cf0bfbacc6b5a.jpg' },
          { id: 'gl-pam-hip7',   title: '帕梅拉·10分钟大腿内侧',    level: '初级', duration: '10 分钟', rating: 5, category: 'glutes-legs', subcategory: '帕梅拉臀腿', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1Vf4y1J7Uo', cover: 'https://i1.hdslb.com/bfs/archive/4147693c0458f89e63294e488fe0ea1c10f7f4f0.jpg' },
        ],
      },




    ],
  },

  /* ───── 上肢塑形（胸肩背+自由重量合并）───── */
  'upper-body': {
    title: '上肢塑形',
    subtitle: '哑铃+徒手 — 打造直角肩、美背、紧实手臂',
    description: '安娜、帕梅拉跟练 + 辣不加香菜器械教学 + 哑铃肩部精讲，肩背胸臂全方位塑形。',
    totalVideos: 17,
    subcategories: [
      {
        name: '安娜上肢',
        videos: [
          { id: 'ub-anna-upper1',title: '安娜·30分钟上半身塑形',   level: '中级', duration: '33 分钟', rating: 5, category: 'upper-body', subcategory: '安娜上肢', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1gm411C7mn', cover: 'https://i0.hdslb.com/bfs/archive/ec2e41d43396daab66578d4d2b19b556d57f9121.jpg' },
          { id: 'ub-anna-upper2',title: '安娜·35分钟哑铃手臂肩背',  level: '中级', duration: '37 分钟', rating: 5, category: 'upper-body', subcategory: '安娜上肢', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1fcC5YDE8U', cover: 'https://i1.hdslb.com/bfs/archive/bc496bedb0d4aedeb842bd7a0bcc4d1dfd167d52.jpg' },
          { id: 'ub-anna-upper3',title: '安娜·40分钟哑铃上肢塑形',  level: '中级', duration: '45 分钟', rating: 5, category: 'upper-body', subcategory: '安娜上肢', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1KU4y1P7gT', cover: 'https://i1.hdslb.com/bfs/archive/65ae673749a600b9aebfb359b9000ac45e97aaad.jpg' },
          { id: 'ub-anna-full',  title: '安娜·30分钟全身哑铃',      level: '中级', duration: '30 分钟', rating: 5, category: 'upper-body', subcategory: '安娜上肢', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1dx4y1U7Lf', cover: 'https://i1.hdslb.com/bfs/archive/f9fe35fbfbf7a4990f02a1eb93691e6ff647320c.jpg' },
          { id: 'ub-anna-arm',   title: '安娜·20分钟哑铃手臂',      level: '初级', duration: '20 分钟', rating: 5, category: 'upper-body', subcategory: '安娜上肢', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1PS411K7wT', cover: 'https://i2.hdslb.com/bfs/archive/1472c8561b76b895aae205a356d15b6feb07274c.jpg' },
          { id: 'ub-anna-stand', title: '安娜·25分钟站立哑铃',      level: '初级', duration: '25 分钟', rating: 5, category: 'upper-body', subcategory: '安娜上肢', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1AuZPYiEK1', cover: 'https://i2.hdslb.com/bfs/archive/55e07aa63ef18c9dc409c82e26eddfa7a410c8cb.jpg' },
        ],
      },
      {
        name: '帕梅拉上肢',
        videos: [
          { id: 'ub-pam-arm1',   title: '帕梅拉·15分钟完美天鹅臂',  level: '初级', duration: '16 分钟', rating: 5, category: 'upper-body', subcategory: '帕梅拉上肢', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1cF411Z7TW', cover: 'https://i0.hdslb.com/bfs/archive/33b8003b732e41441ce38884b285208ee3dee947.jpg' },
          { id: 'ub-pam-arm2',   title: '帕梅拉·15分钟上肢+腹部',   level: '中级', duration: '16 分钟', rating: 5, category: 'upper-body', subcategory: '帕梅拉上肢', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV17V4y157Ww', cover: 'https://i2.hdslb.com/bfs/archive/097ea03220b2ca0009f141b23343b0c461fc1d69.jpg' },
          { id: 'ub-pam-arm3',   title: '帕梅拉·10分钟上肢训练',    level: '初级', duration: '10 分钟', rating: 5, category: 'upper-body', subcategory: '帕梅拉上肢', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1KT4y1j7Cd', cover: 'https://i2.hdslb.com/bfs/archive/1aa8d22abcafa32671d443459aeb2a6b28d5fd23.jpg' },
          { id: 'ub-pam-back',   title: '帕梅拉·直背圆肩改善训练',  level: '初级', duration: '20 分钟', rating: 5, category: 'upper-body', subcategory: '帕梅拉上肢', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1aZC5YkEnE', cover: 'https://i0.hdslb.com/bfs/archive/4de37836f8bca577439037d4d630a7f0d551b62d.jpg' },
        ],
      },
      {
        name: '器械教学',
        videos: [
          { id: 'ub-lbj-rdl',    title: '辣不加香菜·罗马尼亚硬拉',  level: '初级', duration: '2 分钟',  rating: 5, category: 'upper-body', subcategory: '器械教学', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1FbNFzwEWM', cover: 'https://i2.hdslb.com/bfs/archive/16b9290cf7494d519d775b39a0131c643c165925.jpg' },
        ],
      },
      {
        name: '哑铃肩部',
        videos: [
          { id: 'ub-db-front',   title: '哑铃前平举·打造好体态',    level: '初级', duration: '2 分钟', rating: 5, category: 'upper-body', subcategory: '哑铃肩部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1eb4y1J788', cover: 'https://i1.hdslb.com/bfs/archive/b04a54cb563d4063972496546d4bec85a67afcd4.jpg' },
          { id: 'ub-db-press',   title: '坐姿哑铃推肩·打造好体态',  level: '初级', duration: '2 分钟', rating: 5, category: 'upper-body', subcategory: '哑铃肩部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1i44y1L7XG', cover: 'https://i0.hdslb.com/bfs/archive/ca784f3b61e75e0a13a93eaec555033b7835cffb.jpg' },
          { id: 'ub-db-lateral', title: '哑铃侧平举·打造好体态',    level: '初级', duration: '2 分钟', rating: 5, category: 'upper-body', subcategory: '哑铃肩部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV17r4y1e7fX', cover: 'https://i1.hdslb.com/bfs/archive/3b5fd4fc4a287c0943d0d8225b20f3de993c8388.jpg' },
          { id: 'ub-db-fill',    title: '填补肩上角·哑铃跟练',      level: '中级', duration: '8 分钟', rating: 5, category: 'upper-body', subcategory: '哑铃肩部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1oB61BsEDK', cover: 'https://i2.hdslb.com/bfs/archive/84bd84fe62ab53ba5bed93b8a91df75e867a2050.jpg' },
          { id: 'ub-db-guide',   title: '哑铃侧平举·保姆级教学',    level: '初级', duration: '5 分钟', rating: 5, category: 'upper-body', subcategory: '哑铃肩部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1e1421k7sn', cover: 'https://i2.hdslb.com/bfs/archive/539681caa4bef9e864816e21b84257a8a7b6eca5.jpg' },
          { id: 'ub-db-rear',    title: '哑铃俯身飞鸟·练肩后束',    level: '初级', duration: '4 分钟', rating: 5, category: 'upper-body', subcategory: '哑铃肩部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1j66iBAELB', cover: 'https://i0.hdslb.com/bfs/archive/16503ee15672f7e63305e554d1eb611c865b2e50.jpg' },
        ],
      },



    ],
  },

  /* ───── 核心训练 ───── */
  core: {
    title: '核心训练',
    subtitle: '稳定核心，激活全身力量',
    description: '核心是身体的动力中心。从基础卷腹到进阶动作，系统强化腹部和腰部肌群。',
    totalVideos: 12,
    subcategories: [
      {
        name: '安娜核心',
        videos: [
          { id: 'cr-anna-core1', title: '安娜·25分钟核心+腹肌',     level: '中级', duration: '25 分钟', rating: 5, category: 'core', subcategory: '安娜核心', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV17ze7zJEgv', cover: 'https://i0.hdslb.com/bfs/archive/9fecc20602031fa0561a1b199b5c14c55ae686e0.jpg' },
          { id: 'cr-anna-core2', title: '安娜·40分钟腿部+腹部塑形',  level: '中级', duration: '59 分钟', rating: 5, category: 'core', subcategory: '安娜核心', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1uS4y1Q7Do', cover: 'https://i1.hdslb.com/bfs/archive/5c0d1c5631207423735c07ecfd4af5ac3b069af0.jpg' },
        ],
      },
      {
        name: '帕梅拉腹部',
        videos: [
          { id: 'cr-pam-abs1',   title: '帕梅拉·10分钟马甲线训练',  level: '初级', duration: '10 分钟', rating: 5, category: 'core', subcategory: '帕梅拉腹部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV18b4y1Q7ey', cover: 'https://i0.hdslb.com/bfs/archive/2dcad7b7bc28573e26df66b461ab3ffda35aa6b9.jpg' },
          { id: 'cr-pam-abs2',   title: '帕梅拉·10分钟下腹部训练',  level: '初级', duration: '10 分钟', rating: 5, category: 'core', subcategory: '帕梅拉腹部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1rt4y1k7Wq', cover: 'https://i2.hdslb.com/bfs/archive/35f173da3790afe49ff2582457f92890640d9b0b.jpg' },
          { id: 'cr-pam-abs3',   title: '帕梅拉·10分钟天堂虐腹',    level: '中级', duration: '11 分钟', rating: 5, category: 'core', subcategory: '帕梅拉腹部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1MN4y1z7Vg', cover: 'https://i1.hdslb.com/bfs/archive/63322a45c661dc0fca66fe0e525a75fc5861a393.jpg' },
          { id: 'cr-pam-abs4',   title: '帕梅拉·10分钟天堂虐腹2弹',  level: '中级', duration: '11 分钟', rating: 5, category: 'core', subcategory: '帕梅拉腹部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1i94y1u7ck', cover: 'https://i0.hdslb.com/bfs/archive/785199cdd106fd2a964e6bc3d0c9ca1878a7ed91.jpg' },
          { id: 'cr-pam-abs5',   title: '帕梅拉·10分钟腹肌无器械',  level: '初级', duration: '10 分钟', rating: 5, category: 'core', subcategory: '帕梅拉腹部', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1rEdLBDENd', cover: 'https://i0.hdslb.com/bfs/archive/c61f29f5eb602e871eb9036b6e4abb68be45678a.jpg' },
        ],
      },
      {
        name: '高强度燃脂',
        videos: [
          { id: 'cr-anna-tabata', title: '安娜20分钟TABATA腹肌', level: '中级', duration: '20 分钟', rating: 5, category: 'core', subcategory: '高强度燃脂', bilibiliUrl: 'https://player.bilibili.com/player.html?bvid=BV1fF4m1j7Yr', cover: 'https://i0.hdslb.com/bfs/archive/390be5f44a067f3a134e0e5c05aa20e397e9c346.jpg' },
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
