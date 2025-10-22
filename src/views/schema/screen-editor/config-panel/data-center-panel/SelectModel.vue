<template>
  <div class="data-model">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-tree ref="treeRef"
          width="200px"
          tree-title="模型分组"
          :treeData="treeData"
          :title-key="'text'"
          @select-change="handleSelectChange"
        />
      </a-col>

      <a-col :span="18">
        <a-form label-width="75px" flex>
          <a-form-item label="模型名称" style="width: 30%">
            <a-input v-model="query.name" @keyup.enter="handleSearch" clearable size="small" />
          </a-form-item>

          <a-form-item label-width="16px" style="width: 30%">
            <a-button type="primary" @click="handleSearch" size="small">查询</a-button>
            <a-button @click="handleReset" size="small">重置</a-button>
          </a-form-item>
        </a-form>

        <a-table :columns="columns" :data="list" :loading="loading" border size="small">
          <template #modelType="{ row }">
            {{ modelType[row.modelType] }}
          </template>
          <template #createWay="{ row }">
            {{ modelCreateWays[row.createWay] }}
          </template>

          <template #action="{ row }">
            <a-button v-if="showDetail" type="text" size="small" @click="handleView(row)">查看</a-button>
            <a-button type="text" @click="handleSelect(row)">选择</a-button>
          </template>
        </a-table>

        <div class="mt-10 t-right">
          <a-pagination :total="total"
            v-model:current="query.page"
            :pageSize="query.size"
            showTotal
            :loading="loading"
            @change="pageChange"
          />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { throwError } from '@/utils/util'
import { getModeDir, getModelList, commonByData, commonEnum } from '@/api/modules/data-model.api'
import useTable from "@/hooks/service/useTable"

const emit = defineEmits(['select', 'open'])

const props = defineProps({
  showDetail: {
    type: Boolean,
    default: false,
  },
})

const modelType = ref({})
const treeData = ref([])
const query = reactive({
  pid: '',
  name: '',
  modelType: '',
  isNotNullSql: true,
  page: 1,
  size: 10,
})

const modelCreateWays = ref({
  dataTable: '基于数据表',
  sql: '基于sql脚本',
  file: '基于文件',
  api: '基于接口',
})

const columns = [
  { title: '模型名称', key: 'name', tooltip: true },
  { title: '模型类型', slot: 'modelType' },
  { title: '建模方式', slot: 'createWay' },
  { title: '操作', slot: 'action', width: 120, align: 'center' },
]

handleOpen()

async function handleOpen() {
  await getEnum()
  await getMD()
  handleReset()
}

const { list, total, loading, getListData, handleSearch, pageChange } = useTable(
  getModelList,
  query,
)

// 获取模型类型
async function getEnum() {
  try {
    const { modelType: mt } = await commonEnum(['modelType', 'indexAuthType'])
    modelType.value = mt
    getEnumCreateWay()
  } catch (error) {
    throwError('useEnum/getEnum', error)
  }
}

async function getEnumCreateWay() {
  try {
    const { modelCreateWay } = await commonByData(['modelCreateWay'])
    if (modelCreateWay) {
      modelCreateWays.value = modelCreateWay
    }
  } catch (error) {
    throwError('useEnum/getEnum', error)
  }
}

// 获取模型分组
async function getMD() {
  try {
    const res = await getModeDir()
    const arr = res.map(item => {
      return {
        id: item.id,
        text: item.name,
      }
    })
    treeData.value = [{ text: '模型分组', expand: true, selected: true, children: arr }]
  } catch (error) {
    throwError('DataSetModal/getMD', error)
  }
}

function handleView(row) {
  emit('open', row)
}

// 重置
function handleReset() {
  query.name = ''
  handleSearch()
}

function handleSelectChange(node) {
  if (node[0].selected) {
    query.pid = node[0].id
    query.page = 1
    handleSearch()
  } else {
    node[0].selected = true
  }
}

// 查看详情
function handleSelect(row) {
  emit('select', row)
}
</script>

<style scoped>
.data-model {
  height: 100%;
}
/*:deep(.bin-form-item) {*/
/*  .bin-form-item__label {*/
/*    line-height: 32px;*/
/*  }*/
/*}*/
</style>
