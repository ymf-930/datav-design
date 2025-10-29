<template>
  <div class="dv-wrapper">
    <a-progress 
      :type="config.type"
      :percent="realNumber"
      :width="config.type !== 'line' ? attr.w : undefined"
      :stroke-linecap="config.linecap"
      :stroke-width="config.strokeWidth"
      :stroke-color="config.strokeColor"
      :trail-color="config.trailColor"
      :show-info="config.showInfo"
      :gap-degree="config.type === 'dashboard' ? config.gapDegree : undefined"
      :gap-position="config.type === 'dashboard' ? config.gapPosition : undefined"
    >
      <div
        class="circle-title mb-5"
        v-show="config.title.show"
        :style="{ fontSize: `${config.title.fontSize}px`, color: config.title.color }"
      >
        {{ titleText }}
      </div>

      <div
        class="circle-value mb-5"
        v-show="config.value.show"
        :style="{ fontSize: `${config.value.fontSize}px`, color: config.value.color }"
      >
        {{ realNumber }}%
      </div>

      <div
        class="circle-num"
        v-show="config.num.show"
        :style="{ fontSize: `${config.num.fontSize}px`, color: config.num.color }"
      >
        {{ realNum }}
      </div>
    </a-progress>
  </div>
</template>

<script setup>
import { useDataCenter } from '@/hooks/schema/useDataCenter'
import { computed } from 'vue'
import { getEventParamsSexact, useEventBus } from '@/hooks/schema/useEventBus'
import { usePolling } from '@/hooks/schema/usePolling'
import { useScriptAction } from '@/hooks/schema/useScriptAction'

defineOptions({
  name: 'VProgress',
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

const titleText = computed(() => dvData.value.title || config.value.title.content)

const realNumber = computed(() => dvData.value.value * 100)

const realNum = computed(() => {
  const { title, num, total } = dvData.value
  return config.value.numFormat
    .replace(/{title}/, title)
    .replace(/{value}/, realNumber.value)
    .replace(/{num}/, num)
    .replace(/{total}/, total)
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
