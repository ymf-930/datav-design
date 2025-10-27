<template>
  <div class="scroll-bar" :style="containerStyle">
    <div class="scroll-bar__wrap">
      <div class="scroll-bar__view" ref="scrollViewRef" @scroll="handleScroll">
        <slot></slot>
      </div>
    </div>
    <div 
      v-if="scrollState.vertical.show"
      class="scroll-bar__track scroll-bar__track--vertical"
      @mousedown="(e) => startDrag(e, 'vertical')"
    >
      <div 
        class="scroll-bar__thumb scroll-bar__thumb--vertical"
        :style="verticalThumbStyle"
        @mousedown.stop="(e) => handleThumbMouseDown(e, 'vertical')"
      ></div>
    </div>
    <div 
      v-if="scrollState.horizontal.show"
      class="scroll-bar__track scroll-bar__track--horizontal"
      @mousedown="(e) => startDrag(e, 'horizontal')"
    >
      <div 
        class="scroll-bar__thumb scroll-bar__thumb--horizontal"
        :style="horizontalThumbStyle"
        @mousedown.stop="(e) => handleThumbMouseDown(e, 'horizontal')"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

defineOptions({
  name: 'ScrollContainer',
})

/**
 * ScrollContainer 组件 Props
 * 自定义滚动容器，使用绝对定位的滚动条，不占用内容宽度
 */
const props = defineProps({
  height: { type: [String, Number], default: '100%' },
  width: { type: [String, Number], default: '100%' },
  maxHeight: { type: [String, Number], default: null },
  maxWidth: { type: [String, Number], default: null },
  scrollbarSize: { type: Number, default: 6 },
  scrollbarColor: { type: String, default: 'rgba(163, 166, 173, 0.6)' }, // #a3a6ad 的 rgba 模式
  scrollbarHoverColor: { type: String, default: 'rgba(163, 166, 173, 0.8)' },
  scrollBehavior: {
    type: String,
    default: 'smooth',
    validator: (value) => ['smooth', 'auto'].includes(value),
  },
})

const emit = defineEmits(['scroll'])

// DOM 引用
const scrollViewRef = ref(null) // 滚动视图容器的引用
const resizeObserver = ref(null) // ResizeObserver 实例，用于监听内容尺寸变化

/**
 * 滚动条状态管理
 * vertical/horizontal: 垂直/水平滚动条状态
 * show: 是否显示滚动条
 * size: 滚动条滑块大小（百分比，0-100）
 * move: 滚动条滑块位置（百分比，0-100）
 */
const scrollState = ref({
  vertical: { show: false, size: 0, move: 0 },
  horizontal: { show: false, size: 0, move: 0 },
})

// 拖拽状态标记
const isDragging = ref({ vertical: false, horizontal: false })

// 拖拽开始时的鼠标位置
const dragStartPos = ref({ vertical: 0, horizontal: 0 })

/**
 * 容器样式计算
 * 处理容器的高度、宽度等尺寸属性，并设置CSS变量
 */
const containerStyle = computed(() => {
  const style = {
    '--scrollbar-size': `${props.scrollbarSize}px`,
    '--scrollbar-color': props.scrollbarColor,
    '--scrollbar-hover-color': props.scrollbarHoverColor,
  }
  
  Object.entries({ height: props.height, width: props.width, maxHeight: props.maxHeight, maxWidth: props.maxWidth })
    .forEach(([key, value]) => {
      if (value) style[key] = typeof value === 'number' ? `${value}px` : value
    })
  
  return style
})

/**
 * 滚动条滑块样式计算
 * size 和 move 是百分比（0-100），需要使用 % 单位
 */
const verticalThumbStyle = computed(() => ({
  height: `${scrollState.value.vertical.size}%`,
  top: `${scrollState.value.vertical.move}%`,
}))

const horizontalThumbStyle = computed(() => ({
  width: `${scrollState.value.horizontal.size}%`,
  left: `${scrollState.value.horizontal.move}%`,
}))

/**
 * 更新滚动条状态
 * 核心函数：计算滚动条的显示状态、滑块大小和位置
 */
function updateScrollbar() {
  if (!scrollViewRef.value) return
  
  const { scrollHeight, scrollTop, clientHeight, scrollWidth, scrollLeft, clientWidth } = scrollViewRef.value
  
  // 更新滚动条状态（垂直和水平）
  updateScrollbarAxis('vertical', scrollHeight, scrollTop, clientHeight)
  updateScrollbarAxis('horizontal', scrollWidth, scrollLeft, clientWidth)
}

/**
 * 更新单个轴向的滚动条状态
 */
function updateScrollbarAxis(axis, scrollSize, scrollPos, clientSize) {
  if (scrollSize > clientSize) {
    const thumbSize = Math.max((clientSize / scrollSize) * 100, 20)
    scrollState.value[axis] = {
      show: true,
      size: thumbSize,
      move: (scrollPos / (scrollSize - clientSize)) * (100 - thumbSize),
    }
  } else {
    scrollState.value[axis].show = false
  }
}

/**
 * 滚动事件处理
 * 当用户滚动内容时，更新滚动条位置并触发事件
 */
function handleScroll(event) {
  updateScrollbar()
  emit('scroll', {
    scrollTop: event.target.scrollTop,
    scrollLeft: event.target.scrollLeft,
    event,
  })
}

/**
 * 滚动条滑块拖拽开始
 */
function handleThumbMouseDown(e, type) {
  isDragging.value[type] = true
  dragStartPos.value[type] = type === 'vertical' ? e.clientY : e.clientX
  e.preventDefault()
}

/**
 * 点击滚动条轨道开始拖拽
 */
function startDrag(e, type) {
  if (!scrollViewRef.value) return
  
  const isVertical = type === 'vertical'
  const { scrollHeight, clientHeight, scrollWidth, clientWidth } = scrollViewRef.value
  const scrollSize = isVertical ? scrollHeight : scrollWidth
  const clientSize = isVertical ? clientHeight : clientWidth
  const offset = isVertical ? e.offsetY : e.offsetX
  const thumbSize = scrollState.value[type].size
  
  // 计算点击位置对应的滚动位置
  const scrollPosition = (offset / (clientSize - (thumbSize / 100 * clientSize))) * (scrollSize - clientSize)
  
  // 设置滚动位置
  scrollViewRef.value[isVertical ? 'scrollTop' : 'scrollLeft'] = scrollPosition
  
  updateScrollbar()
  isDragging.value[type] = true
  dragStartPos.value[type] = isVertical ? e.clientY : e.clientX
}

/**
 * 鼠标移动事件处理
 */
function handleMouseMove(e) {
  if (isDragging.value.vertical) {
    handleDragMove(e, 'vertical')
  }
  if (isDragging.value.horizontal) {
    handleDragMove(e, 'horizontal')
  }
}

/**
 * 拖拽移动处理
 */
function handleDragMove(e, type) {
  if (!scrollViewRef.value) return
  
  const isVertical = type === 'vertical'
  const delta = isVertical ? e.clientY - dragStartPos.value[type] : e.clientX - dragStartPos.value[type]
  const { scrollHeight, clientHeight, scrollWidth, clientWidth } = scrollViewRef.value
  const scrollSize = isVertical ? scrollHeight : scrollWidth
  const clientSize = isVertical ? clientHeight : clientWidth
  const thumbSize = scrollState.value[type].size
  
  // 根据鼠标移动距离计算滚动距离
  const deltaScroll = (delta / (clientSize - (thumbSize / 100 * clientSize))) * (scrollSize - clientSize)
  
  // 更新滚动位置
  scrollViewRef.value[isVertical ? 'scrollTop' : 'scrollLeft'] += deltaScroll
  
  updateScrollbar()
  dragStartPos.value[type] = isVertical ? e.clientY : e.clientX
}

/**
 * 鼠标抬起事件处理
 * 结束拖拽状态
 */
function handleMouseUp() {
  isDragging.value.vertical = false
  isDragging.value.horizontal = false
}

/**
 * 滚动到指定位置
 */
function scrollTo(top, left) {
  if (scrollViewRef.value) {
    scrollViewRef.value.scrollTo({
      top: top || 0,
      left: left || 0,
      behavior: props.scrollBehavior,
    })
  }
}

/**
 * 滚动到顶部
 */
function scrollToTop() {
  scrollTo(0)
}

/**
 * 滚动到底部
 */
function scrollToBottom() {
  if (scrollViewRef.value) {
    scrollTo(scrollViewRef.value.scrollHeight - scrollViewRef.value.clientHeight)
  }
}


/**
 * 组件挂载后的初始化
 * 1. 注册全局鼠标事件监听器（用于拖拽滚动条）
 * 2. 初始化滚动条状态
 * 3. 监听容器内容尺寸变化（ResizeObserver）
 */
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  
  nextTick(() => {
    // 首次更新滚动条状态
    updateScrollbar()
    
    // 监听容器内容变化，当内容尺寸变化时更新滚动条
    resizeObserver.value = new ResizeObserver(updateScrollbar)
    if (scrollViewRef.value) {
      resizeObserver.value.observe(scrollViewRef.value)
    }
  })
})

/**
 * 组件卸载时的清理
 * 移除事件监听器，断开 ResizeObserver
 */
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  resizeObserver.value?.disconnect()
})

/**
 * 暴露给父组件的方法
 */
defineExpose({
  scrollTo,
  scrollToTop,
  scrollToBottom,
})
</script>

<style scoped>
/* 滚动容器根元素 */
.scroll-bar {
  position: relative;
  height: 100%;
  width: 100%;
}

/* 滚动容器包装层 */
.scroll-bar__wrap {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.scroll-bar__wrap::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

/* 实际滚动的内容区域 */
.scroll-bar__view {
  height: 100%;
  overflow: auto;
}

.scroll-bar__view::-webkit-scrollbar {
  display: none;
}

/* 滚动条轨道 - 默认隐藏，悬浮时显示 */
.scroll-bar__track {
  position: absolute;
  background-color: rgba(163, 166, 173, 0.1);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 999;
}

.scroll-bar:hover .scroll-bar__track {
  opacity: 1;
}

.scroll-bar__track:hover {
  background-color: rgba(163, 166, 173, 0.2);
}

/* 垂直滚动条轨道 */
.scroll-bar__track--vertical {
  right: 0;
  top: 0;
  width: var(--scrollbar-size);
  height: 100%;
  cursor: pointer;
}

/* 水平滚动条轨道 */
.scroll-bar__track--horizontal {
  bottom: 0;
  left: 0;
  height: var(--scrollbar-size);
  width: 100%;
  cursor: pointer;
}

/* 滚动条滑块 - 默认隐藏，悬浮时显示 */
.scroll-bar__thumb {
  position: absolute;
  background-color: var(--scrollbar-color);
  border-radius: calc(var(--scrollbar-size) / 2);
  cursor: pointer;
  user-select: none;
  opacity: 0;
  transition: opacity 0.3s, background-color 0.3s;
  z-index: 1000;
}

.scroll-bar:hover .scroll-bar__thumb {
  opacity: 1;
}

.scroll-bar__thumb:hover {
  background-color: var(--scrollbar-hover-color);
}

/* 垂直滚动条滑块 */
.scroll-bar__thumb--vertical {
  right: 0;
  width: var(--scrollbar-size);
  min-height: 20px;
}

/* 水平滚动条滑块 */
.scroll-bar__thumb--horizontal {
  bottom: 0;
  height: var(--scrollbar-size);
  min-width: 20px;
}

</style>

