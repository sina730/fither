// 训练计划规则引擎

// 根据目标推荐的动作库
const exercisesByGoal = {
  '减脂': [
    { name: '开合跳', sets: 3, reps: '30 次', rest: '30秒', type: '有氧' },
    { name: '高抬腿', sets: 3, reps: '30 秒', rest: '30秒', type: '有氧' },
    { name: '波比跳', sets: 3, reps: '10 次', rest: '45秒', type: '有氧' },
    { name: '深蹲', sets: 3, reps: '15 次', rest: '45秒', type: '力量' },
    { name: '弓步蹲', sets: 3, reps: '12 次/侧', rest: '45秒', type: '力量' },
    { name: '平板支撑', sets: 3, reps: '30 秒', rest: '30秒', type: '核心' },
    { name: '登山爬', sets: 3, reps: '20 次/侧', rest: '30秒', type: '核心' },
    { name: '跳绳', sets: 3, reps: '1 分钟', rest: '30秒', type: '有氧' },
  ],
  '增肌': [
    { name: '哑铃卧推', sets: 4, reps: '10 次', rest: '60秒', type: '力量' },
    { name: '哑铃弯举', sets: 4, reps: '12 次', rest: '60秒', type: '力量' },
    { name: '哑铃肩推', sets: 4, reps: '10 次', rest: '60秒', type: '力量' },
    { name: '深蹲', sets: 4, reps: '12 次', rest: '60秒', type: '力量' },
    { name: '罗马尼亚硬拉', sets: 3, reps: '12 次', rest: '60秒', type: '力量' },
    { name: '臀桥', sets: 4, reps: '15 次', rest: '45秒', type: '力量' },
    { name: '引体向上', sets: 3, reps: '8 次', rest: '60秒', type: '力量' },
    { name: '俯卧撑', sets: 3, reps: '12 次', rest: '45秒', type: '力量' },
  ],
  '塑形': [
    { name: '普拉提百次', sets: 3, reps: '100 次', rest: '30秒', type: '核心' },
    { name: '侧卧抬腿', sets: 3, reps: '15 次/侧', rest: '30秒', type: '力量' },
    { name: '臀桥', sets: 3, reps: '15 次', rest: '45秒', type: '力量' },
    { name: '平板支撑', sets: 3, reps: '45 秒', rest: '30秒', type: '核心' },
    { name: '深蹲', sets: 3, reps: '15 次', rest: '45秒', type: '力量' },
    { name: '鸟狗式', sets: 3, reps: '10 次/侧', rest: '30秒', type: '核心' },
    { name: '弹力带侧走', sets: 3, reps: '15 步/侧', rest: '30秒', type: '力量' },
    { name: '下犬式拉伸', sets: 2, reps: '30 秒', rest: '15秒', type: '拉伸' },
  ],
  '保持健康': [
    { name: '快走', sets: 1, reps: '20 分钟', rest: '—', type: '有氧' },
    { name: '深蹲', sets: 2, reps: '12 次', rest: '45秒', type: '力量' },
    { name: '平板支撑', sets: 2, reps: '30 秒', rest: '30秒', type: '核心' },
    { name: '弓步拉伸', sets: 2, reps: '20 秒/侧', rest: '15秒', type: '拉伸' },
    { name: '猫牛式', sets: 2, reps: '10 次', rest: '15秒', type: '拉伸' },
    { name: '站立体前屈', sets: 2, reps: '30 秒', rest: '15秒', type: '拉伸' },
  ],
};

// 根据部位筛选动作
const exercisesByBodyPart = {
  '上肢': ['哑铃卧推', '哑铃弯举', '哑铃肩推', '俯卧撑', '引体向上'],
  '下肢': ['深蹲', '弓步蹲', '臀桥', '罗马尼亚硬拉', '弹力带侧走', '侧卧抬腿'],
  '核心': ['平板支撑', '登山爬', '鸟狗式', '普拉提百次'],
  '全身': ['波比跳', '开合跳', '高抬腿', '跳绳', '快走'],
};

// 主规则函数
export function generatePlan(profile) {
  const { goal, bodyParts, durationDays, dailyMinutes, hasMenstrual, menstrualDays } = profile;

  // 1. 获取基于目标的动作库
  const goalExercises = exercisesByGoal[goal] || exercisesByGoal['保持健康'];

  // 2. 根据部位筛选
  let filteredExercises = goalExercises;
  if (bodyParts && bodyParts.length > 0 && !bodyParts.includes('全身')) {
    const relevantNames = new Set();
    bodyParts.forEach((part) => {
      (exercisesByBodyPart[part] || []).forEach((name) => relevantNames.add(name));
    });
    // 保留匹配部位的动作 + 始终保留一些核心有氧
    filteredExercises = goalExercises.filter(
      (e) => relevantNames.has(e.name) || e.type === '有氧' || e.type === '拉伸'
    );
    // 如果筛选后太少，回退到全部
    if (filteredExercises.length < 3) filteredExercises = goalExercises;
  }

  // 3. 根据每日时间调整组数
  const timeMultiplier = dailyMinutes <= 20 ? 0.6 : dailyMinutes <= 40 ? 0.85 : 1;

  // 4. 生成每天的计划
  const dailySchedule = [];
  for (let day = 1; day <= durationDays; day++) {
    // 每 3 天一个循环
    const cycleDay = ((day - 1) % 3);

    let dayExercises;
    if (cycleDay === 0) {
      // 力量日
      dayExercises = filteredExercises.filter((e) => e.type === '力量' || e.type === '核心');
    } else if (cycleDay === 1) {
      // 有氧日
      dayExercises = filteredExercises.filter((e) => e.type === '有氧' || e.type === '拉伸');
    } else {
      // 混合日
      dayExercises = filteredExercises.slice(0, Math.ceil(filteredExercises.length / 2));
    }

    // 确保每天至少有动作
    if (dayExercises.length < 2) {
      dayExercises = [...filteredExercises].slice(0, 3);
    }

    // 经期调整
    let note = '';
    if (hasMenstrual && menstrualDays) {
      const periodDay = ((day - 1) % menstrualDays) + 1;
      if (periodDay <= 2) {
        // 前 2 天：纯休息/拉伸
        dayExercises = [
          { name: '休息或轻柔拉伸', sets: 1, reps: '10 分钟', rest: '—', type: '经期' },
          { name: '猫牛式', sets: 2, reps: '10 次', rest: '15秒', type: '拉伸' },
          { name: '婴儿式', sets: 2, reps: '30 秒', rest: '15秒', type: '拉伸' },
        ];
        note = '经期 — 建议放松休息，注意保暖';
      }
    }

    // 应用时间倍率调整组数
    const adjustedExercises = dayExercises.map((e) => ({
      ...e,
      sets: Math.max(1, Math.round(e.sets * timeMultiplier)),
    }));

    // 总预估时间
    const totalMinutes = adjustedExercises.reduce((acc, e) => {
      const reps = parseInt(e.reps) || 1;
      const rest = parseInt(e.rest) || 0;
      return acc + (reps * 2 + rest * e.sets) / 60;
    }, 0);

    dailySchedule.push({
      day,
      exercises: adjustedExercises,
      note,
      estimatedMinutes: Math.round(totalMinutes) + 5,
      type: cycleDay === 0 ? '力量日' : cycleDay === 1 ? '有氧日' : '综合日',
    });
  }

  return {
    profile,
    schedule: dailySchedule,
    totalDays: durationDays,
    generatedAt: Date.now(),
  };
}

// 获取训练计划目标选项
export const goalOptions = [
  { value: '减脂', label: '减脂', icon: '🔥' },
  { value: '增肌', label: '增肌', icon: '💪' },
  { value: '塑形', label: '塑形', icon: '✨' },
  { value: '保持健康', label: '保持健康', icon: '💚' },
];

export const bodyPartOptions = [
  { value: '上肢', label: '上肢' },
  { value: '下肢', label: '下肢' },
  { value: '核心', label: '核心' },
  { value: '全身', label: '全身' },
];
