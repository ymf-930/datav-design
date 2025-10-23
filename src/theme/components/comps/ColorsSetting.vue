<template>
  <div style="width: 578px">
    <Draggable
      v-model="colors"
      class="color-setting"
      tag="div"
      item-key="id"
      v-bind="{ animation: 200, handle: '.icon-move' }"
    >
      <template #item="{ element, index }">
        <div class="color-list-item">
          <div class="item-inner">
            <div
              class="color-border"
              :class="{ active: activeIndex === index }"
              :style="{ '--active-color': element }"
              @click="colorClick(index)"
            >
              <ColorPicker
                :model-value="element"
                :show-value="true"
                :preset-colors="pickerColors"
                :show-alpha="true"
                placement="bottom"
                size="small"
                @update:model-value="(color) => handleColorChange(color, index)"
              />
            </div>
              <AntIcon name="SwapOutlined" class="icon-move pl-5" title="拖动位置"></AntIcon>
              <a-tooltip content="删除颜色" v-if="index > 5">
                <AntIcon name="CloseOutlined" @click="removeColor(index)" class="pl-5"></AntIcon>
              </a-tooltip>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="color-list-item">
          <div class="item-inner">
            <a-button
              type="primary"
              size="small"
              :disabled="colors.length > 10"
              :title="colors.length > 10 ? '主题颜色为11个以内' : ''"
              @click="addColor"
            >
              <span class="mr-8">添加</span>
              <AntIcon name="PlusOutlined"></AntIcon>
            </a-button>
          </div>
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script setup>
import Draggable from 'vuedraggable'
import { computed, ref } from 'vue'
import { pickerColors } from '@/theme'
import ColorPicker from '@/components/Common/ColorPicker/index.vue'

const emit = defineEmits(['update:modelValue', 'update:selectIndex'])
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  selectIndex: {
    type: Number,
    default: 0,
  },
})

const colors = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const activeIndex = computed({
  get: () => props.selectIndex,
  set: val => emit('update:selectIndex', val),
})

function colorClick(index) {
  activeIndex.value = index
}

// 处理颜色变化
function handleColorChange(color, index) {
  colors.value[index] = color
}

//  新增一个颜色
function addColor() {
  // 获取最后一个颜色值
  const color = colors.value[colors.value.length - 1]
  colors.value.push(color)
}
// 移除一个颜色
function removeColor(index) {
  colors.value.splice(index, 1)
}
</script>

<style scoped>
.color-setting {
  margin-top: var(--datav-font-size-lg);
  display: flex;
  flex-wrap: wrap;
  row-gap: var(--datav-border-radius-lg);
  .color-list-item {
    width: 25%;
    .item-inner {
      display: flex;
      align-items: center;
      .color-border {
        width: 102px;
        border: 1px solid var(--s-border-color-2);
        padding: 3px;
        border-radius: var(--datav-border-radius-base);
        &.active {
          border: 2px solid var(--active-color);
          padding: 2px;
        }
      }
      .ant-icon {
        cursor: pointer;
        color: var(--s-text-color-3);
        font-size: var(--datav-font-size-base);
        &.icon-move {
          margin: 0 var(--datav-border-radius-sm);
        }
      }
    }
  }
}
</style>
