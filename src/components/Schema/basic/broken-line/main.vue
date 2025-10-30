<template>
    <div 
    class="dv-wrapper" 
    :style="wrapperStyle"
    @mouseenter="isEditorMode && (showHandles = true)"
    @mouseleave="isEditorMode && (showHandles = false)"
  >
    <svg :width="svgWidth" :height="svgHeight" :style="svgStyle" xmlns="http://www.w3.org/2000/svg">
      <!-- 定义箭头标记 -->
      <defs>
        <!-- 终点箭头（向右）- 箭头后端对准线段端点 -->
        <marker
          v-if="config.arrowStyle === 'end' || config.arrowStyle === 'both'"
          id="arrowhead-broken-end"
          :markerWidth="arrowSize"
          :markerHeight="arrowSize"
          refX="0"
          :refY="arrowSize / 2"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon :points="arrowPoints" :fill="config.color" />
        </marker>
        
        <!-- 起点箭头（向左）- 箭头后端对准线段端点 -->
        <marker
          v-if="config.arrowStyle === 'start' || config.arrowStyle === 'both'"
          id="arrowhead-broken-start"
          :markerWidth="arrowSize"
          :markerHeight="arrowSize"
          :refX="arrowSize"
          :refY="arrowSize / 2"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon :points="arrowPointsStart" :fill="config.color" />
        </marker>
      </defs>

      <!-- 折线 - 仅当电流动画启用时隐藏 -->
      <path
        v-if="!(config.enableAnimation && config.animationType === 'electric')"
        :d="pathString"
        :stroke="config.color"
        :stroke-width="config.width"
        :stroke-dasharray="dashArray"
        stroke-linecap="butt"
        stroke-linejoin="round"
        fill="none"
        :marker-end="
          config.arrowStyle === 'end' || config.arrowStyle === 'both'
            ? 'url(#arrowhead-broken-end)'
            : undefined
        "
        :marker-start="
          config.arrowStyle === 'start' || config.arrowStyle === 'both'
            ? 'url(#arrowhead-broken-start)'
            : undefined
        "
      />
      
      <!-- 电流动画 - 短虚线流动 -->
      <path
        v-if="config.enableAnimation && config.animationType === 'electric'"
        :d="pathString"
        :stroke="config.animationColor"
        :stroke-width="config.width"
        :stroke-dasharray="electricDashArray"
        stroke-linecap="butt"
        stroke-linejoin="round"
        fill="none"
      >
        <animate
          attributeName="stroke-dashoffset"
          :from="config.animationReverse ? '0' : '1000'"
          :to="config.animationReverse ? '1000' : '0'"
          :dur="`${config.animationDelay}s`"
          repeatCount="indefinite"
        />
      </path>
      
      <!-- 水珠动画 - 流动虚线（圆角） -->
      <path
        v-if="config.enableAnimation && config.animationType === 'water'"
        :d="pathString"
        :stroke="config.animationColor"
        :stroke-width="config.width"
        :stroke-dasharray="waterDashArray"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      >
        <animate
          attributeName="stroke-dashoffset"
          :from="config.animationReverse ? '0' : '1000'"
          :to="config.animationReverse ? '1000' : '0'"
          :dur="`${config.animationDelay}s`"
          repeatCount="indefinite"
        />
      </path>
      
      <!-- 轨迹动画 - 圆点移动 -->
      <circle
        v-if="config.enableAnimation && config.animationType === 'track'"
        :r="config.trackBallRadius"
        :fill="config.animationColor"
      >
        <animateMotion
          :path="animationPath"
          :dur="`${config.animationDelay}s`"
          repeatCount="indefinite"
          :keyPoints="animationReverse ? '1;0' : '0;1'"
          keyTimes="0;1"
          calcMode="linear"
        />
      </circle>

      <!-- 折线可悬停区域（用于添加新折点，仅编辑模式） -->
      <path
        v-if="isEditorMode"
        v-for="(segment, index) in lineSegments"
        :key="`segment-${index}`"
        :d="segment.pathData"
        fill="none"
        :stroke="'transparent'"
        :stroke-width="20"
        class="line-hit-area"
        @click="addPointAtSegment($event, index)"
      />

      <!-- 折点处可拖拽的手柄（仅编辑模式显示） -->
      <template v-if="isEditorMode && showHandles">
        <circle
          v-for="(point, index) in pointsArray"
          :key="`point-${index}`"
          :cx="(point.x / 100) * contentWidth + arrowOffset"
          :cy="(point.y / 100) * contentHeight + arrowOffset"
          :r="8"
          :fill="config.color"
          stroke="#fff"
          :stroke-width="2"
          class="control-point"
          :style="{ cursor: 'move' }"
          @mousedown.stop="startDrag($event, index)"
          @dblclick="deletePoint($event, index)"
        />
      </template>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref, watch, inject } from 'vue'
import { useStore } from '@/store'

defineOptions({
  name: 'VBrokenLine',
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

// 悬停时显示手柄（仅编辑模式）
const showHandles = ref(false)

// 解析折点数组
const pointsArray = ref([])
watch(
  () => config.value.points,
  pointsStr => {
    try {
      pointsArray.value = JSON.parse(pointsStr || '[]')
    } catch (e) {
      console.error('Failed to parse points:', e)
      pointsArray.value = []
    }
  },
  { immediate: true },
)

// 计算箭头尺寸
const arrowSize = computed(() => {
  const strokeWidth = config.value.width
  return Math.max(strokeWidth * 2, 6)
})

// 判断是否有箭头
const hasArrow = computed(() => config.value.arrowStyle && config.value.arrowStyle !== 'none')

// 箭头偏移量
const arrowOffset = computed(() => hasArrow.value ? arrowSize.value : 0)

// SVG尺寸 - 扩展以容纳箭头
const svgWidth = computed(() => {
  const { w } = props.data.attr
  return hasArrow.value ? w + arrowSize.value * 2 : w
})

const svgHeight = computed(() => {
  const { h } = props.data.attr
  return hasArrow.value ? h + arrowSize.value * 2 : h
})

// 用于坐标计算的实际显示区域宽高（不含箭头空间）
const contentWidth = computed(() => props.data.attr.w)
const contentHeight = computed(() => props.data.attr.h)

const svgStyle = computed(() => ({
  overflow: 'visible',
}))

const wrapperStyle = computed(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'visible',
}))

// 将百分比坐标转换为实际像素坐标（考虑箭头偏移）
const polylinePoints = computed(() => {
  const offset = arrowOffset.value
  return pointsArray.value
    .map(point => {
      const x = (point.x / 100) * contentWidth.value + offset
      const y = (point.y / 100) * contentHeight.value + offset
      return `${x},${y}`
    })
    .join(' ')
})

// 计算线段用于点击添加折点（考虑箭头偏移）
const lineSegments = computed(() => {
  const segments = []
  const offset = arrowOffset.value
  for (let i = 0; i < pointsArray.value.length - 1; i++) {
    const p1 = pointsArray.value[i]
    const p2 = pointsArray.value[i + 1]
    const x1 = (p1.x / 100) * contentWidth.value + offset
    const y1 = (p1.y / 100) * contentHeight.value + offset
    const x2 = (p2.x / 100) * contentWidth.value + offset
    const y2 = (p2.y / 100) * contentHeight.value + offset
    segments.push({
      pathData: `M ${x1} ${y1} L ${x2} ${y2}`,
    })
  }
  return segments
})

// 计算虚线样式 - 根据线条宽度动态调整
const dashArray = computed(() => {
  const { lineStyle, width } = config.value
  if (lineStyle === 'solid') return 'none'
  if (lineStyle === 'dashed') {
    // 虚线长度 = 线条宽度 × 3，间隙 = 线条宽度 × 2
    const dash = width * 3
    const gap = width * 2
    return `${dash},${gap}`
  }
  return 'none'
})

// 计算不同路径类型的路径字符串
const pathString = computed(() => {
  const { pathType, cornerRadius } = config.value
  const offset = arrowOffset.value
  const points = pointsArray.value.map(point => ({
    x: (point.x / 100) * contentWidth.value + offset,
    y: (point.y / 100) * contentHeight.value + offset
  }))
  
  if (points.length < 2) return ''
  
  switch (pathType) {
    case 'straight': {
      // 直角折线 - 保持原始折点
      let path = `M ${points[0].x} ${points[0].y}`
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`
      }
      return path
    }
    
    case 'roundCorner': {
      // 圆角折线
      if (points.length === 2) {
        return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
      }
      
      let path = `M ${points[0].x} ${points[0].y}`
      
      for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const next = points[i + 1]
        
        // 计算到前一个点和下一个点的距离
        const d1 = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2))
        const d2 = Math.sqrt(Math.pow(next.x - curr.x, 2) + Math.pow(next.y - curr.y, 2))
        
        // 圆角半径不能超过线段长度的一半
        const r = Math.min(cornerRadius, d1 / 2, d2 / 2)
        
        // 计算圆角起点（从当前点向前一个点方向偏移）
        const ratio1 = r / d1
        const p1x = curr.x - (curr.x - prev.x) * ratio1
        const p1y = curr.y - (curr.y - prev.y) * ratio1
        
        // 计算圆角终点（从当前点向下一个点方向偏移）
        const ratio2 = r / d2
        const p2x = curr.x + (next.x - curr.x) * ratio2
        const p2y = curr.y + (next.y - curr.y) * ratio2
        
        // 画线到圆角起点，然后用二次贝塞尔曲线连接到圆角终点
        path += ` L ${p1x} ${p1y} Q ${curr.x} ${curr.y} ${p2x} ${p2y}`
      }
      
      // 连接到最后一个点
      path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`
      return path
    }
    
    case 'bezier': {
      // 贝塞尔曲线 - 平滑曲线
      if (points.length === 2) {
        return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
      }
      
      // 使用 Catmull-Rom 样条插值创建平滑曲线
      let path = `M ${points[0].x} ${points[0].y}`
      
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)]
        const p1 = points[i]
        const p2 = points[i + 1]
        const p3 = points[Math.min(points.length - 1, i + 2)]
        
        // 计算控制点
        const cp1x = p1.x + (p2.x - p0.x) / 6
        const cp1y = p1.y + (p2.y - p0.y) / 6
        const cp2x = p2.x - (p3.x - p1.x) / 6
        const cp2y = p2.y - (p3.y - p1.y) / 6
        
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
      }
      
      return path
    }
    
    default:
      return polylinePoints.value
  }
})

// 计算箭头形状点坐标（终点箭头，向右）
const arrowPoints = computed(() => {
  const size = arrowSize.value
  return `0,0 ${size},${size / 2} 0,${size}`
})

// 计算箭头形状点坐标（起点箭头，向左）
const arrowPointsStart = computed(() => {
  const size = arrowSize.value
  return `${size},0 0,${size / 2} ${size},${size}`
})

// 动画翻转状态
const animationReverse = computed(() => config.value.animationReverse)

// 计算动画路径（用于轨迹动画）
// 动画路径使用 pathString 以支持不同路径类型
const animationPath = computed(() => pathString.value)

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

// 拖拽功能
let isDragging = false
let draggedPointIndex = -1

function startDrag(event, index) {
  // 预览模式下不允许拖拽
  if (!isEditorMode.value) return
  
  isDragging = true
  draggedPointIndex = index

  const svg = event.target.parentElement

  const handleMouseMove = e => {
    if (!isDragging) return

    const rect = svg.getBoundingClientRect()
    const offset = arrowOffset.value
    // 使用内容区域宽高计算百分比（考虑箭头偏移和画布缩放）
    const currentScale = scale.value
    const x = (((e.clientX - rect.left) / currentScale - offset) / contentWidth.value) * 100
    const y = (((e.clientY - rect.top) / currentScale - offset) / contentHeight.value) * 100

    // 更新折点位置，限制范围避免折点太靠近边界和箭头
    if (draggedPointIndex >= 0 && draggedPointIndex < pointsArray.value.length) {
      pointsArray.value[draggedPointIndex] = {
        x: Math.max(2, Math.min(98, x)), // 限制在2%-98%之间
        y: Math.max(2, Math.min(98, y)),
      }

      // 触发配置更新
      config.value.points = JSON.stringify(pointsArray.value)
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

// 在线段中间添加新折点
function addPointAtSegment(event, segmentIndex) {
  // 预览模式下不允许添加折点
  if (!isEditorMode.value) return
  
  const svg = event.target.parentElement
  const rect = svg.getBoundingClientRect()
  const offset = arrowOffset.value
  // 使用内容区域宽高计算百分比（考虑箭头偏移和画布缩放）
  const currentScale = scale.value
  const x = (((event.clientX - rect.left) / currentScale - offset) / contentWidth.value) * 100
  const y = (((event.clientY - rect.top) / currentScale - offset) / contentHeight.value) * 100

  // 在指定线段后插入新点
  pointsArray.value.splice(segmentIndex + 1, 0, {
    x: Math.max(2, Math.min(98, x)), // 限制在2%-98%之间
    y: Math.max(2, Math.min(98, y)),
  })

  // 触发配置更新
  config.value.points = JSON.stringify(pointsArray.value)
}

// 删除折点（右键菜单）
function deletePoint(event, index) {
  // 预览模式下不允许删除折点
  if (!isEditorMode.value) return
  
  // 至少保留2个点
  if (pointsArray.value.length <= 2) return
  
  pointsArray.value.splice(index, 1)
  
  // 触发配置更新
  config.value.points = JSON.stringify(pointsArray.value)
}
</script>

<style scoped>
.dv-wrapper {
  position: relative;
  cursor: pointer;
}

.line-hit-area {
  cursor: crosshair;
  pointer-events: all;
}

.control-point {
  pointer-events: all;
  transition: opacity 0.2s, r 0.2s;
}

.control-point:hover {
  r: 10;
}
</style>
