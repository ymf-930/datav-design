<template>
  <div class="dv-gui g-color-picker" :class="{ inline }">
    <ColorPicker
      :model-value="inputColor"
      :show-value="true"
      :preset-colors="colors"
      :show-alpha="showAlpha"
      placement="bottomRight"
      size="small"
      @update:model-value="handleColorChange"
    />
    <span v-if="label" class="g-input__caption">{{ label }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { pickerColors } from '@/theme'
import ColorPicker from '@/components/Common/ColorPicker/index.vue'

defineOptions({
  name: 'GColorPicker',
})

const emit = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'small',
  },
  colors: {
    type: Array,
    default: () => [...pickerColors],
  },
  showAlpha: {
    type: Boolean,
    default: true,
  },
  inline: {
    type: Boolean,
    default: false,
  },
})

const inputColor = ref('')

watch(
  () => props.modelValue,
  val => {
    inputColor.value = val
  },
  { immediate: true },
)

function handleColorChange(color) {
  inputColor.value = color ? color : null
  emit('update:modelValue', inputColor.value)
  emit('change', color)
}
</script>

<style scoped>
.g-color-picker {
  width: 100%;
}
</style>
