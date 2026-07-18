# FitHer 开发进度报告

> 项目：女性健身平台（React + Vite + Tailwind CSS v4 + Framer Motion）
> 日期：2026-07-18
> 状态：MVP 框架完成，部分页面 UI 待优化

---

## 一、项目结构

```
女性健身/
├── index.html              # 入口 HTML（无 Google Fonts，使用系统字体）
├── package.json            # 依赖 + build 脚本（含图片复制）
├── vite.config.js          # Vite + React + Tailwind + SingleFile 插件
├── PROGRESS.md             # 本文件
├── public/
│   ├── favicon.svg
│   ├── hero-model.png      # 首页主图
│   └── 其他页面底图.png    # 登录/注册等页面底图
└── src/
    ├── App.jsx             # HashRouter 路由配置
    ├── main.jsx
    ├── index.css           # 全局样式 + Tailwind
    ├── pages/
    │   ├── Landing.jsx     # 首页 Landing Page ✅ 完成
    │   ├── Login.jsx       # 登录页 ✅ UI 已优化
    │   ├── Register.jsx    # 注册页 ✅ UI 已优化
    │   ├── Onboarding.jsx  # 画像采集（3步表单）⚠️ 待优化
    │   ├── Plan.jsx        # 训练计划展示 ⚠️ 待优化
    │   ├── Equipment.jsx   # 器材列表 ⚠️ 待优化
    │   ├── EquipmentDetail.jsx  # 器材详情+B站视频 ⚠️ 待优化
    │   └── Diet.jsx        # 饮食建议 ⚠️ 待优化
    ├── data/
    │   ├── rules.js        # 训练计划规则引擎
    │   ├── equipment.js    # 10个器材数据
    │   └── foods.js        # 25种食物数据
    └── utils/
        ├── auth.js         # 登录/注册/登出（localStorage）
        └── storage.js      # localStorage 工具
```

---

## 二、设计规范（主页已确定，其他页面参照）

| 设计元素 | 规范值 |
|---------|--------|
| **主粉色** | #f06a9a（按钮、图标、品牌色） |
| **渐变粉** | #F56898 → #FF9ABB（按钮 135deg 渐变） |
| **标题色** | #111（深黑） |
| **副标题色** | #999 |
| **描述文字色** | #777 |
| **毛玻璃背景** | rgba(255,255,255,0.25) + blur(20px) |
| **毛玻璃卡片圆角** | 24px |
| **胶囊按钮圆角** | 30px（999px） |
| **按钮 hover** | scale 1.05 + translateY -3px + 阴影加深 |
| **按钮 tap** | scale 0.97 |
| **按钮阴影** | 0 10px 35px rgba(240,106,154,0.25) |
| **按钮 hover 阴影** | 0 18px 50px rgba(240,106,154,0.32) |
| **按钮过渡** | 0.3s cubic-bezier(0.25, 0.8, 0.25, 1.2) |
| **输入框高度** | 46px |
| **输入框圆角** | 10px |
| **输入框聚焦** | border #f06a9a + boxShadow 0 0 0 3px rgba(240,106,154,0.12) |
| **输入框边框** | #e8e8e8 |
| **输入框 hover 边框** | #f8b2c2 |
| **Logo 图标** | w-11 h-11 rounded-xl bg-[#f06a9a] shadow-lg |
| **Logo 文字** | text-[26px] font-bold text-[#111] |
| **Logo 副标题** | text-[12px] text-[#f06a9a] "为更好的自己" |
| **Logo 布局** | flex items-center gap-3（无衬底） |
| **登录卡片宽度** | max-w-[450px], 92vw（移动端） |
| **字体** | PingFang SC / Microsoft YaHei / system-ui |

---

## 三、页面完成状态

### ✅ 已优化完成

| 页面 | 状态 | 说明 |
|------|------|------|
| **Landing.jsx** | ✅ 完成 | 首页，300行。导航 + Hero 文字 + 人物主图 + 粉色泡泡呼吸 + 底部三栏 |
| **Login.jsx** | ✅ 完成 | 邮件+密码登录，毛玻璃卡片，胶囊按钮，Logo统一，光圈背景 |
| **Register.jsx** | ✅ 完成 | 邮件注册+确认密码，样式与登录页完全统一 |

### ⚠️ 待优化

| 页面 | 需优化内容 |
|------|-----------|
| **Onboarding.jsx** | 3步表单（目标→周期→身体信息），需要统一卡片毛玻璃样式、输入框规格、按钮胶囊化、步骤指示器美化 |
| **Plan.jsx** | 训练计划展示页，日期选择器、动作列表卡片、顶部概览区 UI 升级 |
| **Equipment.jsx** | 器材分类列表，卡片网格布局、导航统一 |
| **EquipmentDetail.jsx** | 器材详情+B站 iframe 嵌入，视频容器美化、使用说明卡片 |
| **Diet.jsx** | 25种食物数据表格，需要更高级的饮食卡片展示 |

---

## 四、通用 UI 优化指南

优化其他页面时，请遵循以下原则：

1. **所有卡片** 使用 `rgba(255,255,255,0.25)` + `backdrop-filter: blur(20px)` + `border-radius: 24px`
2. **所有按钮** 使用 30px 圆角胶囊 + 主页渐变 + hover/tap 动效
3. **所有输入框** 46px 高 + 10px 圆角 + #e8e8e8 边框 + 聚焦粉光
4. **所有文字** 对齐主页色板：标题 #111、副标题 #999、描述 #777
5. **左上角 Logo** 统一为 FitHer + 为更好的自己，无衬底
6. **页面背景** 使用 `其他页面底图.png` 做背景
7. **光圈装饰** （可选）中心放 2 个柔粉泡泡，800-1100px，blur + 呼吸动画
8. **顶导航** 统一为主页导航栏样式（毛玻璃 + 粉色选中态）
9. **不要改** 表单逻辑、跳转路由、数据存储方式
10. **只优化** 视觉样式、间距、字体、质感、动效

---

## 五、技术要点

- **路由**：HashRouter，URL 格式 `index.html#/login`
- **状态**：localStorage 存储用户/画像/计划
- **构建**：`npm run build` → 单文件 `dist/index.html`（需复制图片到 dist）
- **双击打开**：`dist/index.html` 可直接双击打开（SingleFile 内嵌 JS/CSS）
- **开发服务器**：`npx vite --port 5173`

---

## 六、Git 提交历史

```
c3dedcb MVP完整版：注册→登录→画像采集→训练计划→器材教学→饮食建议
6162080 优化底部三栏质感：去卡片感、加大间距、人物微调、标题右移
842868a FitHer 女性健身平台首页 - 初版完成
c2eec26 交换器材教学和饮食建议的位置
9b3174b 登录/注册页UI优化：统一主页设计规范
d6c2d18 登录/注册页背景增加柔粉光圈呼吸动画，统一Logo样式
```
