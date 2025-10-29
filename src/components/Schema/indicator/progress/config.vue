<template>
  <div class="setting-panel-gui">
    <g-field-collapse label="进度条配置" default-open>
      <g-field label="进度条类型">
        <a-select v-model:value="config.type" size="small" style="width: 100%">
          <a-select-option value="line">线形进度条</a-select-option>
          <a-select-option value="circle">圆形进度条</a-select-option>
          <a-select-option value="dashboard">仪表盘进度条</a-select-option>
        </a-select>
      </g-field>
      
      <g-field label="端点形状">
        <a-select v-model:value="config.linecap" size="small" style="width: 100%">
          <a-select-option value="round">圆形端点</a-select-option>
          <a-select-option value="butt">平头端点</a-select-option>
          <a-select-option value="square">方形端点</a-select-option>
        </a-select>
      </g-field>
      
      <g-field label="进度条样式" flat>
        <g-input-number v-model="config.strokeWidth" :min="1" :max="20" :step="1" inline label="线宽" />
        <g-color-picker v-model="config.strokeColor" inline label="颜色" />
      </g-field>
      
      <g-field label="轨道颜色">
        <g-color-picker v-model="config.trailColor" />
      </g-field>
      
      <g-field label="显示数值" tooltip="是否显示进度百分比数值">
        <a-switch v-model:checked="config.showInfo" size="small" />
      </g-field>
      
      <!-- Dashboard 专用配置 -->
      <template v-if="config.type === 'dashboard'">
        <g-field label="缺口角度">
          <g-input-number v-model="config.gapDegree" :min="0" :max="295" :step="1" suffix="°" />
        </g-field>
        <g-field label="缺口位置">
          <a-select v-model:value="config.gapPosition" size="small" style="width: 100%">
            <a-select-option value="top">顶部</a-select-option>
            <a-select-option value="bottom">底部</a-select-option>
            <a-select-option value="left">左侧</a-select-option>
            <a-select-option value="right">右侧</a-select-option>
          </a-select>
        </g-field>
      </template>
    </g-field-collapse>

    <g-field-collapse label="标题" v-model="config.title.show" toggle>
      <g-field label="标题内容">
        <g-input v-model="config.title.content" />
      </g-field>
      <g-field label="文字大小">
        <g-input-number v-model="config.title.fontSize" :min="12" :max="36" :step="1" suffix="px" />
      </g-field>
      <g-field label="文字颜色">
        <g-color-picker v-model="config.title.color" />
      </g-field>
    </g-field-collapse>

    <g-field-collapse label="百分比" v-model="config.value.show" toggle>
      <g-field label="文字大小">
        <g-input-number v-model="config.value.fontSize" :min="12" :max="36" :step="1" suffix="px" />
      </g-field>
      <g-field label="文字颜色">
        <g-color-picker v-model="config.value.color" />
      </g-field>
    </g-field-collapse>

    <g-field-collapse label="数值" v-model="config.num.show" toggle>
      <g-field label="文字大小">
        <g-input-number v-model="config.num.fontSize" :min="12" :max="36" :step="1" suffix="px" />
      </g-field>
      <g-field label="文字颜色">
        <g-color-picker v-model="config.num.color" />
      </g-field>
      <g-field label="数值格式化">
        <g-input v-model="config.numFormat" />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

// config 配置项
const config = computed(() => props.data.config)
// attr 属性（宽高等）
const attr = computed(() => props.data.attr)

// 监听类型切换，自动调整尺寸
watch(
  () => config.value.type,
  (newType, oldType) => {
    if (!oldType || newType === oldType) return

    // 根据不同类型设置建议尺寸
    const sizePresets = {
      line: { w: 400, h: 30 },      // 线形：横向长条
      circle: { w: 200, h: 200 },    // 圆形：正方形
      dashboard: { w: 200, h: 200 }, // 仪表盘：正方形
    }

    const preset = sizePresets[newType]
    if (preset) {
      attr.value.w = preset.w
      attr.value.h = preset.h
    }
  }
)
</script>
