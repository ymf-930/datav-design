<template>
  <g-field label="选择字段">
    <a-select v-model:value="dimensionModelData">
      <a-select-option v-for="item in dimensionFields" :key="item.name" :label="item.desc"
        :value="item.name"></a-select-option>
    </a-select>
  </g-field>

  <div style="padding: 0 10px 8px" flex>
    <a-space>
      <a-tag color="primary">指标配置</a-tag>
      <a-button type="text" title="新增指标配置" @click="handleAddSaveField">
        <template #icon>
          <AntIcon name="PlusOutlined" />
        </template>
      </a-button>
    </a-space>
  </div>

  <g-field flat v-for="(item, index) in mappingFields.y" :key="index">
    <template #label>
      <a-dropdown :trigger="['click']" :placement="'bottom-start'" :getPopupContainer="() => document.body"
        @click="handleCommand($event, item)">
        <span class="mr-5 aggr">指标{{ index + 1 }}</span>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="(value, key) in AGGREGATOR_FUN" :key="key" :selected="item.aggregator === key">
              {{ value }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-button type="text" text-color="danger" @click="handleRemoveSaveField(index)">
        <template #icon>
          <AntIcon name="CloseCircleOutlined" />
        </template>
      </a-button>
    </template>
    <g-select :label="`字段(${AGGREGATOR_FUN[item.aggregator]})`" inline v-model="item.field"
      :data="measureFields.map(i => ({ value: i.name, label: i.desc }))"></g-select>
    <g-input label="标题" inline v-model="item.title"></g-input>
  </g-field>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { AGGREGATOR_FUN } from '@/hooks/schema/useModelEnum'
import { throwError } from '@/utils/util'

const emit = defineEmits(['update:axisFieldsModel', 'update:dimensionModel'])

const props = defineProps({
  axisFieldsModel: {
    type: Object,
    default: () => ({}),
  },
  dimensionModel: {
    type: String,
    default: '',
  },
  dimensionFields: {
    type: Array,
    default: () => [],
  },
  measureFields: {
    type: Array,
    default: () => [],
  },
})

const mappingFields = ref({
  x: [],
  y: [],
})
const dimensionModelData = ref('')

watch(
  () => [props.axisFieldsModel, props.dimensionModel],
  ([data, dim]) => {
    mappingFields.value = data
    dimensionModelData.value = dim
  },
  { deep: true, immediate: true },
)

watch(
  () => [mappingFields.value, dimensionModelData.value],
  ([data, dim]) => {
    emit('update:axisFieldsModel', data)
    emit('update:dimensionModel', dim)
  },
  { deep: true },
)

function handleAddSaveField() {
  if (mappingFields.value.y.length > 9) {
    throwError('Radar/handleAddSaveField', { message: '最多可添加10条' })
  } else {
    mappingFields.value.y.push({
      field: '',
      title: '',
      aggregator: 'SUM',
    })
  }
}

function handleCommand(name, el) {
  el.aggregator = name
}

// 删除存储字段
function handleRemoveSaveField(index) {
  mappingFields.value.y.splice(index, 1)
}
</script>

<style scoped>
.aggr {
  color: white;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-color: white;
}
</style>
