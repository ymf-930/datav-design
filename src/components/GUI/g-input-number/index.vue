<template>
  <div class="dv-gui g-input-number" :class="{ inline }">
    <div class="slider-box" v-if="slider">
      <g-slider v-model="inputValue" :min="min" :max="max" :step="step" :show-input="false" />
    </div>
    <a-input-number
      v-model:value="inputValue"
      :size="size"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      arrow-up-icon="plus"
      arrow-down-icon="minus"
      style="width: 100%"
      @change="handleChange"
    >
      <template v-if="suffix" #addonAfter>
        <span class="g-input-number__suffix">{{ suffix }}</span>
      </template>
    </a-input-number>
    <span v-if="label" class="g-input__caption" :title="tooltip">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'GInputNumber',
})
const emit = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: '',
  },
  tooltip: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'small',
  },
  min: {
    type: Number,
    default: -Infinity,
  },
  max: {
    type: Number,
    default: Infinity,
  },
  step: {
    type: Number,
    default: 1,
  },
  inline: {
    type: Boolean,
    default: false,
  },
  suffix: String,
  disabled: Boolean,
  slider: Boolean,
})

const inputValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const handleChange = (currentValue, oldValue) => {
  emit('change', currentValue, oldValue)
}
</script>

<style scoped>
:deep(.ant-input-number-group-addon){
  padding: 0 4px;
}
.g-input-number {
  width: 100%;

  .g-input-number__suffix {
    font-family: Consolas, Monaco;
    font-size: 12px;
    color: var(--s-text-color-3);
    padding: 0;
    white-space: nowrap;
  }
}
</style>
