<template>
    <div 
    class="dv-wrapper" 
    :style="wrapperStyle"
    @mouseenter="isEditorMode && (showHandles = true)"
    @mouseleave="isEditorMode && (showHandles = false)"
  >
    <svg :width="svgWidth" :height="svgHeight" xmlns="http://www.w3.org/2000/svg">
      <!-- 定义箭头标记 -->
      <defs>
        <marker
          v-if="config.arrowStyle !== 'none'"
          id="arrowhead-broken"
          :markerWidth="arrowSize"
          :markerHeight="arrowSize"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon :points="arrowPoints" :fill="config.color" />
        </marker>
      </defs>

      <!-- 折线 -->
      <polyline
        :points="polylinePoints"
        :stroke="config.color"
        :stroke-width="config.width"
        :stroke-dasharray="dashArray"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
        :marker-end="
          config.arrowStyle === 'end' || config.arrowStyle === 'both'
            ? 'url(#arrowhead-broken)'
            : undefined
        "
        :marker-start="
          config.arrowStyle === 'start' || config.arrowStyle === 'both'
            ? 'url(#arrowhead-broken)'
            : undefined
        "
      />

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
          :cx="(point.x / 100) * contentWidth"
          :cy="(point.y / 100) * contentHeight"
          :r="8"
          :fill="config.color"
          stroke="#fff"
          :stroke-width="2"
          class="control-point"
          :style="{ cursor: 'move' }"
          @mousedown.stop="startDrag($event, index)"
          @contextmenu.prevent="deletePoint($event, index)"
        />
      </template>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref, watch, inject } from 'vue'

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

// SVG尺寸，使用容器尺寸，不超出
const svgWidth = computed(() => props.data.attr.w)
const svgHeight = computed(() => props.data.attr.h)

// 用于坐标计算的实际显示区域宽高
const contentWidth = computed(() => props.data.attr.w)
const contentHeight = computed(() => props.data.attr.h)

const wrapperStyle = computed(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'visible',
}))

// 将百分比坐标转换为实际像素坐标
const polylinePoints = computed(() => {
  return pointsArray.value
    .map(point => {
      const x = (point.x / 100) * contentWidth.value
      const y = (point.y / 100) * contentHeight.value
      return `${x},${y}`
    })
    .join(' ')
})

// 计算线段用于点击添加折点
const lineSegments = computed(() => {
  const segments = []
  for (let i = 0; i < pointsArray.value.length - 1; i++) {
    const p1 = pointsArray.value[i]
    const p2 = pointsArray.value[i + 1]
    const x1 = (p1.x / 100) * contentWidth.value
    const y1 = (p1.y / 100) * contentHeight.value
    const x2 = (p2.x / 100) * contentWidth.value
    const y2 = (p2.y / 100) * contentHeight.value
    segments.push({
      pathData: `M ${x1} ${y1} L ${x2} ${y2}`,
    })
  }
  return segments
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
  return `0,0 ${size},${size / 2} 0,${size}`
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
    // 使用内容区域宽高计算百分比
    const x = ((e.clientX - rect.left) / contentWidth.value) * 100
    const y = ((e.clientY - rect.top) / contentHeight.value) * 100

    // 更新折点位置，限制范围避免折点太靠近边界
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
  // 使用内容区域宽高计算百分比
  const x = ((event.clientX - rect.left) / contentWidth.value) * 100
  const y = ((event.clientY - rect.top) / contentHeight.value) * 100

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
