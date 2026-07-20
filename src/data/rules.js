/**
 * FitHer 训练计划规则引擎 v4 — 简化友好版
 *
 * 核心原则：
 *   1. 降低动作数量 — 每天 2-3 个主体动作（原 v3 可能 5-8 个）
 *   2. 优先简单器械 — 跑步机/椭圆仪 > 固定器械 > 自由重量
 *   3. 时间匹配优先跟练 — 跟练视频时长匹配则优先推荐
 *   4. 避免多器械组合 — 每天尽量同器械，最多 2 种
 *   5. 避免复杂分化 — 不做胸/背/腿分化，每日全身均衡
 *
 * 每日结构：热身(固定) → 主体训练(简化填充) → 拉伸(固定)
 * 所有动作均来自「器材教学」已上传视频
 */

/* ================================================================
   一、器械简易度排名（越小 = 越简单 = 越优先）
   ================================================================ */
const SIMPLICITY = {
  'treadmill':      0,   // 跑步机 — 最简单
  'elliptical':     0,   // 椭圆仪
  'stair-climb':    0,   // 爬楼机
  'chest-press':    1,   // 坐姿推胸 — 固定器械
  'row':            1,   // 坐姿划船
  'lat-pulldown':   1,   // 高位下拉
  'leg-extension':  1,   // 坐姿腿屈伸
  'pec-fly':        1,   // 蝴蝶机
  'hip-abduction':  1,   // 坐姿髋外展
  'leg-press':      1,   // 倒蹬机
  'hip-thrust':     1,   // 臀推机
  'leg-adduction':  1,   // 髋内收
  'smith':          2,   // 史密斯机 — 中等
  'cable':          2,   // 龙门架/绳索
  'bench':          2,   // 罗马椅
  'dumbbell':       3,   // 哑铃 — 需一定技巧
  'bodyweight':     2,   // 自重
  'mixed':          2,   // 综合跟练（含多器械但教练指导）
};

/* ================================================================
   二、动作素材库（按场景×目标组织）
       每项 = { name, sets, reps, rest, type, sec, videoId, equipment[, isFollowAlong] }
   ================================================================ */

// ── 健身房·减脂 15分钟 四方案（4天一轮）──
const gymCut15Schemes = {
  '全身': [
    { name:'跑步机匀速慢跑',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'速度5.4-6.0 无坡度 平稳匀速慢跑' },
    { name:'跑步机坡度快走',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'速度3.8-4.2 坡度8-10 低冲击燃脂' },
    { name:'跑步机间歇变速',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'慢跑2min(速6)+快走1min(速4.5) 循环' },
    { name:'椭圆机稳态有氧',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'中等阻力匀速踩踏 换运动模式避免瓶颈' },
  ],
  '下肢': [
    { name:'跑步机高坡度快走',sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'坡度10-12 强化臀腿发力' },
    { name:'跑步机坡度快走',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'坡度8-10 持续刺激下肢' },
    { name:'跑步机间歇变速',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'快走2min(速5坡8)+慢跑1min(速6坡0)循环' },
    { name:'椭圆机下肢侧重',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'双脚大幅度蹬踏 重心下沉 侧重臀腿发力' },
  ],
  '上肢': [
    { name:'跑步机匀速慢跑',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'双臂自然摆动 保持肩背放松' },
    { name:'跑步机坡度快走',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'坡度6-8 摆臂幅度加大活动上肢' },
    { name:'跑步机间歇变速',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'慢跑2min(速6)+快走1min(速4.5)循环' },
    { name:'椭圆机上肢侧重',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'拉高阻力 双手大力推拉把手 重点锻炼肩臂' },
  ],
  '核心': [
    { name:'跑步机核心慢跑',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'速度5.0-5.5 全程收紧核心 保持躯干稳定' },
    { name:'跑步机核心快走',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'坡度6-8 收腹挺胸 核心持续发力' },
    { name:'跑步机间歇变速',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'频繁变速 全程收紧核心维持平衡' },
    { name:'椭圆机核心联动',  sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'中等阻力 手脚协调联动 核心收紧稳定躯干' },
  ],
};

// ── 健身房·减脂 30分钟 四方案（4天一轮），主体20min ──
const gymCut30Schemes = {
  '全身': [
    { name:'跑步机匀速慢跑',  sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'坡度0 速度5.5-6.0 平稳慢跑 手脚自然摆动' },
    { name:'跑步机高坡度快走',sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'坡度8-10 速度3.8-4.2 全身协调发力 低冲击燃脂' },
    { name:'跑步机间歇变速跑',sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'慢跑2min(速6)+慢走1min(速4.5) 循环填满20分钟' },
    { name:'椭圆机稳态有氧',  sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'阻力3档 双手活动把手 手脚同步发力' },
  ],
  '下肢': [
    { name:'跑步机匀速慢跑',  sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'坡度3-5 脚步加大 侧重大腿小腿发力' },
    { name:'跑步机高坡度快走',sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'坡度12 重心后移 重点刺激臀部大腿后侧' },
    { name:'跑步机间歇变速跑',sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'慢走段坡度调到6 强化腿部持续发力' },
    { name:'椭圆机下肢侧重',  sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'手扶固定短扶手 加大踏板蹬踏幅度 侧重臀腿' },
  ],
  '上肢': [
    { name:'跑步机匀速慢跑',  sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'加大手臂前后摆动幅度 激活肩臂' },
    { name:'跑步机高坡度快走',sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'双手大幅度前后摆臂 弥补爬坡下肢占比过高' },
    { name:'跑步机间歇变速跑',sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'加速阶段加大摆臂 慢走阶段拉伸手臂肌群' },
    { name:'椭圆机上肢侧重',  sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'阻力5-6档 重点推拉把手 强化肩背手臂' },
  ],
  '核心': [
    { name:'跑步机匀速慢跑',  sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'全程不扶扶手 收紧腹部维持平衡 强化核心' },
    { name:'跑步机高坡度快走',sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'不扶扶手 爬坡时收紧腰腹对抗前倾压力' },
    { name:'跑步机间歇变速跑',sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'变速切换时全程收腹 防止身体晃动 核心持续受力' },
    { name:'椭圆机核心联动',  sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'全程收紧腹部 腰背挺直不塌腰 手脚协调' },
  ],
};

// ── 健身房·减脂 45分钟 纯有氧（4天一轮，1动作35min） ──
const gymCut45Schemes = {
  '全身': [
    { name:'跑步机匀速慢跑',  sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'速度5.5-6.0 平稳匀速慢跑 35min燃脂' },
    { name:'跑步机高坡度快走',sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'坡度8-10 速度3.8-4.2 低冲击燃脂' },
    { name:'跑步机间歇变速跑',sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'慢跑2min速6+快走1min速4.5 循环' },
    { name:'椭圆机稳态有氧',  sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'阻力3-4档 换运动模式避免瓶颈' },
  ],
  '下肢': [
    { name:'跑步机高坡度快走',sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'坡度10-12 强化臀腿发力' },
    { name:'跑步机间歇变速跑',sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'快走段坡8 慢跑段坡0 交替刺激下肢' },
    { name:'跑步机匀速慢跑',  sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'坡度3-5 加大步幅 侧重下肢' },
    { name:'椭圆机下肢侧重',  sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'手扶固定短扶手 加大踏板蹬踏 侧重臀腿' },
  ],
  '上肢': [
    { name:'跑步机匀速慢跑',  sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'大幅摆臂 激活肩臂 每10min肩部环绕' },
    { name:'跑步机间歇变速跑',sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'加速段大力摆臂 慢走段拉伸肩臂' },
    { name:'跑步机高坡度快走',sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'坡度6-8 双手大幅前后摆臂 活动肩关节' },
    { name:'椭圆机上肢侧重',  sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'阻力5-6档 重点推拉把手 强化肩背手臂' },
  ],
  '核心': [
    { name:'跑步机核心慢跑',  sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'全程不扶扶手 收紧腹部 核心持续发力' },
    { name:'跑步机核心快走',  sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-lbj-treadmill',equipment:'treadmill',  note:'坡度6-8 收腹挺胸 对抗前倾 核心强化' },
    { name:'跑步机间歇变速跑',sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-pro-treadmill',equipment:'treadmill',  note:'变速时全程收腹 防止身体晃动 核心持续受力' },
    { name:'椭圆机核心联动',  sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'全程收紧腹部 腰背挺直 手脚协调' },
  ],
};

// ── 健身房·减脂：有氧为主，优先跟练 ──
const gymCut = [
  // 跟练视频 — 时间匹配时优先
  { name: '35分钟爬坡跟练',    sets: 1, reps: '35 分钟', rest: '—', type: '有氧', sec: 2100, videoId: 'tm-xx-35',      equipment: 'treadmill',   isFollowAlong: true },
  { name: '45分钟爬坡跟练',    sets: 1, reps: '48 分钟', rest: '—', type: '有氧', sec: 2880, videoId: 'tm-xx-45',      equipment: 'treadmill',   isFollowAlong: true },
  // 简单有氧器械
  { name: '跑步机快走',        sets: 1, reps: '15 分钟', rest: '—', type: '有氧', sec: 900,  videoId: 'tm-pro-treadmill', equipment: 'treadmill' },
  { name: '跑步机爬坡',        sets: 1, reps: '15 分钟', rest: '—', type: '有氧', sec: 900,  videoId: 'tm-lbj-treadmill',  equipment: 'treadmill' },
  { name: '椭圆仪',            sets: 1, reps: '10 分钟', rest: '—', type: '有氧', sec: 600,  videoId: 'tm-lbj-elliptical', equipment: 'elliptical' },
  { name: '爬楼机',            sets: 1, reps: '10 分钟', rest: '—', type: '有氧', sec: 600,  videoId: 'tm-lbj-climb',      equipment: 'stair-climb' },
  // 补充力量（每次最多 1 个）
  { name: '坐姿推胸',          sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-chest',    equipment: 'chest-press' },
  { name: '坐姿划船',          sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-row',       equipment: 'row' },
  { name: '高位下拉',          sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-gwl',       equipment: 'lat-pulldown' },
  { name: '坐姿腿屈伸',        sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-legext',    equipment: 'leg-extension' },
  { name: '蝴蝶机夹胸',        sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-pec',       equipment: 'pec-fly' },
  { name: '坐姿髋外展',        sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-hipabd',    equipment: 'hip-abduction' },
];

// ── 健身房·增肌：固定器械为主，每天 2-3 台 ──
const gymBuild = [
  // 跟练
  { name: 'XiaoXiao背部器械+爬坡跟练', sets:1, reps:'49 分钟', rest:'—', type:'力量', sec:2940, videoId:'st-xx-back', equipment:'mixed', isFollowAlong:true },
  // 固定器械
  { name: '高位下拉',          sets: 4, reps: '10 次',   rest: '60秒', type: '力量', sec: 75, videoId: 'st-lbj-gwl',       equipment: 'lat-pulldown' },
  { name: '坐姿推胸',          sets: 4, reps: '10 次',   rest: '60秒', type: '力量', sec: 75, videoId: 'st-lbj-chest',    equipment: 'chest-press' },
  { name: '坐姿划船',          sets: 4, reps: '10 次',   rest: '60秒', type: '力量', sec: 75, videoId: 'st-lbj-row',       equipment: 'row' },
  { name: '倒蹬机',            sets: 3, reps: '12 次',   rest: '60秒', type: '力量', sec: 80, videoId: 'st-lbj-legpress',  equipment: 'leg-press' },
  { name: '臀推机',            sets: 3, reps: '12 次',   rest: '45秒', type: '力量', sec: 70, videoId: 'st-lbj-hipthrust', equipment: 'hip-thrust' },
  { name: '蝴蝶机夹胸',        sets: 3, reps: '12 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-pec',       equipment: 'pec-fly' },
  { name: '坐姿髋外展',        sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-hipabd',    equipment: 'hip-abduction' },
  { name: '坐姿腿屈伸',        sets: 3, reps: '12 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-legext',    equipment: 'leg-extension' },
  { name: '史密斯深蹲',        sets: 3, reps: '12 次',   rest: '60秒', type: '力量', sec: 75, videoId: 'st-lbj-smith-squat',equipment:'smith' },
  // 收尾有氧
  { name: '跑步机快走',        sets: 1, reps: '8 分钟',  rest: '—',   type: '有氧', sec: 480, videoId: 'tm-pro-treadmill', equipment: 'treadmill' },
];

// ── 健身房·塑形：轻量器械 ──
const gymShape = [
  { name: '蝴蝶机夹胸',        sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-pec',       equipment: 'pec-fly' },
  { name: '坐姿划船',          sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-row',       equipment: 'row' },
  { name: '高位下拉',          sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-gwl',       equipment: 'lat-pulldown' },
  { name: '臀推机',            sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-hipthrust', equipment: 'hip-thrust' },
  { name: '坐姿髋外展',        sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-hipabd',    equipment: 'hip-abduction' },
  { name: '绳索面拉',          sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-facepull',  equipment: 'cable' },
  { name: '坐姿腿屈伸',        sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-legext',    equipment: 'leg-extension' },
  { name: '椭圆仪',            sets: 1, reps: '8 分钟',  rest: '—',   type: '有氧', sec: 480, videoId: 'tm-lbj-elliptical', equipment: 'elliptical' },
  { name: '跑步机爬坡',        sets: 1, reps: '10 分钟', rest: '—',   type: '有氧', sec: 600, videoId: 'tm-lbj-treadmill',  equipment: 'treadmill' },
];

// ── 健身房·保持健康：轻量均衡 ──
const gymHealth = [
  { name: '跑步机快走',        sets: 1, reps: '10 分钟', rest: '—',   type: '有氧', sec: 600, videoId: 'tm-pro-treadmill', equipment: 'treadmill' },
  { name: '坐姿推胸',          sets: 2, reps: '12 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-chest',    equipment: 'chest-press' },
  { name: '高位下拉',          sets: 2, reps: '12 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-gwl',       equipment: 'lat-pulldown' },
  { name: '坐姿划船',          sets: 2, reps: '12 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-row',       equipment: 'row' },
  { name: '椭圆仪',            sets: 1, reps: '8 分钟',  rest: '—',   type: '有氧', sec: 480, videoId: 'tm-lbj-elliptical', equipment: 'elliptical' },
  { name: '倒蹬机',            sets: 2, reps: '12 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-legpress',  equipment: 'leg-press' },
];

// ── 居家·减脂：跟练视频为主 ──
const homeCut = [
  { name: '30min无跳跃站立HIIT',   sets:1, reps:'30 分钟', rest:'—',type:'有氧', sec:1800, videoId:'cd-anna-hiit1',   equipment:'bodyweight', isFollowAlong:true },
  { name: '20min TABATA腹肌',      sets:1, reps:'20 分钟', rest:'—',type:'核心', sec:1200, videoId:'cr-anna-tabata1',  equipment:'bodyweight', isFollowAlong:true },
  { name: '30min全身力量无器械',   sets:1, reps:'30 分钟', rest:'—',type:'力量', sec:1800, videoId:'ub-anna-full',     equipment:'bodyweight', isFollowAlong:true },
  { name: '40min自重臀腿',         sets:1, reps:'40 分钟', rest:'—',type:'力量', sec:2400, videoId:'gl-anna-glutes1',  equipment:'bodyweight', isFollowAlong:true },
  { name: '25分钟核心+腹肌',       sets:1, reps:'25 分钟', rest:'—',type:'核心', sec:1500, videoId:'cr-anna-core1',    equipment:'bodyweight', isFollowAlong:true },
  { name: '安娜·28分钟臀腿',       sets:1, reps:'28 分钟', rest:'—',type:'力量', sec:1680, videoId:'gl-anna-glutes3',  equipment:'bodyweight', isFollowAlong:true },
];

// ── 居家·增肌：哑铃跟练为主 ──
const homeBuild = [
  { name: '30分钟上半身塑形',      sets:1, reps:'33 分钟', rest:'—',type:'力量', sec:1980, videoId:'ub-anna-upper1',  equipment:'dumbbell', isFollowAlong:true },
  { name: '35分钟哑铃手臂肩背',    sets:1, reps:'37 分钟', rest:'—',type:'力量', sec:2220, videoId:'ub-anna-upper2',  equipment:'dumbbell', isFollowAlong:true },
  { name: '40分钟哑铃上肢塑形',    sets:1, reps:'45 分钟', rest:'—',type:'力量', sec:2700, videoId:'ub-anna-upper3',  equipment:'dumbbell', isFollowAlong:true },
  { name: '30分钟全身哑铃',        sets:1, reps:'30 分钟', rest:'—',type:'力量', sec:1800, videoId:'ub-anna-full',     equipment:'dumbbell', isFollowAlong:true },
  { name: '40min自重臀腿',         sets:1, reps:'40 分钟', rest:'—',type:'力量', sec:2400, videoId:'gl-anna-glutes1',  equipment:'bodyweight', isFollowAlong:true },
  { name: '安娜·30分钟臀腿训练',   sets:1, reps:'34 分钟', rest:'—',type:'力量', sec:2040, videoId:'gl-anna-glutes2',  equipment:'bodyweight', isFollowAlong:true },
  { name: '25分钟核心+腹肌',       sets:1, reps:'25 分钟', rest:'—',type:'核心', sec:1500, videoId:'cr-anna-core1',    equipment:'bodyweight', isFollowAlong:true },
];

// ── 居家·塑形：哑铃 + 核心 ──
const homeShape = [
  { name: '20分钟哑铃手臂',        sets:1, reps:'20 分钟', rest:'—',type:'力量', sec:1200, videoId:'ub-anna-arm',     equipment:'dumbbell', isFollowAlong:true },
  { name: '25分钟站立哑铃',        sets:1, reps:'25 分钟', rest:'—',type:'力量', sec:1500, videoId:'ub-anna-stand',    equipment:'dumbbell', isFollowAlong:true },
  { name: '30分钟上半身塑形',      sets:1, reps:'33 分钟', rest:'—',type:'力量', sec:1980, videoId:'ub-anna-upper1',  equipment:'dumbbell', isFollowAlong:true },
  { name: '安娜·28分钟臀腿',       sets:1, reps:'28 分钟', rest:'—',type:'力量', sec:1680, videoId:'gl-anna-glutes3',  equipment:'bodyweight', isFollowAlong:true },
  { name: '25分钟核心+腹肌',       sets:1, reps:'25 分钟', rest:'—',type:'核心', sec:1500, videoId:'cr-anna-core1',    equipment:'bodyweight', isFollowAlong:true },
  { name: '帕梅拉·15分钟上肢+腹部',sets:1, reps:'16 分钟', rest:'—',type:'力量', sec:960,  videoId:'ub-pam-arm2',     equipment:'dumbbell', isFollowAlong:true },
];

// ── 居家·保持健康：轻量混搭 ──
const homeHealth = [
  { name: '25分钟站立哑铃',        sets:1, reps:'25 分钟', rest:'—',type:'力量', sec:1500, videoId:'ub-anna-stand',    equipment:'dumbbell', isFollowAlong:true },
  { name: '帕梅拉·10分钟上肢训练', sets:1, reps:'10 分钟', rest:'—',type:'力量', sec:600,  videoId:'ub-pam-arm3',     equipment:'bodyweight', isFollowAlong:true },
  { name: '25分钟核心+腹肌',       sets:1, reps:'25 分钟', rest:'—',type:'核心', sec:1500, videoId:'cr-anna-core1',    equipment:'bodyweight', isFollowAlong:true },
  { name: '帕梅拉·10分钟全身拉伸', sets:1, reps:'11 分钟', rest:'—',type:'拉伸', sec:660,  videoId:'st-pam-full',     equipment:'bodyweight', isFollowAlong:true },
  { name: '帕梅拉·10分钟腿部拉伸', sets:1, reps:'10 分钟', rest:'—',type:'拉伸', sec:600,  videoId:'st-pam-leg',      equipment:'bodyweight', isFollowAlong:true },
];

/* ================================================================
   三、经期动作
   ================================================================ */
/* ================================================================
   三、场景×目标 → 动作池映射
   ================================================================ */
// ── 减脂60min（3纯+1力 力量8min） ──
const gymCut60Schemes={全身:[[{name:'跑步机匀速慢跑',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day1 纯有氧 速度5.5-6.5 平稳慢跑'}],[{name:'跑步机高坡度快走',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'Day2 纯有氧 坡度8-10 速度3.8-4.2'}],[{name:'跑步机间歇变速跑',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day3 纯有氧 快跑1.5min速7+慢走1.5min速4 循环'}],[{name:'椭圆机稳态有氧',sets:1,reps:'42 分钟',type:'有氧',sec:2520,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 力量日 有氧减量'},{name:'坐姿推胸',sets:3,reps:'12 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-chest',equipment:'chest-press',note:'力量日-胸 3组12次'}]],下肢:[[{name:'跑步机高坡度快走',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'Day1 纯有氧 坡度10-12 强化臀腿'}],[{name:'跑步机间歇变速跑',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day2 纯有氧 快走段坡8 慢跑段坡0 交替'}],[{name:'跑步机匀速慢跑',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day3 纯有氧 坡度4-6 大步幅'}],[{name:'椭圆机下肢侧重',sets:1,reps:'42 分钟',type:'有氧',sec:2520,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 力量日 有氧减量'},{name:'坐姿腿屈伸',sets:3,reps:'12 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'力量日-腿 3组12次'}]],上肢:[[{name:'跑步机匀速慢跑',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day1 纯有氧 大幅摆臂 激活肩臂'}],[{name:'跑步机间歇变速跑',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day2 纯有氧 加速大力摆臂+慢走拉伸'}],[{name:'跑步机高坡度快走',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'Day3 纯有氧 双手大幅摆臂'}],[{name:'椭圆机上肢侧重',sets:1,reps:'42 分钟',type:'有氧',sec:2520,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 力量日 有氧减量'},{name:'高位下拉',sets:3,reps:'12 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'力量日-背 3组12次'}]],核心:[[{name:'跑步机核心慢跑',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day1 纯有氧 不扶扶手 全程收腹'}],[{name:'跑步机核心快走',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'Day2 纯有氧 爬坡收腹 对抗前倾'}],[{name:'跑步机间歇变速跑',sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day3 纯有氧 变速收腹 核心持续'}],[{name:'椭圆机核心联动',sets:1,reps:'42 分钟',type:'有氧',sec:2520,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 力量日 有氧减量'},{name:'坐姿划船',sets:3,reps:'12 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-row',equipment:'row',note:'力量日-背 3组12次'}]]};

// ── 减脂75min（3纯+1力 力量16min） ──
const gymCut75Schemes={全身:[[{name:'跑步机匀速慢跑',sets:1,reps:'65 分钟',type:'有氧',sec:3900,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day1 纯有氧 速度5.5-6.5 长距离65min'}],[{name:'跑步机高坡度快走',sets:1,reps:'65 分钟',type:'有氧',sec:3900,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'Day2 纯有氧 坡度8-12 持续出汗'}],[{name:'跑步机间歇变速跑',sets:1,reps:'65 分钟',type:'有氧',sec:3900,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day3 纯有氧 快跑2min速7.5+慢走1.5min 循环'}],[{name:'椭圆机稳态有氧',sets:1,reps:'49 分钟',type:'有氧',sec:2940,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 力量日 有氧减量'},{name:'坐姿推胸',sets:3,reps:'12 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-chest',equipment:'chest-press',note:'力量日-胸 3组12次'},{name:'高位下拉',sets:3,reps:'12 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'力量日-背 3组12次'}]],下肢:[[{name:'跑步机高坡度快走',sets:1,reps:'65 分钟',type:'有氧',sec:3900,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'Day1 纯有氧 坡度12 65min燃脂'}],[{name:'跑步机间歇变速跑',sets:1,reps:'65 分钟',type:'有氧',sec:3900,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day2 纯有氧 快跑段坡8 全力刺激'}],[{name:'跑步机匀速慢跑',sets:1,reps:'65 分钟',type:'有氧',sec:3900,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day3 纯有氧 坡度5 大步幅'}],[{name:'椭圆机下肢侧重',sets:1,reps:'49 分钟',type:'有氧',sec:2940,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 力量日 有氧减量'},{name:'坐姿腿屈伸',sets:3,reps:'12 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'力量日-腿 3组12次'},{name:'坐姿髋外展',sets:3,reps:'12 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'力量日-臀 3组12次'}]]};

// ── 减脂90min（3纯+1力 力量40min） ──
const gymCut90Schemes={全身:[[{name:'跑步机匀速慢跑',sets:1,reps:'80 分钟',type:'有氧',sec:4800,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day1 纯有氧 速度5.5-6.5 长距离80min'}],[{name:'跑步机高坡度快走',sets:1,reps:'80 分钟',type:'有氧',sec:4800,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'Day2 纯有氧 坡度8-12 80min耐力'}],[{name:'跑步机间歇变速跑',sets:1,reps:'80 分钟',type:'有氧',sec:4800,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day3 纯有氧 快跑2.5min速7.5+慢走1.5min'}],[{name:'椭圆机稳态有氧',sets:1,reps:'40 分钟',type:'有氧',sec:2400,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 力量日 有氧减量'},{name:'坐姿推胸',sets:4,reps:'10 次',rest:'60秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'力量-胸 4组10次'},{name:'高位下拉',sets:4,reps:'10 次',rest:'60秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'力量-背 4组10次'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'60秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'力量-腿 4组10次'}]],下肢:[[{name:'跑步机高坡度快走',sets:1,reps:'80 分钟',type:'有氧',sec:4800,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'Day1 纯有氧 坡度12 臀腿巅峰'}],[{name:'跑步机间歇变速跑',sets:1,reps:'80 分钟',type:'有氧',sec:4800,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day2 纯有氧 快跑段坡8 全力'}],[{name:'跑步机匀速慢跑',sets:1,reps:'80 分钟',type:'有氧',sec:4800,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day3 纯有氧 坡度5 大步幅'}],[{name:'椭圆机下肢侧重',sets:1,reps:'40 分钟',type:'有氧',sec:2400,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 力量日 有氧减量'},{name:'倒蹬机',sets:4,reps:'10 次',rest:'60秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'力量-腿 4组10次'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'60秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'力量-腿 4组10次'},{name:'臀推机',sets:4,reps:'10 次',rest:'60秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'力量-臀 4组10次'}]]};

// ── 减脂方案映射 + 方案分发 ──
function getGymCutScheme(min){const m={60:gymCut60Schemes,75:gymCut75Schemes,90:gymCut90Schemes};return m[min]||gymCut60Schemes;}
function getGymScheme(goal,min){if(goal==='减脂'&&min>=60)return getGymCutScheme(min);if(goal==='增肌')return makeGymBuildScheme(min);if(goal==='塑形'){if(min===15)return gymShapeSchemes;return makeGymShapeScheme(min);}return null;}
// 塑形生成器：基于15min方案 + 时长扩展
function makeGymShapeScheme(min){if(min===15)return gymShapeSchemes;if(min===30)return gymShape30Schemes;if(min===45)return gymShape45Schemes;const b=gymShape45Schemes,r={};const cardioMin=min-50;for(const k of Object.keys(b)){r[k]=b[k].map((s,i)=>{const isEven=i%2===0;const cardio=isEven?{name:'椭圆仪稳态有氧',sets:1,reps:'—',rest:'—',type:'有氧',sec:cardioMin*60,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'塑形后有氧 '+cardioMin+'min 椭圆仪 线条清晰'}:{name:'跑步机爬坡快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:cardioMin*60,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'塑形后有氧 '+cardioMin+'min 爬坡 燃脂塑形'};return[...s.map(e=>({...e})),cardio];});}return r;}

// ── 增肌15min ──
const gymBuild15Schemes = {'全身':[[{name:'坐姿推胸',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 全身-推 胸部主导 肩胛收紧'},{name:'高位下拉',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 全身-拉 背部宽度 沉肩发力'}],[{name:'坐姿划船',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-row',equipment:'row',note:'Day2 全身-拉 背中厚度 顶峰收缩'},{name:'坐姿腿屈伸',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 全身-腿 股四头肌 离心控制'}],[{name:'坐姿推胸',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day3 全身-推 上胸角度 全程控制'},{name:'哑铃侧平举',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 全身-肩 侧平举 打造好体态'}],[{name:'哑铃推肩',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-press',equipment:'dumbbell',note:'Day4 备选-肩 坐姿推肩 强化三角肌'},{name:'倒蹬机',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day4 备选-腿 宽距位 臀腿综合'}]],'下肢':[[{name:'倒蹬机',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day1 下肢-推 宽距高位 臀+腘绳'},{name:'坐姿腿屈伸',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day1 下肢-屈 股四头肌 离心3秒'}],[{name:'臀推机',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 下肢-臀 顶峰收缩2秒 慢离心'},{name:'坐姿髋外展',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day2 下肢-展 臀中肌 上臀饱满'}],[{name:'史密斯深蹲',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-smith-squat',equipment:'smith',note:'Day3 下肢-蹲 固定轨迹 股四+臀整体'},{name:'坐姿腿屈伸',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 下肢-屈 单腿交替 找弱势'}],[{name:'哈克机深蹲',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-hack',equipment:'leg-press',note:'Day4 备选-蹲 哈克机固定轨迹 更安全'},{name:'臀推机',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day4 备选-臀 轻重量高次数 泵感'}]],'上肢':[[{name:'坐姿推胸',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 上肢-推 上胸 推到近锁不锁死'},{name:'高位下拉',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 上肢-拉 宽握正手 背阔宽度'}],[{name:'坐姿划船',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-row',equipment:'row',note:'Day2 上肢-拉 窄握对握 背中厚度'},{name:'哑铃俯身飞鸟',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day2 上肢-肩 俯身飞鸟 练肩后束'}],[{name:'绳索面拉',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 上肢-拉 肩后束+外旋 改善圆肩'},{name:'哑铃侧平举',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 上肢-肩 侧平举 打造好体态'}],[{name:'高位下拉',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 反握 背阔下沿+二头'},{name:'哑铃前平举',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-front',equipment:'dumbbell',note:'Day4 备选-肩 前平举 打造好体态'}]],'核心':[[{name:'罗马椅背伸展',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-goat',equipment:'bench',note:'Day1 核心-伸 下背部+核心 慢起慢放'},{name:'坐姿划船',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-row',equipment:'row',note:'Day1 核心-拉 躯干稳定 不转体'}],[{name:'臀推机',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 核心-臀 核心绷紧 不借腰'},{name:'史密斯后蹬',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day2 核心-蹬 核心抗旋转 单腿稳定'}],[{name:'绳索面拉',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 核心-拉 站姿核心锁定 只动手臂'},{name:'坐姿腿屈伸',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 核心-腿 后背贴紧 核心维持'}],[{name:'哑铃俯身飞鸟',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day4 备选-肩 俯身飞鸟 练肩后束'},{name:'高位下拉',sets:3,reps:'10 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 核心收紧 严格动作'}]],};

// ── 增肌30min ──
const gymBuild30Schemes = {'全身':[[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 全身-推 胸部主导 肩胛收紧'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 全身-拉 背部宽度 沉肩发力'}],[{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 全身-拉 背中厚度 顶峰收缩'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 全身-腿 股四头肌 离心控制'}],[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day3 全身-推 上胸角度 全程控制'},{name:'哑铃侧平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 全身-肩 侧平举 打造好体态'}],[{name:'哑铃推肩',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-press',equipment:'dumbbell',note:'Day4 备选-肩 坐姿推肩 强化三角肌'},{name:'倒蹬机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day4 备选-腿 宽距位 臀腿综合'}]],'下肢':[[{name:'倒蹬机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day1 下肢-推 宽距高位 臀+腘绳'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day1 下肢-屈 股四头肌 离心3秒'}],[{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 下肢-臀 顶峰收缩2秒 慢离心'},{name:'坐姿髋外展',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day2 下肢-展 臀中肌 上臀饱满'}],[{name:'史密斯深蹲',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-smith-squat',equipment:'smith',note:'Day3 下肢-蹲 固定轨迹 股四+臀整体'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 下肢-屈 单腿交替 找弱势'}],[{name:'哈克机深蹲',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hack',equipment:'leg-press',note:'Day4 备选-蹲 哈克机固定轨迹 更安全'},{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day4 备选-臀 轻重量高次数 泵感'}]],'上肢':[[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 上肢-推 上胸 推到近锁不锁死'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 上肢-拉 宽握正手 背阔宽度'}],[{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 上肢-拉 窄握对握 背中厚度'},{name:'哑铃俯身飞鸟',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day2 上肢-肩 俯身飞鸟 练肩后束'}],[{name:'绳索面拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 上肢-拉 肩后束+外旋 改善圆肩'},{name:'哑铃侧平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 上肢-肩 侧平举 打造好体态'}],[{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 反握 背阔下沿+二头'},{name:'哑铃前平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-front',equipment:'dumbbell',note:'Day4 备选-肩 前平举 打造好体态'}]],'核心':[[{name:'罗马椅背伸展',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day1 核心-伸 下背部+核心 慢起慢放'},{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day1 核心-拉 躯干稳定 不转体'}],[{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 核心-臀 核心绷紧 不借腰'},{name:'史密斯后蹬',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day2 核心-蹬 核心抗旋转 单腿稳定'}],[{name:'绳索面拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 核心-拉 站姿核心锁定 只动手臂'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 核心-腿 后背贴紧 核心维持'}],[{name:'哑铃俯身飞鸟',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day4 备选-肩 俯身飞鸟 练肩后束'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 核心收紧 严格动作'}]],};

// ── 增肌45min ──
const gymBuild45Schemes = {'全身':[[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 全身-推 胸部主导 肩胛收紧'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 全身-拉 背部宽度 沉肩发力'},{name:'哑铃推肩',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-press',equipment:'dumbbell',note:'辅助-肩 三组轻量 推肩补充'}],[{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 全身-拉 背中厚度 顶峰收缩'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 全身-腿 股四头肌 离心控制'},{name:'哑铃侧平举',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-lateral',equipment:'dumbbell',note:'辅助-肩 三组轻量 侧平举'}],[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day3 全身-推 上胸角度 全程控制'},{name:'哑铃侧平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 全身-肩 侧平举 打造好体态'},{name:'哑铃前平举',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-front',equipment:'dumbbell',note:'辅助-肩 三组轻量 前平举'}],[{name:'哑铃推肩',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-press',equipment:'dumbbell',note:'Day4 备选-肩 坐姿推肩 强化三角肌'},{name:'倒蹬机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day4 备选-腿 宽距位 臀腿综合'}]],'下肢':[[{name:'倒蹬机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day1 下肢-推 宽距高位 臀+腘绳'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day1 下肢-屈 股四头肌 离心3秒'},{name:'坐姿腿屈伸',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'辅助-腿 三组轻量'}],[{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 下肢-臀 顶峰收缩2秒 慢离心'},{name:'坐姿髋外展',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day2 下肢-展 臀中肌 上臀饱满'},{name:'坐姿腿屈伸',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'辅助-腿 三组轻量'}],[{name:'史密斯深蹲',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-smith-squat',equipment:'smith',note:'Day3 下肢-蹲 固定轨迹 股四+臀整体'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 下肢-屈 单腿交替 找弱势'},{name:'坐姿腿屈伸',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'辅助-腿 三组轻量'}],[{name:'哈克机深蹲',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hack',equipment:'leg-press',note:'Day4 备选-蹲 哈克机固定轨迹 更安全'},{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day4 备选-臀 轻重量高次数 泵感'}]],'上肢':[[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 上肢-推 上胸 推到近锁不锁死'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 上肢-拉 宽握正手 背阔宽度'},{name:'哑铃推肩',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-press',equipment:'dumbbell',note:'辅助-肩 三组轻量 推肩补充'}],[{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 上肢-拉 窄握对握 背中厚度'},{name:'哑铃俯身飞鸟',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day2 上肢-肩 俯身飞鸟 练肩后束'},{name:'哑铃侧平举',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-lateral',equipment:'dumbbell',note:'辅助-肩 三组轻量 侧平举'}],[{name:'绳索面拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 上肢-拉 肩后束+外旋 改善圆肩'},{name:'哑铃侧平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 上肢-肩 侧平举 打造好体态'},{name:'哑铃前平举',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'ub-db-front',equipment:'dumbbell',note:'辅助-肩 三组轻量 前平举'}],[{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 反握 背阔下沿+二头'},{name:'哑铃前平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-front',equipment:'dumbbell',note:'Day4 备选-肩 前平举 打造好体态'}]],'核心':[[{name:'罗马椅背伸展',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day1 核心-伸 下背部+核心 慢起慢放'},{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day1 核心-拉 躯干稳定 不转体'},{name:'坐姿腿屈伸',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'辅助-腿 三组轻量'}],[{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 核心-臀 核心绷紧 不借腰'},{name:'史密斯后蹬',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day2 核心-蹬 核心抗旋转 单腿稳定'},{name:'坐姿腿屈伸',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'辅助-腿 三组轻量'}],[{name:'绳索面拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 核心-拉 站姿核心锁定 只动手臂'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 核心-腿 后背贴紧 核心维持'},{name:'坐姿腿屈伸',sets:3,reps:'12 次',rest:'60秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'辅助-腿 三组轻量'}],[{name:'哑铃俯身飞鸟',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day4 备选-肩 俯身飞鸟 练肩后束'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 核心收紧 严格动作'}]],};

// ── 增肌60min ──
const gymBuild60Schemes = {'全身':[[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 全身-推 胸部主导 肩胛收紧'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 全身-拉 背部宽度 沉肩发力'}],[{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 全身-拉 背中厚度 顶峰收缩'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 全身-腿 股四头肌 离心控制'}],[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day3 全身-推 上胸角度 全程控制'},{name:'哑铃侧平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 全身-肩 侧平举 打造好体态'}],[{name:'哑铃推肩',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-press',equipment:'dumbbell',note:'Day4 备选-肩 坐姿推肩 强化三角肌'},{name:'倒蹬机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day4 备选-腿 宽距位 臀腿综合'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],'下肢':[[{name:'倒蹬机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day1 下肢-推 宽距高位 臀+腘绳'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day1 下肢-屈 股四头肌 离心3秒'}],[{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 下肢-臀 顶峰收缩2秒 慢离心'},{name:'坐姿髋外展',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day2 下肢-展 臀中肌 上臀饱满'}],[{name:'史密斯深蹲',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-smith-squat',equipment:'smith',note:'Day3 下肢-蹲 固定轨迹 股四+臀整体'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 下肢-屈 单腿交替 找弱势'}],[{name:'哈克机深蹲',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hack',equipment:'leg-press',note:'Day4 备选-蹲 哈克机固定轨迹 更安全'},{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day4 备选-臀 轻重量高次数 泵感'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],'上肢':[[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 上肢-推 上胸 推到近锁不锁死'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 上肢-拉 宽握正手 背阔宽度'}],[{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 上肢-拉 窄握对握 背中厚度'},{name:'哑铃俯身飞鸟',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day2 上肢-肩 俯身飞鸟 练肩后束'}],[{name:'绳索面拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 上肢-拉 肩后束+外旋 改善圆肩'},{name:'哑铃侧平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 上肢-肩 侧平举 打造好体态'}],[{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 反握 背阔下沿+二头'},{name:'哑铃前平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-front',equipment:'dumbbell',note:'Day4 备选-肩 前平举 打造好体态'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],'核心':[[{name:'罗马椅背伸展',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day1 核心-伸 下背部+核心 慢起慢放'},{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day1 核心-拉 躯干稳定 不转体'}],[{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 核心-臀 核心绷紧 不借腰'},{name:'史密斯后蹬',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day2 核心-蹬 核心抗旋转 单腿稳定'}],[{name:'绳索面拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 核心-拉 站姿核心锁定 只动手臂'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 核心-腿 后背贴紧 核心维持'}],[{name:'哑铃俯身飞鸟',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day4 备选-肩 俯身飞鸟 练肩后束'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 核心收紧 严格动作'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],};

// ── 增肌75min ──
const gymBuild75Schemes = {'全身':[[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 全身-推 胸部主导 肩胛收紧'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 全身-拉 背部宽度 沉肩发力'}],[{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 全身-拉 背中厚度 顶峰收缩'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 全身-腿 股四头肌 离心控制'}],[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day3 全身-推 上胸角度 全程控制'},{name:'哑铃侧平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 全身-肩 侧平举 打造好体态'}],[{name:'哑铃推肩',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-press',equipment:'dumbbell',note:'Day4 备选-肩 坐姿推肩 强化三角肌'},{name:'倒蹬机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day4 备选-腿 宽距位 臀腿综合'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],'下肢':[[{name:'倒蹬机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day1 下肢-推 宽距高位 臀+腘绳'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day1 下肢-屈 股四头肌 离心3秒'}],[{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 下肢-臀 顶峰收缩2秒 慢离心'},{name:'坐姿髋外展',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day2 下肢-展 臀中肌 上臀饱满'}],[{name:'史密斯深蹲',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-smith-squat',equipment:'smith',note:'Day3 下肢-蹲 固定轨迹 股四+臀整体'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 下肢-屈 单腿交替 找弱势'}],[{name:'哈克机深蹲',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hack',equipment:'leg-press',note:'Day4 备选-蹲 哈克机固定轨迹 更安全'},{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day4 备选-臀 轻重量高次数 泵感'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],'上肢':[[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 上肢-推 上胸 推到近锁不锁死'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 上肢-拉 宽握正手 背阔宽度'}],[{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 上肢-拉 窄握对握 背中厚度'},{name:'哑铃俯身飞鸟',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day2 上肢-肩 俯身飞鸟 练肩后束'}],[{name:'绳索面拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 上肢-拉 肩后束+外旋 改善圆肩'},{name:'哑铃侧平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 上肢-肩 侧平举 打造好体态'}],[{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 反握 背阔下沿+二头'},{name:'哑铃前平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-front',equipment:'dumbbell',note:'Day4 备选-肩 前平举 打造好体态'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],'核心':[[{name:'罗马椅背伸展',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day1 核心-伸 下背部+核心 慢起慢放'},{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day1 核心-拉 躯干稳定 不转体'}],[{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 核心-臀 核心绷紧 不借腰'},{name:'史密斯后蹬',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day2 核心-蹬 核心抗旋转 单腿稳定'}],[{name:'绳索面拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 核心-拉 站姿核心锁定 只动手臂'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 核心-腿 后背贴紧 核心维持'}],[{name:'哑铃俯身飞鸟',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day4 备选-肩 俯身飞鸟 练肩后束'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 核心收紧 严格动作'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],};

// ── 增肌90min ──
const gymBuild90Schemes = {'全身':[[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 全身-推 胸部主导 肩胛收紧'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 全身-拉 背部宽度 沉肩发力'}],[{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 全身-拉 背中厚度 顶峰收缩'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 全身-腿 股四头肌 离心控制'}],[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day3 全身-推 上胸角度 全程控制'},{name:'哑铃侧平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 全身-肩 侧平举 打造好体态'}],[{name:'哑铃推肩',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-press',equipment:'dumbbell',note:'Day4 备选-肩 坐姿推肩 强化三角肌'},{name:'倒蹬机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day4 备选-腿 宽距位 臀腿综合'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],'下肢':[[{name:'倒蹬机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day1 下肢-推 宽距高位 臀+腘绳'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day1 下肢-屈 股四头肌 离心3秒'}],[{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 下肢-臀 顶峰收缩2秒 慢离心'},{name:'坐姿髋外展',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day2 下肢-展 臀中肌 上臀饱满'}],[{name:'史密斯深蹲',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-smith-squat',equipment:'smith',note:'Day3 下肢-蹲 固定轨迹 股四+臀整体'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 下肢-屈 单腿交替 找弱势'}],[{name:'哈克机深蹲',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hack',equipment:'leg-press',note:'Day4 备选-蹲 哈克机固定轨迹 更安全'},{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day4 备选-臀 轻重量高次数 泵感'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],'上肢':[[{name:'坐姿推胸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 上肢-推 上胸 推到近锁不锁死'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 上肢-拉 宽握正手 背阔宽度'}],[{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 上肢-拉 窄握对握 背中厚度'},{name:'哑铃俯身飞鸟',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day2 上肢-肩 俯身飞鸟 练肩后束'}],[{name:'绳索面拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 上肢-拉 肩后束+外旋 改善圆肩'},{name:'哑铃侧平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-lateral',equipment:'dumbbell',note:'Day3 上肢-肩 侧平举 打造好体态'}],[{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 反握 背阔下沿+二头'},{name:'哑铃前平举',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-front',equipment:'dumbbell',note:'Day4 备选-肩 前平举 打造好体态'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],'核心':[[{name:'罗马椅背伸展',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day1 核心-伸 下背部+核心 慢起慢放'},{name:'坐姿划船',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day1 核心-拉 躯干稳定 不转体'}],[{name:'臀推机',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day2 核心-臀 核心绷紧 不借腰'},{name:'史密斯后蹬',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day2 核心-蹬 核心抗旋转 单腿稳定'}],[{name:'绳索面拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 核心-拉 站姿核心锁定 只动手臂'},{name:'坐姿腿屈伸',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 核心-腿 后背贴紧 核心维持'}],[{name:'哑铃俯身飞鸟',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'ub-db-rear',equipment:'dumbbell',note:'Day4 备选-肩 俯身飞鸟 练肩后束'},{name:'高位下拉',sets:4,reps:'10 次',rest:'90秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 备选-拉 核心收紧 严格动作'},{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'增肌后有氧收尾 促进恢复'}]],};

function makeGymBuildScheme(min){
  const map={15:gymBuild15Schemes,30:gymBuild30Schemes,45:gymBuild45Schemes,60:gymBuild60Schemes,75:gymBuild75Schemes,90:gymBuild90Schemes};
  return map[min]||gymBuild30Schemes;
}

// ── 塑形15min（2动作×8min，4方案轮换） ──
const gymShapeSchemes = {
  '上肢':[
    [{name:'坐姿推胸',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 收紧胸线 改善溜肩 紧致肩臂外侧'},{name:'绳索面拉',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-facepull',equipment:'cable',note:'Day1 绳索侧平举 打造肩部外侧线条'}],
    [{name:'高位下拉',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day2 薄背塑形 修饰后背线条'},{name:'直臂下压',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-pushdown',equipment:'cable',note:'Day2 绳索臂屈伸 消除手臂拜拜肉'}],
    [{name:'坐姿推胸',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day3 坐姿肩推 打造直角肩'},{name:'坐姿划船',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-row',equipment:'row',note:'Day3 反握划船 紧致手臂前侧'}],
    [{name:'椭圆机上肢推拉模式',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 备选-有氧 轻阻力推拉 燃脂塑肩胸'},{name:'蝴蝶机夹胸',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-pec',equipment:'pec-fly',note:'Day4 备选-力 站姿夹胸 低冲击塑形'}],
  ],
  '下肢':[
    [{name:'臀推机',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day1 提臀塑形 改善假胯宽'},{name:'坐姿髋外展',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day1 收紧臀部两侧线条'}],
    [{name:'坐姿腿屈伸',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 紧致大腿前侧 拉长腿部线条'},{name:'倒蹬机',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day2 站姿提踵模式 拉长小腿线条'}],
    [{name:'坐姿腿屈伸',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 腿弯举模式 收紧大腿后侧'},{name:'髋内收',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-legadd',equipment:'leg-adduction',note:'Day3 改善大腿内侧松弛'}],
    [{name:'跑步机坡度快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'Day4 备选-有氧 坡度快走 燃脂不粗腿'},{name:'臀推机',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day4 备选-力 臀推塑形 温和塑腿'}],
  ],
  '核心':[
    [{name:'罗马椅背伸展',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-goat',equipment:'bench',note:'Day1 卷腹模式 收紧上腹 打造腰线'},{name:'龙门架练背',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-cable-back',equipment:'cable',note:'Day1 绳索转体收腹 消除侧腰赘肉'}],
    [{name:'史密斯后蹬',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day2 下腹抬腿模式 平坦小腹'},{name:'罗马椅背伸展',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-goat',equipment:'bench',note:'Day2 腰背伸展 改善久坐塌腰'}],
    [{name:'史密斯深蹲',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-smith-squat',equipment:'smith',note:'Day3 负重平板支撑模式 收紧腰侧'},{name:'反向蝴蝶机',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-revfly',equipment:'pec-fly',note:'Day3 侧腹拉伸 改善腰腹松弛'}],
    [{name:'椭圆机全程收腹',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 备选-有氧 低阻力收腹 动态燃脂'},{name:'罗马椅背伸展',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-goat',equipment:'bench',note:'Day4 备选-力 卷腹 核心稳定'}],
  ],
  '全身':[
    [{name:'坐姿推胸',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 上半身线条 胸部塑形'},{name:'臀推机',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day1 臀部塑形 全身均衡紧致'}],
    [{name:'高位下拉',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day2 薄背塑形 优化上半身比例'},{name:'坐姿腿屈伸',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 瘦腿塑形 优化下肢线条'}],
    [{name:'坐姿推胸',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day3 坐姿肩推 直角肩塑形'},{name:'龙门架练背',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-cable-back',equipment:'cable',note:'Day3 绳索转体收腹 细腰优化轮廓'}],
    [{name:'跑步机匀速慢跑',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day4 备选-有氧 全身燃脂 零基础友好'},{name:'辅助引体向上',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-pullup',equipment:'lat-pulldown',note:'Day4 备选-力 全身复合 综合塑形'}],
  ],
};
// ── 塑形30min（热5+2动作各10min+伸5） ──
const gymShape30Schemes = {
  '上肢':[
    [{name:'坐姿推胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 紧致胸型 消除肩臂赘肉 流畅肩颈'},{name:'绳索面拉',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day1 绳索侧平举 打造肩部外侧线条'}],
    [{name:'高位下拉',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day2 薄背塑形 修饰后背轮廓'},{name:'直臂下压',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-pushdown',equipment:'cable',note:'Day2 绳索臂屈伸 改善手臂拜拜肉'}],
    [{name:'坐姿推胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day3 坐姿肩推 打造直角肩'},{name:'坐姿划船',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day3 二头弯举模式 收紧手臂前侧'}],
    [{name:'椭圆机上肢推拉模式',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 备选-有氧 轻阻力推拉 燃脂塑肩胸'},{name:'蝴蝶机夹胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-pec',equipment:'pec-fly',note:'Day4 备选-力 绳索夹胸 零基础友好'}],
  ],
  '下肢':[
    [{name:'臀推机',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day1 上提臀部 改善假胯宽'},{name:'坐姿髋外展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day1 收紧臀侧线条'}],
    [{name:'坐姿腿屈伸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 紧致大腿前侧 拉长纤细小腿'},{name:'倒蹬机',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day2 站姿提踵模式 拉长小腿线条'}],
    [{name:'坐姿腿屈伸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day3 腿弯举模式 收紧大腿后侧'},{name:'髋内收',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-legadd',equipment:'leg-adduction',note:'Day3 改善大腿内侧松弛赘肉'}],
    [{name:'跑步机低坡度快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'Day4 备选-有氧 温和燃脂 不粗腿'},{name:'臀推机',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day4 备选-力 臀推塑形 温和塑腿'}],
  ],
  '核心':[
    [{name:'罗马椅背伸展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day1 卷腹模式 收紧上腹 清晰腰线'},{name:'龙门架练背',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-cable-back',equipment:'cable',note:'Day1 绳索转体收腹 消减侧腰赘肉'}],
    [{name:'史密斯后蹬',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day2 下腹抬腿模式 平坦小腹'},{name:'罗马椅背伸展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day2 腰背伸展 改善久坐塌腰'}],
    [{name:'史密斯深蹲',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-smith-squat',equipment:'smith',note:'Day3 负重平板支撑模式 收紧腰侧'},{name:'反向蝴蝶机',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-revfly',equipment:'pec-fly',note:'Day3 侧腹塑形 改善腰腹松弛'}],
    [{name:'椭圆机全程收腹',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 备选-有氧 低阻力收腹 动态燃脂'},{name:'罗马椅背伸展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day4 备选-力 卷腹 腰腹薄弱友好'}],
  ],
  '全身':[
    [{name:'坐姿推胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 上半身线条 胸部塑形'},{name:'臀推机',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day1 臀部塑形 全身均匀紧致'}],
    [{name:'高位下拉',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day2 薄背塑形 优化比例'},{name:'坐姿腿屈伸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 瘦腿塑形 优化下肢线条'}],
    [{name:'坐姿推胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day3 直角肩塑形 优化轮廓'},{name:'龙门架练背',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-cable-back',equipment:'cable',note:'Day3 绳索转体收腹 细腰'}],
    [{name:'跑步机匀速慢跑',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day4 备选-有氧 全身燃脂 难度最低'},{name:'辅助引体向上',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-pullup',equipment:'lat-pulldown',note:'Day4 备选-力 全身复合塑形'}],
  ],
};
// ── 塑形45min（热5+3主+1辅35min+伸5） ──
const gymShape45Schemes = {
  '上肢':[
    [{name:'坐姿推胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 主1 整体上半身紧致 改善含胸'},{name:'高位下拉',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 主2 平背塑形 基础直角肩'},{name:'坐姿推胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 主3 肩推模式 直角肩塑造'},{name:'直臂下压',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-pushdown',equipment:'cable',note:'Day1 辅助 收紧手臂后侧'}],
    [{name:'蝴蝶机夹胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-pec',equipment:'pec-fly',note:'Day2 主1 紧致胸型 消除腋下赘肉'},{name:'坐姿划船',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 主2 单臂划船 瘦手臂'},{name:'绳索面拉',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day2 主3 侧平举 改善溜肩'},{name:'坐姿划船',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-row',equipment:'row',note:'Day2 辅助 二头弯举 手臂紧致'}],
    [{name:'坐姿划船',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day3 主1 器械夹背 薄背显瘦'},{name:'坐姿推胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day3 主2 坐姿推举 肩背线条'},{name:'反向蝴蝶机',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-revfly',equipment:'pec-fly',note:'Day3 主3 俯身飞鸟 改善背厚'},{name:'直臂下压',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-pushdown',equipment:'cable',note:'Day3 辅助 小臂塑形'}],
    [{name:'椭圆机上肢推拉',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 备选 轻阻力推拉 低冲击'},{name:'高位下拉',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 主2 薄背塑形'},{name:'绳索面拉',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day4 主3 肩塑形 肩臂轻盈'},{name:'罗马椅背伸展',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-goat',equipment:'bench',note:'Day4 辅助 拉伸补时 体能友好'}],
  ],
  '下肢':[
    [{name:'臀推机',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day1 主1 翘臀 改善假胯宽'},{name:'坐姿髋外展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day1 主2 腿外展 收紧臀侧'},{name:'坐姿腿屈伸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day1 主3 紧致大腿前侧'},{name:'倒蹬机',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day1 辅助 站姿提踵 纤细小腿'}],
    [{name:'坐姿腿屈伸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 主1 腿弯举模式 大腿后侧'},{name:'髋内收',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-legadd',equipment:'leg-adduction',note:'Day2 主2 髋内收 大腿内侧'},{name:'坐姿髋外展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day2 主3 臀中肌 改善臀下垂'},{name:'罗马椅背伸展',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-goat',equipment:'bench',note:'Day2 辅助 腿部拉伸塑形'}],
    [{name:'史密斯深蹲',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-smith-squat',equipment:'smith',note:'Day3 主1 器械深蹲 腿臀优化'},{name:'史密斯后蹬',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day3 主2 后踢臀 拉长腿部'},{name:'倒蹬机',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day3 主3 小腿塑形 不粗腿'},{name:'臀推机',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day3 辅助 臀线精细雕刻'}],
    [{name:'跑步机低坡度快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'Day4 备选 温和燃脂 消水肿'},{name:'臀推机',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day4 主2 臀推塑形'},{name:'坐姿髋外展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day4 主3 腿外展 轻盈'},{name:'坐姿腿屈伸',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day4 辅助 下肢放松'}],
  ],
  '核心':[
    [{name:'罗马椅背伸展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day1 主1 卷腹 上腹平坦 收侧腰'},{name:'龙门架练背',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-cable-back',equipment:'cable',note:'Day1 主2 绳索转体 腰线'},{name:'史密斯后蹬',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day1 主3 下腹抬腿 小肚腩'},{name:'罗马椅背伸展',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-goat',equipment:'bench',note:'Day1 辅助 腰背伸展 平衡'}],
    [{name:'龙门架练背',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-cable-back',equipment:'cable',note:'Day2 主1 俄罗斯转体 收腰'},{name:'反向蝴蝶机',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-revfly',equipment:'pec-fly',note:'Day2 主2 侧腹训练 消除赘肉'},{name:'罗马椅背伸展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day2 主3 收腹定型 矫正歪腰'},{name:'史密斯后蹬',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day2 辅助 骨盆稳定'}],
    [{name:'史密斯深蹲',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-smith-squat',equipment:'smith',note:'Day3 主1 负重平板 紧致躯干'},{name:'史密斯后蹬',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-smith-kick',equipment:'smith',note:'Day3 主2 下腹紧致 改善塌腰'},{name:'罗马椅背伸展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day3 主3 腰背核心 体态挺拔'},{name:'臀推机',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day3 辅助 核心拉伸'}],
    [{name:'椭圆机全程收腹',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day4 备选 收腹踩踏 动态瘦腰'},{name:'罗马椅背伸展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-goat',equipment:'bench',note:'Day4 主2 卷腹 减腰腹脂肪'},{name:'龙门架练背',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-cable-back',equipment:'cable',note:'Day4 主3 转体收腹 温和塑形'},{name:'罗马椅背伸展',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-goat',equipment:'bench',note:'Day4 辅助 核心舒缓拉伸'}],
  ],
  '全身':[
    [{name:'坐姿推胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day1 主1 推胸 上半身紧致'},{name:'臀推机',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day1 主2 臀推 下半身塑形'},{name:'高位下拉',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day1 主3 薄背 体态协调'},{name:'罗马椅背伸展',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-goat',equipment:'bench',note:'Day1 辅助 收腹 全身均匀'}],
    [{name:'坐姿推胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day2 主1 肩推 上半身气质'},{name:'坐姿腿屈伸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-legext',equipment:'leg-extension',note:'Day2 主2 腿屈伸 腿部纤细'},{name:'坐姿划船',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-row',equipment:'row',note:'Day2 主3 背部划船 线条干净'},{name:'倒蹬机',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day2 辅助 小腿塑形'}],
    [{name:'蝴蝶机夹胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-pec',equipment:'pec-fly',note:'Day3 主1 夹胸 精致体态'},{name:'坐姿髋外展',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-hipabd',equipment:'hip-abduction',note:'Day3 主2 臀外展 轻薄显瘦'},{name:'绳索面拉',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-facepull',equipment:'cable',note:'Day3 主3 侧平举 肩部线条'},{name:'龙门架练背',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-cable-back',equipment:'cable',note:'Day3 辅助 侧腰收紧'}],
    [{name:'跑步机匀速慢跑',sets:1,reps:'—',rest:'—',type:'有氧',sec:600,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day4 备选 全身燃脂 新手适配'},{name:'坐姿推胸',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day4 主2 坐姿复合推'},{name:'高位下拉',sets:4,reps:'15-20 次',rest:'45秒',type:'力量',sec:150,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4 主3 基础拉背'},{name:'罗马椅背伸展',sets:3,reps:'15-20 次',rest:'45秒',type:'力量',sec:160,videoId:'st-lbj-goat',equipment:'bench',note:'Day4 辅助 全身拉伸补时'}],
  ],
};



// ── 健康15/30方案 + 45+生成 ──
const gymHealth15Schemes={全身:[{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day1全身-有氧 轻快走'},{name:'坐姿推胸',sets:2,reps:'12 次',rest:'45秒',type:'力量',sec:240,videoId:'st-lbj-chest',equipment:'chest-press',note:'Day2全身-力量 维持肌肉'},{name:'椭圆仪',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day3全身-有氧 关节友好'},{name:'高位下拉',sets:2,reps:'12 次',rest:'45秒',type:'力量',sec:240,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day4全身-力量 背部健康'}],下肢:[{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day1下肢-有氧 活动关节'},{name:'倒蹬机',sets:2,reps:'12 次',rest:'45秒',type:'力量',sec:240,videoId:'st-lbj-legpress',equipment:'leg-press',note:'Day2下肢-力量 腿部力量'},{name:'椭圆仪',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day3下肢-有氧 蹬踏'},{name:'臀推机',sets:2,reps:'12 次',rest:'45秒',type:'力量',sec:240,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day4下肢-力量 臀部激活'}],上肢:[{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day1上肢-有氧 摆臂走'},{name:'高位下拉',sets:2,reps:'12 次',rest:'45秒',type:'力量',sec:240,videoId:'st-lbj-gwl',equipment:'lat-pulldown',note:'Day2上肢-力量 背+肩'},{name:'椭圆仪',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day3上肢-有氧 推拉把手'},{name:'坐姿划船',sets:2,reps:'12 次',rest:'45秒',type:'力量',sec:240,videoId:'st-lbj-row',equipment:'row',note:'Day4上肢-力量 背部健康'}],核心:[{name:'跑步机快走',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'Day1核心-有氧 收腹走'},{name:'坐姿划船',sets:2,reps:'12 次',rest:'45秒',type:'力量',sec:240,videoId:'st-lbj-row',equipment:'row',note:'Day2核心-力量 核心稳定'},{name:'椭圆仪',sets:1,reps:'—',rest:'—',type:'有氧',sec:480,videoId:'tm-lbj-elliptical',equipment:'elliptical',note:'Day3核心-有氧 手脚协调'},{name:'臀推机',sets:2,reps:'12 次',rest:'45秒',type:'力量',sec:240,videoId:'st-lbj-hipthrust',equipment:'hip-thrust',note:'Day4核心-力量 核心绷紧'}]};

function makeGymHealthScheme(min){if(min<=30)return min===15?gymHealth15Schemes:null;const b=gymHealth15Schemes,r={};const cm=Math.round(min*0.5);for(const k of Object.keys(b)){r[k]=b[k].map(e=>e.type==='有氧'?{...e,reps:cm+' 分钟',sec:cm*60}:{...e,sets:3,sec:160})}return r}

// ── 居家跟练池扩充（直接push到对应池） ──
{const _add=(arr,ex)=>{if(!arr.find(x=>x.videoId===ex.videoId))arr.push(ex);};
_add(homeCut,{name:'帕梅拉·15分钟跳跃有氧',sets:1,reps:'15 分钟',rest:'—',type:'有氧',sec:900,videoId:'cd-pam-jump',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'帕梅拉·10分钟暴汗有氧',sets:1,reps:'11 分钟',rest:'—',type:'有氧',sec:660,videoId:'cd-pam-hiit',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'帕梅拉·12分钟趣味有氧',sets:1,reps:'12 分钟',rest:'—',type:'有氧',sec:720,videoId:'cd-pam-fun',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'帕梅拉·新手全身燃脂',sets:1,reps:'26 分钟',rest:'—',type:'有氧',sec:1560,videoId:'cd-pam-day2',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'安娜15分钟快速爆汗HIIT',sets:1,reps:'15 分钟',rest:'—',type:'有氧',sec:900,videoId:'cd-anna-hiit2',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'安娜15分钟低强度无跳跃',sets:1,reps:'15 分钟',rest:'—',type:'有氧',sec:900,videoId:'cd-anna-hiit3',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'安娜20分钟无跳跃训练',sets:1,reps:'20 分钟',rest:'—',type:'有氧',sec:1200,videoId:'cd-anna-hiit4',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'安娜20分钟杀手级全身HIIT',sets:1,reps:'20 分钟',rest:'—',type:'有氧',sec:1200,videoId:'cd-anna-hiit5',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'安娜20分钟低冲击全身训练',sets:1,reps:'20 分钟',rest:'—',type:'有氧',sec:1200,videoId:'cd-anna-hiit6',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'安娜30分钟高强度全身HIIT',sets:1,reps:'30 分钟',rest:'—',type:'有氧',sec:1800,videoId:'cd-anna-hiit7',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'安娜35分钟居家有氧燃脂',sets:1,reps:'35 分钟',rest:'—',type:'有氧',sec:2100,videoId:'cd-anna-hiit8',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'安娜40分钟无跳跃全身有氧',sets:1,reps:'40 分钟',rest:'—',type:'有氧',sec:2400,videoId:'cd-anna-hiit9',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'安娜40分钟无跳跃HIIT+核心',sets:1,reps:'40 分钟',rest:'—',type:'有氧',sec:2400,videoId:'cd-anna-hiit10',equipment:'bodyweight',isFollowAlong:true});
_add(homeCut,{name:'安娜50min全站立HIIT',sets:1,reps:'50 分钟',rest:'—',type:'有氧',sec:3000,videoId:'cd-anna-hiit11',equipment:'bodyweight',isFollowAlong:true});}

// ── 居家·减脂 15分钟 三视频循环 ──
const homeCut15Cycle = [
  { name:'安娜15分钟快速爆汗HIIT', sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'cd-anna-hiit2',equipment:'bodyweight', note:'Day1 高强度爆汗HIIT 全程站立' },
  { name:'安娜15分钟低强度无跳跃', sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'cd-anna-hiit3',equipment:'bodyweight', note:'Day2 低强度 无跳跃无深蹲 膝盖友好' },
  { name:'帕梅拉·15分钟跳跃有氧', sets:1,reps:'15 分钟',type:'有氧',sec:900,videoId:'cd-pam-jump',   equipment:'bodyweight', note:'Day3 帕梅拉跳跃有氧 燃脂暴汗' },
];

// ── 居家·减脂 30分钟 三视频循环（20min跟练+5热身+5拉伸=30min） ──
const homeCut30Cycle = [
  { name:'安娜20分钟无跳跃训练',      sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'cd-anna-hiit4',equipment:'bodyweight', note:'Day1 新手友好 无跳跃 全程站立' },
  { name:'安娜20分钟杀手级全身HIIT',  sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'cd-anna-hiit5',equipment:'bodyweight', note:'Day2 杀手级HIIT 燃脂暴汗 全力输出' },
  { name:'安娜20分钟低冲击全身训练',  sets:1,reps:'20 分钟',type:'有氧',sec:1200,videoId:'cd-anna-hiit6',equipment:'bodyweight', note:'Day3 低冲击 膝盖友好 无深蹲无跳跃' },
];

// ── 居家·减脂 45分钟 三视频循环（35min跟练+5热身+5拉伸） ──
const homeCut45Cycle = [
  { name:'安娜30分钟高强度全身HIIT', sets:1,reps:'30 分钟',type:'有氧',sec:1800,videoId:'cd-anna-hiit7',equipment:'bodyweight', note:'Day1 高强度HIIT 全身燃脂塑形 适合小基数' },
  { name:'安娜35分钟居家有氧燃脂',   sets:1,reps:'35 分钟',type:'有氧',sec:2100,videoId:'cd-anna-hiit8',equipment:'bodyweight', note:'Day2 燃脂暴汗 练出小蛮腰' },
  { name:'安娜30分钟无跳跃HIIT',     sets:1,reps:'30 分钟',type:'有氧',sec:1800,videoId:'cd-anna-hiit', equipment:'bodyweight', note:'Day3 无跳跃HIIT 全身燃脂' },
];

// ── 居家·减脂 60分钟 三视频循环（50min跟练+5热身+5拉伸） ──
const homeCut60Cycle = [
  { name:'安娜40分钟无跳跃全身有氧',  sets:1,reps:'40 分钟',type:'有氧',sec:2400,videoId:'cd-anna-hiit9', equipment:'bodyweight', note:'Day1 无跳跃 低冲击 膝盖友好' },
  { name:'安娜40分钟无跳跃HIIT+核心', sets:1,reps:'40 分钟',type:'有氧',sec:2400,videoId:'cd-anna-hiit10',equipment:'bodyweight', note:'Day2 无跳跃HIIT 核心强化训练' },
  { name:'安娜50min全站立HIIT训练',   sets:1,reps:'50 分钟',type:'有氧',sec:3000,videoId:'cd-anna-hiit11',equipment:'bodyweight', note:'Day3 脂肪杀手 全站立 快速燃脂' },
];

// ── 居家增肌方案（热身自动延长补时长） ──
const homeBuildSchemes = {
  15:{
    '上肢':[
      [{name:'帕梅拉·10分钟上肢训练',sets:1,reps:'10 分钟',rest:'—',type:'力量',sec:600,videoId:'ub-pam-arm3',equipment:'bodyweight',isFollowAlong:true,note:'方案A 上肢塑形 无器械'}],
      [{name:'帕梅拉·15分钟完美天鹅臂',sets:1,reps:'16 分钟',rest:'—',type:'力量',sec:960,videoId:'ub-pam-arm1',equipment:'bodyweight',isFollowAlong:true,note:'方案B 天鹅臂 优美手臂'}],
    ],
    '下肢':[
      [{name:'安娜15分钟臀部塑型训练',sets:1,reps:'15 分钟',rest:'—',type:'力量',sec:900,videoId:'gl-anna-glutes4',equipment:'bodyweight',isFollowAlong:true,note:'方案A 臀部塑型'}],
      [{name:'帕梅拉·10分钟蜜桃翘臀',sets:1,reps:'10 分钟',rest:'—',type:'力量',sec:600,videoId:'gl-pam-hip4',equipment:'bodyweight',isFollowAlong:true,note:'方案B 蜜桃臀'}],
    ],
    '核心':[
      [{name:'帕梅拉·10分钟马甲线训练',sets:1,reps:'10 分钟',rest:'—',type:'核心',sec:600,videoId:'cr-pam-abs1',equipment:'bodyweight',isFollowAlong:true,note:'方案A 马甲线'}],
      [{name:'帕梅拉·10分钟下腹部训练',sets:1,reps:'10 分钟',rest:'—',type:'核心',sec:600,videoId:'cr-pam-abs2',equipment:'bodyweight',isFollowAlong:true,note:'方案B 下腹部'}],
    ],
    '全身':[
      [{name:'帕梅拉·15分钟上肢+腹部',sets:1,reps:'16 分钟',rest:'—',type:'力量',sec:960,videoId:'ub-pam-arm2',equipment:'bodyweight',isFollowAlong:true,note:'方案A 上肢+腹部'}],
      [{name:'安娜15分钟低强度无跳跃',sets:1,reps:'15 分钟',rest:'—',type:'有氧',sec:900,videoId:'cd-anna-hiit3',equipment:'bodyweight',isFollowAlong:true,note:'方案B 低强度全身'}],
    ],
  },
  30:{
    '上肢':[
      [{name:'安娜·20分钟哑铃手臂',sets:1,reps:'20 分钟',rest:'—',type:'方案A 哑铃手臂',sec:1200,videoId:'ub-anna-arm',equipment:'dumbbell',isFollowAlong:true,note:''}],
      [{name:'帕梅拉·直背圆肩改善训练',sets:1,reps:'20 分钟',rest:'—',type:'力量',sec:1200,videoId:'ub-pam-back',equipment:'bodyweight',isFollowAlong:true,note:'方案B 直背圆肩'}],
    ],
    '下肢':[
      [{name:'安娜20分钟翘臀训练 无器械',sets:1,reps:'20 分钟',rest:'—',type:'力量',sec:1200,videoId:'gl-anna-glutes5',equipment:'bodyweight',isFollowAlong:true,note:'方案A 翘臀'}],
      [{name:'安娜20分钟腿部塑形训练',sets:1,reps:'20 分钟',rest:'—',type:'力量',sec:1200,videoId:'gl-anna-glutes6',equipment:'bodyweight',isFollowAlong:true,note:'方案B 腿部塑形'}],
    ],
    '核心':[
      [{name:'安娜20分钟TABATA腹肌',sets:1,reps:'20 分钟',rest:'—',type:'核心',sec:1200,videoId:'cr-anna-tabata',equipment:'bodyweight',isFollowAlong:true,note:'方案A TABATA'}],
      [{name:'安娜·25分钟核心+腹肌',sets:1,reps:'25 分钟',rest:'—',type:'核心',sec:1500,videoId:'cr-anna-core1',equipment:'bodyweight',isFollowAlong:true,note:'方案B 核心腹肌'}],
    ],
    '全身':[
      [{name:'安娜·25分钟站立哑铃',sets:1,reps:'25 分钟',rest:'—',type:'方案A 站立哑铃',sec:1500,videoId:'ub-anna-stand',equipment:'dumbbell',isFollowAlong:true,note:''}],
      [{name:'安娜·20分钟哑铃手臂',sets:1,reps:'20 分钟',rest:'—',type:'方案B 哑铃上肢',sec:1200,videoId:'ub-anna-arm',equipment:'dumbbell',isFollowAlong:true,note:''}],
    ],
  },
  45:{
    '上肢':[
      [{name:'安娜·30分钟上半身塑形',sets:1,reps:'33 分钟',rest:'—',type:'方案A 上半身塑形',sec:1980,videoId:'ub-anna-upper1',equipment:'dumbbell',isFollowAlong:true,note:''}],
      [{name:'安娜·35分钟哑铃手臂肩背',sets:1,reps:'37 分钟',rest:'—',type:'方案B 手臂肩背',sec:2220,videoId:'ub-anna-upper2',equipment:'dumbbell',isFollowAlong:true,note:''}],
    ],
    '下肢':[
      [{name:'安娜30分钟腿臀训练 无器械',sets:1,reps:'30 分钟',rest:'—',type:'力量',sec:1800,videoId:'gl-anna-glutes7',equipment:'bodyweight',isFollowAlong:true,note:'方案A 腿臀无器械'}],
      [{name:'安娜30分钟腿臀训练 配哑铃',sets:1,reps:'30 分钟',rest:'—',type:'方案B 腿臀哑铃',sec:1800,videoId:'gl-anna-glutes8',equipment:'dumbbell',isFollowAlong:true,note:''}],
    ],
    '核心':[
      [{name:'安娜·25分钟核心+腹肌',sets:1,reps:'25 分钟',rest:'—',type:'核心',sec:1500,videoId:'cr-anna-core1',equipment:'bodyweight',isFollowAlong:true,note:'方案A 核心腹肌'}],
      [{name:'安娜20分钟TABATA腹肌',sets:1,reps:'20 分钟',rest:'—',type:'核心',sec:1200,videoId:'cr-anna-tabata',equipment:'bodyweight',isFollowAlong:true,note:'方案B TABATA'}],
    ],
    '全身':[
      [{name:'安娜·30分钟全身哑铃',sets:1,reps:'30 分钟',rest:'—',type:'方案A 全身哑铃',sec:1800,videoId:'ub-anna-full',equipment:'dumbbell',isFollowAlong:true,note:''}],
      [{name:'安娜·30分钟上半身塑形',sets:1,reps:'33 分钟',rest:'—',type:'方案B 上半身',sec:1980,videoId:'ub-anna-upper1',equipment:'dumbbell',isFollowAlong:true,note:''}],
    ],
  },
  60:{
    '上肢':[
      [{name:'安娜·40分钟哑铃上肢塑形',sets:1,reps:'45 分钟',rest:'—',type:'方案A 哑铃上肢',sec:2700,videoId:'ub-anna-upper3',equipment:'dumbbell',isFollowAlong:true,note:''}],
      [{name:'安娜·35分钟哑铃手臂肩背',sets:1,reps:'37 分钟',rest:'—',type:'方案B 手臂肩背',sec:2220,videoId:'ub-anna-upper2',equipment:'dumbbell',isFollowAlong:true,note:''}],
    ],
    '下肢':[
      [{name:'安娜40分钟腿臀训练 无器械',sets:1,reps:'40 分钟',rest:'—',type:'力量',sec:2400,videoId:'gl-anna-glutes9',equipment:'bodyweight',isFollowAlong:true,note:'方案A 腿臀'}],
      [{name:'帕梅拉40min无站立臀腿合集',sets:1,reps:'40 分钟',rest:'—',type:'力量',sec:2400,videoId:'gl-pam-hip8',equipment:'bodyweight',isFollowAlong:true,note:'方案B 无站立臀腿'}],
    ],
    '核心':[
      [{name:'安娜·40分钟腿部+腹部塑形',sets:1,reps:'59 分钟',rest:'—',type:'核心',sec:3540,videoId:'cr-anna-core2',equipment:'bodyweight',isFollowAlong:true,note:'方案A 腿腹综合'}],
      [{name:'安娜·25分钟核心+腹肌',sets:1,reps:'25 分钟',rest:'—',type:'核心',sec:1500,videoId:'cr-anna-core1',equipment:'bodyweight',isFollowAlong:true,note:'方案B 核心腹肌'}],
    ],
    '全身':[
      [{name:'安娜·40分钟哑铃上肢塑形',sets:1,reps:'45 分钟',rest:'—',type:'方案A 哑铃上肢',sec:2700,videoId:'ub-anna-upper3',equipment:'dumbbell',isFollowAlong:true,note:''}],
      [{name:'安娜40分钟腿臀训练 无器械',sets:1,reps:'40 分钟',rest:'—',type:'力量',sec:2400,videoId:'gl-anna-glutes9',equipment:'bodyweight',isFollowAlong:true,note:'方案B 腿臀主导'}],
    ],
  },
};

const poolMap = {
  home: { '减脂': homeCut, '增肌': homeBuild, '塑形': homeShape },
  gym:  { '减脂': gymCut,  '增肌': gymBuild,  '塑形': gymShape },
};

/* ================================================================
   四、主生成函数
   ================================================================ */
export function generatePlan(profile) {
  const {
    goal = '减脂', bodyParts, durationDays, dailyMinutes,
    hasMenstrual, periodDate, scene, weight, targetWeight,
  } = profile;

  const isGym = scene === 'gym';
  const pool = (poolMap[isGym ? 'gym' : 'home']?.[goal]) || homeCut;

  // 减重强度倍率
  const isCut = goal === '减脂';
  const cw = parseFloat(weight) || 0, tw = parseFloat(targetWeight) || 0;
  const cutMul = (isCut && cw > 0 && tw > 0 && tw < cw) ? Math.min(1.2, 1 + ((cw - tw) / cw) * 1.5) : 1;

  // 经期：用周期日计算（0-5为经期日，28天周期）
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const periodStart = periodDate ? new Date(periodDate + 'T00:00:00') : null;

  const totalDays = durationDays || 30;
  const schedule = [];

  for (let day = 1; day <= totalDays; day++) {
    let isPd = false;
    let pdDay = 0;
    if (periodStart && !isNaN(periodStart.getTime())) {
      const planDate = new Date(today); planDate.setDate(today.getDate() + day - 1);
      const diffDays = Math.floor((planDate - periodStart) / 86400000);
      const cycleDay = ((diffDays % 28) + 28) % 28;
      if (cycleDay >= 0 && cycleDay < 6) {
        isPd = true;
        pdDay = cycleDay + 1;
      }
    }

    let dayEx;

    if (isPd && pdDay <= 2) {
      dayEx = [{ name:'安娜15分钟放松拉伸', sets:1,reps:'15 分钟',type:'拉伸',sec:900,videoId:'cd-anna',equipment:'bodyweight' }];
    } else if (isPd && pdDay <= 4) {
      const pdSec = dailyMinutes * 60, pdMin = dailyMinutes;
      dayEx = isGym
        ? [{ name:'跑步机慢走放松', sets:1,reps:`${pdMin} 分钟`,type:'有氧',sec:pdSec,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'经期恢复 坡度0-2 速度3-4 慢走放松' }]
        : [{ name:'户外轻松散步', sets:1,reps:'30 分钟',type:'有氧',sec:1800,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'经期恢复 户外轻松散步 30分钟即可' }];
    } else if (isPd && pdDay <= 6) {
      const pdSec = dailyMinutes * 60, pdMin = dailyMinutes;
      dayEx = isGym
        ? [{ name:'跑步机快走恢复', sets:1,reps:`${pdMin} 分钟`,type:'有氧',sec:pdSec,videoId:'tm-lbj-treadmill',equipment:'treadmill',note:'经期恢复 坡度2-5 速度4.5-5.5 快走恢复活力' }]
        : [{ name:'户外轻松散步', sets:1,reps:'30 分钟',type:'有氧',sec:1800,videoId:'tm-pro-treadmill',equipment:'treadmill',note:'经期恢复 户外轻松散步 30分钟即可' }];
    } else if (isGym && goal === '减脂' && dailyMinutes <= 45) {
      const map = { 15: gymCut15Schemes, 30: gymCut30Schemes, 45: gymCut45Schemes };
      const schemes = map[dailyMinutes] || gymCut30Schemes;
      const bp = (bodyParts && bodyParts.length > 0) ? bodyParts[0] : '全身';
      const flat = schemes[bp] || schemes['全身'];
      dayEx = [{ ...flat[(day - 1) % 4] }];
    } else if (isGym) {
      const bp = (bodyParts && bodyParts.length > 0) ? bodyParts[0] : '全身';
      const schemes = getGymScheme(goal, dailyMinutes);
      if (schemes) {
        const flat = schemes[bp] || schemes['全身'];
        dayEx = Array.isArray(flat[0]) ? flat[(day - 1) % 4].map(e => ({ ...e }))
          : flat.slice(((day - 1) % 4) * Math.round(flat.length / 4), ((day - 1) % 4 + 1) * Math.round(flat.length / 4)).map(e => ({ ...e }));
      } else {
        const availSec = dailyMinutes * 60 - 600;
        dayEx = fillTime(pool, availSec, goal, day, isGym);
      }
    } else if (!isGym && goal === '减脂' && dailyMinutes <= 60) {
      // 居家减脂 15/30/45/60：三视频循环
      const cycleMap = { 15: homeCut15Cycle, 30: homeCut30Cycle, 45: homeCut45Cycle, 60: homeCut60Cycle };
      dayEx = [{ ...cycleMap[dailyMinutes][(day - 1) % 3] }];
    } else if (!isGym && goal === '增肌' && homeBuildSchemes[dailyMinutes]) {
      // 居家增肌：2套轮换方案（按身体部位+天自动轮换）
      const bp = (bodyParts && bodyParts.length > 0) ? bodyParts[0] : '全身';
      const bpSchemes = homeBuildSchemes[dailyMinutes][bp] || homeBuildSchemes[dailyMinutes]['全身'];
      const scheme = bpSchemes[(day - 1) % bpSchemes.length];
      dayEx = scheme.map(e => ({ ...e }));
    } else {
      const availSec = dailyMinutes * 60 - (dailyMinutes === 15 ? 0 : 600);
      dayEx = fillTime(pool, availSec, goal, day, isGym);
    }

    // 减重倍率
    if (cutMul > 1 && !isPd) {
      dayEx = dayEx.map((e) => {
        if (e.type === '热身' || e.type === '拉伸') return e;
        return { ...e, sets: Math.max(1, Math.round((e.sets || 1) * cutMul)) };
      });
    }

    // 热身：居家非15min时自动延长热身补足总时长
    let warmupSec = 300;
    if (!isGym && (goal === '减脂' || goal === '增肌') && dailyMinutes > 15) {
      const totalExSec = dayEx.reduce((a, e) => a + e.sec * (e.sets || 1), 0);
      warmupSec = Math.max(300, dailyMinutes * 60 - totalExSec - 300);
    }
    const warmupVideo = warmupSec <= 300 ? 'wu-anna' : warmupSec <= 600 ? 'wu-anna2' : 'cd-anna';
    const warmupEx = { name: '训练前热身', sets: 1, reps: `${Math.round(warmupSec / 60)} 分钟`, rest: '—', type: '热身', sec: warmupSec, videoId: warmupVideo, equipment: 'bodyweight' };
    const stretchEx = { name: '训练后放松拉伸', sets: 1, reps: '5 分钟', rest: '—', type: '拉伸', sec: 300, videoId: 'cd-teagan', equipment: 'bodyweight' };
    // 15min方案+经期天不加额外热身拉伸
    const skipWrap = isPd || dailyMinutes === 15;
    const full = skipWrap ? dayEx : [warmupEx, ...dayEx, stretchEx];

    const totalMin = Math.round(full.reduce((a, e) => a + e.sec * (e.sets || 1), 0) / 60);

    let typeLabel;
    if (isPd && pdDay <= 2) typeLabel = '经期拉伸';
    else if (isPd && pdDay <= 4) typeLabel = isGym ? '经期慢走' : '经期散步';
    else if (isPd && pdDay <= 6) typeLabel = isGym ? '经期快走' : '经期散步';
    else if (goal === '减脂') {
      const hasStrength = dayEx.some(e => e.type === '力量');
      typeLabel = hasStrength ? '燃脂+力量' : '燃脂日';
    }
    else if (goal === '增肌') {
      const hasCardio = dayEx.some(e => e.type === '有氧');
      typeLabel = hasCardio ? '综合日' : '力量日';
    }
    else if (goal === '塑形') {
      const hasCardio = dayEx.some(e => e.type === '有氧');
      typeLabel = hasCardio ? '综合日' : '塑形日';
    }
    else typeLabel = '训练日';

    schedule.push({
      day, exercises: full,
      note: isPd && pdDay <= 2 ? '经期前2天 — 15分钟拉伸放松'
        : isPd && pdDay <= 4 ? (isGym ? '经期第3-4天 — 跑步机慢走恢复' : '经期第3-4天 — 户外散步30分钟')
        : isPd && pdDay <= 6 ? (isGym ? '经期第5-6天 — 跑步机快走恢复' : '经期第5-6天 — 户外散步30分钟')
        : (goal === '减脂' && dayEx.some(e => e.type === '力量')) ? '有氧燃脂 + 力量塑形日' : '',
      estimatedMinutes: totalMin, type: typeLabel, isPeriodDay: isPd,
    });
  }

  let wlEst = '';
  if (isCut && cw > 0 && tw > 0 && tw < cw) {
    wlEst = `当前 ${cw} kg → 目标 ${tw} kg，需减 ${(cw - tw).toFixed(1)} kg，预计约 ${Math.ceil((cw - tw) / 0.4)} 周达成`;
  }

  return { profile, schedule, totalDays, generatedAt: Date.now(), periodStartDate: periodDate || null, weightLossEstimate: wlEst, scene: scene || 'home' };
}

/* ================================================================
   五、简化时间填充算法（v4 核心改动）
   ================================================================ */

/** 每类目标的主体动作上限 */
const MAX_EXERCISES = {
  '减脂': 2,
  '增肌': 3,
  '塑形': 2,
};

function fillTime(pool, targetSec, goal, day, isGym) {
  const maxN = MAX_EXERCISES[goal] || 2;

  // ── Step 1: 优先匹配跟练视频 ──
  const followAlongs = pool.filter((e) => e.isFollowAlong);
  if (followAlongs.length > 0) {
    // 按时长匹配度排序（最接近 targetSec 的排最前）
    const sorted = [...followAlongs].sort((a, b) =>
      Math.abs(a.sec - targetSec) - Math.abs(b.sec - targetSec)
    );
    const bestFA = sorted[0];
    const ratio = bestFA.sec / targetSec;
    if (ratio >= 0.6 && ratio <= 1.4) {
      const remaining = targetSec - bestFA.sec;
      if (remaining <= 300) return [{ ...bestFA }];
      const supplement = pickOneSimple(pool, remaining, [bestFA.equipment], day);
      return supplement ? [{ ...bestFA }, supplement] : [{ ...bestFA }];
    }
    if (followAlongs.length >= 2 && targetSec > 1800) {
      let bestPair = null, bestDiff = Infinity;
      for (let i = 0; i < sorted.length && i < 6; i++) {
        for (let j = i + 1; j < sorted.length && j < 7; j++) {
          const c = sorted[i].sec + sorted[j].sec;
          const d = Math.abs(c - targetSec);
          if (d < bestDiff && c / targetSec >= 0.7 && c / targetSec <= 1.3) { bestDiff = d; bestPair = [{ ...sorted[i] }, { ...sorted[j] }]; }
        }
      }
      if (bestPair) return bestPair;
    }
  }

  // ── Step 2: 无匹配跟练 → 按器械分组，优先简单器械 ──
  const groups = groupByEquipment(pool);
  // 按器械简易度排序
  const sortedGroups = Object.entries(groups).sort(([eqA], [eqB]) =>
    (SIMPLICITY[eqA] ?? 5) - (SIMPLICITY[eqB] ?? 5)
  );

  // 尝试找到能填满大部分时间的单个器械组
  for (const [equip, items] of sortedGroups) {
    const picks = fillFromGroup(items, targetSec, maxN, day);
    const used = picks.reduce((a, e) => a + e.sec * (e.sets || 1), 0);
    // 填满 ≥ 60% 目标时间 → 可用
    if (used >= targetSec * 0.5 && picks.length > 0) {
      // 如果还不够且还有名额，从另一个简单器械补 1 个
      if (used < targetSec * 0.85 && picks.length < maxN) {
        const extra = pickOneSimple(pool, targetSec - used, [equip], day + picks.length);
        if (extra) picks.push(extra);
      }
      return picks;
    }
  }

  // ── Step 3: 回退 — 跨器械组合但限制数量 ──
  // 从最简单器械开始取，最多 maxN 个，最多跨 2 种器械
  const allSorted = [...pool].sort((a, b) =>
    (SIMPLICITY[a.equipment] ?? 5) - (SIMPLICITY[b.equipment] ?? 5)
  );
  return fillFromGroup(allSorted, targetSec, maxN, day);
}

/** 按器械分组 */
function groupByEquipment(pool) {
  const groups = {};
  for (const ex of pool) {
    const eq = ex.equipment || 'other';
    if (!groups[eq]) groups[eq] = [];
    groups[eq].push(ex);
  }
  return groups;
}

/** 从指定列表中按时间贪心选取，带数量上限和偏移轮换 */
function fillFromGroup(list, targetSec, maxCount, offset) {
  if (!list.length) return [];
  const sel = [];
  let total = 0;
  const start = offset % list.length;
  for (let i = 0; i < list.length && sel.length < maxCount && total < targetSec * 1.1; i++) {
    const idx = (start + i) % list.length;
    const ex = list[idx];
    const cost = ex.sec * (ex.sets || 1);
    // 允许略微超出（110%）
    if (total + cost <= targetSec * 1.15) {
      sel.push({ ...ex });
      total += cost;
    }
  }
  return sel;
}

/** 从池中选 1 个简单补充动作（排除指定器械、尽量匹配剩余时间） */
function pickOneSimple(pool, remainingSec, excludeEquip, offset) {
  const candidates = pool
    .filter((e) => !excludeEquip.includes(e.equipment))
    .filter((e) => e.sec <= remainingSec * 1.2) // 允许稍超
    .sort((a, b) => {
      // 优先：简易度 > 时间匹配度
      const simA = SIMPLICITY[a.equipment] ?? 5;
      const simB = SIMPLICITY[b.equipment] ?? 5;
      if (simA !== simB) return simA - simB;
      return Math.abs(a.sec - remainingSec) - Math.abs(b.sec - remainingSec);
    });

  if (candidates.length === 0) return null;
  // 取最佳匹配，用 offset 轮换
  const idx = offset % candidates.length;
  return { ...candidates[idx] };
}

/* ================================================================
   六、导出选项（Onboarding 依赖，不变）
   ================================================================ */
export const goalOptions = [
  { value: '减脂', label: '🔥  减脂' }, { value: '增肌', label: '💪  增肌' },
  { value: '塑形', label: '✨  塑形' },
];
export const bodyPartOptions = [
  { value: '上肢', label: '上肢' }, { value: '下肢', label: '下肢' },
  { value: '核心', label: '核心' }, { value: '全身', label: '全身' },
];
export const sceneOptions = [
  { value: 'home', label: '🏠 居家训练' }, { value: 'gym', label: '🏋️ 健身房训练' },
];
