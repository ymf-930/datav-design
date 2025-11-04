<template>
  <div>
    <a-button type="text" @click="open">{{ label }}</a-button>
    <a-modal v-model:visible="visible"
      :title="modalTitle"
      :maskClosable="false"
      :keyboard="false"
      width="1200px"
      top="60px"
      destroyOnClose
      @opened="render = true"
    >
      <div class="code-editor">
        <template v-if="render">
          <div class="fun">
            <v-ace-editor
              v-model:value="str"
              theme="tomorrow_night"
              :style="{ height: '320px', border: 'none' }"
              :options="{
                useWorker: false
              }"
            />
          </div>
          <div class="right-tip">
            <a-radio-group :model-value="0" size="large" style="width: 100%">
              <a-radio-button :value="0">样式示例</a-radio-button>
            </a-radio-group>
            <div class="tip-content">
              <ScrollContainer height="300px">
                <a-collapse :v-model:activeKey="'0'" ghost>
                  <a-collapse-panel v-for="(item, index) in exampleDesc"
                    :key="index"
                    :title="`示例${index + 1}: ${item.name}`"
                  >
                    <div class="code">
                      <highlightjs language="js" :code="item.code" />
                    </div>
                  </a-collapse-panel>
                </a-collapse>
              </ScrollContainer>
            </div>
          </div>
        </template>

        <a-skeleton active v-else :paragraph="{ rows: 15 }"></a-skeleton>
      </div>
      <template #footer>
        <div flex="main:justify">
          <div flex="cross:center">
            <a-tag color="processing">
              <AntIcon name="FileTextOutlined"></AntIcon>
              说明
            </a-tag>
            <span class="pl-5" style="color: var(--ant-error-color)">
              高级样式配置，格式为style对象，会覆盖默认配置
            </span>
          </div>
          <div>
            <a-button @click="visible = false" ghost>关闭</a-button>
            <a-button type="primary" @click="handleSave">保存</a-button>
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ScrollContainer from '@/components/Common/ScrollContainer/index.vue'
defineOptions({
  name: 'AdvanceStyle',
})

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
  },
  label: {
    type: String,
    default: '配置',
  },
  modalTitle: {
    type: String,
    default: '高级样式配置',
  },
})

const render = ref(false)
const visible = ref(false)
const str = ref('')
const exampleDesc = [
  {
    name: '文字渐变',
    code: JSON.stringify(
      {
        'font-weight': 'bolder',
        'background-image': '-webkit-linear-gradient(bottom, red, #fd8403, yellow)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
      null,
      2,
    ),
  },
]

const data = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

function open() {
  render.value = false
  visible.value = true
  str.value = data.value
}

// 保存关闭
async function handleSave() {
  visible.value = false
  data.value = str.value
}
</script>

<style scoped>
.code-editor {
  height: 320px;
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
