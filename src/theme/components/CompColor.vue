<template>
  <div class="comp-color-wrap">
    <div class="body-box">
      <div flex="main:justify cross:center">
        <div class="theme-color-item-box">
          <div
            v-for="(color, index) in showColors"
            :key="index"
            class="theme-color-item"
          >
            <ColorPicker
              :model-value="color"
              :show-value="false"
              :preset-colors="pickerColors"
              :show-alpha="true"
              placement="bottom"
              size="small"
              :custom-style="{ width: '28px', padding: '0' }"
              @update:model-value="(newColor) => handleColorChange(newColor, index)"
            />
          </div>
        </div>
        <div class="btn-box">
            <a-button type="text" size="small" title="自定义组件颜色" @click="openCustomTheme">
              <template #icon>
                <AntIcon name="EditOutlined" class="btn-text"></AntIcon>
              </template>
            </a-button>
            <a-button
              type="text"
              size="small"
              title="移除自定义颜色"
              :disabled="isSystemOrCustomTheme(selectedCom.attr.chartThemeColor)"
              @click="deleteCustomColor"
            >
              <template #icon>
                <AntIcon name="DeleteOutlined" class="btn-text"></AntIcon>
              </template>
            </a-button>
        </div>
      </div>
      <div class="theme-bottom" :style="themeBottomStyle"></div>
    </div>
    <SelfTheme ref="selfThemeRef" />
  </div>
</template>

<script setup>
import { useChartThemeColor, SelfTheme, pickerColors } from '@/theme'
import { computed, ref } from 'vue'
import ColorPicker from '@/components/Common/ColorPicker/index.vue'

defineOptions({
  name: 'CompColor',
})

const selfThemeRef = ref(null)

const { selectedThemeColors, isSystemOrCustomTheme, selectedCom } = useChartThemeColor()

const showColors = computed(() => selectedThemeColors.value.slice(0, 6))

const themeBottomStyle = computed(() => {
  const arr = showColors.value
  const start = arr[0]
  const end = arr[arr.length - 1]
  return { backgroundImage: `linear-gradient(to right, ${start} 0%, ${end} 100%)` }
})

// 处理颜色变化
function handleColorChange(color, index) {
  colorChange(color, index)
}

// 弹出自定义颜色弹窗
function openCustomTheme() {
  selfThemeRef.value?.open()
}

// 删除自定义颜色
function deleteCustomColor() {
  selectedCom.value.attr.chartThemeColor = ''
}

function colorChange(color, index) {
  // 缓存当前的颜色值
  let colors = [...selectedThemeColors.value]
  // 截取前11个颜色
  if (colors.length > 11) colors = colors.slice(0, 11)
  // 指定对应颜色的位置颜色修改
  colors[index] = color
  // 设置到当前组件
  selectedCom.value.attr.chartThemeColor = colors.join(',')
}
</script>

<style scoped>
.comp-color-wrap {
  position: relative;
  width: 100%;
  .body-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 4px 10px;
    height: 28px;
    border-radius: 4px;
    overflow: hidden;
    background-color: #313132;

    .theme-color-item-box {
      display: flex;
      align-items: center;
      border-radius: 2px;
      overflow: hidden;
      :deep(.ant-color-picker) {
        &.theme-color-item {
          display: inline-block;
          width: 30px;
          height: 10px;
          .ant-color-picker-trigger {
            padding: 0;
          }
        }
      }
      .theme-color-item {
        display: inline-block;
        width: 28px;
        height: 10px;
        cursor: pointer;
        border: 1px solid var(--s-border-color);
        border-radius: 2px;
        overflow: hidden;
        margin-right: 2px;
        .color-preview {
          width: 100%;
          height: 100%;
        }
      }
    }
    .btn-box {
      display: flex;
      margin-left: 8px;
      .btn-text {
        cursor: pointer;
        color: var(--s-text-color-2);
      }
    }
    .theme-bottom {
      position: absolute;
      left: 0;
      bottom: 1px;
      width: 100%;
      height: 3px;
    }
  }
}
</style>
