<template>
  <div 
    class="dv-wrapper" 
    :style="wrapperStyle"
    @mouseenter="showHandles = true"
    @mouseleave="showHandles = false"
  >
    <svg
      :width="svgWidth"
      :height="svgHeight"
      :style="svgStyle"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 定义箭头标记 -->
      <defs>
        <!-- 终点箭头（向右）- 箭头后端对准线段端点 -->
        <marker
          v-if="config.arrowStyle === 'end' || config.arrowStyle === 'both'"
          id="arrowhead-end"
          :markerWidth="arrowSize"
          :markerHeight="arrowSize"
          refX="0"
          :refY="arrowSize / 2"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon
            :points="arrowPoints"
            :fill="config.color"
          />
        </marker>
        
        <!-- 起点箭头（向左）- 箭头后端对准线段端点 -->
        <marker
          v-if="config.arrowStyle === 'start' || config.arrowStyle === 'both'"
          id="arrowhead-start"
          :markerWidth="arrowSize"
          :markerHeight="arrowSize"
          :refX="arrowSize"
          :refY="arrowSize / 2"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon
            :points="arrowPointsStart"
            :fill="config.color"
          />
        </marker>
      </defs>
      
      <!-- 主线段 - 仅当电流动画启用时隐藏 -->
      <line
        v-if="!(config.enableAnimation && config.animationType === 'electric')"
        :x1="actualCoords.x1"
        :y1="actualCoords.y1"
        :x2="actualCoords.x2"
        :y2="actualCoords.y2"
        :stroke="config.color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="dashArray"
        stroke-linecap="butt"
        :marker-end="config.arrowStyle === 'end' || config.arrowStyle === 'both' ? 'url(#arrowhead-end)' : undefined"
        :marker-start="config.arrowStyle === 'start' || config.arrowStyle === 'both' ? 'url(#arrowhead-start)' : undefined"
      />
      
      <!-- 电流动画 - 短虚线流动 -->
      <line
        v-if="config.enableAnimation && config.animationType === 'electric'"
        :x1="actualCoords.x1"
        :y1="actualCoords.y1"
        :x2="actualCoords.x2"
        :y2="actualCoords.y2"
        :stroke="config.animationColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="electricDashArray"
        stroke-linecap="butt"
      >
        <animate
          attributeName="stroke-dashoffset"
          :from="config.animationReverse ? '0' : '1000'"
          :to="config.animationReverse ? '1000' : '0'"
          :dur="`${config.animationDelay}s`"
          repeatCount="indefinite"
        />
      </line>
      
      <!-- 水珠动画 - 流动虚线（圆角） -->
      <line
        v-if="config.enableAnimation && config.animationType === 'water'"
        :x1="actualCoords.x1"
        :y1="actualCoords.y1"
        :x2="actualCoords.x2"
        :y2="actualCoords.y2"
        :stroke="config.animationColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="waterDashArray"
        stroke-linecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          :from="config.animationReverse ? '0' : '1000'"
          :to="config.animationReverse ? '1000' : '0'"
          :dur="`${config.animationDelay}s`"
          repeatCount="indefinite"
        />
      </line>
      
      <!-- 轨迹动画 - 圆点移动 -->
      <circle
        v-if="config.enableAnimation && config.animationType === 'track'"
        :r="config.trackBallRadius"
        :fill="config.animationColor"
      >
        <animateMotion
          :path="`M ${actualCoords.x1} ${actualCoords.y1} L ${actualCoords.x2} ${actualCoords.y2}`"
          :dur="`${config.animationDelay}s`"
          repeatCount="indefinite"
          :keyPoints="animationReverse ? '1;0' : '0;1'"
          keyTimes="0;1"
          calcMode="linear"
        />
      </circle>

      <!-- 编辑模式：悬浮时显示可拖拽端点 -->
      <template v-if="isEditorMode && showHandles">
        <circle
          v-for="(point, index) in endpoints"
          :key="index"
          :cx="actualCoords[index === 0 ? 'x1' : 'x2']"
          :cy="actualCoords[index === 0 ? 'y1' : 'y2']"
          :r="8"
          :fill="config.color"
          stroke="#fff"
          :stroke-width="2"
          class="endpoint-control"
          :style="{ cursor: 'move' }"
          @mousedown.stop="startDragEndpoint($event, index)"
        />
      </template>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref, watch, inject } from 'vue'
import { useStore } from '@/store'

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

// 获取渲染模式
const renderMode = inject('RenderModel', 'editor')
const isEditorMode = computed(() => renderMode === 'editor')

// 获取画布缩放比例
const { schemaStore, storeToRefs } = useStore()
const { canvas } = storeToRefs(schemaStore)
const scale = computed(() => canvas.value.scale)

// 悬停时显示手柄
const showHandles = ref(false)

// 解析端点坐标
const endpoints = ref([{ x: 10, y: 50 }, { x: 90, y: 50 }])

watch(
  () => [config.value.startX, config.value.startY, config.value.endX, config.value.endY],
  () => {
    endpoints.value = [
      { x: config.value.startX || 10, y: config.value.startY || 50 },
      { x: config.value.endX || 90, y: config.value.endY || 50 }
    ]
  },
  { immediate: true }
)

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

// SVG尺寸计算 - 扩展SVG尺寸以容纳箭头
const svgWidth = computed(() => {
  const { w } = props.data.attr
  // 如果有箭头，给SVG增加额外空间
  const hasArrow = config.value.arrowStyle && config.value.arrowStyle !== 'none'
  return hasArrow ? w + arrowSize.value * 2 : w
})

const svgHeight = computed(() => {
  const { h } = props.data.attr
  // 如果有箭头，给SVG增加额外空间
  const hasArrow = config.value.arrowStyle && config.value.arrowStyle !== 'none'
  return hasArrow ? h + arrowSize.value * 2 : h
})

// 将百分比坐标转换为实际像素坐标
const actualCoords = computed(() => {
  const { w, h } = props.data.attr
  const hasArrow = config.value.arrowStyle && config.value.arrowStyle !== 'none'
  // 如果有箭头，需要偏移坐标以适应扩展的SVG空间
  const offset = hasArrow ? arrowSize.value : 0
  
  return {
    x1: (endpoints.value[0].x / 100) * w + offset,
    y1: (endpoints.value[0].y / 100) * h + offset,
    x2: (endpoints.value[1].x / 100) * w + offset,
    y2: (endpoints.value[1].y / 100) * h + offset,
  }
})

// 计算线段粗细 - 使用config中的width
const strokeWidth = computed(() => {
  return config.value.width
})

// 计算虚线样式 - 根据线条宽度动态调整
const dashArray = computed(() => {
  const { dashStyle, width } = config.value
  if (dashStyle === 'solid') return 'none'
  if (dashStyle === 'dashed') {
    // 虚线长度 = 线条宽度 × 3，间隙 = 线条宽度 × 2
    const dash = width * 3
    const gap = width * 2
    return `${dash},${gap}`
  }
  return 'none'
})

// 计算箭头尺寸
const arrowSize = computed(() => {
  const strokeWidth = config.value.width
  return Math.max(strokeWidth * 2, 6)
})

// 计算箭头形状点坐标（终点箭头，向右）
const arrowPoints = computed(() => {
  const size = arrowSize.value
  return `0,0 ${size},${size/2} 0,${size}`
})

// 计算箭头形状点坐标（起点箭头，向左）
const arrowPointsStart = computed(() => {
  const size = arrowSize.value
  return `${size},0 0,${size/2} ${size},${size}`
})

// 动画翻转状态
const animationReverse = computed(() => config.value.animationReverse)

// 电流动画虚线样式（短虚线，大间隔）
const electricDashArray = computed(() => {
  const width = config.value.width
  const dash = width * 4
  const gap = width * 4
  return `${dash} ${gap}`
})

// 水珠动画虚线样式（较长虚线，圆角）
const waterDashArray = computed(() => {
  const width = config.value.width
  const dash = width * 4
  const gap = width * 4
  return `${dash} ${gap}`
})

// 拖拽端点逻辑
let isDragging = false
let draggedIndex = -1

function startDragEndpoint(event, index) {
  if (!isEditorMode.value) return
  
  isDragging = true
  draggedIndex = index
  showHandles.value = true  // 拖拽时保持手柄显示
  
  const svg = event.target.parentElement
  const rect = svg.getBoundingClientRect()
  const { w, h } = props.data.attr
  const hasArrow = config.value.arrowStyle && config.value.arrowStyle !== 'none'
  const offset = hasArrow ? arrowSize.value : 0
  
  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    // 转换为百分比坐标（考虑箭头偏移和画布缩放）
    const currentScale = scale.value
    const x = (((e.clientX - rect.left) / currentScale - offset) / w) * 100
    const y = (((e.clientY - rect.top) / currentScale - offset) / h) * 100
    
    // 更新端点位置（限制范围2-98%以容纳手柄和箭头）
    if (draggedIndex === 0) {
      config.value.startX = Math.max(2, Math.min(98, x))
      config.value.startY = Math.max(2, Math.min(98, y))
    } else {
      config.value.endX = Math.max(2, Math.min(98, x))
      config.value.endY = Math.max(2, Math.min(98, y))
    }
    
    // 同步更新endpoints
    endpoints.value[draggedIndex] = {
      x: draggedIndex === 0 ? config.value.startX : config.value.endX,
      y: draggedIndex === 0 ? config.value.startY : config.value.endY
    }
  }
  
  const handleMouseUp = () => {
    isDragging = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style scoped>
.dv-wrapper {
  position: relative;
}

.endpoint-control {
  pointer-events: all;
  transition: r 0.2s;
}

.endpoint-control:hover {
  r: 10;
}
</style>
