<template>
  <a-modal
    v-model:visible="visible"
    title="新建大屏"
    width="1000px"
    class="schema-modal"
    destroyOnClose
  >
    <div>
      <h2 class="title-bar">预设</h2>
      <div class="preset-wp">
        <div
          class="preset-item web-box"
          :class="{ selected: createValue.type === 'web' }"
          @click="selectPreset('web')"
        >
          <AntIcon name="LaptopOutlined"></AntIcon>
          <div class="label-title">
            <div class="h2">{{ webValue.label }}</div>
            <div class="h4">{{ webValue.width }}x{{ webValue.height }}</div>
          </div>
          <a-dropdown :trigger="['click']"
            :placement="'bottom-end'"
            style="width: 24px; height: 46px; line-height: 46px"
          >
            <AntIcon name="DownOutlined"></AntIcon>
            <template #overlay>
              <a-menu>
                <a-menu-item v-for="item in webScreenMap" :key="item.label" @click="handleWebTrigger(item)">
                  <div flex="main:justify" style="width: 180px">
                    <span>{{ item.label }}</span>
                    <span>{{ item.width }}x{{ item.height }}</span>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div
          class="preset-item mobile-box"
          :class="{ selected: createValue.type === 'mobile' }"
          @click="selectPreset('mobile')"
        >
          <AntIcon name="MobileOutlined"></AntIcon>
          <div class="label-title">
            <div class="h2">{{ mobileValue.label }}</div>
            <div class="h4">{{ mobileValue.width }}x{{ mobileValue.height }}</div>
          </div>
          <a-dropdown :trigger="['click']"
            :placement="'bottom-end'"
            style="width: 24px; height: 46px; line-height: 46px"
          >
            <AntIcon name="DownOutlined"></AntIcon>
            <template #overlay>
              <a-menu>
                <a-menu-item v-for="item in mobileScreenMap" :key="item.label" @click="handleMobileTrigger(item)">
                  <div flex="main:justify" style="width: 180px">
                    <span>{{ item.label }}</span>
                    <span>{{ item.width }}x{{ item.height }}</span>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div
          class="preset-item custom-box"
          :class="{ selected: createValue.type === 'custom' }"
          @click="selectPreset('custom')"
        >
          <AntIcon name="GatewayOutlined"></AntIcon>
          <div>
            <p class="mb-5">自定义大小</p>
            <p class="custom-input">
              <span class="mr-5">W:</span>
              <a-input-number
                v-model="customValue.width"
                :min="100"
                :step="1"
                :precision="0"
                size="mini"
                @change="changeSize(customValue)"
              />
              <span class="ml-5 mr-5">H:</span>
              <a-input-number
                v-model="customValue.height"
                :min="100"
                :step="1"
                :precision="0"
                size="mini"
                @change="changeSize(customValue)"
              />
            </p>
          </div>
          <div style="width: 24px"></div>
        </div>
      </div>
      <h2 class="title-bar">模板</h2>
      <div class="template-list">
        <div class="template-grid" v-for="tpl in templates" :key="tpl.template.id">
          <div
            class="template-item"
            :class="{ selected: createValue.type === 'tpl' && createValue.tpl === tpl.template.id }"
            @click="selectTpl(tpl)"
          >
            <div class="template-image">
              <div class="preview-image">
                <img v-if="getThumb(tpl.pageConfig)" :src="getThumb(tpl.pageConfig)" alt="" />
                <img
                  v-else
                  src="@/assets/images/logo.png"
                  alt="default"
                  style="width: 147px; height: 147px; padding: 30px;"
                />
              </div>
              <div class="tpl-remove">
                <a-button type="text"
                  text-color="#f5222d"
                  title="移除模板" @click="removeTpl(tpl)">
        <template #icon>
          <AntIcon name="DeleteOutlined" />
        </template></a-button>
              </div>
            </div>
            <div class="template-info">
              <div class="template-name" t-ellipsis :title="tpl.name">{{ tpl.name }}</div>
              <div class="template-size">
                <p>画布尺寸</p>
                <p>{{ tpl.pageConfig.width }}x{{ tpl.pageConfig.height }}px</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a-empty v-show="templates.length === 0" description="暂无模板"></a-empty>
    </div>
    <template #footer>
      <a-button @click="closeModal">取消</a-button>
      <a-button type="primary" @click="createScreen">开始设计</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { defaultCreateObj, saveCreateData } from '@/api/database.api'
import { getTemplateList, removeTemplate } from '@/api/modules/template.api'
import { throwError } from '@/utils/util'
import { Modal, message } from 'ant-design-vue'
import { webScreenMap, mobileScreenMap } from '@/config/enum'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
// 实际创建存储值
const createValue = reactive({ ...defaultCreateObj })

// web模式临时存储显示
const webValue = reactive({
  label: webScreenMap[0].label,
  width: webScreenMap[0].width,
  height: webScreenMap[0].height,
})
// mobile模式临时存储显示
const mobileValue = reactive({
  label: mobileScreenMap[0].label,
  width: mobileScreenMap[0].width,
  height: mobileScreenMap[0].height,
})
// custom模式临时存储显示
const customValue = reactive({
  width: 1920,
  height: 1080,
})
// 模板列表
const templates = ref([])

const closeModal = () => {
  visible.value = false
}

const openCreate = () => {
  // 初始化
  createValue.label = webScreenMap[0].label
  createValue.width = webScreenMap[0].width
  createValue.height = webScreenMap[0].height
  createValue.type = 'web'
  createValue.tpl = ''
  getTplList()
  visible.value = true
}

const selectTpl = tpl => {
  createValue.type = 'tpl'
  createValue.tpl = tpl.template.id
}

const changeSize = ({ width, height }) => {
  createValue.label = '自定义'
  createValue.width = width
  createValue.height = height
  createValue.tpl = ''
}

const handleWebTrigger = item => {
  webValue.label = item.label
  webValue.width = item.width
  webValue.height = item.height
  // 更新实际值
  createValue.label = item.label
  createValue.type = item.type
  createValue.width = item.width
  createValue.height = item.height
  createValue.tpl = ''
}

const handleMobileTrigger = item => {
  mobileValue.label = item.label
  mobileValue.width = item.width
  mobileValue.height = item.height
  // 更新实际值
  createValue.label = item.label
  createValue.type = item.type
  createValue.width = item.width
  createValue.height = item.height
  createValue.tpl = ''
}

const getTplList = () => {
  getTemplateList().then(res => {
    templates.value = (res.rows || []).map(item => {
      let json = {}
      try {
        json = JSON.parse(item.content)
      } catch (e) {
        json = { pageConfig: {} }
      }
      return json
    })
  })
}

const removeTpl = tpl => {
  Modal.confirm({
    title: '提示',
    content: '确定删除当前模板吗？',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        await removeTemplate(tpl.id)
        getTplList()
        message.success('删除模板成功！')
      } catch (e) {
        throwError('create-screen/removeTpl', e)
      }
    },
    onCancel() {
      console.log('取消删除')
    }
  })
}

const selectPreset = type => {
  if (type === 'web') {
    createValue.label = webValue.label
    createValue.width = webValue.width
    createValue.height = webValue.height
  } else if (type === 'mobile') {
    createValue.label = mobileValue.label
    createValue.width = mobileValue.width
    createValue.height = mobileValue.height
  } else if (type === 'custom') {
    createValue.label = '自定义'
    createValue.width = customValue.width
    createValue.height = customValue.height
  }
  createValue.type = type
  createValue.tpl = ''
}

const createScreen = async () => {
  closeModal()
  await saveCreateData(createValue)

  const route = router.resolve('/schema/screen')
  window.open(route.href, '_blank')
}

function getThumb(pageConfig) {
  return pageConfig.thumbnail || pageConfig.bgImage
}

defineExpose({
  openCreate,
})
</script>

<style scoped>
.title-bar {
  font-size: 18px;
  margin-bottom: var(--datav-border-radius-lg);
  font-weight: normal;
}
.preset-wp {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--datav-border-radius-lg);
  .preset-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 68px;
    width: 32%;
    padding-right: 20px;
    background: var(--schema-color-bg-2);
    border: 1px solid var(--s-border-color);
    border-radius: var(--datav-border-radius-base);
    transition: 0.2s;
    &.selected {
      border: 1px solid var(--datav-primary-color);
    }
    > .anticon {
      font-size: 40px;
      padding: 0 20px;
      font-weight: lighter;
    }
    .label-title {
      width: 140px;
      .h2 {
        font-size: var(--datav-font-size-base);
      }
      .h4 {
        color: var(--s-text-color-2);
      }
    }
    .b-icon-down {
      width: 24px;
      text-align: center;
      &:hover {
        color: var(--datav-primary-color);
        background: var(--s-color-1);
        border-radius: 5px;
      }
    }
    .custom-input {
      display: flex;
      align-items: center;
      :deep(.ant-input-number) {
        width: 75px;
        .ant-input-number-handler {
          display: none;
        }
      }
    }
  }
}
.template-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: -var(--datav-border-radius-lg);
  margin-right: -var(--datav-border-radius-lg);
  color: #fff;
  font-size: var(--datav-font-size-sm);
  .template-grid {
    width: 25%;
    padding: 0 var(--datav-border-radius-lg);
  }
  .template-item {
    cursor: pointer;
    height: 184px;
    border: 1px solid var(--s-border-color);
    outline: 1px solid transparent;
    margin-bottom: var(--datav-font-size-lg);
    transition: 0.2s;
    border-radius: var(--datav-border-radius-base);
    overflow: hidden;
    &:hover {
      border: 1px solid var(--datav-primary-color);
      .preview-image img {
        transform: scale(1.15);
      }
    }
    .template-image {
      padding: var(--datav-border-radius-lg);
      width: 100%;
      height: 146px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s;
      position: relative;
    }

    .template-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      height: 36px;
      background: var(--s-color-1);
      transition: 0.2s;
    }
    .tpl-remove {
      position: absolute;
      top: var(--datav-border-radius-sm);
      right: var(--datav-border-radius-lg);
    }
    .preview-image {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
        opacity: 0.7;
        transition: 0.2s;
        object-fit: cover;
      }
    }
    .template-name {
      font-size: var(--datav-font-size-sm);
    }
    .template-size {
      font-size: var(--datav-font-size-sm);
      transform: scale(0.8);
      transform-origin: right center;
      letter-spacing: 1px;
      color: var(--s-text-color-2);
      text-align: right;
      font-family: Orbitron-Bold, PingFangSC-Medium, PingFang SC, Microsoft YaHei, Arial, Helvetica,
        sans-serif;
    }
    &.selected {
      border: 1px solid var(--datav-primary-color);
    }
  }
  .template-item-placeholder {
    width: 258px;
    margin: var(--datav-font-size-lg);
  }
}
</style>
