/**
 * 精确的组件替换策略
 * 基于 Ant Design Vue 3.2.20 的组件差异分析
 */

// 组件替换映射 - 包含属性转换
const componentReplacements = {
  // Modal 组件
  'b-modal': {
    component: 'a-modal',
    props: {
      'v-model': 'v-model:open',
      'body-styles': 'bodyStyle',
      'destroy-on-close': 'destroyOnClose',
      'append-to-body': 'getContainer',
      'draggable': null, // Ant Design Vue 不支持拖拽
      'top': null, // 使用 CSS 定位
      'width': ':width' // 需要绑定
    },
    events: {
      'close': 'cancel',
      'ok': 'ok'
    }
  },

  // Dropdown 组件
  'b-dropdown': {
    component: 'a-dropdown',
    props: {
      'append-to-body': 'getPopupContainer',
      'trigger': 'trigger',
      '@command': '@click' // 事件名不同
    },
    slots: {
      'dropdown': 'overlay'
    }
  },

  'b-dropdown-menu': {
    component: 'a-menu',
    props: {
      'style': 'style'
    }
  },

  'b-dropdown-item': {
    component: 'a-menu-item',
    props: {
      'name': 'key'
    }
  },

  // Radio 组件
  'b-radio-group': {
    component: 'a-radio-group',
    props: {
      'type': 'button',
      'size': 'size',
      'v-model': 'v-model:value'
    }
  },

  'b-radio': {
    component: 'a-radio',
    props: {
      'label': 'value'
    }
  },

  // Select 组件
  'b-select': {
    component: 'a-select',
    props: {
      'v-model': 'v-model:value',
      'clearable': 'allowClear',
      'multiple': 'mode="multiple"'
    }
  },

  'b-option': {
    component: 'a-select-option',
    props: {
      'label': 'label',
      'value': 'value'
    }
  },

  'b-option-group': {
    component: 'a-select-opt-group',
    props: {
      'label': 'label'
    }
  },

  // Collapse 组件
  'b-collapse': {
    component: 'a-collapse',
    props: {
      'model-value': 'v-model:activeKey',
      'simple': 'ghost'
    }
  },

  'b-collapse-panel': {
    component: 'a-collapse-panel',
    props: {
      'name': 'key',
      'show-arrow': 'showArrow'
    }
  },

  // Scrollbar 组件 - Ant Design Vue 没有对应组件
  'b-scrollbar': {
    component: 'div',
    props: {
      'native': 'style="overflow-y: auto;"'
    },
    customClass: 'ant-scrollbar'
  },

  // TreeSelect 组件
  'b-tree-select': {
    component: 'a-tree-select',
    props: {
      'v-model': 'v-model:value',
      'clearable': 'allowClear',
      'multiple': 'multiple'
    }
  },

  // Popover 组件
  'b-popover': {
    component: 'a-popover',
    props: {
      'v-model:visible': 'v-model:open',
      'width': 'overlayStyle',
      'disabled': 'disabled'
    }
  },

  // Skeleton 组件
  'b-skeleton': {
    component: 'a-skeleton',
    props: {
      'animation': 'active',
      'rows': 'paragraph="{ rows: 15 }"'
    }
  },

  // Tag 组件
  'b-tag': {
    component: 'a-tag',
    props: {
      'type': 'color'
    }
  },

  // Charts 组件 - 需要特殊处理
  'b-charts': {
    component: 'div',
    customClass: 'chart-container',
    note: '需要手动替换为具体的图表库组件'
  },

  // Ace Editor 组件 - 需要特殊处理
  'b-ace-editor': {
    component: 'div',
    customClass: 'ace-editor-container',
    note: '需要手动替换为 ace-editor 组件'
  }
}

// 特殊组件处理函数
const specialComponentHandlers = {
  // 处理 MessageBox
  'MessageBox': {
    replacement: 'Modal',
    import: "import { Modal } from 'ant-design-vue'",
    usage: 'Modal.confirm()'
  },

  // 处理 Utils
  'Utils': {
    replacement: '自定义工具函数',
    note: '需要手动实现对应的工具函数'
  }
}

module.exports = {
  componentReplacements,
  specialComponentHandlers
}
