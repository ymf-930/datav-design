<template>
  <a-modal v-model:visible="visible"
    :title="modalTitle"
    :maskClosable="false"
    :keyboard="false"
    :zIndex="4000"
    width="1200px"
    top="50px"
    destroyOnClose
  >
    <div class="code-editor">
      <template v-if="render">
        <div class="fun">
          <p class="top">
            async function (
            <span class="params">{{ params }}</span>
            ){
          </p>
          <p class="code">
            <v-ace-editor
              v-model:value="data"
              theme="tomorrow_night"
              lang="typescript"
              :style="{ height: '500px', border: 'none' }"
              :options="{
                showLineNumbers: false,
                fontSize: 14,
                wrap: true,
                useWorker: false
              }"
            />
          </p>
          <p class="bottom">}</p>
        </div>
        <div class="right-tip">
          <a-radio-group v-model:value="tipType"  style="width: 100%" flex="main:justify cross:center">
            <a-radio-button :value="0">变量说明</a-radio-button>
            <a-radio-button :value="1">脚本示例</a-radio-button>
          </a-radio-group>
          <div class="tip-content">
            <ScrollContainer height="400px">
              <CustomScriptsParams v-if="tipType === 0" :paramsDesc="paramsDesc" />
              <CustomScriptsExamples v-if="tipType === 1" :exampleDesc="exampleDesc" />
            </ScrollContainer>
          </div>
        </div>
      </template>

      <a-skeleton active v-else :paragraph="{ rows: 15 }"></a-skeleton>
    </div>
    <template #footer>
      <div flex="main:justify">
        <div flex="cross:center">
          <template v-if="funcExplain">
            <a-tag>
              <AntIcon name="FileTextOutlined"></AntIcon>
              说明
            </a-tag>
            <span class="pl-5" style="color: var(--ant-error-color)">
              {{ funcExplain }}
            </span>
          </template>
        </div>
        <div>
          <a-button @click="visible = false" ghost>关闭</a-button>
          <a-button type="primary" @click="handleSave">保存</a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import ScrollContainer from '@/components/Common/ScrollContainer/index.vue'
defineOptions({
  name: 'CustomScriptsEditor',
})

const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  modalTitle: {
    type: String,
  },
  funcExplain: {
    type: String,
  },
  // 函数入参,这里不包含最后都注入的util，和comApi
  augments: {
    type: Array,
    default: () => [],
  },
  // 实际编辑的脚本值
  modelValue: {
    type: String,
    default: '',
  },
  // 参数描述
  paramsDesc: {
    type: Array,
    default: () => [],
  },
  // 示例代码 {name,code} 的对象数组，name表示示例名称，code表示对应代码
  exampleDesc: {
    type: Array,
    default: () => [],
  },
})

const data = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})
const visible = ref(false)
const render = ref(false)
const curIndex = ref(null) // 当前事件索引
const tipType = ref(0) //  { 0: '变量说明', 1: '介绍案例' }
const params = computed(() => [...props.augments, 'userInfo', 'util'].join(', '))

function open(val, index) {
  curIndex.value = index
  data.value = val
  tipType.value = 0
  visible.value = true
  // 兜底：确保打开后渲染内容，避免仅依赖事件不触发
  nextTick(() => {
    render.value = true
  })
}

// 保存关闭
function handleSave() {
  tipType.value = 0
  visible.value = false
  emit('success', data.value, curIndex.value)
}

defineExpose({
  open,
})
</script>

<style scoped>
.code-editor {
  height: 580px;
  display: flex;
  background-color: var(--schema-color-bg-2);
  .fun {
    display: flex;
    flex-direction: column;
    width: calc(100% - 480px);
    font-size: var(--datav-font-size-base);
    color: #b478cf;
    .params {
      color: var(--ant-primary-color);
    }
    .code {
      padding: 5px 5px 5px 0;
      flex: 1;
    }
    .bottom {
      margin-bottom: 5px;
    }
  }
  .right-tip {
    width: 480px;
    border-left: 1px solid var(--v-g-border-color);
    padding-left: var(--datav-border-radius-lg);
    .tip-content {
      height: calc(100% - 40px);
      margin-top: var(--datav-border-radius-base);
      overflow-y: auto;
    }
  }

  :deep(.hljs) {
    padding: var(--datav-font-size-lg);
    border-radius: var(--datav-border-radius-lg);
    font-size: 13px;
    font-family: Monaco, Menlo, 'Ubuntu Mono', Consolas, source-code-pro, monospace;
    /* background: #f5f6f7; */
    white-space: pre-wrap;
    line-height: 1.5715;
  }
  :deep(.ant-collapse) {
    border: none;
    background-color: var(--schema-color-bg-2);
  }
  :deep(.ant-collapse > .ant-collapse-item) {
    border: none;
  }
  :deep(.ant-collapse > .ant-collapse-item > .ant-collapse-header) {
    border-bottom: 1px solid transparent;
  }
  :deep(.ant-collapse-content) {
    padding: 0;
    background-color: var(--schema-color-bg-2);
    .ant-collapse-content-box {
      padding: 0;
      color: #fafafa;
      .tip {
        color: #fff;
      }
    }
  }
}
:deep(.ant-skeleton.is-animated .ant-skeleton-content .ant-skeleton-title) {
  background: linear-gradient(90deg, #1e1e1f 25%, #232324 37%, #1e1e1f 63%);
}
</style>
