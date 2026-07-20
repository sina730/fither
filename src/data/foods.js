// 原有 foods 数据（保留兼容）
export const foods = [
  { name: '鸡胸肉', unit: '100g', calories: 133, protein: 31, category: '肉蛋类' },
  { name: '鸡蛋', unit: '1个', calories: 70, protein: 6, category: '肉蛋类' },
  { name: '三文鱼', unit: '100g', calories: 208, protein: 20, category: '肉蛋类' },
  { name: '牛肉（瘦）', unit: '100g', calories: 125, protein: 22, category: '肉蛋类' },
  { name: '虾仁', unit: '100g', calories: 99, protein: 21, category: '肉蛋类' },
  { name: '豆腐', unit: '100g', calories: 76, protein: 8, category: '豆制品' },
  { name: '豆浆', unit: '250ml', calories: 80, protein: 7, category: '豆制品' },
  { name: '毛豆', unit: '100g', calories: 131, protein: 13, category: '豆制品' },
  { name: '西兰花', unit: '100g', calories: 34, protein: 3, category: '蔬菜类' },
  { name: '菠菜', unit: '100g', calories: 23, protein: 3, category: '蔬菜类' },
  { name: '番茄', unit: '100g', calories: 18, protein: 1, category: '蔬菜类' },
  { name: '黄瓜', unit: '100g', calories: 16, protein: 1, category: '蔬菜类' },
  { name: '胡萝卜', unit: '100g', calories: 41, protein: 1, category: '蔬菜类' },
  { name: '红薯', unit: '100g', calories: 86, protein: 1, category: '主食类' },
  { name: '糙米饭', unit: '100g', calories: 116, protein: 3, category: '主食类' },
  { name: '燕麦', unit: '100g', calories: 377, protein: 14, category: '主食类' },
  { name: '全麦面包', unit: '1片', calories: 75, protein: 3, category: '主食类' },
  { name: '玉米', unit: '1根', calories: 112, protein: 4, category: '主食类' },
  { name: '香蕉', unit: '1根', calories: 105, protein: 1, category: '水果类' },
  { name: '苹果', unit: '1个', calories: 95, protein: 0, category: '水果类' },
  { name: '蓝莓', unit: '100g', calories: 57, protein: 1, category: '水果类' },
  { name: '牛油果', unit: '半个', calories: 120, protein: 1, category: '水果类' },
  { name: '牛奶', unit: '250ml', calories: 150, protein: 8, category: '乳制品' },
  { name: '酸奶（无糖）', unit: '200ml', calories: 120, protein: 8, category: '乳制品' },
  { name: '坚果（混合）', unit: '30g', calories: 175, protein: 5, category: '零食类' },
];

export const foodCategories = [...new Set(foods.map((f) => f.category))];

// ====== 健身食物分类库 ======
const gradients = {
  protein: 'linear-gradient(135deg, #fff5f7 0%, #ffeef2 40%, #fde4ea 100%)',
  carbs:   'linear-gradient(135deg, #fffaf5 0%, #fff6ec 40%, #fef0e0 100%)',
  veg:     'linear-gradient(135deg, #f7fdf8 0%, #eef8f0 40%, #e2f4e6 100%)',
  fat:     'linear-gradient(135deg, #fffcf8 0%, #fff8f0 40%, #fef2e4 100%)',
};

export const foodLibrary = {
  protein: {
    id: 'protein',
    icon: '💪',
    title: '高蛋白食物',
    enTitle: 'PROTEIN',
    desc: '帮助训练后肌肉恢复',
    bg: '#fff5f7',
    foods: [
      { name: '鸡胸肉', image: './食物鸡胸肉.png', calories: 133, protein: 31, unit: '100g', gradient: gradients.protein, tags: ['高蛋白', '低脂'] },
      { name: '鸡蛋', image: './食物水煮蛋.png', calories: 143, protein: 13, unit: '100g', gradient: gradients.protein, tags: ['营养全面', '早餐推荐'] },
      { name: '牛肉', image: './食物牛肉.png', calories: 125, protein: 22, unit: '100g', gradient: gradients.protein, tags: ['高蛋白', '补铁'], fit: 'cover', scale: 0.85 },
      { name: '三文鱼', image: './食物三文鱼.png', calories: 208, protein: 22, unit: '100g', gradient: gradients.protein, tags: ['优质脂肪', 'Omega-3'] },
      { name: '虾', image: './食物虾.png', calories: 99, protein: 24, unit: '100g', gradient: gradients.protein, tags: ['高蛋白', '低卡'] },
      { name: '牛奶', image: './食物牛奶.png', calories: 54, protein: 3.2, unit: '100ml', gradient: gradients.protein, tags: ['补钙', '日常必备'], fit: 'contain' },
    ],
  },
  carbs: {
    id: 'carbs',
    icon: '🍚',
    title: '优质碳水',
    enTitle: 'CARBS',
    desc: '提供训练所需能量',
    bg: '#fffaf5',
    foods: [
      { name: '燕麦', image: './食物燕麦.png', calories: 389, protein: 16, unit: '100g', gradient: gradients.carbs, tags: ['高纤维', '早餐推荐'] },
      { name: '红薯', image: './食物红薯.png', calories: 86, protein: 1.6, unit: '100g', gradient: gradients.carbs, tags: ['低GI', '饱腹感'] },
      { name: '糙米', image: './食物糙米.png', calories: 116, protein: 3, unit: '100g', gradient: gradients.carbs, tags: ['低GI', '主食推荐'] },
      { name: '玉米', image: './食物玉米.png', calories: 112, protein: 4, unit: '1根', gradient: gradients.carbs, tags: ['膳食纤维', '加餐好选'] },
      { name: '全麦面包', image: './食物面包.png', calories: 75, protein: 3, unit: '1片', gradient: gradients.carbs, tags: ['高纤维', '便捷'] },
      { name: '香蕉', image: './食物香蕉.png', calories: 105, protein: 1, unit: '1根', gradient: gradients.carbs, tags: ['快碳', '训练前后'] },
    ],
  },
  veg: {
    id: 'veg',
    icon: '🥦',
    title: '健康蔬菜',
    enTitle: 'VEGETABLES',
    desc: '补充维生素与膳食纤维',
    bg: '#f6fbf7',
    foods: [
      { name: '西兰花', image: './食物西兰花.png', calories: 34, protein: 2.8, unit: '100g', gradient: gradients.veg, tags: ['高纤维', '健身必备'] },
      { name: '菠菜', image: './食物菠菜.png', calories: 23, protein: 3, unit: '100g', gradient: gradients.veg, tags: ['补铁', '低卡'] },
      { name: '生菜', image: './食物生菜.png', calories: 15, protein: 1, unit: '100g', gradient: gradients.veg, tags: ['低卡', '沙拉基础'] },
      { name: '番茄', image: './食物西红柿.png', calories: 18, protein: 1, unit: '100g', gradient: gradients.veg, tags: ['抗氧化', '低卡'] },
      { name: '胡萝卜', image: './食物萝卜.png', calories: 41, protein: 1, unit: '100g', gradient: gradients.veg, tags: ['维生素A', '护眼'] },
      { name: '黄瓜', image: './食物黄瓜.png', calories: 16, protein: 1, unit: '100g', gradient: gradients.veg, tags: ['低卡', '补水'] },
    ],
  },
  fat: {
    id: 'fat',
    icon: '🥑',
    title: '健康脂肪',
    enTitle: 'HEALTHY FATS',
    desc: '维持激素平衡与饱腹感',
    bg: '#fffcf8',
    foods: [
      { name: '牛油果', image: './食物牛油果.png', calories: 120, protein: 1, unit: '半个', gradient: gradients.fat, tags: ['优质脂肪', '饱腹感'] },
      { name: '坚果', image: './食物坚果.png', calories: 175, protein: 5, unit: '30g', gradient: gradients.fat, tags: ['优质脂肪', '加餐好选'] },
      { name: '鸡蛋黄', image: './食物鸡蛋.png', calories: 55, protein: 3, unit: '1个', gradient: gradients.fat, tags: ['卵磷脂', '营养密集'] },
      { name: '橄榄油', image: './食物橄榄油.png', calories: 120, protein: 0, unit: '1汤匙', gradient: gradients.fat, tags: ['优质脂肪', '凉拌首选'], fit: 'contain' },
      { name: '奇亚籽', image: './食物奇亚籽.png', calories: 60, protein: 2, unit: '15g', gradient: gradients.fat, tags: ['Omega-3', '高纤维'] },
    ],
  },
};

export const libraryCategories = [
  { id: 'all', label: '全部', icon: '📋' },
  { id: 'protein', label: '蛋白质', icon: '💪' },
  { id: 'carbs', label: '碳水', icon: '🍚' },
  { id: 'veg', label: '蔬菜', icon: '🥦' },
  { id: 'fat', label: '脂肪', icon: '🥑' },
];

// 获取所有食物（扁平列表）
export const allLibraryFoods = Object.values(foodLibrary).flatMap(cat =>
  cat.foods.map(f => ({ ...f, categoryId: cat.id, categoryTitle: cat.title }))
);

// ====== 饮食建议（按目标分类） ======
export const dietAdvice = {
  '减脂期': {
    desc: '控制总热量，优选高蛋白低脂食物',
    tips: ['每餐吃到七分饱，细嚼慢咽，给大脑20分钟感知饱腹信号，避免暴饮暴食', '多选鸡胸肉、鱼虾、瘦牛肉等高蛋白低脂肉类，搭配西兰花菠菜等深色蔬菜', '减少精制碳水（白米饭/白面包）和油炸食品，用燕麦糙米红薯等粗粮替代主食', '每天饮水 2L 以上，提高基础代谢，饭前一杯温水利于控制进食量'],
    highlight: '热量缺口是关键，但不要过度节食，循序渐进才能坚持。',
  },
  '增肌期': {
    desc: '保证充足蛋白质和碳水摄入，支撑肌肉生长',
    tips: ['蛋白质每天 1.2-1.6g/kg 体重，均匀分配到三餐中，训练后30分钟内补充', '训练后及时补充碳水和蛋白质，比例约 3:1，帮助肌肉修复和糖原恢复', '牛肉、鸡蛋、牛奶、鸡胸肉是优质蛋白来源，搭配米饭全麦面包提供能量', '加餐可选择坚果、酸奶、香蕉，两餐之间补充防止肌肉分解'],
    highlight: '吃够 + 练够，肌肉才会长，不要害怕碳水。',
  },
  '保持期': {
    desc: '均衡营养，维持健康体态与活力',
    tips: ['多样化食材不挑食，每天摄入12种以上不同食物，保证营养全面覆盖', '控制油脂和糖分摄入，少吃加工食品和高糖饮料，选择天然食材为主', '保持规律三餐不跳餐，早餐吃好午餐吃饱晚餐吃少，定时定量稳定代谢', '偶尔放纵不必焦虑，80%自律+20%自由，找到可持续的健康生活方式'],
    highlight: '均衡才是长久之道，享受健康生活，不被数字绑架。',
  },
};

// ====== 训练期间尽量少吃的食物 ======
export const avoidFoods = [
  { name: '奶茶', image: './食物奶茶.png', calories: '300-500', unit: 'kcal', tag: '高糖' },
  { name: '炸鸡', image: './食物炸鸡.png', calories: '400-600', unit: 'kcal', tag: '高脂' },
  { name: '薯条', image: './食物薯条.png', calories: '500', unit: 'kcal', tag: '油炸' },
  { name: '蛋糕', image: './食物蛋糕.png', calories: '300-500', unit: 'kcal', tag: '高糖' },
  { name: '饼干', image: './食物饼干.png', calories: '400', unit: 'kcal', tag: '加工食品' },
  { name: '可乐', image: './食物可乐.png', calories: '140', unit: 'kcal', tag: '高糖' },
];

// ====== Hero 功能卡片 ======
export const heroFeatures = [
  { icon: '🥗', title: '营养搭配', desc: '合理选择每日食物' },
  { icon: '💪', title: '高蛋白', desc: '帮助训练恢复' },
  { icon: '🔥', title: '热量参考', desc: '了解食物摄入' },
];
