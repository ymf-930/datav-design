<template>
  <component :is="iconComponent" v-bind="$attrs" :style="{ fontSize: size + 'px' }" />
</template>

<script setup>
import { computed } from 'vue'
import * as Icons from '@ant-design/icons-vue'

defineOptions({
  name: 'AntIcon',
  inheritAttrs: false
})

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 16
  }
})

const iconComponent = computed(() => {
  // 直接使用传入的图标名称，不做映射
  return Icons[props.name] || Icons['QuestionCircleOutlined']
})
</script>
