<template>
  <div 
    ref="scrollContainerRef" 
    class="scroll-container"
    :class="containerClass"
    :style="containerStyle"
    @scroll="handleScroll"
  >
    <div 
      ref="scrollContentRef" 
      class="scroll-content"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

defineOptions({
  name: 'ScrollContainer',
})

const props = defineProps({
  // 容器高度
  height: {
    type: [String, Number],
    default: '100%',
  },
  // 容器宽度
  width: {
    type: [String, Number],
    default: '100%',
  },
  // 最大高度
  maxHeight: {
    type: [String, Number],
    default: null,
  },
  // 最大宽度
  maxWidth: {
    type: [String, Number],
    default: null,
  },
  // 滚动条大小
  scrollbarSize: {
    type: Number,
    default: 8,
  },
  // 滚动条颜色
  scrollbarColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.2)',
  },
  // 滚动条悬停颜色
  scrollbarHoverColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.4)',
  },
  // 滚动行为
  scrollBehavior: {
    type: String,
    default: 'smooth',
    validator: (value) => ['smooth', 'auto'].includes(value),
  },
})

const emit = defineEmits(['scroll'])

// 引用
const scrollContainerRef = ref(null)

// 计算属性
const containerClass = computed(() => ({
  'scroll-container-auto': props.scrollBehavior === 'auto',
}))

const containerStyle = computed(() => {
  const style = {
    '--scrollbar-size': `${props.scrollbarSize}px`,
    '--scrollbar-color': props.scrollbarColor,
    '--scrollbar-hover-color': props.scrollbarHoverColor,
  }
  
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.maxHeight) {
    style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  }
  if (props.maxWidth) {
    style.maxWidth = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
  }
  
  return style
})

// 方法
function handleScroll(event) {
  emit('scroll', {
    scrollTop: event.target.scrollTop,
    scrollLeft: event.target.scrollLeft,
    event,
  })
}

function scrollTo(top, left) {
  if (scrollContainerRef.value) {
    scrollContainerRef.value.scrollTo({
      top: top || 0,
      left: left || 0,
      behavior: props.scrollBehavior,
    })
  }
}

function scrollToTop() {
  scrollTo(0)
}

function scrollToBottom() {
  if (scrollContainerRef.value) {
    scrollTo(scrollContainerRef.value.scrollHeight - scrollContainerRef.value.clientHeight)
  }
}

function scrollToLeft() {
  scrollTo(0, 0)
}

function scrollToRight() {
  if (scrollContainerRef.value) {
    scrollTo(0, scrollContainerRef.value.scrollWidth - scrollContainerRef.value.clientWidth)
  }
}

// 暴露方法
defineExpose({
  scrollTo,
  scrollToTop,
  scrollToBottom,
  scrollToLeft,
  scrollToRight,
})
</script>

<style scoped>
.scroll-container {
  position: relative;
  overflow: auto;
  background-color: transparent;
}

.scroll-content {
  position: relative;
}

.scroll-container-auto .scroll-content {
  transition: none;
}

/* 自定义滚动条样式 */
.scroll-container::-webkit-scrollbar {
  width: var(--scrollbar-size);
  height: var(--scrollbar-size);
}

.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-color);
  border-radius: calc(var(--scrollbar-size) / 2);
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-hover-color);
}

/* Firefox 滚动条样式 */
.scroll-container {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-color) transparent;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .scroll-container {
    --scrollbar-color: rgba(255, 255, 255, 0.2);
    --scrollbar-hover-color: rgba(255, 255, 255, 0.4);
  }
}
</style>
