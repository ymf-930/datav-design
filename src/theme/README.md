# 主题系统使用指南

## 🎯 快速开始

### 修改主题色（一行代码）

```javascript
import { themeConfigRef } from '@/theme'

// 修改主色
themeConfigRef.value.antPrimaryColor = '#F77234'
```

### 在 CSS 中使用

```css
/* 主色 */
.my-button {
  background-color: var(--ant-primary-color);
}

/* hover 状态 */
.my-button:hover {
  background-color: var(--ant-primary-color-hover);
}

/* 浅色背景 */
.light-bg {
  background-color: var(--ant-primary-1);  /* 90% 透明度 */
}

/* 最浅背景 */
.lighter-bg {
  background-color: var(--ant-primary-7);  /* 10% 透明度，最浅 */
}

/* 聚焦阴影 */
.my-input:focus {
  box-shadow: 0 0 0 2px var(--ant-primary-color-outline);
}
```

---

## 📊 生成的 CSS 变量

修改 `antPrimaryColor` 后，系统会自动生成以下变量：

### 主题色变量

```css
--ant-primary-color          /* 主色（100% 不透明）*/
--ant-primary-color-hover    /* hover 状态（更亮）*/
--ant-primary-color-active   /* active 状态（更暗）*/
--ant-primary-color-outline  /* 外发光阴影（20% 透明度）*/
```

### 色板（rgba 透明度渐变）

```css
--ant-primary-1  /* rgba(r, g, b, 0.9)  - 90% 透明度 */
--ant-primary-2  /* rgba(r, g, b, 0.8)  - 80% 透明度 */
--ant-primary-3  /* rgba(r, g, b, 0.65) - 65% 透明度 */
--ant-primary-4  /* rgba(r, g, b, 0.5)  - 50% 透明度 */
--ant-primary-5  /* rgba(r, g, b, 0.35) - 35% 透明度 */
--ant-primary-6  /* rgba(r, g, b, 0.2)  - 20% 透明度 */
--ant-primary-7  /* rgba(r, g, b, 0.1)  - 10% 透明度（最浅）*/
```

**说明**：`--ant-primary-color` 是原色（最深），1-7 逐渐变浅。

### 其他颜色

同样的规则适用于：
- `antSuccessColor` → `--ant-success-*`
- `antWarningColor` → `--ant-warning-*`
- `antErrorColor` → `--ant-error-*`
- `antInfoColor` → `--ant-info-*`

---

## 🏗️ 文件结构

```
src/theme/
├── index.js                    # 主入口，导出所有功能
├── config/
│   ├── default-theme.js        # 默认主题配置
│   └── *.json                  # 预设主题配置
├── hooks/
│   └── index.js                # 主题 hooks（themeConfigRef、useThemeInit）
├── utils/
│   ├── css-vars.js             # CSS 变量生成工具
│   └── caches.js               # 主题缓存管理
└── components/
    ├── index.vue               # 主题选择器
    ├── GlobalTheme.vue         # 全局主题管理
    └── CustomTheme.vue         # 自定义主题管理
```

---

## 🎨 预设主题色

内置 10 种精选主题色：

| 颜色名称 | 色值 |
|---------|------|
| 科技蓝 | #1890FF |
| 极致蓝 | #165DFF |
| 碧涛青 | #14C9C9 |
| 仙野绿 | #00B42A |
| 暗夜紫 | #722ED1 |
| 青春紫 | #D91AD9 |
| 浪漫红 | #F53F3F |
| 活力橙 | #F77234 |
| 黄昏 | #FF9800 |
| 玫瑰红 | #F5319D |

使用方式：

```javascript
import { ThemeMainColors } from '@/theme'

themeConfigRef.value.antPrimaryColor = ThemeMainColors[0]  // 科技蓝
```

---

## 🔧 高级用法

### 1. 监听主题变化

```javascript
import { watch } from 'vue'
import { themeConfigRef } from '@/theme'

watch(
  () => themeConfigRef.value.antPrimaryColor,
  (newColor) => {
    console.log('主题色已更改:', newColor)
  }
)
```

### 2. 加载预设配置

```javascript
import { loadConfig } from '@/theme'

loadConfig({
  antPrimaryColor: '#722ED1',
  antSuccessColor: '#00B42A',
  // ... 其他颜色
})
```

### 3. 判断是否为当前主题

```javascript
import { isThemeActive } from '@/theme'

const isActive = isThemeActive({
  antPrimaryColor: '#1890FF'
})
```

---

## 🎯 项目设计系统变量

在 `src/assets/styles/theme/base.css` 中定义：

### 文本颜色
```css
--datav-text-color-primary     /* 主要文本 */
--datav-text-color-secondary   /* 次要文本 */
--datav-text-color-disabled    /* 禁用文本 */
```

### 背景颜色
```css
--datav-bg-color-primary       /* 主背景 */
--datav-bg-color-secondary     /* 次背景 */
--datav-bg-color-tertiary      /* 第三层背景 */
```

### 边框颜色
```css
--datav-border-color-base      /* 基础边框 */
--datav-border-color-split     /* 分割线 */
```

### 其他
```css
--datav-font-size-*            /* 字号 */
--datav-border-radius-*        /* 圆角 */
--datav-shadow-*               /* 阴影 */
```

---

## 💡 使用建议

### ✅ 推荐做法

```css
/* 使用 CSS 变量 */
.my-component {
  color: var(--datav-text-color-primary);
  background-color: var(--ant-primary-1);
  border: 1px solid var(--datav-border-color-base);
}

/* hover 使用主题色 */
.my-component:hover {
  border-color: var(--ant-primary-color);
}
```

### ❌ 避免硬编码

```css
/* ❌ 不要硬编码颜色 */
.my-component {
  color: #ffffff;           /* 不会响应主题切换 */
  background-color: #1890ff; /* 不会响应主题切换 */
}
```

---

## 📦 持久化存储

主题配置自动保存到 `localStorage`，键名为 `__SCHEMA_THEME__`。

刷新页面后会自动恢复上次的主题设置。

### 清除缓存

```javascript
localStorage.removeItem('__SCHEMA_THEME__')
location.reload()
```

---

## 🎨 Ant Design 组件主题覆盖

项目已对以下组件进行了暗黑主题适配：

✅ Button、Input、Select、Modal、Message  
✅ Table、Form、Tree、Tabs、Drawer  
✅ Collapse、Radio、Space、Switch、Statistic  
✅ Pagination

覆盖文件位置：`src/assets/styles/theme/ant-override/`

所有组件会自动应用暗黑主题，无需额外配置。

---

## 🔍 API 参考

### themeConfigRef

响应式主题配置对象。

```typescript
interface ThemeConfig {
  antPrimaryColor: string
  antSuccessColor: string
  antWarningColor: string
  antErrorColor: string
  antInfoColor: string
  binColorPrimary: string  // 兼容旧版
}
```

### useThemeInit()

初始化主题系统（在 App.vue 中调用）。

### loadConfig(config)

加载主题配置。

### isThemeActive(config)

判断配置是否为当前激活的主题。

---

## 🐛 常见问题

### Q: 主题色没有立即生效？

A: 确保在 `App.vue` 中调用了 `useThemeInit()`。

### Q: 如何在 JS 中获取主题色？

A: 
```javascript
import { themeConfigRef } from '@/theme'

const color = themeConfigRef.value.antPrimaryColor
```

### Q: 色板 1-7 的区别？

A: 
- `--ant-primary-color` 是原色（最深、100% 不透明）
- `--ant-primary-1` 比原色浅（90% 透明度）
- `--ant-primary-7` 最浅（10% 透明度）

---

## 📚 相关文档

- [Ant Design Vue 官方文档](https://antdv.com)
- 组件覆盖详情：`src/assets/styles/theme/ant-override/`

---

**版本**: v2.0  
**最后更新**: 2025-10-29  

