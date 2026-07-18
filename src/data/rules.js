// 训练计划规则引擎 — 女性零基础健身

// ══════════════════════════════════════
// 一、动作池（按 场景+目标 严格区分）
// ══════════════════════════════════════

// —— 居家减脂：徒手HIIT+弹力带 ——
const homeCut = [
  { name: '开合跳', sets: 3, reps: '30 次', rest: '30秒', type: '有氧', sec: 45 },
  { name: '高抬腿', sets: 3, reps: '30 秒', rest: '30秒', type: '有氧', sec: 45 },
  { name: '原地小跑', sets: 3, reps: '45 秒', rest: '30秒', type: '有氧', sec: 55 },
  { name: '波比跳（简易版）', sets: 3, reps: '8 次', rest: '45秒', type: '有氧', sec: 55 },
  { name: '深蹲', sets: 3, reps: '15 次', rest: '45秒', type: '力量', sec: 60 },
  { name: '臀桥', sets: 3, reps: '15 次', rest: '45秒', type: '力量', sec: 55 },
  { name: '平板支撑', sets: 2, reps: '30 秒', rest: '30秒', type: '核心', sec: 50 },
  { name: '死虫式', sets: 2, reps: '10 次/侧', rest: '30秒', type: '核心', sec: 40 },
  { name: '弹力带划船', sets: 3, reps: '15 次', rest: '30秒', type: '力量', sec: 55, eq: '弹力带' },
  { name: '弹力带髋外展', sets: 2, reps: '15 次/侧', rest: '30秒', type: '力量', sec: 45, eq: '弹力带' },
];

// —— 健身房减脂：跑步机优先+固定器械 ——
const gymCut = [
  { name: '跑步机快走/慢跑', sets: 1, reps: '15 分钟', rest: '—', type: '有氧', sec: 900, eq: '跑步机', note: '坡度3-5，速度4-6km/h，微出汗即可' },
  { name: '坐姿推胸', sets: 3, reps: '12 次', rest: '45秒', type: '力量', sec: 60, eq: '蝴蝶机/推胸机', note: '调节座椅至把手与胸齐平' },
  { name: '高位下拉', sets: 3, reps: '12 次', rest: '45秒', type: '力量', sec: 60, eq: '龙门架', note: '双手宽握，下拉至锁骨高度' },
  { name: '倒蹬机', sets: 3, reps: '12 次', rest: '60秒', type: '力量', sec: 70, eq: '史密斯机', note: '轻重量起步，膝盖勿锁死' },
  { name: '坐姿划船', sets: 3, reps: '12 次', rest: '45秒', type: '力量', sec: 60, eq: '龙门架', note: '背部挺直，夹紧肩胛骨' },
  { name: '蝴蝶机夹胸', sets: 3, reps: '12 次', rest: '45秒', type: '力量', sec: 60, eq: '蝴蝶机', note: '调节座椅使把手与肩同高' },
  { name: '椭圆机（可选）', sets: 1, reps: '8 分钟', rest: '—', type: '有氧', sec: 480, eq: '椭圆机', note: '低阻力，保持匀速' },
];

// —— 居家增肌 ——
const homeBuild = [
  { name: '俯卧撑（跪姿）', sets: 3, reps: '10 次', rest: '45秒', type: '力量', sec: 55 },
  { name: '深蹲', sets: 4, reps: '15 次', rest: '45秒', type: '力量', sec: 60 },
  { name: '臀桥', sets: 4, reps: '15 次', rest: '45秒', type: '力量', sec: 55 },
  { name: '弓步蹲', sets: 3, reps: '10 次/侧', rest: '45秒', type: '力量', sec: 55 },
  { name: '弹力带划船', sets: 3, reps: '15 次', rest: '45秒', type: '力量', sec: 55, eq: '弹力带' },
  { name: '弹力带肩推', sets: 3, reps: '12 次', rest: '45秒', type: '力量', sec: 55, eq: '弹力带' },
  { name: '弹力带弯举', sets: 3, reps: '15 次', rest: '45秒', type: '力量', sec: 55, eq: '弹力带' },
  { name: '平板支撑', sets: 3, reps: '45 秒', rest: '30秒', type: '核心', sec: 60 },
  { name: '卷腹', sets: 3, reps: '15 次', rest: '30秒', type: '核心', sec: 45 },
];

// —— 健身房增肌 ——
const gymBuild = [
  { name: '坐姿推胸', sets: 4, reps: '10 次', rest: '60秒', type: '力量', sec: 70, eq: '蝴蝶机/推胸机' },
  { name: '高位下拉', sets: 4, reps: '10 次', rest: '60秒', type: '力量', sec: 70, eq: '龙门架' },
  { name: '坐姿划船', sets: 3, reps: '12 次', rest: '60秒', type: '力量', sec: 70, eq: '龙门架' },
  { name: '倒蹬机', sets: 4, reps: '12 次', rest: '60秒', type: '力量', sec: 70, eq: '史密斯机' },
  { name: '哑铃肩推', sets: 3, reps: '12 次', rest: '60秒', type: '力量', sec: 70, eq: '哑铃' },
  { name: '蝴蝶机夹胸', sets: 3, reps: '12 次', rest: '45秒', type: '力量', sec: 60, eq: '蝴蝶机' },
  { name: '哑铃弯举', sets: 3, reps: '12 次', rest: '45秒', type: '力量', sec: 55, eq: '哑铃' },
  { name: '卷腹', sets: 4, reps: '15 次', rest: '30秒', type: '核心', sec: 45 },
  { name: '平板支撑', sets: 3, reps: '45 秒', rest: '30秒', type: '核心', sec: 60 },
];

// —— 居家塑形 ——
const homeShape = [
  { name: '普拉提百次', sets: 3, reps: '50 次', rest: '30秒', type: '核心', sec: 50 },
  { name: '臀桥', sets: 3, reps: '15 次', rest: '45秒', type: '力量', sec: 55 },
  { name: '侧卧抬腿', sets: 3, reps: '15 次/侧', rest: '30秒', type: '力量', sec: 45 },
  { name: '平板支撑', sets: 3, reps: '30 秒', rest: '30秒', type: '核心', sec: 50 },
  { name: '鸟狗式', sets: 3, reps: '10 次/侧', rest: '30秒', type: '核心', sec: 45 },
  { name: '猫牛式', sets: 3, reps: '10 次', rest: '15秒', type: '拉伸', sec: 30 },
  { name: '弹力带侧走', sets: 3, reps: '12 步/侧', rest: '30秒', type: '力量', sec: 45, eq: '弹力带' },
  { name: '跪姿后踢腿', sets: 3, reps: '15 次/侧', rest: '30秒', type: '力量', sec: 50 },
  { name: '深蹲', sets: 2, reps: '15 次', rest: '45秒', type: '力量', sec: 50 },
];

// —— 健身房塑形 ——
const gymShape = [
  { name: '蝴蝶机夹胸', sets: 3, reps: '15 次', rest: '45秒', type: '力量', sec: 60, eq: '蝴蝶机' },
  { name: '坐姿划船', sets: 3, reps: '15 次', rest: '45秒', type: '力量', sec: 60, eq: '龙门架' },
  { name: '龙门架臀推', sets: 3, reps: '15 次', rest: '45秒', type: '力量', sec: 60, eq: '龙门架' },
  { name: '哑铃侧平举', sets: 3, reps: '15 次', rest: '45秒', type: '力量', sec: 55, eq: '哑铃' },
  { name: '椭圆机', sets: 1, reps: '8 分钟', rest: '—', type: '有氧', sec: 480, eq: '椭圆机' },
  { name: '臀桥', sets: 3, reps: '15 次', rest: '45秒', type: '力量', sec: 55 },
  { name: '平板支撑', sets: 3, reps: '45 秒', rest: '30秒', type: '核心', sec: 60 },
  { name: '猫牛式', sets: 3, reps: '10 次', rest: '15秒', type: '拉伸', sec: 30 },
];

// —— 居家保持健康 ——
const homeHealth = [
  { name: '快走', sets: 1, reps: '12 分钟', rest: '—', type: '有氧', sec: 720 },
  { name: '深蹲', sets: 2, reps: '12 次', rest: '45秒', type: '力量', sec: 55 },
  { name: '平板支撑', sets: 2, reps: '30 秒', rest: '30秒', type: '核心', sec: 50 },
  { name: '弓步拉伸', sets: 2, reps: '20 秒/侧', rest: '15秒', type: '拉伸', sec: 30 },
  { name: '猫牛式', sets: 2, reps: '10 次', rest: '15秒', type: '拉伸', sec: 30 },
  { name: '站立体前屈', sets: 2, reps: '30 秒', rest: '—', type: '拉伸', sec: 30 },
  { name: '鸟狗式', sets: 2, reps: '8 次/侧', rest: '30秒', type: '核心', sec: 40 },
  { name: '开合跳', sets: 2, reps: '20 次', rest: '30秒', type: '有氧', sec: 40 },
];

// —— 健身房保持健康 ——
const gymHealth = [
  { name: '跑步机快走', sets: 1, reps: '8 分钟', rest: '—', type: '有氧', sec: 480, eq: '跑步机' },
  { name: '坐姿推胸', sets: 2, reps: '12 次', rest: '45秒', type: '力量', sec: 55, eq: '蝴蝶机/推胸机' },
  { name: '高位下拉', sets: 2, reps: '12 次', rest: '45秒', type: '力量', sec: 55, eq: '龙门架' },
  { name: '倒蹬机', sets: 2, reps: '12 次', rest: '60秒', type: '力量', sec: 55, eq: '史密斯机' },
  { name: '椭圆机', sets: 1, reps: '5 分钟', rest: '—', type: '有氧', sec: 300, eq: '椭圆机' },
  { name: '猫牛式', sets: 2, reps: '10 次', rest: '15秒', type: '拉伸', sec: 30 },
  { name: '平板支撑', sets: 2, reps: '30 秒', rest: '30秒', type: '核心', sec: 50 },
];

// ══════════════════════════════════════
// 二、场景+目标映射
// ══════════════════════════════════════
const poolMap = {
  home: { '减脂': homeCut, '增肌': homeBuild, '塑形': homeShape, '保持健康': homeHealth },
  gym:  { '减脂': gymCut,  '增肌': gymBuild,  '塑形': gymShape,  '保持健康': gymHealth },
};

// ══════════════════════════════════════
// 三、部位筛选映射
// ══════════════════════════════════════
const partNames = {
  '上肢': ['坐姿推胸','高位下拉','蝴蝶机夹胸','哑铃肩推','哑铃弯举','哑铃侧平举','俯卧撑（跪姿）','弹力带划船','弹力带肩推','弹力带弯举','龙门架下拉'],
  '下肢': ['深蹲','弓步蹲','臀桥','倒蹬机','侧卧抬腿','跪姿后踢腿','弹力带侧走','弹力带髋外展','龙门架臀推'],
  '核心': ['平板支撑','死虫式','鸟狗式','普拉提百次','卷腹','猫牛式'],
};

// ══════════════════════════════════════
// 四、拉伸（按部位匹配）
// ══════════════════════════════════════
const stretchMap = {
  '上肢': [
    { name: '肩部拉伸', sets: 1, reps: '30 秒/侧', rest: '—', type: '拉伸', sec: 60 },
    { name: '手臂后侧拉伸', sets: 1, reps: '30 秒/侧', rest: '—', type: '拉伸', sec: 60 },
  ],
  '下肢': [
    { name: '大腿前侧拉伸', sets: 1, reps: '30 秒/侧', rest: '—', type: '拉伸', sec: 60 },
    { name: '大腿后侧拉伸', sets: 1, reps: '30 秒/侧', rest: '—', type: '拉伸', sec: 60 },
  ],
  '核心': [
    { name: '婴儿式放松', sets: 1, reps: '1 分钟', rest: '—', type: '拉伸', sec: 60 },
    { name: '仰卧脊柱扭转', sets: 1, reps: '30 秒/侧', rest: '—', type: '拉伸', sec: 60 },
  ],
};
const defaultStretch = [
  { name: '全身舒展', sets: 1, reps: '1 分钟', rest: '—', type: '拉伸', sec: 60 },
  { name: '腿后侧拉伸', sets: 1, reps: '30 秒/侧', rest: '—', type: '拉伸', sec: 60 },
  { name: '脊柱放松', sets: 1, reps: '30 秒', rest: '—', type: '拉伸', sec: 30 },
];

// ══════════════════════════════════════
// 五、经期轻量动作
// ══════════════════════════════════════
const periodExercises = [
  { name: '猫牛式', sets: 2, reps: '8 次', rest: '15秒', type: '拉伸', sec: 25 },
  { name: '婴儿式', sets: 2, reps: '45 秒', rest: '—', type: '拉伸', sec: 45 },
  { name: '坐姿体前屈', sets: 2, reps: '30 秒', rest: '—', type: '拉伸', sec: 30 },
  { name: '腹式呼吸', sets: 2, reps: '1 分钟', rest: '—', type: '拉伸', sec: 60 },
];

// ══════════════════════════════════════
// 六、主生成函数
// ══════════════════════════════════════
export function generatePlan(profile) {
  const {
    goal = '保持健康', bodyParts, durationDays, dailyMinutes,
    hasMenstrual, periodDate, scene, weight, targetWeight,
  } = profile;

  const isGym = scene === 'gym';
  const pool = (poolMap[isGym ? 'gym' : 'home']?.[goal]) || homeHealth;

  // 部位筛选
  let filtered = pool;
  if (bodyParts?.length > 0 && !bodyParts.includes('全身')) {
    const names = new Set();
    bodyParts.forEach((p) => { (partNames[p] || []).forEach((n) => names.add(n)); });
    filtered = pool.filter((e) => names.has(e.name));
    if (filtered.length < 3) filtered = pool;
  }

  // 减脂：有氧为主，分离有氧/力量池
  const isCut = goal === '减脂';
  const cardioPool = filtered.filter((e) => e.type === '有氧');
  const strengthPool = filtered.filter((e) => e.type === '力量' || e.type === '核心');

  // 减重强度
  const cw = parseFloat(weight) || 0, tw = parseFloat(targetWeight) || 0;
  const cutMul = (isCut && cw > 0 && tw > 0 && tw < cw) ? Math.min(1.2, 1 + ((cw - tw) / cw) * 1.5) : 1;

  // 拉伸（秒）
  const stretchSec = Math.min(dailyMinutes * 5, 300);
  const stretches = pickStretch(stretchSec, bodyParts);

  // 热身 3 分钟
  const warmupSec = 180;
  const warmup = [{ name: '训练前热身', sets: 1, reps: '3 分钟', rest: '—', type: '热身', sec: warmupSec,
    videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1Ft4y1Q7Xa' }];

  // 正式动作可用时间
  const stretchTotal = stretches.reduce((a, e) => a + e.sec * (e.sets || 1), 0);
  const mainSec = dailyMinutes * 60 - warmupSec - stretchTotal;

  // 减脂时间分配：有氧 55% / 力量 45%
  const cardioTarget = isCut ? Math.round(mainSec * 0.55) : Math.round(mainSec * 0.3);
  const strengthTarget = mainSec - cardioTarget;

  // 经期日期：28天周期 × 6天
  const pdSet = new Set();
  if (hasMenstrual && periodDate) {
    const p0 = new Date(periodDate + 'T00:00:00');
    if (!isNaN(p0.getTime())) {
      for (let c = 0; c < 13; c++) {
        const cs = new Date(p0); cs.setDate(cs.getDate() + c * 28);
        for (let d = 0; d < 6; d++) {
          const dd = new Date(cs); dd.setDate(dd.getDate() + d);
          pdSet.add(dd.toDateString());
        }
      }
    }
  }

  // 生成
  const schedule = [];
  const totalDays = durationDays || 30;

  for (let day = 1; day <= totalDays; day++) {
    const planDate = new Date(); planDate.setDate(planDate.getDate() + (day - 1));
    const isPd = pdSet.has(planDate.toDateString());

    let dayEx;
    if (isPd) {
      dayEx = periodExercises.map((e) => ({ ...e }));
    } else {
      // 按时间比例选取
      const cardioPicked = isCut
        ? pickToTime(cardioPool, cardioTarget)
        : pickToTime(
            filtered.filter((e) => e.type === '有氧' || e.type === '拉伸'),
            Math.round(mainSec * 0.35)
          );
      const strengthPicked = pickToTime(strengthPool, strengthTarget);

      // 健身房减脂：确保跑步机排在第一位
      if (isGym && isCut) {
        const tm = cardioPicked.findIndex((e) => e.name.includes('跑步机'));
        if (tm > 0) {
          const [treadmill] = cardioPicked.splice(tm, 1);
          cardioPicked.unshift(treadmill);
        }
      }

      dayEx = [...cardioPicked, ...strengthPicked];
    }

    // 应用强度倍率
    if (cutMul > 1 && !isPd) {
      dayEx = dayEx.map((e) => ({ ...e, sets: Math.max(1, Math.round((e.sets || 1) * cutMul)) }));
    }

    const all = [...warmup.map((e) => ({ ...e })), ...dayEx, ...stretches.map((e) => ({ ...e }))];
    const totalMin = Math.round(all.reduce((a, e) => a + e.sec * (e.sets || 1), 0) / 60);

    const cd3 = (day - 1) % 3;
    let typeLabel = isPd ? '经期' : cd3 === 0 ? '力量日' : cd3 === 1 ? '有氧日' : '综合日';

    schedule.push({ day, exercises: all, note: isPd ? '经期 — 已调整为轻量拉伸，注意保暖' : '', estimatedMinutes: totalMin, type: typeLabel, isPeriodDay: isPd });
  }

  let wlEst = '';
  if (isCut && cw > 0 && tw > 0 && tw < cw) {
    wlEst = `当前 ${cw} kg → 目标 ${tw} kg，需减 ${(cw - tw).toFixed(1)} kg，预计约 ${Math.ceil((cw - tw) / 0.4)} 周达成`;
  }

  return { profile, schedule, totalDays, generatedAt: Date.now(), periodStartDate: periodDate || null, weightLossEstimate: wlEst, scene: scene || 'home' };
}

// ══════════════════════════════════════
// 辅助
// ══════════════════════════════════════
function pickStretch(targetSec, bodyParts) {
  const p = [];
  if (bodyParts?.length > 0 && !bodyParts.includes('全身')) {
    bodyParts.forEach((bp) => { (stretchMap[bp] || []).forEach((e) => p.push(e)); });
  }
  if (!p.length) p.push(...defaultStretch);
  const sel = []; let t = 0;
  for (const e of p) { if (t >= targetSec) break; sel.push({ ...e }); t += e.sec * (e.sets || 1); }
  return sel;
}

function pickToTime(pool, targetSec) {
  if (!pool.length) return [];
  const deduped = [...new Map(pool.map((e) => [e.name, e])).values()]; // 去重
  const sel = []; let t = 0, i = 0;
  const maxEx = Math.min(10, Math.ceil(targetSec / 60) + 2);
  while (t < targetSec && i < deduped.length * 3 && sel.length < maxEx) {
    const e = deduped[i % deduped.length];
    sel.push({ ...e }); t += e.sec * (e.sets || 1); i++;
  }
  return sel;
}

// ══════════════════════════════════════
// 导出选项
// ══════════════════════════════════════
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
