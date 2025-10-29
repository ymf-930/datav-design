<template>
  <div class="setting-panel-gui">
    <g-field-collapse label="属性" default-open>
      <g-field label="方向">
        <g-select v-model="config.direction" :data="directionOptions" />
      </g-field>
      
      <g-field label="线条" flat>
        <g-input-number
          v-model="config.width"
          :min="1"
          :max="999"
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
    
    <g-field-collapse label="动画">
      <g-field label="开启动画">
        <g-switch v-model="config.enableAnimation" />
      </g-field>
      
      <g-field label="动画类型">
        <g-select v-model="config.animationType" :data="animationTypeOptions" />
      </g-field>
      
      <g-field label="动画颜色">
        <g-color-picker v-model="config.animationColor" />
      </g-field>
      
      <g-field label="动画翻转">
        <g-switch v-model="config.animationReverse" />
      </g-field>
      
      <g-field label="动画延迟" flat>
        <g-input-number
          v-model="config.animationDelay"
          :min="1"
          :max="60"
          :step="1"
          suffix="秒"
          inline
        />
      </g-field>
      
      <g-field label="轨迹球半径" flat v-if="config.animationType === 'track'">
        <g-input-number
          v-model="config.trackBallRadius"
          :min="1"
          :max="20"
          :step="1"
          inline
        />
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

// 动画类型选项
const animationTypeOptions = [
  { value: 'electric', label: '电流' },
  { value: 'track', label: '轨迹' },
  { value: 'water', label: '水珠' },
]
</script>
