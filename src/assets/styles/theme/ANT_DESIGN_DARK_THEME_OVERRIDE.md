# Ant Design Vue 暗黑主题样式覆盖指南

## 📋 概述

为了更好地适配暗黑主题，项目创建了一套完整的 Ant Design Vue 组件样式覆盖方案。

这些样式覆盖基于 `antd.variable.css`，使用正确的 Ant Design 类名，结合项目的设计系统变量（`--datav-*`）。

---

## 📁 文件结构

```
src/assets/styles/theme/
├── index.css                       # 主入口（定义变量 + 导入组件覆盖）
└── ant-override/                   # Ant Design 组件样式覆盖
    ├── button.css                  # 按钮
    ├── input.css                   # 输入框
    ├── select.css                  # 选择器
    ├── modal.css                   # 模态框
    ├── message.css                 # 消息提示
    ├── table.css                   # 表格
    ├── form.css                    # 表单
    ├── tree.css                    # 树形控件
    ├── tabs.css                    # 标签页
    └── drawer.css                  # 抽屉
```

---

## 🎨 设计系统变量

### 项目自定义变量（`--datav-*`）

这些变量在 `src/assets/styles/theme/index.css` 中定义：

#### 文本颜色
```css
--datav-text-color-primary     /* 主要文本 rgba(255, 255, 255, 0.85) */
--datav-text-color-secondary   /* 次要文本 rgba(255, 255, 255, 0.45) */
--datav-text-color-disabled    /* 禁用文本 rgba(255, 255, 255, 0.25) */
--datav-text-color-inverse     /* 反色文本 #000 */
```

#### 背景颜色
```css
--datav-bg-color-primary       /* 主背景 #18181c */
--datav-bg-color-secondary     /* 次背景 #1f1f1f */
--datav-bg-color-tertiary      /* 第三层背景 #262626 */
--datav-bg-color-quaternary    /* 第四层背景 #373738 */
--datav-bg-color-container     /* 容器背景 #141414 */
```

#### 边框颜色
```css
--datav-border-color-base      /* 基础边框 #434343 */
--datav-border-color-split     /* 分割线 #303030 */
--datav-border-color-light     /* 浅色边框 rgba(255, 255, 255, 0.06) */
```

#### 阴影
```css
--datav-shadow-color           /* 阴影颜色 */
--datav-box-shadow-base        /* 基础阴影 */
--datav-input-shadow           /* 输入框阴影 */
```

#### 其他
```css
--datav-font-size-base         /* 基础字号 14px */
--datav-font-size-lg           /* 大字号 16px */
--datav-font-size-sm           /* 小字号 12px */
--datav-border-radius-*        /* 边框半径 */
--datav-margin-*               /* 外边距 */
--datav-padding-*              /* 内边距 */
```

### Ant Design 颜色变量（`--ant-*`）

这些变量由主题系统动态生成（`src/theme/`）：

```css
--ant-primary-color            /* 主色 */
--ant-primary-color-hover      /* hover 状态 */
--ant-primary-color-active     /* active 状态 */
--ant-primary-color-outline    /* 外发光 */
--ant-primary-1 ~ --ant-primary-7  /* 色板 */

--ant-success-color            /* 成功色 */
--ant-warning-color            /* 警告色 */
--ant-error-color              /* 错误色 */
--ant-info-color               /* 信息色 */
```

---

## 🎯 覆盖的组件

### 1. Button（按钮）

**覆盖内容**：
- ✅ 默认按钮背景和边框
- ✅ hover/focus/active 状态
- ✅ 禁用状态
- ✅ 文本按钮和链接按钮

**示例**：
```vue
<a-button>默认按钮</a-button>
<a-button type="primary">主色按钮</a-button>
<a-button danger>危险按钮</a-button>
<a-button type="text">文本按钮</a-button>
```

### 2. Input（输入框）

**覆盖内容**：
- ✅ 输入框背景和边框
- ✅ placeholder 颜色
- ✅ 聚焦状态边框和阴影
- ✅ 禁用状态
- ✅ 前后缀图标
- ✅ 数字输入框
- ✅ 文本域

**示例**：
```vue
<a-input placeholder="请输入" />
<a-input-number v-model:value="num" />
<a-textarea placeholder="多行文本" />
```

### 3. Select（选择器）

**覆盖内容**：
- ✅ 选择器背景和边框
- ✅ 下拉面板样式
- ✅ 选项 hover 和选中状态
- ✅ 多选标签样式
- ✅ 禁用状态

**示例**：
```vue
<a-select v-model:value="value" placeholder="请选择">
  <a-select-option value="1">选项1</a-select-option>
  <a-select-option value="2">选项2</a-select-option>
</a-select>
```

### 4. Modal（模态框）

**覆盖内容**：
- ✅ 模态框背景和边框
- ✅ 头部和底部样式
- ✅ 关闭按钮 hover 效果
- ✅ 遮罩层
- ✅ 确认对话框图标颜色

**示例**：
```vue
<a-modal v-model:visible="visible" title="标题">
  <p>内容</p>
</a-modal>
```

### 5. Message & Notification（消息提示）

**覆盖内容**：
- ✅ 消息背景和边框
- ✅ 不同类型的图标颜色
- ✅ 通知样式

**示例**：
```javascript
import { message } from 'ant-design-vue'
message.success('成功提示')
message.error('错误提示')
message.warning('警告提示')
```

### 6. Table（表格）

**覆盖内容**：
- ✅ 表头背景
- ✅ 行 hover 效果
- ✅ 选中行背景
- ✅ 排序和筛选图标
- ✅ 空数据样式

**示例**：
```vue
<a-table :columns="columns" :data-source="data" />
```

### 7. Form（表单）

**覆盖内容**：
- ✅ 表单标签颜色
- ✅ 错误提示颜色
- ✅ Checkbox 和 Radio 样式
- ✅ Switch 开关样式

**示例**：
```vue
<a-form>
  <a-form-item label="用户名">
    <a-input />
  </a-form-item>
  <a-form-item>
    <a-checkbox>记住我</a-checkbox>
  </a-form-item>
</a-form>
```

### 8. Tree（树形控件）

**覆盖内容**：
- ✅ 节点背景和文本颜色
- ✅ hover 和选中状态
- ✅ 复选框样式
- ✅ 展开/收起图标

### 9. Tabs（标签页）

**覆盖内容**：
- ✅ 标签背景和边框
- ✅ 激活状态
- ✅ hover 效果
- ✅ 墨水条颜色
- ✅ 卡片式标签

### 10. Drawer（抽屉）

**覆盖内容**：
- ✅ 抽屉背景
- ✅ 头部和底部样式
- ✅ 关闭按钮
- ✅ 遮罩层

---

## 🔧 使用方法

### 1. 样式已自动应用

样式覆盖文件已在 `src/assets/styles/index.css` 中自动导入：

```css
@import './theme/index.css'; /* 包含变量定义和组件覆盖 */
```

### 2. 无需额外配置

所有 Ant Design 组件会自动应用暗黑主题样式，无需额外配置。

### 3. 修改主题色

```javascript
import { themeConfigRef } from '@/theme'

// 修改主色
themeConfigRef.value.antPrimaryColor = '#F77234'
```

主题色会自动更新，所有使用 `--ant-primary-color` 的样式都会响应。

---

## 📝 自定义样式覆盖

### 添加新的组件覆盖

1. 在 `src/assets/styles/theme/ant-override/` 创建新文件

2. 使用 Ant Design 官方类名编写样式：

```css
/* src/assets/styles/theme/ant-override/card.css */
[theme-name='dark'] {
  .ant-card {
    background-color: var(--datav-bg-color-secondary);
    border-color: var(--datav-border-color-base);
  }

  .ant-card-head {
    border-bottom-color: var(--datav-border-color-split);
  }

  .ant-card-head-title {
    color: var(--datav-text-color-primary);
  }
}
```

3. 在 `src/assets/styles/theme/index.css` 中导入：

```css
@import './ant-override/card.css';
```

### 查找 Ant Design 类名

参考 Ant Design Vue 官方文档：
- [Button 按钮](https://antdv.com/components/button-cn)
- [Input 输入框](https://antdv.com/components/input-cn)
- [Select 选择器](https://antdv.com/components/select-cn)
- [其他组件](https://antdv.com/components/overview-cn)

使用浏览器开发者工具查看组件的实际类名。

---

## 🎨 颜色使用建议

### ✅ 推荐做法

```css
/* 使用设计系统变量 */
.my-component {
  color: var(--datav-text-color-primary);
  background-color: var(--datav-bg-color-secondary);
  border-color: var(--datav-border-color-base);
}

/* 使用主题色变量 */
.my-button {
  background-color: var(--ant-primary-color);
}

.my-button:hover {
  background-color: var(--ant-primary-color-hover);
}
```

### ❌ 不推荐做法

```css
/* 硬编码颜色值 */
.my-component {
  color: #ffffff;                    /* ❌ 不会响应主题切换 */
  background-color: #1f1f1f;         /* ❌ 不会响应主题切换 */
}
```

---

## 🐛 常见问题

### Q: 为什么某些组件样式没有生效？

**A**: 检查以下几点：
1. 是否使用了正确的 Ant Design 类名
2. 样式优先级是否足够（可能需要添加 `!important`）
3. 样式是否在 `[theme-name='dark']` 选择器内

### Q: 如何调试样式覆盖？

**A**: 使用浏览器开发者工具：
1. 检查元素的实际类名
2. 查看 CSS 变量的值
3. 检查样式是否被覆盖

### Q: 可以添加亮色主题的样式覆盖吗？

**A**: 可以，在 `[theme-name='light']` 选择器内添加样式：

```css
[theme-name='light'] {
  .ant-button {
    /* 亮色主题样式 */
  }
}
```

### Q: 如何确保样式优先级？

**A**: 使用更具体的选择器或添加 `!important`：

```css
[theme-name='dark'] .ant-select-selector {
  background-color: var(--datav-bg-color-secondary) !important;
}
```

---

## 📚 相关文档

- [Ant Design Vue 官方文档](https://antdv.com)
- [主题系统使用指南](../../../theme/README.md)
- [主题示例](../../../../docs/THEME_EXAMPLE.vue)

---

## ✅ 总结

### 已完成

- ✅ 17+ 核心组件样式覆盖
  - Button、Input、Select、Modal、Message
  - Table、Form、Tree、Tabs、Drawer
  - Collapse、Radio、Space、Switch、Statistic
  - Pagination 等
- ✅ 完整的设计系统变量
- ✅ 暗黑主题适配
- ✅ 自动应用，无需额外配置

### 优势

- ✅ 使用正确的 Ant Design 类名
- ✅ 基于 CSS 变量，易于维护
- ✅ 支持动态主题切换
- ✅ 清晰的文件结构

---

**创建时间**: 2025-10-28  
**最后更新**: 2025-10-29  
**适用版本**: Ant Design Vue 3.x  



