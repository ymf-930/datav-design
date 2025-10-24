<template>
  <a-modal v-model:visible="visible"
    destroyOnClose
    :title="btnText"
    top="200px"
    class="schema-modal"
    @close="visible = false"
  >
    <a-form ref="formRef" :model="pageInfo" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" v-if="visible">
      <a-form-item label="所在目录" class="is-required" v-if="!route.query.isShow">
        <a-tree-select :data="dirTree"
          v-model:value="pageInfo.pid"
          titleKey="text"
          default-expand
        ></a-tree-select>
      </a-form-item>
      <a-form-item
        label="大屏名称"
        prop="name"
        :rules="{ required: true, message: '大屏名称不能为空', trigger: 'blur' }"
      >
        <a-input v-model="pageInfo.name"></a-input>
      </a-form-item>
      <template v-if="status === 'audited' && $route.query.id">
        <a-form-item label="预览地址">
          <g-input v-model="shareUrl" readonly type="textarea" :autosize="{ minRows: 3 }" />
        </a-form-item>
        <a-form-item>
          <a-button type="text" @click="copyUrl">复制预览地址</a-button>
        </a-form-item>
      </template>
    </a-form>
    <template #footer>
      <a-button type="primary" @click="saveKanban" :loading="loading">
        <template #icon>
          <AntIcon name="SaveOutlined" />
        </template>
        {{ btnText }}
      </a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { useStore } from '@/store'
import { computed, nextTick, ref, watch } from 'vue'
import { getKanbanDir } from '@/api/modules/analysis-dashboard.api'
import { copyText, throwError } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import useSavePreview from '@/hooks/schema/useSavePreview'
import { getPublicPath } from '@/utils/env'
import { setGlobalLoading } from '@/hooks/schema/useGlobalLoading'
import { sendMsg } from '@/utils/cross-tab-msg'

defineOptions({
  name: 'SaveScreen',
})
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  status: {
    type: String,
    default: 'edit',
    validator: val => ['edit', 'audited'].includes(val),
  },
})
const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const { schemaStore, storeToRefs } = useStore()
const { pageInfo } = storeToRefs(schemaStore)
const { saveScreenData } = useSavePreview()

const router = useRouter()
const route = useRoute()

const dirTree = ref([])
const formRef = ref(null)
const loading = ref(false)

const shareUrl = computed(
  () => window.location.origin + getPublicPath(`/#/screen/${route.query.id}`),
)

getKanbanDir().then(res => {
  dirTree.value = res.data ? [res.data] : []
})

const btnText = computed(() => (props.status === 'edit' ? '保存大屏' : '发布大屏'))

const saveInterval = 60 * 1000 // 每1分钟保存一次

// 定时保存函数
function saveData() {
  const isEdit = pageInfo.value.id || route.query.id
  if (isEdit) {
    saveScreenData('edit').then(() => sendMsg('save-success'))
  }
  setTimeout(saveData, saveInterval)
}

// 启动定时保存
setTimeout(saveData, saveInterval)

const saveKanban = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      let id = ''
      try {
        setGlobalLoading(true)
        loading.value = true
        id = await saveScreenData(props.status)
      } catch (e) {
        throwError('save-screes/saveKanban', e)
      }
      setGlobalLoading(false)
      pageInfo.value.id = id
      loading.value = false
      visible.value = false
      message.success({ message: `${btnText.value}成功！`, showClose: true })
      sendMsg('save-success')
      let routeData = router.resolve({
        path: '/schema/screen',
        query: { id: id, isShow: route.query.isShow },
      })
      window.location.replace(routeData.href)
    }
  })
}

const copyUrl = () => {
  nextTick(() => {
    if (copyText(shareUrl.value)) {
      message.success('复制发布地址成功!')
    }
  })
}

watch(
  () => props.modelValue,
  val => {
    if (val) {
      nextTick(() => {
        formRef.value && formRef.value.resetFields()
      })
    }
  },
)
</script>
