<template>
  <a-modal v-model:visible="visible"
    width="640px"
    top="50px"
    destroyOnClose
    :bodyStyle="{ backgroundColor: 'var(--schema-color-bg-3)' }"
    :closable="false"
  >
    <div class="custom-box" style="min-height: 540px">
      <div class="top-color-edit bg-box">
        <div flex="cross:center">
          <span class="color-name">自定义组件颜色</span>
          <a-input v-model:value="currentChartTheme.name" style="width: 240px" disabled />
        </div>
        <ColorsSetting v-model="currentChartTheme.color" v-model:selectIndex="currentColorIndex" />
      </div>
      <ColorsPanel
        :color="currentColor"
        @selectSystem="handleSelectSystemColors"
        @selectColor="handleSelectColor"
      />
      <div class="chart-show bg-box mt-16">
        <ColorsCharts :colors="currentChartTheme.color" :id="currentChartTheme.id" />
      </div>
    </div>
    <template #footer>
      <a-button @click="handleDown" ghost>关闭</a-button>
      <a-button type="primary" @click="handleOk">应用</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Modal } from 'ant-design-vue'
import { useChartThemeColor } from '@/theme'
import ColorsCharts from './comps/ColorsCharts.vue'
import ColorsSetting from './comps/ColorsSetting.vue'
import ColorsPanel from './comps/ColorsPanel.vue'

defineOptions({
  name: 'SelfTheme',
})

const visible = ref(false)

// 自定义颜色数组
const { selectedCom, selectedThemeColors } = useChartThemeColor()

const currentChartTheme = ref({
  id: '',
  name: '',
  color: [],
})

// 当前编辑的颜色索引
const currentColorIndex = ref(0)

const currentColor = computed(() => {
  const index = currentColorIndex.value
  const color = currentChartTheme.value.color[index]
  return color ?? ''
})

function open() {
  currentChartTheme.value.name = selectedCom.value.alias
  let colors = [...selectedThemeColors.value]
  if (colors.length > 11) colors = colors.slice(0, 11)
  currentChartTheme.value.color = colors
  visible.value = true
}

function resetThemeStatus() {
  currentChartTheme.value = {
    id: '',
    name: '',
    color: [],
  }
  currentColorIndex.value = 0
}

// 操作完成
async function handleDown() {
  visible.value = false
  resetThemeStatus()
}

// 应用当前主题
function handleOk() {
  const { color } = currentChartTheme.value
  selectedCom.value.attr.chartThemeColor = color.join(',')
  visible.value = false
  resetThemeStatus()
}

// 选择系统主题色应用
function handleSelectSystemColors(colors) {
  currentChartTheme.value.color = colors
  currentColorIndex.value = 0
}

// 选择了一个扩展颜色
function handleSelectColor(color) {
  const index = currentColorIndex.value
  currentChartTheme.value.color[index] = color
}

defineExpose({ open })
</script>

<style scoped>
.custom-box {
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
    width: 100%;
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
      }
    }
    &::after {
      content: '';
      position: absolute;
      left: var(--datav-border-radius-base);
      top: var(--datav-font-size-lg);
      bottom: 20px;
      border-left: 1px solid var(--s-color-1);
    }
  }
}
</style>
