<template>
  <div class="dv-wrapper" :style="wrapperStyle">
    <svg
      :width="svgWidth"
      :height="svgHeight"
      :style="svgStyle"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 定义箭头标记 -->
      <defs>
        <marker
          v-if="config.arrowStyle !== 'none'"
          id="arrowhead-straight"
          :markerWidth="arrowSize"
          :markerHeight="arrowSize"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon
            :points="arrowPoints"
            :fill="config.color"
          />
        </marker>
      </defs>
      
      <!-- 主线段 -->
      <line
        :x1="lineConfig.x1"
        :y1="lineConfig.y1"
        :x2="lineConfig.x2"
        :y2="lineConfig.y2"
        :stroke="config.color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="dashArray"
        stroke-linecap="round"
        :marker-end="config.arrowStyle === 'end' || config.arrowStyle === 'both' ? 'url(#arrowhead-straight)' : undefined"
        :marker-start="config.arrowStyle === 'start' || config.arrowStyle === 'both' ? 'url(#arrowhead-straight)' : undefined"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'VStraightLine',
})

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// config 配置项
const config = computed(() => props.data.config)

const wrapperStyle = computed(() => {
  return {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

const svgStyle = computed(() => {
  return {
    overflow: 'visible',
  }
})

// SVG尺寸计算
const svgWidth = computed(() => {
  const { w } = props.data.attr
  return w
})

const svgHeight = computed(() => {
  const { h } = props.data.attr
  return h
})

// 计算线段的位置
const lineConfig = computed(() => {
  const { w, h } = props.data.attr
  const { direction } = config.value
  
  if (direction === 'horizontal') {
    // 水平线段
    return {
      x1: 0,
      y1: h / 2,
      x2: w,
      y2: h / 2
    }
  } else if (direction === 'vertical') {
    // 垂直线段
    return {
      x1: w / 2,
      y1: 0,
      x2: w / 2,
      y2: h
    }
  }
  
  // 默认水平
  return {
    x1: 0,
    y1: h / 2,
    x2: w,
    y2: h / 2
  }
})

// 计算线段粗细 - 使用config中的width
const strokeWidth = computed(() => {
  return config.value.width
})

// 计算虚线样式
const dashArray = computed(() => {
  const { dashStyle } = config.value
  if (dashStyle === 'solid') return 'none'
  if (dashStyle === 'dashed') return '5,5'
  return 'none'
})

// 计算箭头尺寸
const arrowSize = computed(() => {
  const strokeWidth = config.value.width
  return Math.max(strokeWidth * 2, 6)
})

// 计算箭头形状点坐标
const arrowPoints = computed(() => {
  const size = arrowSize.value
  return `0,0 ${size},${size/2} 0,${size}`
})
</script>

<style scoped>
.dv-wrapper {
  position: relative;
}
</style>
