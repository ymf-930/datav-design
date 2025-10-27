<template>
  <div class="top" style="width: 100%">
    <div flex>
      <a-input
        :size="size"
        :placeholder="placeholder"
        :model-value="showText"
        readonly
        allowClear
        @clear="handleClear"
      ></a-input>
      <a-button :size="size" background @click="handleOpen" style="margin-left: 2px">选择</a-button>
    </div>

    <a-modal v-model:visible="visible"
      title="接口选择"
      width="800px"
      class="schema-modal"
      :footer="null"
      destroyOnClose
    >
      <div>


        <a-row :gutter="16">
          <a-col :span="6">
            <a-tree width="220px"
              ref="treeRef"
              tree-title="服务类别"
              :title-key="'name'"
              :treeData="dataTree"
              @select-change="handleTreeSelect"
            ></a-tree>
          </a-col>

          <a-col :span="18">
            <div class="mb-8">
              <a-space>
                名称
                <a-input
                  v-model:value="query.interfaceName"
                  allowClear
                  size="small"
                  @keyup.enter.stop="handleSearch"
                  :maxlength="100"
                ></a-input>
                <a-button type="primary" :loading="loading" @click="handleSearch" size="small">
                  查询
                </a-button>
                <a-button @click="handleReset" size="small">重置</a-button>
              </a-space>
            </div>

            <a-table :columns="columns" :data="list" :loading="loading" size="small">
              <template #action="{ row }">
                <a-button type="text" size="small" @click="handleSelect(row)">选择</a-button>
              </template>
            </a-table>
          </a-col>
        </a-row>

        <div class="pt-16 t-right">
          <a-pagination :total="total"
            :current="query.page"
            :pageSize="query.size"
            showTotal
            @change="pageChange"
          ></a-pagination>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import useTable from '@/hooks/service/useTable'
import { getInterfaceList, getServiceTree } from '@/api/modules/analysis-dashboard.api'

defineOptions({
  name: 'ServiceSelect',
})

const emit = defineEmits(['update:modelValue', 'update:name', 'closeEdit', 'select'])
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  name: {
    // 存储显示名称
    type: String,
    default: '',
  },
  compType: {
    // 组件数据类型
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请选择服务',
  },
  size: String,
})

const columns = [
  { title: '服务名称', key: 'interfaceName', ellipsis: true, tooltip: true },
  { title: '请求类型', key: 'reqType', width: 90, align: 'center', ellipsis: true, tooltip: true },
  { title: '服务地址', key: 'interfaceUrl', ellipsis: true, tooltip: true },
  { title: '版本', key: 'version', width: 70, align: 'center' },
  { title: '操作', slot: 'action', width: 70, align: 'center' },
]

const visible = ref(false)
const showText = ref('') // 展示文字

const dataTree = ref()
const routers = ref('')

const query = reactive({
  interfaceName: '',
  categoryId: '',
  engineType: 'analysis_engine',
  size: 10,
  page: 1,
})

watch(
  () => props.name,
  name => (showText.value = name),
  { immediate: true },
)

async function handleOpen() {
  //用于字段模板编辑界面重置为关闭状态
  emit('closeEdit')
  visible.value = true
  await getMenuTree()
  handleReset()
}

function handleTreeSelect(node) {
  if (node[0].selected) {
    query.categoryId = node[0].id
    handleSearch()
  } else {
    node[0].selected = true
  }
}

function handleSelect(row) {
  showText.value = row.interfaceName
  emit('select', row)
  emit('update:modelValue', row.id)
  emit('update:name', row.interfaceName)
  visible.value = false
}

async function getMenuTree() {
  const res = await getServiceTree()
  const data = [
    {
      name: '服务管理',
      expand: true,
      children: res,
      selected: true,
      code: 'root',
    },
  ]

  dataTree.value = restructureData(data)
  return dataTree.value
}

function restructureData(data = []) {
  const mapper = node => {
    const expanded = routers.value.indexOf(node.id) > -1 ? true : false
    const mapperNode = {
      expand: expanded,
      ...node,
    }
    if (node.children && node.children.length) {
      mapperNode.children = node.children.map(mapper)
    }
    return mapperNode
  }
  return data.map(mapper)
}

function handleClear() {
  showText.value = ''
  emit('update:modelValue', '')
  emit('update:name', '')
  emit('select', null)
  visible.value = false
}

const { list, total, loading, getListData, handleSearch, pageChange } = useTable(
  getInterfaceList,
  query,
)

function handleReset() {
  query.page = 1
  query.size = 10
  query.interfaceName = ''
  getListData()
}
</script>

<style scoped></style>
