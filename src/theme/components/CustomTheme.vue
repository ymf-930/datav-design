<template>
  <a-modal
    v-model:visible="visible"
    width="960px"
    top="50px"
    destroyOnClose
    :bodyStyle="{ backgroundColor: 'var(--schema-color-bg-3)' }"
    :closable="false"
  >
    <div class="custom-box" style="min-height: 540px">
      <div class="left-info pr-8">
        <div class="color-list mr-5">
          <div class="top-button">
            <a-button type="primary" :style="{ width: '100%' }" plain @click="createCustomTheme">
              <template #icon>
                <AntIcon name="PlusSquareOutlined" />
              </template>
              创建自定义主题
            </a-button>
          </div>

          <div v-if="customThemes.length || isComp" class="list-wrap">
            <div
              class="theme-color-item"
              flex="cross:center"
              v-for="item in customThemes"
              :key="item.id"
            >
              <div
                class="theme-item"
                :class="{ active: item.id === currentTheme.id }"
                @click="selectOneTheme(item.id)"
              >
                <div class="name">{{ item.name }}</div>

                <div
                  class="color-box"
                  v-for="(colorItem, index) in item.color"
                  :key="index"
                  :style="{ backgroundColor: colorItem }"
                ></div>
                <div
                  class="theme-bottom"
                  :style="{
                    backgroundImage: `linear-gradient(to right, ${item.color[0]} 0%, ${
                      item.color[item.color.length - 1]
                    } 100%)`,
                  }"
                ></div>
              </div>
              <div
                class="delete-icon"
                :class="{ disabled: usedIds.includes(item.id) }"
                :title="usedIds.includes(item.id) ? '当前主题已被使用不可删除' : ''"
                @click="removeCustomTheme(item.id, usedIds.includes(item.id))"
              >
                <AntIcon name="DeleteOutlined"></AntIcon>
              </div>
            </div>
          </div>
          <div v-else class="empty t-center" style="height: 150px" flex="main:center cross:center">
            暂无自定义主题
          </div>
        </div>
        <a-timeline>
          <a-timeline-item color="blue"></a-timeline-item>
          <a-timeline-item color="green"></a-timeline-item>
        </a-timeline>
      </div>
      <div class="right-info">
        <template v-if="customThemes.length || isComp">
          <div class="top-color-edit bg-box">
            <div flex="main:justify">
              <div flex="cross:center">
                <span class="color-name">主题名称</span>

                <a-input
                  v-if="isComp && currentTheme.id === ''"
                  v-model:value="currentTheme.name"
                  style="width: 240px"
                  disabled
                />
                <a-input
                  v-else
                  v-model:value="currentTheme.name"
                  show-word-count
                  :maxlength="8"
                  style="width: 240px"
                  @blur="inputBlur"
                />
              </div>
            </div>

            <ColorsSetting v-model="currentTheme.color" v-model:selectIndex="currentColorIndex" />
          </div>

          <ColorsPanel
            :color="currentColor"
            @selectSystem="handleSelectSystemColors"
            @selectColor="handleSelectColor"
          />
          <div class="chart-show bg-box mt-16">
            <ColorsCharts :colors="currentTheme.color" :id="currentTheme.id" />
          </div>
        </template>
        <a-empty v-else style="padding-top: 200px" description="暂未选择自定义主题"></a-empty>
      </div>
    </div>
    <template #footer>
      <a-button @click="handleDown" ghost>关闭</a-button>
      <a-button type="primary" @click="handleOk">应用全局主题</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Modal } from 'ant-design-vue'
import { useChartThemeColor, createNewCustomColors } from '@/theme'
import ColorsCharts from './comps/ColorsCharts.vue'
import ColorsSetting from './comps/ColorsSetting.vue'
import ColorsPanel from './comps/ColorsPanel.vue'

defineOptions({
  name: 'CustomTheme',
})

const props = defineProps({
  // 是否是组件设置
  isComp: {
    type: Boolean,
  },
})

const visible = ref(false)

// 自定义颜色数组
const { customThemes, usedIds, selectedCom, selectedThemeColors, pageConfig } = useChartThemeColor()

// 当前显示的组件样式，这里如果应用了之后，就会生成一个逗号分割的副本存储至当前图表中去。
const currentChartTheme = ref({
  id: '',
  name: '',
  color: [],
})

// 当前修改的对象
const currentTheme = ref({
  id: '',
  name: '',
  color: [],
})
// 当前编辑的颜色索引
const currentColorIndex = ref(0)

const currentColor = computed(() => {
  const index = currentColorIndex.value
  const color = currentTheme.value.color[index]
  return color ?? ''
})

function open() {
  // 如果当前是组件模式
  if (props.isComp) {
    currentChartTheme.value.name = selectedCom.value.alias
    currentChartTheme.value.color = [...selectedThemeColors.value]
    // 默认选中 当前组件的id
    selectOneTheme('')
  } else {
    // 判断自定义数组中是否存在，如存在则默认选中第一个id的自定义主题
    if (customThemes.value.length > 0) {
      selectOneTheme(customThemes.value[0].id)
    }
  }
  visible.value = true
}

function resetThemeStatus() {
  currentChartTheme.value = {
    id: '',
    name: '',
    color: [],
  }
  currentTheme.value = {
    id: '',
    name: '',
    color: [],
  }
  currentColorIndex.value = 0
}

// 文本输入失焦时间
function inputBlur() {
  currentTheme.value.name = currentTheme.value.name || '未定义'
}

// 操作完成
async function handleDown() {
  visible.value = false
  resetThemeStatus()
}

// 应用当前主题
function handleOk() {
  pageConfig.value.chartThemeColor = currentTheme.value.id
  visible.value = false
  resetThemeStatus()
}

// 创建一个主题元素，包含id，name，color
async function createCustomTheme() {
  resetThemeStatus()
  const newOne = createNewCustomColors()
  customThemes.value.push(newOne)
  selectOneTheme(newOne.id)
}

// 移除一个
function removeCustomTheme(id, disabled) {
  if (disabled) return
  Modal.confirm({
    title: '提示',
    content: '是否删除当前自定义主题颜色?',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      const idx = customThemes.value.findIndex(c => c.id === id)
      if (idx > -1) {
        customThemes.value.splice(idx, 1)
        // 删除后移除 ，并且查看是否可以选中第一个
        resetThemeStatus()
        if (idx >= 1 && customThemes.value[idx - 1]) {
          selectOneTheme(customThemes.value[idx - 1].id)
        }
      }
    },
    onCancel() {
      console.log('取消删除')
    },
  })
}

// 选择切换时
async function selectOneTheme(id) {
  // 表示组件模式选项，且选中的是当前组件的内容
  const idx = customThemes.value.findIndex(c => c.id === id)
  if (idx === -1) return
  currentTheme.value = customThemes.value[idx]

  currentColorIndex.value = 0
}

// 选择系统主题色应用
function handleSelectSystemColors(colors) {
  currentTheme.value.color = colors
  currentColorIndex.value = 0
}

// 选择了一个扩展颜色
function handleSelectColor(color) {
  const index = currentColorIndex.value
  currentTheme.value.color[index] = color
}

defineExpose({ open })
</script>

<style scoped>
.custom-box {
  display: flex;

  .left-info {
    display: flex;
    width: 308px;

    .color-list {
      flex: 1;
    }
  }

  .right-info {
    flex: 1;
  }

  .top-button {
    width: 283px;
    padding: 0 0 10px;
    border-bottom: 1px solid var(--s-color-1);
    margin-bottom: 10px;
  }

  .list-wrap {
    height: 500px;
    overflow-y: auto;
  }

  .theme-color-item {
    margin-bottom: var(--datav-border-radius-lg);
  }

  .theme-item {
    position: relative;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-between;
    padding: var(--datav-border-radius-lg) 7px 10px;
    width: calc(100% - 22px);
    background-color: var(--s-color-1);
    border-bottom: 2px solid rgba(0, 0, 0, 0);
    border-radius: var(--datav-border-radius-lg);
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;

    .theme-bottom {
      position: absolute;
      left: 0;
      bottom: 0px;
      width: 100%;
      height: 3px;
    }

    &.active {
      border: 2px solid var(--ant-primary-color);
      border-bottom: 2px solid rgba(0, 0, 0, 0);
    }

    .name {
      text-align: left;
      width: 60px;
      font-size: 13px;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      vertical-align: middle;
      overflow: hidden;
    }

    .color-box {
      display: inline-block;
      width: var(--datav-font-size-lg);
      height: var(--datav-font-size-lg);
      border-radius: 3px;
    }
  }

  .bg-box {
    padding: 10px var(--datav-font-size-lg);
    background: rgb(44, 44, 50);
    border-radius: var(--datav-border-radius-base);
  }

  .top-color-edit {
    .color-name {
      position: relative;
      right: -1px;
      line-height: 32px;
      height: 32px;
      padding: 0 var(--datav-font-size-sm);
      display: inline-block;
      border-radius: var(--datav-border-radius-base) 0 0 var(--datav-border-radius-base);
      background-color: var(--s-color-1);
      color: var(--s-text-color);
    }

    .tip {
      display: inline-block;
      padding: 0 7px;
      height: 28px;
      line-height: 26px;
      border-radius: var(--datav-border-radius-base);
      color: #f2c97d;
      border: 1px solid rgba(242, 201, 125, 0.3);
    }
  }

  .delete-icon {
    width: 22px;
    cursor: pointer;
    text-align: right;

    &::before {
      cursor: pointer;
    }

    &.disabled {
      cursor: not-allowed;
      color: var(--s-text-color-3);
    }
  }

  :deep(.ant-timeline) {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .ant-timeline-item {
      .ant-timeline-item-tail {
        display: none;
      }

      .ant-timeline-item-head {
        background-color: transparent;
        border-width: 2px;
        width: 14px;
        height: 14px;
      }
      .ant-timeline-item-content{
        min-height: 0;
      }
    }

    &::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 16px;
      bottom: 20px;
      border-left: 1px solid var(--s-color-1);
    }
  }
}
</style>
