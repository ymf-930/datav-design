<template>
  <div class="dv-wrapper" :style="wrapperStyle">
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      :style="canvasStyle"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick } from 'vue'

defineOptions({
  name: 'VLineCanvas',
})

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const canvasRef = ref(null)
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

const canvasStyle = computed(() => {
  return {
    maxWidth: '100%',
    maxHeight: '100%',
  }
})

// Canvas尺寸计算
const canvasWidth = computed(() => {
  const { w } = props.data.attr
  return w
})

const canvasHeight = computed(() => {
  const { h } = props.data.attr
  return h
})

// 计算线段的位置
const lineConfig = computed(() => {
  const { w, h } = props.data.attr
  
  return {
    x1: 0,
    y1: h / 2,
    x2: w,
    y2: h / 2
  }
})

// 计算虚线样式
const dashPattern = computed(() => {
  const { dashStyle } = config.value
  if (dashStyle === 'solid') return []
  if (dashStyle === 'dashed') return [5, 5]
  if (dashStyle === 'dotted') return [1, 3]
  if (dashStyle === 'dashdot') return [5, 3, 1, 3]
  return []
})

// 绘制箭头
const drawArrow = (ctx, x, y, angle, size) => {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(-size, -size/2)
  ctx.lineTo(-size, size/2)
  ctx.closePath()
  ctx.fill()
  
  ctx.restore()
}

// 绘制线段
const drawLine = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const { x1, y1, x2, y2 } = lineConfig.value
  const strokeWidth = props.data.attr.h
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 设置线条样式
  ctx.strokeStyle = config.value.color
  ctx.fillStyle = config.value.color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  
  // 设置虚线
  if (dashPattern.value.length > 0) {
    ctx.setLineDash(dashPattern.value)
  } else {
    ctx.setLineDash([])
  }
  
  // 绘制主线段
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  
  // 绘制箭头
  const arrowSize = Math.max(strokeWidth * 2, 6)
  const angle = Math.atan2(y2 - y1, x2 - x1)
  
  if (config.value.arrowStyle === 'end' || config.value.arrowStyle === 'both') {
    drawArrow(ctx, x2, y2, angle, arrowSize)
  }
  
  if (config.value.arrowStyle === 'start' || config.value.arrowStyle === 'both') {
    drawArrow(ctx, x1, y1, angle + Math.PI, arrowSize)
  }
}

// 监听变化重新绘制
watch(
  [() => config.value, () => props.data.attr],
  () => {
    nextTick(() => {
      drawLine()
    })
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  drawLine()
})
</script>

<style scoped>
.dv-wrapper {
  position: relative;
}
</style>

