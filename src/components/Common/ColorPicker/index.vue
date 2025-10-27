<template>
  <div class="color-picker-wrapper" :class="{ 'show-value': showValue }">
    <!-- 显示颜色值的情况 -->
    <template v-if="showValue">
      <div class="color-display">
        <a-input 
          v-model:value="inputValue"
          :size="size"
          :placeholder="placeholder"
          @change="handleInputChange"
        />
        <a-dropdown 
          :trigger="['click']"
          :placement="placement"
          :destroy-popup-on-hide="false"
        >
          <div 
            class="color-preview"
            :style="customStyle"
            @click.stop
          >
            <div 
              class="color-preview-inner"
              :style="{ backgroundColor: modelValue || '#000000' }"
            ></div>
          </div>
          <template #overlay>
            <div 
              class="color-picker-dropdown"
              :style="{ '--sketch-width': typeof sketchWidth === 'number' ? `${sketchWidth}px` : sketchWidth }"
            >
              <Sketch
                :model-value="getColorObject(modelValue)"
                :preset-colors="presetColors"
                :disable-alpha="!showAlpha"
                @update:modelValue="handleColorChange"
              />
            </div>
          </template>
        </a-dropdown>
      </div>
    </template>
    
    <!-- 只显示颜色块的情况 -->
    <template v-else>
      <a-dropdown 
        :trigger="['click']"
        :placement="placement"
        :destroy-popup-on-hide="false"
      >
        <div 
          class="color-preview-only"
          :style="customStyle"
          @click.stop
        >
          <div 
            class="color-preview-inner"
            :style="{ backgroundColor: modelValue || '#000000' }"
          ></div>
        </div>
        <template #overlay>
          <div 
            class="color-picker-dropdown"
            :style="{ '--sketch-width': typeof sketchWidth === 'number' ? `${sketchWidth}px` : sketchWidth }"
          >
            <Sketch
              :model-value="getColorObject(modelValue)"
              :preset-colors="presetColors"
              :disable-alpha="!showAlpha"
              @update:modelValue="handleColorChange"
            />
          </div>
        </template>
      </a-dropdown>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Sketch } from '@ckpack/vue-color'
import { pickerColors } from '@/theme'
import { getColorObject, getColorString } from '@/utils/util'

defineOptions({
  name: 'ColorPicker',
})

const emit = defineEmits(['update:modelValue', 'change'])

const props = defineProps({
  // 颜色值
  modelValue: {
    type: String,
    default: '',
  },
  // 是否显示颜色值
  showValue: {
    type: Boolean,
    default: true,
  },
  // 预设颜色
  presetColors: {
    type: Array,
    default: () => [...pickerColors],
  },
  // 是否显示透明度
  showAlpha: {
    type: Boolean,
    default: true,
  },
  // dropdown 位置
  placement: {
    type: String,
    default: 'bottom',
    validator: (value) => [
      'top', 'topLeft', 'topRight',
      'bottom', 'bottomLeft', 'bottomRight',
      'left', 'leftTop', 'leftBottom',
      'right', 'rightTop', 'rightBottom'
    ].includes(value),
  },
  // 颜色块大小
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 占位符文本
  placeholder: {
    type: String,
    default: '请选择颜色',
  },
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({}),
  },
  // Sketch 组件宽度
  sketchWidth: {
    type: [String, Number],
    default: '250px',
  },
})

// 输入框的值
const inputValue = ref('')

// 监听外部值变化，同步到输入框
watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val || ''
  },
  { immediate: true }
)

// 处理输入框输入
function handleInputChange(event) {
  const value = event.target.value
  inputValue.value = value
  
  // 尝试解析颜色值
  if (value) {
    try {
      const colorObj = getColorObject(value)
      const formatColor = getColorString(colorObj)
      emit('update:modelValue', formatColor)
      emit('change', formatColor)
    } catch (error) {
      // 如果解析失败，仍然更新值，让用户继续输入
      emit('update:modelValue', value)
    }
  } else {
    emit('update:modelValue', '')
    emit('change', '')
  }
}

// 处理输入框失焦
function handleInputBlur() {
  // 失焦时尝试格式化颜色值
  if (inputValue.value) {
    try {
      const colorObj = getColorObject(inputValue.value)
      const formatColor = getColorString(colorObj)
      inputValue.value = formatColor
      emit('update:modelValue', formatColor)
      emit('change', formatColor)
    } catch (error) {
      // 如果格式不正确，恢复原值
      inputValue.value = props.modelValue || ''
    }
  }
}

// 处理颜色变化
function handleColorChange(color) {
  if (color && !props.disabled) {
    try {
      const formatColor = getColorString(color)
      inputValue.value = formatColor
      emit('update:modelValue', formatColor)
      emit('change', formatColor)
    } catch (error) {
      console.log('Color conversion error:', error)
    }
  }
}
</script>

<style scoped>
.color-picker-wrapper.show-value {
  width: 100%;
}

.color-display {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
  width: 100%;
  padding: 0;
  overflow: hidden;
}

.color-preview-inner {
  width: 100%;
  height: 100%;
  border-radius: 2px;
}

.color-preview {
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 0;
  border: 1px solid var(--s-color-1);
  flex-shrink: 0;
  transition: all 0.2s ease;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  padding: 2px;
}

.color-preview:hover {
  border-color: var(--s-primary-color, #1890ff);
}

.color-preview-only {
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid var(--s-color-1);
  transition: all 0.2s ease;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  padding: 2px;
}

.color-preview-only:hover {
  border-color: var(--s-primary-color, #1890ff);
}

/* 尺寸变体 */
.color-picker-wrapper.size-small .color-preview {
  width: 20px;
  height: 20px;
}

.color-picker-wrapper.size-small .color-preview-only {
  width: 20px;
  height: 20px;
}

.color-picker-wrapper.size-small .color-input {
  font-size: 12px;
  padding: 6px 10px;
}

.color-picker-wrapper.size-large .color-preview {
  width: 28px;
  height: 28px;
}

.color-picker-wrapper.size-large .color-preview-only {
  width: 28px;
  height: 28px;
}

.color-picker-wrapper.size-large .color-input {
  font-size: 16px;
  padding: 10px 14px;
}

/* 禁用状态 */
.color-picker-wrapper.disabled .color-input,
.color-picker-wrapper.disabled .color-preview,
.color-picker-wrapper.disabled .color-preview-only {
  cursor: not-allowed;
  opacity: 0.6;
}

.color-picker-wrapper.disabled .color-input:hover,
.color-picker-wrapper.disabled .color-preview:hover,
.color-picker-wrapper.disabled .color-preview-only:hover {
  border-color: var(--s-border-color, #d9d9d9);
  transform: none;
}

.color-picker-dropdown {
  background: var(--schema-color-bg-2, #fff);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

/* Sketch 组件宽度调整 */
.color-picker-dropdown :deep(.vc-sketch) {
  width: var(--sketch-width, 200px) !important;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .color-value {
    color: var(--s-text-color-dark, #fff);
    background: var(--s-bg-color-dark, #1f1f1f);
    border-color: var(--s-border-color-dark, #434343);
  }
  
  .color-preview,
  .color-preview-only {
    border-color: var(--s-border-color-dark, #434343);
  }
}
</style>
