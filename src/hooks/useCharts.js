import { computed, nextTick, ref } from 'vue'

//图表hook，需要传入props.data 配置项
export function useChartMain(data) {
  // config 配置项
  const config = computed(() => data.config)
  // event属性
  const events = computed(() => data.events)

  const chartRef = ref(null)
  const render = ref(false)

  // 刷新图表
  // vue-echarts 8.x: 默认是响应式的，option 改变会自动更新
  // 不需要手动调用 setOption（除非设置了 manual-update="true"）
  function refreshChart() {
    // vue-echarts 会自动监听 option 的变化并更新图表
    // 如果需要强制重新渲染，可以触发 nextTick
    nextTick(() => {
      // 图表会自动更新，这里只是确保 DOM 更新完成
    })
  }

  return {
    config,
    events,
    chartRef,
    render,
    refreshChart,
  }
}
