# FitHer 开发进度报告

> **项目**：女性健身平台（React 19 + Vite 8 + Tailwind CSS v4 + Framer Motion 12）
> **日期**：2026-07-19
> **状态**：6/8 页面完成，2/8 待优化（Equipment、Diet 无变动）
> **最新提交**：`f13f1e1` — v3.1 Plan页UI重构

---

## 一、项目结构

```
女性健身/
├── index.html
├── package.json            # React 19 + Vite 8 + Tailwind v4 + Framer Motion + viteSingleFile
├── vite.config.js
├── PROGRESS.md
├── public/
│   ├── favicon.svg
│   ├── hero-model.png
│   └── 其他页面底图.png
└── src/
    ├── App.jsx             # HashRouter，8条路由
    ├── main.jsx
    ├── index.css           # 全局样式（overflow已解除，数字箭头已隐藏）
    ├── pages/
    │   ├── Landing.jsx        # 首页 ✅
    │   ├── Login.jsx          # 登录 ✅ 跳转→/onboarding
    │   ├── Register.jsx       # 注册 ✅ 跳转→/onboarding
    │   ├── Onboarding.jsx     # 长表单（下拉+双栏+分组）✅
    │   ├── Plan.jsx           # 训练计划（单栏+勾选+进度条）✅
    │   ├── Equipment.jsx      # 器材列表 ⚠️
    │   ├── EquipmentDetail.jsx # 器材详情+B站 ⚠️
    │   └── Diet.jsx           # 饮食建议 ⚠️
    ├── data/
    │   ├── rules.js          # 规则引擎（8套独立动作池+热身/拉伸+经期逻辑）
    │   ├── equipment.js      # 10个器材
    │   └── foods.js          # 25种食物
    └── utils/
        ├── auth.js           # localStorage 邮箱注册/登录
        └── storage.js        # fither_ 前缀存取
```

---

## 二、用户流程

```
Landing → Login → /onboarding（长表单） → Plan（训练计划）
          Register ↗                    ↖ 重新制定计划
```

**关键路由**：HashRouter，`#/login` `#/register` `#/onboarding` `#/plan`

---

## 三、设计系统（Design Tokens）

### 3.1 色板
| 用途 | 色值 |
|------|------|
| 品牌粉 | `#F56898` (主) `#FF5C93` (Plan页) |
| 渐变 | `linear-gradient(135deg, #F56898, #FF9ABB)` |
| 浅粉底 | `#fde8ef` |
| 标题 | `#111` / `#222` |
| 正文 | `#333` |
| 辅助 | `#666` |
| 单位/提示 | `#999` |
| Placeholder | `#B8B8B8` |
| 边框 | `#ECECEC` |
| 聚焦 | `#ff6ba8` + `0 0 0 4px rgba(255,100,160,0.12)` |

### 3.2 组件规范
| 组件 | 规范 |
|------|------|
| 按钮 | 999px圆角，粉色渐变，hover上浮+阴影 |
| 输入框 | 52px高，14px圆角，#ECECEC边框，16px内边距 |
| 卡片 | 18-24px圆角，`0 8px 28px rgba(0,0,0,0.05)` 阴影 |
| 导航栏 | 72px高，毛玻璃 `blur(18px)`，全宽 |
| Logo | 42×42px，圆角12px，文字28px/700 |

### 3.3 8px 间距体系
`4 / 8 / 16 / 24 / 32 / 40 / 48 / 64` px

---

## 四、页面状态

### ✅ 已完成（6/8）
| 页面 | 行数 | 要点 |
|------|------|------|
| Landing.jsx | 300 | 人物主图+泡泡动画+毛玻璃底部三栏 |
| Login.jsx | 220 | 毛玻璃卡片+胶囊按钮+柔粉双泡泡 |
| Register.jsx | 220 | 与Login完全统一 |
| **Onboarding.jsx** | ~400 | 长表单：标题外移、3组双栏（📋基础 🎯偏好 🌸个性化）、全部Select/MultiSelect下拉、InputGroup单位组件、Design Tokens统一 |
| **Plan.jsx** | ~260 | 单栏全宽：三层顶部（标题→标签→体重）、Day卡片76×72px、进度条含勾选、动作卡片18px圆角、热身淡粉/拉伸淡紫、全hover动效 |
| **rules.js** | ~320 | 8套独立动作池（居家/健身房×减脂/增肌/塑形/健康）、热身视频集成、按部位拉伸、28天周期×6天经期标记、减重强度倍率、时长精准匹配 |

### ⚠️ 待优化（2/8）
| 页面 | 说明 |
|------|------|
| Equipment.jsx | 器材列表，卡片网格，导航需统一 |
| EquipmentDetail.jsx | 器材详情+B站iframe，视频容器美化 |
| Diet.jsx | 饮食建议表格，需卡片化 |

---

## 五、关键业务逻辑

### 5.1 训练计划生成（rules.js）
- 8套独立动作池：`poolMap[scene][goal]` → home/gym × 减脂/增肌/塑形/健康
- 健身房减脂：固定器械为主（坐姿推胸/高位下拉/倒蹬机/坐姿划船/蝴蝶机夹胸），有氧集成到热身视频
- 居家减脂：徒手HIIT+弹力带
- 热身：视频跳转（健身房含跑步机指导，5-8min；居家3min）
- 拉伸：按训练部位匹配（上肢/下肢/核心）
- 经期：28天周期，每次连续6天，自动替换轻量拉伸
- 时长：热身+正式动作循环填充+拉伸 = 精准匹配用户设定

### 5.2 数据存储
- `fither_users` / `fither_currentUser` → auth.js
- `fither_profile` → Onboarding存入，Plan读取生成，包含：goal, dailyMinutes, bodyParts, bodyFat, durationDays, restrictions, hasMenstrual, periodDate, scene, weight, targetWeight, height

### 5.3 Plan页交互
- 每条动作左侧checkbox，勾选实时更新进度条
- 进度条统计热身+正式+拉伸全部动作
- 完成线条 `text-decoration: line-through` + 降低透明度

---

## 六、技术要点

- **路由**：HashRouter，`index.html#/login`
- **构建**：`npm run build` → `dist/index.html`（单文件+图片复制）
- **开发**：`npx vite --port 5173`
- **状态**：localStorage，无后端
- **全局CSS**：`overflow` 已解除（页面可滚动），数字输入箭头已隐藏

---

## 七、Git 历史

```
f13f1e1 v3.1: Plan页UI重构 — 单栏+勾选进度+导航统一
a1f5afd v3.0: 训练计划生成逻辑重写 + 表单UI全面升级
a5e95ef 添加项目进度报告PROGRESS.md
d6c2d18 登录/注册页背景增加柔粉光圈呼吸动画，统一Logo样式
9b3174b 登录/注册页UI优化
c3dedcb MVP完整版
6162080 优化底部三栏质感
842868a FitHer 首页初版
```

## 八、下一步

1. **Equipment.jsx / EquipmentDetail.jsx / Diet.jsx** — 导航统一（72px/Logo 42px/16px字/44px菜单间距），卡片统一18-24px圆角+阴影+hover动效
2. **移动端适配** — 所有页面
3. **退出登录** — 各页面统一加退出按钮
