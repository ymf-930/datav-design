<template>
  <template v-if="isWord">
    <g-field label="标签标题">
      <a-select v-model:value="mappingFields.word" size="small"></a-select>
        <a-select-option
          v-for="item in dimensionFields"
          :key="item.name"
          :value="item.name"
        >{{ item.desc }}</a-select-option>
      </a-select>
    </g-field>
    <g-field label="标签值">
      <a-select v-model:value="mappingFields.frequency" size="small">
        <a-select-option
          v-for="item in measureFields"
          :key="item.name"
          :value="item.name"
        >{{ item.desc }}</a-select-option>
      </a-select>
    </g-field>
  </template>

  <template v-else-if="isSelect">
    <g-field label="选项标题">
      <a-select v-model:value="mappingFields.lAbEl" size="small">
        <a-select-option
          v-for="item in dimensionFields"
          :key="item.name"
          :value="item.name"
        >{{ item.desc }}</a-select-option>
      </a-select>
    </g-field>
    <g-field label="选项值">
      <a-select v-model:value="mappingFields.vAlUe" size="small">
        <a-select-option
          v-for="item in measureFields"
          :key="item.name"
          :value="item.name"
        >{{ item.desc }}</a-select-option>
      </a-select>
    </g-field>
  </template>

  <template v-else-if="isCircle">
    <g-field label="标题">
      <a-select v-model:value="mappingFields.tItLe" size="small">
        <a-select-option
          v-for="item in dimensionFields"
          :key="item.name"
          :value="item.name"
        >{{ item.desc }}</a-select-option>
      </a-select>
    </g-field>
    <g-field label="选项值">
      <a-select v-model:value="mappingFields.vAlUe" size="small">
        <a-select-option
          v-for="item in measureFields"
          :key="item.name"
          :value="item.name"
        >{{ item.desc }}</a-select-option>
      </a-select>
    </g-field>
  </template>

  <template v-else>
    <g-field label="标签标题">
      <a-select v-model:value="mappingFields.nAmE" size="small">
        <a-select-option
          v-for="item in dimensionFields"
          :key="item.name"
          :value="item.name"
        >{{ item.desc }}</a-select-option>
      </a-select>
    </g-field>
    <g-field label="标签值">
      <a-select v-model:value="mappingFields.vAlUe" size="small" @change="handleChange">
        <a-select-option
          v-for="item in measureFields"
          :key="item.name"
          :value="item.name"
        >{{ item.desc }}</a-select-option>
      </a-select>
    </g-field>
  </template>

  <g-field label="计算方式" v-if="showAgg">
    <a-select v-model:value="mappingFields.aGgReGaToR" size="small">
      <a-select-option
        v-for="(value, key) in AGGREGATOR_FUN"
        :key="key"
        :label="value"
        :value="key"
      ></a-select-option>
    </a-select>
  </g-field>
</template>

<script setup>
import { ref, watch } from 'vue'
import { AGGREGATOR_FUN } from '@/hooks/schema/useModelEnum'

const emit = defineEmits(['update:mapping'])

const props = defineProps({
  mapping: {
    type: Object,
    default: () => ({}),
  },
  dimensionFields: {
    type: Array,
    default: () => [],
  },
  measureFields: {
    type: Array,
    default: () => [],
  },
  isWord: {
    type: Boolean,
    default: false,
  },
  isSelect: {
    type: Boolean,
    default: false,
  },
  isCircle: {
    type: Boolean,
    default: false,
  },
  showAgg: {
    type: Boolean,
    default: false,
  },
})

const mappingFields = ref({})

watch(
  () => props.mapping,
  data => {
    mappingFields.value = data
  },
  { deep: true, immediate: true },
)

watch(
  () => mappingFields.value,
  data => {
    emit('update:mapping', data)
  },
  { deep: true },
)

function handleChange() {
  if (props.showAgg){
    mappingFields.value.aGgReGaToR = 'SUM'
  }
}
</script>

<style scoped></style>
