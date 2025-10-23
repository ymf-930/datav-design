<template>
  <div class="dv-gui g-select">
    <a-select v-model:value="inputValue" :size="size" :disabled="disabled" @change="handleChange" style="width: 100%;">
      <a-select-opt-group v-for="item in data" :key="item.group" :label="item.group">
        <a-select-option
          v-for="item in item.data"
          :key="item.value"
          :value="item.value"
        >
          <span>{{ item.label }}</span>
          <span style="float: right; color: var(--s-text-color-2)">{{ item.value }}</span>
        </a-select-option>
      </a-select-opt-group>
    </a-select>

    <span v-if="label" class="g-input__caption">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'GGroupSelect',
})

const emit = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: 0,
  },
  data: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'small',
  },
  inline: {
    type: [Boolean, String],
    default: false,
  },
  disabled: Boolean,
})

const inputValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const handleChange = currentValue => {
  emit('change', currentValue)
}
</script>
