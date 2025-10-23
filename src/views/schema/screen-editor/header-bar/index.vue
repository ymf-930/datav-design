<template>
  <div class="header-container">
    <div class="left-actions">
      <!-- <a-tooltip content="返回"> -->
      <div class="head-btn home">
        <AntIcon name="HomeOutlined"></AntIcon>
      </div>
      <!-- </a-tooltip> -->
      <div class="page-info">
        <span v-if="pageInfo.name">{{ pageInfo.name }}</span>
        <span v-else style="color: rgba(255, 255, 255, 0.5)">未命名大屏</span>
      </div>
      <a-space>
        <a-tooltip content="图层">
          <div
            class="head-btn"
            :class="{ active: toolbar.layer }"
            @click="schemaStore.toggleLayerPanel()"
          >
            <AntIcon name="AppstoreOutlined"></AntIcon>
          </div>
        </a-tooltip>
        <a-tooltip content="配置面板">
          <div
            class="head-btn"
            :class="{ active: toolbar.config }"
            @click="schemaStore.toggleConfigPanel()"
          >
            <AntIcon name="SettingOutlined"></AntIcon>
          </div>
        </a-tooltip>

        <a-divider type="vertical" />

        <a-tooltip content="后退">
          <div class="head-btn" :class="{ disabled: undoDisable }" @click="undo">
            <AntIcon name="LeftOutlined"></AntIcon>
          </div>
        </a-tooltip>
        <a-tooltip content="前进">
          <div class="head-btn" :class="{ disabled: redoDisable }" @click="redo">
            <AntIcon name="RightOutlined"></AntIcon>
          </div>
        </a-tooltip>
      </a-space>
    </div>
    <div class="global-actions">
      <a-space>
        <a-tooltip content="导入json (会覆盖所有内容！)">
          <a-upload action="/" :show-upload-list="false" :before-upload="handleUpload">
            <div class="head-btn">
              <AntIcon name="ImportOutlined"></AntIcon>
            </div>
          </a-upload>
        </a-tooltip>

        <a-tooltip content="导出json">
          <div class="head-btn" @click="downloadCfg">
            <AntIcon name="ExportOutlined"></AntIcon>
          </div>
        </a-tooltip>
        <a-divider type="vertical" />

        <div>
          <div class="head-btn" @click="handleSaveScreen">
            <AntIcon name="SaveOutlined" color="var(--datav-primary-color)"></AntIcon>
            &nbsp;保&nbsp;存
          </div>
          <a-dropdown :trigger="['hover']">
            <div class="head-btn" style="margin-left: -1px; padding: 0 var(--datav-border-radius-sm)">
              <AntIcon name="EllipsisOutlined"></AntIcon>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="saveTpl" @click="saveCommand('saveTpl')">保存模板</a-menu-item>
                <a-menu-item key="saveImage" @click="saveCommand('saveImage')">保存图片</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>

        <a-divider type="vertical" />

        <a-tooltip content="预览">
          <div class="head-btn" @click="handPreview">
            <AntIcon name="EyeOutlined" color="var(--datav-primary-color)"></AntIcon>
            &nbsp;预&nbsp;览
          </div>
        </a-tooltip>

        <a-tooltip content="发布">
          <div class="head-btn" @click="handlePublish">
            <AntIcon name="SendOutlined" color="var(--datav-primary-color)"></AntIcon>
            &nbsp;发&nbsp;布
          </div>
        </a-tooltip>
      </a-space>
    </div>
  </div>
  <head-loading />
  <save-screen v-model="saveVisible" :status="saveStatus" />
  <save-template v-model="tempVisible" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import HeadLoading from './head-loading.vue'
import SaveScreen from './save-screen.vue'
import SaveTemplate from './save-template.vue'
import { message, Modal } from 'ant-design-vue'
import { readFileText, downloadFile } from '@/utils/file-helper'
import { useStore } from '@/store'
import useSavePreview from '@/hooks/schema/useSavePreview'
import { createPreviewThumb } from '@/hooks/usePreviewImg'
import { setGlobalLoading } from '@/hooks/schema/useGlobalLoading'

const props = defineProps({
  backUrl: {
    type: String,
  },
  backTarget: {
    type: String,
    default: '_self', // _self
    validator: val => ['_self', '_blank'].includes(val),
  },
  pageStatus: {
    type: Object,
    default: () => ({}),
  },
})
const router = useRouter()
const { schemaStore, storeToRefs } = useStore()
const { pageInfo, comps, toolbar, undoDisable, redoDisable, pageConfig, areaData } =
  storeToRefs(schemaStore)

const { buildPageJson, previewScreen } = useSavePreview()
const saveVisible = ref(false)
const saveStatus = ref('edit')
const tempVisible = ref(false)

const handleBack = () => {
  const path = props.backUrl || '/'
  if (props.backTarget === '_blank') {
    const route = router.resolve(path)
    window.open(route.href, props.backTarget)
  } else {
    Modal.confirm({
      title: '提示',
      content: '返回时会丢失未保存的操作',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // router.push(path)
        window.open(path, props.backTarget)
        schemaStore.clearStore()
      },
      onCancel() {
        console.log('取消返回')
      }
    })
  }
}

// 导入
const handleUpload = file => {
  if (file.type !== 'application/json') {
    message.warning('请选择正确的json配置文件')
    return false
  }
  readFileText(file).then(data => {
    try {
      const screenData = JSON.parse(data)
      const { comps, pageConfig } = screenData
      schemaStore.loadScreenData({ comps, pageConfig })
    } catch (e) {
      console.warn('The imported file could not be converted to the correct JSON!')
    }
  })
  return false
}

// 导出
const downloadCfg = () => {
  const { templateName, pageJson } = buildPageJson()
  downloadFile(pageJson, `${templateName}.json`)
  message.success({ message: '模板文件已保存！', showClose: true })
}

// 保存
const handleSaveScreen = () => {
  saveStatus.value = 'edit'
  saveVisible.value = true
}

// 发布
const handlePublish = () => {
  saveStatus.value = 'audited'
  saveVisible.value = true
}

// 预览
const handPreview = async () => {
  const data = await previewScreen()
  let routeData = router.resolve({ path: `/screen/preview/${data.pageInfo.id}` })
  window.open(routeData.href, '_blank')
}

// 保存指令
function saveCommand(cmd) {
  if (cmd === 'saveImage') {
    handleExportImg()
  } else if (cmd === 'saveTpl') {
    tempVisible.value = true
  }
}

// 导出图片
async function handleExportImg() {
  setGlobalLoading(true)
  // 取消选中
  schemaStore.selectCom()
  areaData.value.showArea = false
  message.warning('正在导出图片，请勿进行其他操作！')
  try {
    const el = document.getElementById('canvas-components')
    const base64 = await createPreviewThumb(el)
    const link = document.createElement('a')
    link.download = (pageInfo.value.name || '看板预览') + '.jpeg'
    link.href = base64
    link.click()
  } catch (error) {
    console.error(error)
    message.warning('图片导出失败，请重试。')
  }
  setGlobalLoading(false)
}

defineExpose({
  handleSaveScreen,
  handlePublish,
  handPreview,
})
</script>

<style scoped>
.header-container {
  position: relative;
  width: 100%;
  height: 50px;
  background-color: var(--s-color);
  border-bottom: 1px solid var(--s-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  padding: 0 80px 0 var(--datav-border-radius-lg);
  z-index: 100;
  .head-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 28px;
    padding: 0 10px;
    text-align: center;
    cursor: pointer;
    color: var(--s-text-color);
    border-radius: 3px;
    transition: 0.2s;
    border: 1px solid var(--s-border-color-2);
    &.home {
      border-color: transparent;
    }
    > .anticon {
      font-size: 18px;
    }
    &:hover:not(.disabled) {
      color: var(--datav-primary-color);
      border-color: var(--datav-primary-color);
    }
    &.active {
      color: var(--datav-primary-color);
      border-color: var(--datav-primary-color);
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }
    .com-list-icon {
      &.is-rotate {
        animation: com-rotate 2s infinite;
        animation-direction: alternate-reverse;
      }
    }
  }
  .left-actions,
  .global-actions {
    height: 28px;
    display: flex;
    align-items: center;
  }
  .left-actions {
    .back-icon {
      height: 24px;
      > .anticon {
        position: relative;
        top: 1px;
        cursor: pointer;
        margin: 0 10px;
        font-size: 18px;
      }
    }
  }
  .page-info {
    display: flex;
    align-items: center;
    text-align: center;
    cursor: default;
    height: 100%;
    width: 180px;
    margin: 0 var(--datav-font-size-lg);
  }
  .global-actions {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
