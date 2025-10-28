<template>
  <div class="setting-panel-gui">
    <g-field-collapse label="属性设置" default-open>
      <g-field label="方向">
        <g-select v-model="config.direction" :data="directionOptions" />
      </g-field>
      
      <g-field label="线条" flat>
        <g-input-number
          v-model="config.width"
          :min="1"
          :max="20"
          :step="1"
          suffix="px"
          inline
          label="宽度"
        />
        <g-color-picker v-model="config.color" inline label="颜色"/>
      </g-field>
      
      <g-field label="线条样式">
        <g-select v-model="config.dashStyle" :data="dashStyleOptions" />
      </g-field>
      
      <g-field label="箭头样式">
        <g-select v-model="config.arrowStyle" :data="arrowStyleOptions" />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const config = computed(() => props.data.config)

// 方向选项
const directionOptions = [
  { value: 'horizontal', label: '水平' },
  { value: 'vertical', label: '垂直' },
]

// 线条样式选项
const dashStyleOptions = [
  { value: 'solid', label: '实线' },
  { value: 'dashed', label: '虚线' },
]

// 箭头样式选项
const arrowStyleOptions = [
  { value: 'none', label: '无箭头' },
  { value: 'start', label: '起点箭头' },
  { value: 'end', label: '终点箭头' },
  { value: 'both', label: '双向箭头' },
]
</script>
