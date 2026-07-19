/**
 * FitHer 训练计划规则引擎 v3 — 简单无脑派
 *
 * 核心理念：用户只需填表，系统自动填满每日训练时间
 * 每日结构：热身(固定) → 主体训练(按时长自动填充) → 拉伸(固定)
 * 所有动作均来自「器材教学」已上传视频
 */

/* ================================================================
   一、动作素材库（按场景×目标组织）
       每项 = { name, sets, reps, rest, type, sec, videoId }
       sec = 预估秒数，用于时间填充计算
   ================================================================ */

// ── 健身房·减脂：有氧为主，力量为辅 ──
const gymCut = [
  { name: '跑步机快走',        sets: 1, reps: '15 分钟', rest: '—',  type: '有氧', sec: 900,  videoId: 'tm-pro-treadmill' },
  { name: '跑步机爬坡',        sets: 1, reps: '15 分钟', rest: '—',  type: '有氧', sec: 900,  videoId: 'tm-lbj-treadmill' },
  { name: '椭圆仪',            sets: 1, reps: '10 分钟', rest: '—',  type: '有氧', sec: 600,  videoId: 'tm-lbj-elliptical' },
  { name: '爬楼机',            sets: 1, reps: '10 分钟', rest: '—',  type: '有氧', sec: 600,  videoId: 'tm-lbj-climb' },
  { name: '35分钟爬坡跟练',    sets: 1, reps: '35 分钟', rest: '—',  type: '有氧', sec: 2100, videoId: 'tm-xx-35' },
  { name: '45分钟爬坡跟练',    sets: 1, reps: '45 分钟', rest: '—',  type: '有氧', sec: 2700, videoId: 'tm-xx-45' },
  { name: '坐姿推胸',          sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-chest' },
  { name: '坐姿划船',          sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-row' },
  { name: '高位下拉',          sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-gwl' },
  { name: '坐姿腿屈伸',        sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-legext' },
  { name: '蝴蝶机夹胸',        sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-pec' },
  { name: '坐姿髋外展',        sets: 2, reps: '15 次',   rest: '30秒',type: '力量', sec: 55,  videoId: 'st-lbj-hipabd' },
];

// ── 健身房·增肌：力量器械为主 ──
const gymBuild = [
  { name: '高位下拉',          sets: 4, reps: '10 次',   rest: '60秒', type: '力量', sec: 75, videoId: 'st-lbj-gwl' },
  { name: '坐姿推胸',          sets: 4, reps: '10 次',   rest: '60秒', type: '力量', sec: 75, videoId: 'st-lbj-chest' },
  { name: '坐姿划船',          sets: 4, reps: '10 次',   rest: '60秒', type: '力量', sec: 75, videoId: 'st-lbj-row' },
  { name: '倒蹬机',            sets: 4, reps: '12 次',   rest: '60秒', type: '力量', sec: 80, videoId: 'st-lbj-legpress' },
  { name: '史密斯深蹲',        sets: 3, reps: '12 次',   rest: '60秒', type: '力量', sec: 75, videoId: 'st-lbj-smith-squat' },
  { name: '臀推机',            sets: 3, reps: '12 次',   rest: '45秒', type: '力量', sec: 70, videoId: 'st-lbj-hipthrust' },
  { name: '蝴蝶机夹胸',        sets: 3, reps: '12 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-pec' },
  { name: '坐姿髋外展',        sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-hipabd' },
  { name: '直臂下压',          sets: 3, reps: '12 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-pushdown' },
  { name: '坐姿腿屈伸',        sets: 3, reps: '12 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-legext' },
  { name: '跑步机快走',        sets: 1, reps: '8 分钟',  rest: '—',   type: '有氧', sec: 480, videoId: 'tm-pro-treadmill' },
];

// ── 健身房·塑形：器械 + 有氧混搭 ──
const gymShape = [
  { name: '蝴蝶机夹胸',        sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-pec' },
  { name: '坐姿划船',          sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-row' },
  { name: '高位下拉',          sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-gwl' },
  { name: '臀推机',            sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 65, videoId: 'st-lbj-hipthrust' },
  { name: '坐姿髋外展',        sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-hipabd' },
  { name: '绳索面拉',          sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-facepull' },
  { name: '坐姿腿屈伸',        sets: 3, reps: '15 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-legext' },
  { name: '椭圆仪',            sets: 1, reps: '8 分钟',  rest: '—',   type: '有氧', sec: 480, videoId: 'tm-lbj-elliptical' },
  { name: '跑步机爬坡',        sets: 1, reps: '10 分钟', rest: '—',   type: '有氧', sec: 600, videoId: 'tm-lbj-treadmill' },
];

// ── 健身房·保持健康：轻量均衡 ──
const gymHealth = [
  { name: '跑步机快走',        sets: 1, reps: '10 分钟', rest: '—',   type: '有氧', sec: 600, videoId: 'tm-pro-treadmill' },
  { name: '坐姿推胸',          sets: 2, reps: '12 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-chest' },
  { name: '高位下拉',          sets: 2, reps: '12 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-gwl' },
  { name: '坐姿划船',          sets: 2, reps: '12 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-row' },
  { name: '椭圆仪',            sets: 1, reps: '8 分钟',  rest: '—',   type: '有氧', sec: 480, videoId: 'tm-lbj-elliptical' },
  { name: '倒蹬机',            sets: 2, reps: '12 次',   rest: '45秒', type: '力量', sec: 60, videoId: 'st-lbj-legpress' },
];

// ── 居家·减脂：HIIT + 有氧 ──
const homeCut = [
  { name: '30min无跳跃站立HIIT',  sets: 1, reps: '30 分钟', rest: '—', type: '有氧', sec: 1800, videoId: 'cd-anna-hiit1' },
  { name: '20min TABATA腹肌',     sets: 1, reps: '20 分钟', rest: '—', type: '核心', sec: 1200, videoId: 'cr-anna-tabata1' },
  { name: '30min全身力量无器械',  sets: 1, reps: '30 分钟', rest: '—', type: '力量', sec: 1800, videoId: 'ub-anna-full' },
  { name: '40min自重臀腿',        sets: 1, reps: '40 分钟', rest: '—', type: '力量', sec: 2400, videoId: 'gl-anna-glutes1' },
  { name: '25分钟核心+腹肌',      sets: 1, reps: '25 分钟', rest: '—', type: '核心', sec: 1500, videoId: 'cr-anna-core1' },
  { name: '安娜·28分钟臀腿',      sets: 1, reps: '28 分钟', rest: '—', type: '力量', sec: 1680, videoId: 'gl-anna-glutes3' },
];

// ── 居家·增肌：哑铃上肢 + 臀腿 ──
const homeBuild = [
  { name: '30分钟上半身塑形',     sets: 1, reps: '33 分钟', rest: '—', type: '力量', sec: 1980, videoId: 'ub-anna-upper1' },
  { name: '35分钟哑铃手臂肩背',   sets: 1, reps: '37 分钟', rest: '—', type: '力量', sec: 2220, videoId: 'ub-anna-upper2' },
  { name: '40分钟哑铃上肢塑形',   sets: 1, reps: '45 分钟', rest: '—', type: '力量', sec: 2700, videoId: 'ub-anna-upper3' },
  { name: '30分钟全身哑铃',       sets: 1, reps: '30 分钟', rest: '—', type: '力量', sec: 1800, videoId: 'ub-anna-full' },
  { name: '40min自重臀腿',        sets: 1, reps: '40 分钟', rest: '—', type: '力量', sec: 2400, videoId: 'gl-anna-glutes1' },
  { name: '安娜·30分钟臀腿训练',  sets: 1, reps: '34 分钟', rest: '—', type: '力量', sec: 2040, videoId: 'gl-anna-glutes2' },
  { name: '25分钟核心+腹肌',      sets: 1, reps: '25 分钟', rest: '—', type: '核心', sec: 1500, videoId: 'cr-anna-core1' },
];

// ── 居家·塑形：哑铃 + 核心 ──
const homeShape = [
  { name: '20分钟哑铃手臂',       sets: 1, reps: '20 分钟', rest: '—', type: '力量', sec: 1200, videoId: 'ub-anna-arm' },
  { name: '25分钟站立哑铃',       sets: 1, reps: '25 分钟', rest: '—', type: '力量', sec: 1500, videoId: 'ub-anna-stand' },
  { name: '30分钟上半身塑形',     sets: 1, reps: '33 分钟', rest: '—', type: '力量', sec: 1980, videoId: 'ub-anna-upper1' },
  { name: '安娜·28分钟臀腿',      sets: 1, reps: '28 分钟', rest: '—', type: '力量', sec: 1680, videoId: 'gl-anna-glutes3' },
  { name: '25分钟核心+腹肌',      sets: 1, reps: '25 分钟', rest: '—', type: '核心', sec: 1500, videoId: 'cr-anna-core1' },
  { name: '帕梅拉·15分钟上肢+腹部',sets: 1, reps: '16 分钟', rest: '—',type: '力量', sec: 960,  videoId: 'ub-pam-arm2' },
];

// ── 居家·保持健康：轻量混搭 ──
const homeHealth = [
  { name: '25分钟站立哑铃',       sets: 1, reps: '25 分钟', rest: '—', type: '力量', sec: 1500, videoId: 'ub-anna-stand' },
  { name: '帕梅拉·10分钟上肢训练',sets: 1, reps: '10 分钟', rest: '—', type: '力量', sec: 600,  videoId: 'ub-pam-arm3' },
  { name: '25分钟核心+腹肌',      sets: 1, reps: '25 分钟', rest: '—', type: '核心', sec: 1500, videoId: 'cr-anna-core1' },
  { name: '帕梅拉·10分钟全身拉伸',sets: 1, reps: '11 分钟', rest: '—', type: '拉伸', sec: 660,  videoId: 'st-pam-full' },
  { name: '帕梅拉·10分钟腿部拉伸',sets: 1, reps: '10 分钟', rest: '—', type: '拉伸', sec: 600,  videoId: 'st-pam-leg' },
];

/* ================================================================
   二、经期动作
   ================================================================ */
const periodLight = [
  { name: '安娜5分钟快速拉伸',    sets: 1, reps: '5 分钟',  rest: '—', type: '拉伸', sec: 300,  videoId: 'wu-anna' },
  { name: '安娜10分钟拉伸练习',   sets: 1, reps: '10 分钟', rest: '—', type: '拉伸', sec: 600,  videoId: 'wu-anna2' },
  { name: '帕梅拉·10分钟腿部拉伸',sets: 1, reps: '10 分钟', rest: '—', type: '拉伸', sec: 600,  videoId: 'st-pam-leg' },
  { name: '帕梅拉·10分钟全身拉伸',sets: 1, reps: '11 分钟', rest: '—', type: '拉伸', sec: 660,  videoId: 'st-pam-full' },
  { name: '安娜15分钟放松拉伸',   sets: 1, reps: '15 分钟', rest: '—', type: '拉伸', sec: 900,  videoId: 'cd-anna' },
];

const periodRecovery = [
  { name: '安娜5分钟快速拉伸',    sets: 1, reps: '5 分钟',  rest: '—', type: '拉伸', sec: 300,  videoId: 'wu-anna' },
  { name: '帕梅拉·10分钟上肢训练',sets: 1, reps: '10 分钟', rest: '—', type: '力量', sec: 600,  videoId: 'ub-pam-arm3' },
  { name: '帕梅拉·10分钟全身拉伸',sets: 1, reps: '11 分钟', rest: '—', type: '拉伸', sec: 660,  videoId: 'st-pam-full' },
];

/* ================================================================
   三、场景×目标 → 动作池映射
   ================================================================ */
const poolMap = {
  home: { '减脂': homeCut, '增肌': homeBuild, '塑形': homeShape, '保持健康': homeHealth },
  gym:  { '减脂': gymCut,  '增肌': gymBuild,  '塑形': gymShape,  '保持健康': gymHealth },
};

/* ================================================================
   四、主生成函数
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
      dayEx = periodLight.map((e) => ({ ...e }));
    } else if (isPd && pdDay <= 4) {
      dayEx = periodRecovery.map((e) => ({ ...e }));
    } else {
      // ═══ 核心逻辑：按时长自动填充 ═══
      // 可用时间 = 用户时长 - 5min热身 - 10min拉伸
      const availSec = dailyMinutes * 60 - 300 - 300;
      dayEx = fillTime(pool, availSec, goal, day);
    }

    // 减重倍率（不影响热身/拉伸）
    if (cutMul > 1 && !isPd) {
      dayEx = dayEx.map((e) => {
        if (e.type === '热身' || e.type === '拉伸') return e;
        return { ...e, sets: Math.max(1, Math.round((e.sets || 1) * cutMul)) };
      });
    }

    // 前插热身、后插拉伸
    const warmupEx = { name: '训练前热身', sets: 1, reps: '5 分钟', rest: '—', type: '热身', sec: 300, videoId: 'wu-anna' };
    const stretchEx = { name: '训练后放松拉伸', sets: 1, reps: '5 分钟', rest: '—', type: '拉伸', sec: 300, videoId: 'cd-teagan' };
    const full = [warmupEx, ...dayEx, stretchEx];

    const totalMin = Math.round(full.reduce((a, e) => a + e.sec * (e.sets || 1), 0) / 60);

    let typeLabel;
    if (isPd && pdDay <= 2) typeLabel = '经期拉伸';
    else if (isPd) typeLabel = '经期恢复';
    else if (goal === '减脂') typeLabel = (day % 2 === 1) ? '有氧日' : '综合日';
    else typeLabel = (day % 3 === 1) ? '力量日' : (day % 3 === 2) ? '综合日' : '塑形日';

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
   五、时间填充算法
   ================================================================ */
function fillTime(pool, targetSec, goal, day) {
  // 分离有氧/力量/核心
  const cardio = pool.filter((e) => e.type === '有氧');
  const strength = pool.filter((e) => e.type === '力量');
  const core = pool.filter((e) => e.type === '核心');
  const other = pool.filter((e) => !['有氧', '力量', '核心'].includes(e.type));

  let picks = [];
  let used = 0;

  if (goal === '减脂') {
    // 有氧为主，填满全部时间，最多补1个轻力量
    picks = fillFrom(cardio, targetSec, day);
    const used = picks.reduce((a, e) => a + e.sec * (e.sets || 1), 0);
    if (targetSec - used > 300) {
      const extra = [...strength, ...core];
      if (extra.length > 0) picks.push({ ...extra[(day + picks.length) % extra.length] });
    }
  } else if (goal === '增肌') {
    // 力量优先，占80%
    picks = fillFrom(strength, Math.round(targetSec * 0.8), day);
    used = picks.reduce((a, e) => a + e.sec * (e.sets || 1), 0);
    // 剩余补有氧
    const remaining = targetSec - used;
    if (remaining > 120) {
      const filler = fillFrom(cardio, remaining, day + 100);
      picks = [...picks, ...filler];
    }
  } else {
    // 塑形/健康：均衡混搭
    const all = [...cardio, ...strength, ...core, ...other];
    picks = fillFrom(all, targetSec, day);
  }

  // 减脂：最多3个主体动作，新手友好
  if (goal === '减脂' && picks.length > 3) picks = picks.slice(0, 3);
  // 其他目标：确保最少2个动作
  if (goal !== '减脂' && picks.length < 2 && pool.length >= 2) {
    const extra = pool.filter((e) => !picks.find((p) => p.videoId === e.videoId));
    if (extra.length > 0) picks.push({ ...extra[0] });
  }

  // 排序：有氧→核心→力量→其他
  const order = { '有氧': 0, '核心': 1, '力量': 2, '拉伸': 3 };
  picks.sort((a, b) => (order[a.type] || 2) - (order[b.type] || 2));

  return picks;
}

/** 从列表中按时间贪心选取，day参数用于循环偏移 */
function fillFrom(list, targetSec, offset) {
  if (!list.length) return [];
  const sel = [];
  let total = 0;
  // 按 day 偏移轮换起点，保证不同天有变化
  const start = offset % list.length;
  for (let i = 0; i < list.length && total < targetSec; i++) {
    const idx = (start + i) % list.length;
    const ex = list[idx];
    const cost = ex.sec * (ex.sets || 1);
    if (total + cost <= targetSec * 1.15) {
      sel.push({ ...ex });
      total += cost;
    }
  }
  return sel;
}

/* ================================================================
   六、导出选项（Onboarding 依赖，不变）
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
