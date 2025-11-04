<template>
  <div class="dv-wrapper">
    <dv-scroll-board 
      :config="scrollBoardConfig"
      :style="wrapperStyle" 
      ref="tableRef"
    ></dv-scroll-board>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch, onMounted } from 'vue'
import { useEventBus, getEventParamsSexact } from '@/hooks/schema/useEventBus'
import { useDataCenter } from '@/hooks/schema/useDataCenter'
import { useScriptAction } from '@/hooks/schema/useScriptAction'

defineOptions({
  name: 'VScrollTable',
})
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const { dvData, buildParams, setDvData } = useDataCenter(props.data)
const tableRef = ref(null)

// 确保组件挂载时初始化数据
onMounted(() => {
  // 确保数据已加载
  if (!dvData.value || Object.keys(dvData.value).length === 0) {
    setDvData()
  }
})

// config 配置项
const config = computed(() => props.data.config)
// attr 属性
const attr = computed(() => props.data.attr)
// 容器style
const wrapperStyle = computed(() => ({
  width: `${attr.value.w}px`,
  height: `${attr.value.h}px`,
}))

// 解析数据
const parsedTableData = computed(() => {
  // 优先使用 dvData
  if (dvData.value && dvData.value.header && dvData.value.data) {
    return {
      header: dvData.value.header,
      data: dvData.value.data,
    }
  }
  
  // 如果 dvData 为空，从 apiData.config.data 解析
  if (props.data.apiData?.config?.data) {
    try {
      const rawData = props.data.apiData.config.data
      const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData
      
      if (parsedData && parsedData.header && parsedData.data) {
        return {
          header: parsedData.header,
          data: parsedData.data,
        }
      }
    } catch (e) {
      console.error('解析数据失败:', e)
    }
  }
  
  return { header: [], data: [] }
})

// 转换数据格式为 scrollBoard 需要的格式
const scrollBoardConfig = computed(() => {
  const tableData = parsedTableData.value
  const cfg = config.value
  
  // 根据是否显示行号，拼接宽度及对齐方式
  const columnWidth = cfg.index ? [cfg.indexWidth, ...cfg.columnWidth] : [...cfg.columnWidth]
  const textAlign = cfg.index ? [cfg.indexAlign, ...cfg.align] : [...cfg.align]
  
  // @kjgl77/datav-vue3 的 dv-scroll-board 使用 config prop，格式为：
  // { header: [], data: [], index: boolean, rowNum: number, ... }
  const result = {
    header: tableData.header,
    data: tableData.data,
    index: cfg.index,
    rowNum: cfg.rowNum,
    titleBG: cfg.headerBGC,
    oddBG: cfg.oddRowBGC,
    evenBG: cfg.evenRowBGC,
    columnWidth: columnWidth.length > 0 ? columnWidth.join(',') : '',
    textAlign: textAlign.length > 0 ? textAlign.join(',') : '',
    carousel: cfg.carousel ? 'single' : 'none',
  }
  
  console.log('转换后的配置:', result)
  console.log('表格数据:', tableData)
  
  return result
})

watch(
  [() => dvData.value, () => config.value],
  () => {
    nextTick(() => {
      // @kjgl77/datav-vue3 是 Vue 3 组件，使用响应式更新，无需手动调用 init
      // 如果需要手动刷新，可以调用 resize 或其他方法
      if (tableRef.value && typeof tableRef.value.onResize === 'function') {
        tableRef.value.onResize()
      }
    })
  },
  { deep: true, immediate: true },
)

// 获取响应事件
const actions = {
  getData(params, onEvent) {
    console.log('-----获取响应参数-----', params, onEvent)
    // Message(`已接收参数：${params.value}，并进行响应设置函数调用！`)
    const p = getEventParamsSexact(params, onEvent.actionParams)
    buildParams(p)
    // const actParams = buildParams(p)
    setDvData()
    // 执行对应脚本
    useScriptAction(props.data, onEvent)
  },
}
// 事件系统增加
useEventBus(props.data, actions)
</script>
