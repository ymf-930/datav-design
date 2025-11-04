<template>
  <div class="dv-wrapper">
    <dv-capsule-chart
      :config="capsuleChartConfig"
      :style="wrapperStyle"
      :class="[{ 'x-hide': !config.xAxis.show }, { 'y-hide': !config.yAxis.show }]"
    ></dv-capsule-chart>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDataCenter } from '@/hooks/schema/useDataCenter'
import { getEventParamsSexact, useEventBus } from '@/hooks/schema/useEventBus'
import { usePolling } from '@/hooks/schema/usePolling'
import { useChartThemeColor } from '@/theme'
import { useScriptAction } from '@/hooks/schema/useScriptAction'

defineOptions({
  name: 'VCapsuleBar',
})
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const { dvData, apiData, buildParams, setDvData } = useDataCenter(props.data)
// config 配置项
const config = computed(() => props.data.config) // attr 属性
const attr = computed(() => props.data.attr)

const { getThemeColors } = useChartThemeColor()

const themeColors = computed(() => getThemeColors(props.data.attr.chartThemeColor))

// 容器style
const wrapperStyle = computed(() => {
  const { global, xAxis, yAxis, grid } = config.value
  const { top, right, bottom, left } = grid
  const radius = global.borderRadius
  return {
    width: `${attr.value.w}px`,
    height: `${attr.value.h}px`,
    fontFamily: global.fontFamily,
    padding: `${top}px ${right}px ${bottom}px ${left}px`,
    '--bar-radius': `${radius[0]}px ${radius[1]}px ${radius[2]}px ${radius[3]}px`,
    '--bar-height': global.barHeight + 'px',
    '--bar-margin': `${global.barMargin}px 0`,
    '--bar-bg': global.barBg,
    '--bar-shadow': global.shadow ? `${global.shadow} ${global.shadowColor}` : 'none',
    '--x-font-color': xAxis.color,
    '--y-font-color': yAxis.color,
    '--label-height': global.barHeight + global.barMargin * 2 + 'px',
    '--label-color': global.label.color,
    '--label-font-size': global.label.fontSize + 'px',
  }
})

// 解析数据
const parsedCapsuleData = computed(() => {
  // 优先使用 dvData
  const data = dvData.value || []
  
  // 如果 dvData 是数组格式，需要转换
  if (Array.isArray(data)) {
    return data.map((item, index) => ({
      name: item.name || item.title || item.x || `项目${index + 1}`,
      value: item.value || item.y || 0,
    }))
  }
  
  // 如果 dvData 为空，尝试从 apiData.config.data 解析
  if (props.data.apiData?.config?.data) {
    try {
      const rawData = props.data.apiData.config.data
      const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData
      
      if (Array.isArray(parsedData)) {
        return parsedData.map((item, index) => ({
          name: item.name || item.title || item.x || `项目${index + 1}`,
          value: item.value || item.y || 0,
        }))
      }
    } catch (e) {
      console.error('解析胶囊图数据失败:', e)
    }
  }
  
  // 如果已经是对象格式，直接使用
  if (data && data.data && Array.isArray(data.data)) {
    return data.data
  }
  
  return []
})

// 转换数据格式为 capsuleChart 需要的格式
const capsuleChartConfig = computed(() => {
  const { global } = config.value
  const data = parsedCapsuleData.value
  
  // @kjgl77/datav-vue3 的 dv-capsule-chart 使用 config prop，格式为：
  // { data: [{ name, value }], color: [] }
  const result = {
    data: data,
    color: themeColors.value,
  }
  
  console.log('胶囊图配置:', result)
  console.log('胶囊图数据:', data)
  
  return result
})

// 获取响应事件
const actions = {
  getData(params, onEvent) {
    const p = getEventParamsSexact(params, onEvent.actionParams)
    buildParams(p)
    setDvData()
    // 执行对应脚本
    useScriptAction(props.data, onEvent)
  },
}
// 事件系统增加
useEventBus(props.data, actions)
usePolling(() => {
  setDvData()
}, apiData.value.config)
</script>

<style scoped>
:deep(.dv-capsule-chart) {
  .label-column div {
    line-height: var(--label-height);
    flex-shrink: 0;
    flex-grow: 0;
    color: var(--y-font-color);
  }
  .unit-label {
    color: var(--x-font-color);
  }
  &.x-hide .unit-label {
    display: none;
  }
  &.y-hide .label-column {
    display: none;
  }
  .capsule-item {
    height: var(--bar-height);
    margin: var(--bar-margin);
    background: var(--bar-bg);
    border-radius: var(--bar-radius);
    box-shadow: var(--bar-shadow);
    .capsule-item-column {
      height: calc(var(--bar-height) - 2px);
      border-radius: var(--bar-radius);
      .capsule-item-value {
        color: var(--label-color);
        font-size: var(--label-font-size);
      }
    }
  }
}
</style>
