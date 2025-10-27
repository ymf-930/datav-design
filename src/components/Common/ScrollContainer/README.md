# ScrollContainer 组件使用说明

## 概述

`ScrollContainer` 是一个自定义的滚动容器组件，它提供了完整的滚动功能，包括自定义滚动条样式、拖拽滚动、平滑滚动等特性。

## 特性

- ✅ **自定义滚动条**: 美观的滚动条样式，支持暗色主题
- ✅ **拖拽滚动**: 支持拖拽滚动条进行滚动
- ✅ **平滑滚动**: 支持平滑滚动动画
- ✅ **响应式**: 自动适应内容大小变化
- ✅ **高度可配置**: 支持固定高度、最大高度等
- ✅ **事件支持**: 提供滚动事件回调

## 基本使用

```vue
<template>
  <ScrollContainer height="300px">
    <div v-for="item in 50" :key="item">
      内容项 {{ item }}
    </div>
  </ScrollContainer>
</template>

<script setup>
import ScrollContainer from '@/components/Common/ScrollContainer/index.vue'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `height` | String/Number | '100%' | 容器高度 |
| `width` | String/Number | '100%' | 容器宽度 |
| `maxHeight` | String/Number | null | 最大高度 |
| `maxWidth` | String/Number | null | 最大宽度 |
| `scrollbarSize` | Number | 8 | 滚动条大小 |
| `scrollbarColor` | String | 'rgba(0, 0, 0, 0.2)' | 滚动条颜色 |
| `scrollbarHoverColor` | String | 'rgba(0, 0, 0, 0.4)' | 滚动条悬停颜色 |
| `showVerticalScrollbar` | Boolean | true | 是否显示垂直滚动条 |
| `showHorizontalScrollbar` | Boolean | true | 是否显示水平滚动条 |
| `scrollBehavior` | String | 'smooth' | 滚动行为 ('smooth'/'auto') |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `scroll` | `{ scrollTop, scrollLeft, event }` | 滚动时触发 |

## 方法

通过 ref 可以调用以下方法：

| 方法名 | 参数 | 说明 |
|--------|------|------|
| `scrollTo` | `(top, left)` | 滚动到指定位置 |
| `scrollToTop` | - | 滚动到顶部 |
| `scrollToBottom` | - | 滚动到底部 |
| `scrollToLeft` | - | 滚动到左侧 |
| `scrollToRight` | - | 滚动到右侧 |
| `updateScrollbar` | - | 更新滚动条 |

## 使用示例

### 1. 基本滚动容器

```vue
<template>
  <ScrollContainer height="400px">
    <div class="content">
      <!-- 你的内容 -->
    </div>
  </ScrollContainer>
</template>
```

### 2. 带事件监听的滚动容器

```vue
<template>
  <ScrollContainer 
    height="300px" 
    @scroll="handleScroll"
    ref="scrollRef"
  >
    <div v-for="item in items" :key="item.id">
      {{ item.content }}
    </div>
  </ScrollContainer>
</template>

<script setup>
import { ref } from 'vue'

const scrollRef = ref(null)

function handleScroll({ scrollTop, scrollLeft }) {
  console.log('滚动位置:', { scrollTop, scrollLeft })
}

// 滚动到顶部
function scrollToTop() {
  scrollRef.value?.scrollToTop()
}
</script>
```

### 3. 自定义样式的滚动容器

```vue
<template>
  <ScrollContainer 
    height="500px"
    scrollbar-size="12"
    scrollbar-color="rgba(255, 0, 0, 0.3)"
    scrollbar-hover-color="rgba(255, 0, 0, 0.6)"
  >
    <div class="long-content">
      <!-- 长内容 -->
    </div>
  </ScrollContainer>
</template>
```

## 注意事项

1. **性能**: 组件使用 ResizeObserver 监听内容变化，在不需要时记得销毁
2. **样式**: 滚动条样式会自动适配暗色主题
3. **兼容性**: 支持现代浏览器，IE 需要 polyfill
4. **事件**: 滚动事件会频繁触发，建议使用防抖处理
