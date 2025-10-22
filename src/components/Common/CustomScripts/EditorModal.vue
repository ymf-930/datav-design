<template>
  <a-modal v-model:visible="visible"
    :title="modalTitle"
    :mask-closable="false"
    :esc-closable="false"
    :z-index="4000"
    width="1200px"
    top="50px"
    append-to-body
    destroy-on-close
    @opened="render = true"
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
            <div
              theme="tomorrow_night"
              wrap
              lang="typescript"
              height="500"
              v-model="data"
              :font-size="14"
              :options="{ showLineNumbers: false }"
              :styles="{ border: 'none' }"
            ></div>
          </p>
          <p class="bottom">}</p>
        </div>
        <div class="right-tip">
          <a-radio-group v-model:value="tipType" type="capsule" size="large" style="width: 100%">
            <a-radio :value="0">变量说明</a-radio>
            <a-radio :value="1">脚本示例</a-radio>
          </a-radio-group>
          <div class="tip-content">
            <div class="ant-scrollbar">
              <CustomScriptsParams v-if="tipType === 0" :paramsDesc="paramsDesc" />
              <CustomScriptsExamples v-if="tipType === 1" :exampleDesc="exampleDesc" />
            </div>
          </div>
        </div>
      </template>

      <a-skeleton active v-else :paragraph="{ rows: 15 }"></b-skeleton>
    </div>
    <template #footer>
      <div flex="main:justify">
        <div flex="cross:center">
          <template v-if="funcExplain">
            <b-tag>
              <a-icon name="file-text"></a-icon>
              说明
            </a-tag>
            <span class="pl-5" style="color: var(--bin-color-danger-light1)">
              {{ funcExplain }}
            </span>
          </template>
        </div>
        <div>
          <a-button @click="visible = false">关闭</a-button>
          <a-button type="primary" @click="handleSave">保存</a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, computed } from 'vue'
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
  render.value = false
  tipType.value = 0
  visible.value = true
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
    font-size: 14px;
    color: #b478cf;
    .params {
      color: var(--bin-color-primary);
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
    padding-left: 8px;
    .tip-content {
      height: calc(100% - 40px);
      margin-top: 6px;
      overflow-y: auto;
    }
  }

  :deep(.hljs) {
    padding: 16px;
    border-radius: 8px;
    font-size: 13px;
    font-family: Monaco, Menlo, 'Ubuntu Mono', Consolas, source-code-pro, monospace;
    /* background: #f5f6f7; */
    white-space: pre-wrap;
    line-height: 1.5715;
  }
  :deep(.bin-collapse) {
    border: none;
    background-color: var(--schema-color-bg-2);
  }
  :deep(.bin-collapse > .bin-collapse-item) {
    border: none;
  }
  :deep(.bin-collapse > .bin-collapse-item > .bin-collapse-header) {
    border-bottom: 1px solid transparent;
  }
  :deep(.bin-collapse-content) {
    padding: 0;
    background-color: var(--schema-color-bg-2);
    .bin-collapse-content-box {
      padding: 0;
      color: #fafafa;
      .tip {
        color: #fff;
      }
    }
  }
}
:deep(.bin-skeleton.is-animated .bin-skeleton__item) {
  background: linear-gradient(90deg, #1e1e1f 25%, #232324 37%, #1e1e1f 63%);
}
</style>
