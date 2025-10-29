<template>
  <div class="dv-wrapper">
    <div class="image-box" :style="iconWrapperStyle">
      <AntIcon
        :name="config.src"
        :size="iconSize"
        @click="handleClick"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AntIcon from '@/components/Common/AntIcon/index.vue'

defineOptions({
  name: 'VIcon',
})

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// config 配置项
const config = computed(() => props.data.config)

// 图标尺寸计算（保持原 iconfont 组件的计算逻辑）
const iconSize = computed(() => {
  return Math.floor(config.value.size / 2 + 2)
})

// 图标容器样式
const iconWrapperStyle = computed(() => {
  return {
    color: config.value.color,
    cursor: config.value.pointerType === 'btn' ? 'pointer' : 'default',
  }
})

function handleClick() {
  if (config.value.pointerType === 'btn' && config.value.urlConfig?.url) {
    window.open(config.value.urlConfig.url, config.value.urlConfig.isBlank ? '_blank' : '_self')
  }
}
</script>

<style scoped>
.image-box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
