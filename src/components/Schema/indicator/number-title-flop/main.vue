<template>
  <div class="dv-wrapper" :style="wrapperStyle">
    <div :style="titleStyle">{{ titleText }}</div>
    <div :style="counterContainerStyle" v-if="render">
      <a-statistic 
        :value="realNumber"
        :value-style="counterValueStyle"
        :precision="counter.decimals"
        :decimal-separator="counter.decimal"
        :group-separator="counter.separator"
        :prefix="counter.prefix"
        :suffix="counter.suffix"
      ></a-statistic>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useDataCenter } from '@/hooks/schema/useDataCenter'
import { getEventParamsSexact, useEventBus } from '@/hooks/schema/useEventBus'
import { usePolling } from '@/hooks/schema/usePolling'
import { useScriptAction } from '@/hooks/schema/useScriptAction'

defineOptions({
  name: 'VNumberTitleFlop',
})

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const { dvData, apiData, buildParams, setDvData } = useDataCenter(props.data)
// config 配置项
const config = computed(() => props.data.config)
// attr 属性
const attr = computed(() => props.data.attr)

const wrapperStyle = computed(() => {
  const arrangement = config.value.global.arrangement
  let style = {}
  if (arrangement === 'top') {
    style = {
      display: 'block',
      alignItems: 'start',
      flexDirection: 'column',
    }
  } else if (arrangement === 'left') {
    style = {
      display: 'flex',
      alignItems: 'baseline',
      flexDirection: 'row',
    }
  } else if (arrangement === 'bottom') {
    style = {
      display: 'flex',
      alignItems: 'start',
      flexDirection: 'column-reverse',
    }
  }
  return {
    ...style,
  }
})

const titleText = computed(() => dvData.value.title || config.value.title.content)

const titleStyle = computed(() => {
  const { fontFamily, arrangement, distance } = config.value.global
  const { textStyle } = config.value.title

  const style = {
    display: 'flex',
    flexShrink: '0',
    alignItems: 'center',
    color: textStyle.color,
    fontWeight: textStyle.fontWeight,
    fontFamily: `${fontFamily}, Arial, sans-serif`,
    fontSize: `${textStyle.fontSize}px`,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    lineHeight: 'normal',
    margin: '0px',
    justifyContent: textStyle.textAlign,
    width: '100%',
  }

  if (arrangement === 'top') {
    style.margin = `0px 0px ${distance}px`
  } else if (arrangement === 'left') {
    style.width = 'auto'
    style.margin = `0px ${distance}px 0px 0px`
  } else if (arrangement === 'bottom') {
    style.margin = `${distance}px 0px 0px`
  }
  return style
})

// 容器样式（布局相关）
const counterContainerStyle = computed(() => {
  const { title, counter, global } = config.value
  const style = {
    whiteSpace: 'nowrap',
    textAlign: counter.textStyle.textAlign,
    color: counter.textStyle.color, // 设置容器颜色，确保继承
  }

  const titleContainerH = title.textStyle.fontSize + 10
  const arrangement = global.arrangement
  if (arrangement === 'top' || arrangement === 'bottom') {
    style.width = `${attr.value.w}px`
    style.height = `${attr.value.h - titleContainerH}px`
  } else if (arrangement === 'left') {
    style.width = `${attr.value.w}px`
    style.height = `${attr.value.h}px`
  }
  return style
})

// 数值样式（传递给 a-statistic 的 valueStyle）
const counterValueStyle = computed(() => {
  const { counter } = config.value
  return {
    color: counter.textStyle.color,
    fontFamily: counter.textStyle.fontFamily,
    fontSize: `${counter.textStyle.fontSize}px`,
    fontWeight: counter.textStyle.fontWeight,
  }
})

const counter = computed(() => config.value.counter)

const realNumber = computed(() => dvData.value.value ?? counter.value.value)

const render = ref(true)

watch(
  () => config.value,
  () => {
    render.value = false
    setTimeout(() => {
      render.value = true
    }, 50)
  },
  { deep: true },
)

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
/* 确保 Statistic 组件的颜色能够正确继承 */
:deep(.ant-statistic) {
  color: inherit;
}

:deep(.ant-statistic-content) {
  color: inherit !important;
}

:deep(.ant-statistic-content-value) {
  color: inherit !important;
}

:deep(.ant-statistic-content-value-int),
:deep(.ant-statistic-content-value-decimal) {
  color: inherit !important;
}

:deep(.ant-statistic-content-prefix),
:deep(.ant-statistic-content-suffix) {
  color: inherit !important;
}
</style>
