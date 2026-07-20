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
const periodLight = [
  { name: '安娜5分钟快速拉伸',    sets:1, reps:'5 分钟',  rest:'—',type:'拉伸', sec:300,  videoId:'wu-anna',     equipment:'bodyweight' },
  { name: '安娜10分钟拉伸练习',   sets:1, reps:'10 分钟', rest:'—',type:'拉伸', sec:600,  videoId:'wu-anna2',    equipment:'bodyweight' },
  { name: '帕梅拉·10分钟腿部拉伸',sets:1, reps:'10 分钟', rest:'—',type:'拉伸', sec:600,  videoId:'st-pam-leg',  equipment:'bodyweight' },
  { name: '帕梅拉·10分钟全身拉伸',sets:1, reps:'11 分钟', rest:'—',type:'拉伸', sec:660,  videoId:'st-pam-full', equipment:'bodyweight' },
  { name: '安娜15分钟放松拉伸',   sets:1, reps:'15 分钟', rest:'—',type:'拉伸', sec:900,  videoId:'cd-anna',     equipment:'bodyweight' },
];

const periodRecovery = [
  { name: '安娜5分钟快速拉伸',    sets:1, reps:'5 分钟',  rest:'—',type:'拉伸', sec:300,  videoId:'wu-anna',     equipment:'bodyweight' },
  { name: '帕梅拉·10分钟上肢训练',sets:1, reps:'10 分钟', rest:'—',type:'力量', sec:600,  videoId:'ub-pam-arm3', equipment:'bodyweight' },
  { name: '帕梅拉·10分钟全身拉伸',sets:1, reps:'11 分钟', rest:'—',type:'拉伸', sec:660,  videoId:'st-pam-full', equipment:'bodyweight' },
];

/* ================================================================
   四、场景×目标 → 动作池映射
   ================================================================ */
const poolMap = {
  home: { '减脂': homeCut, '增肌': homeBuild, '塑形': homeShape, '保持健康': homeHealth },
  gym:  { '减脂': gymCut,  '增肌': gymBuild,  '塑形': gymShape,  '保持健康': gymHealth },
};

/* ================================================================
   五、主生成函数
   ================================================================ */
export function generatePlan(profile) {
  const {
    goal = '保持健康', bodyParts, durationDays, dailyMinutes,
    hasMenstrual, periodDate, scene, weight, targetWeight,
  } = profile;

  const isGym = scene === 'gym';
  const pool = (poolMap[isGym ? 'gym' : 'home']?.[goal]) || homeHealth;

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
      // 经期第 1-2 天：纯拉伸
      dayEx = periodLight.map((e) => ({ ...e }));
    } else if (isPd && pdDay <= 4) {
      // 经期第 3-4 天：轻量恢复
      dayEx = periodRecovery.map((e) => ({ ...e }));
    } else {
      // ═══ 核心逻辑：简化填充 ═══
      // 可用时间 = 用户时长 - 5min热身 - 5min拉伸
      const availSec = dailyMinutes * 60 - 300 - 300;
      dayEx = fillTime(pool, availSec, goal, day, isGym);
    }

    // 减重倍率
    if (cutMul > 1 && !isPd) {
      dayEx = dayEx.map((e) => {
        if (e.type === '热身' || e.type === '拉伸') return e;
        return { ...e, sets: Math.max(1, Math.round((e.sets || 1) * cutMul)) };
      });
    }

    // 前插热身、后插拉伸
    const warmupEx = { name: '训练前热身', sets: 1, reps: '5 分钟', rest: '—', type: '热身', sec: 300, videoId: 'wu-anna', equipment: 'bodyweight' };
    const stretchEx = { name: '训练后放松拉伸', sets: 1, reps: '5 分钟', rest: '—', type: '拉伸', sec: 300, videoId: 'cd-teagan', equipment: 'bodyweight' };
    const full = [warmupEx, ...dayEx, stretchEx];

    const totalMin = Math.round(full.reduce((a, e) => a + e.sec * (e.sets || 1), 0) / 60);

    // 简化日类型标签 — 不做复杂分化
    let typeLabel;
    if (isPd && pdDay <= 2) typeLabel = '经期拉伸';
    else if (isPd) typeLabel = '经期恢复';
    else if (goal === '减脂') typeLabel = '燃脂日';
    else if (goal === '增肌') typeLabel = '力量日';
    else if (goal === '塑形') typeLabel = '塑形日';
    else typeLabel = '健康日';

    schedule.push({
      day, exercises: full,
      note: isPd && pdDay <= 2 ? '经期前2天 — 纯拉伸放松' : isPd ? '经期恢复 — 轻量训练' : '',
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
   六、简化时间填充算法（v4 核心改动）
   ================================================================ */

/** 每类目标的主体动作上限 */
const MAX_EXERCISES = {
  '减脂': 2,
  '增肌': 3,
  '塑形': 2,
  '保持健康': 2,
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
    // 跟练时长在目标时间的 70%-125% 范围内 → 直接采用
    if (ratio >= 0.7 && ratio <= 1.25) {
      const remaining = targetSec - bestFA.sec;
      // 剩余不足 5 分钟 → 只用跟练
      if (remaining <= 300) {
        return [{ ...bestFA }];
      }
      // 有剩余时间 → 补 1 个简单补充动作（不同器械）
      const supplement = pickOneSimple(pool, remaining, [bestFA.equipment], day);
      return supplement ? [{ ...bestFA }, supplement] : [{ ...bestFA }];
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
   七、导出选项（Onboarding 依赖，不变）
   ================================================================ */
export const goalOptions = [
  { value: '减脂', label: '🔥  减脂' }, { value: '增肌', label: '💪  增肌' },
  { value: '塑形', label: '✨  塑形' }, { value: '保持健康', label: '🌱  保持健康' },
];
export const bodyPartOptions = [
  { value: '上肢', label: '上肢' }, { value: '下肢', label: '下肢' },
  { value: '核心', label: '核心' }, { value: '全身', label: '全身' },
];
export const sceneOptions = [
  { value: 'home', label: '🏠 居家训练' }, { value: 'gym', label: '🏋️ 健身房训练' },
];
