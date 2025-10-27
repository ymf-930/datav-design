<template>
  <span v-if="hasClickHandler" class="anticon-clickable" v-bind="$attrs">
    <component :is="iconComponent" :style="iconStyle" />
  </span>
  <component v-else :is="iconComponent" v-bind="$attrs" :style="iconStyle" />
</template>

<script setup>
import { computed, useAttrs } from 'vue'
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

const attrs = useAttrs()
const hasClickHandler = computed(() => {
  // 检查是否有点击相关的监听器
  return attrs.onClick || attrs['onClick.stop']
})

const iconStyle = computed(() => {
  return { fontSize: props.size + 'px' }
})

const iconComponent = computed(() => {
  // 直接使用传入的图标名称，不做映射
  return Icons[props.name] || Icons['QuestionCircleOutlined']
})
</script>

<style scoped>
.anticon-clickable {
  display: inline-block;
  cursor: pointer;
  line-height: 1;
}
</style>
