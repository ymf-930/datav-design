<template>
  <a-modal
    title="快捷键指南"
    :visible="modelValue"
    :getPopupContainer="() => document.body"
    class="schema-modal"
    :bodyStyle="{ padding: '10px' }"
    width="620px"
    :footer="null"
    @update:visible="$emit('update:modelValue', $event)"
  >
    <div class="shortcut-wp">
      <div class="shortcut-box">
        <div class="key-title">基础快捷键</div>
        <div class="key-wrap">
          <div class="shortcut-item">
            <div class="shortcut-title">开关图层面板</div>
            <div class="shortcut-value">Ctrl + ←</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">开关配置面板</div>
            <div class="shortcut-value">Ctrl + →</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">开关组件面板</div>
            <div class="shortcut-value">Ctrl + ↑</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">开关工具栏</div>
            <div class="shortcut-value">Ctrl + ↓</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">复制选中组件</div>
            <div class="shortcut-value">Ctrl + C</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">粘贴组件</div>
            <div class="shortcut-value">Ctrl + V</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">撤销操作</div>
            <div class="shortcut-value">Ctrl + Z</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">保存大屏</div>
            <div class="shortcut-value">Ctrl + S</div>
          </div>
        </div>
      </div>
      <div class="shortcut-box">
        <div class="key-title">画布操作</div>
        <div class="key-wrap">
          <div class="shortcut-item">
            <div class="shortcut-title">画布缩放最佳比例</div>
            <div class="shortcut-value">Ctrl + A</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">画布缩放为1：1</div>
            <div class="shortcut-value">Ctrl + D</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">自由缩放</div>
            <div class="shortcut-value">Ctrl + 鼠标滚轮/滚动</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">移动画布</div>
            <div class="shortcut-value">Space + 鼠标左键/拖动</div>
          </div>
        </div>
      </div>
      <div class="shortcut-box">
        <div class="key-title">组件操作</div>
        <div class="key-wrap">
          <div class="shortcut-item">
            <div class="shortcut-title">组件置顶</div>
            <div class="shortcut-value">Alt + Home</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">组件置底</div>
            <div class="shortcut-value">Alt + End</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">上移一层</div>
            <div class="shortcut-value">Alt + ↑</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">下移一层</div>
            <div class="shortcut-value">Alt + ↓</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">移动组件1像素</div>
            <div class="shortcut-value">↑ ↓ ← →</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">移动组件10像素</div>
            <div class="shortcut-value">Shift + ↑ ↓ ← →</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">多选点击组件</div>
            <div class="shortcut-value">Ctrl + 鼠标左键</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">重命名</div>
            <div class="shortcut-value">F2/双击图层</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">组合</div>
            <div class="shortcut-value">Ctrl + G</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">删除选中组件</div>
            <div class="shortcut-value">Delete</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">锁定X轴拖动</div>
            <div class="shortcut-value">Shift + 鼠标左键拖动</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-title">锁定Y轴拖动</div>
            <div class="shortcut-value">Ctrl + 鼠标左键拖动</div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'shortcut',
  props: {
    modelValue: {
      type: Boolean,
    },
  },
  emits: ['update:modelValue'],
}
</script>

<style scoped>
.shortcut-wp {
  position: relative;
  margin: -var(--datav-font-size-lg);
  background: var(--schema-color-bg-2);
  user-select: none;
  .shortcut-box {
    display: flex;
    border-bottom: 1px solid var(--schema-color-border);
    .key-title {
      width: 50px;
      font-size: var(--datav-font-size-lg);
      padding: var(--datav-border-radius-lg) 0;
      -webkit-writing-mode: vertical-rl;
      writing-mode: vertical-rl;
      letter-spacing: 2px;
      text-align: center;
      line-height: 50px;
      border-right: 1px solid var(--schema-color-border);
    }
    .key-wrap {
      width: calc(100% - 50px);
      padding: var(--datav-border-radius-lg) 0 0 var(--datav-font-size-lg);
      display: flex;
      flex-wrap: wrap;
    }
    &:last-child {
      border-bottom: none;
    }
  }
  .shortcut-item {
    display: flex;
    width: 250px;
    height: 28px;
    margin: 0 var(--datav-font-size-lg) var(--datav-border-radius-lg) 0;
    justify-content: space-between;
    align-items: center;
  }

  .shortcut-title {
    padding-right: 15px;
    color: var(--s-text-color);
    font-size: var(--datav-font-size-sm);
  }

  .shortcut-value {
    padding: var(--datav-border-radius-sm) var(--datav-border-radius-base);
    font-weight: 700;
    color: var(--ant-primary-color);
  }
}
</style>