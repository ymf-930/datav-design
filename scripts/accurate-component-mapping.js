/**
 * Ant Design Vue 3.2.20 组件属性映射
 * 基于官方文档的准确映射
 */

// 组件属性映射 - 基于 Ant Design Vue 3.2.20 官方文档
const componentMappings = {
  // Modal 组件
  'b-modal': {
    component: 'a-modal',
    props: {
      'v-model': 'v-model:visible', // ✅ 正确：使用 v-model:visible
      'body-styles': 'bodyStyle',
      'destroy-on-close': 'destroyOnClose',
      'append-to-body': 'getContainer',
      'draggable': null, // 不支持
      'top': null, // 不支持
      'width': ':width'
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
      'trigger': 'trigger', // ✅ 正确
      'append-to-body': 'getPopupContainer', // ✅ 正确
      '@command': '@click' // ✅ 正确：事件名不同
    },
    slots: {
      'dropdown': 'overlay' // ✅ 正确：插槽名不同
    }
  },

  'b-dropdown-menu': {
    component: 'a-menu', // ✅ 正确
    props: {
      'style': 'style'
    }
  },

  'b-dropdown-item': {
    component: 'a-menu-item', // ✅ 正确
    props: {
      'name': 'key' // ✅ 正确
    }
  },

  // Radio 组件
  'b-radio-group': {
    component: 'a-radio-group',
    props: {
      'type': 'button', // ✅ 正确：button 类型
      'v-model': 'v-model:value', // ✅ 正确
      'size': 'size'
    }
  },

  'b-radio': {
    component: 'a-radio',
    props: {
      'label': 'value' // ✅ 正确
    }
  },

  // Select 组件
  'b-select': {
    component: 'a-select',
    props: {
      'v-model': 'v-model:value', // ✅ 正确
      'clearable': 'allowClear', // ✅ 正确
      'multiple': 'mode="multiple"' // ✅ 正确
    }
  },

  'b-option': {
    component: 'a-select-option', // ✅ 正确
    props: {
      'label': 'label',
      'value': 'value'
    }
  },

  'b-option-group': {
    component: 'a-select-opt-group', // ✅ 正确
    props: {
      'label': 'label'
    }
  },

  // Collapse 组件
  'b-collapse': {
    component: 'a-collapse',
    props: {
      'model-value': 'v-model:activeKey', // ✅ 正确
      'simple': 'ghost' // ✅ 正确
    }
  },

  'b-collapse-panel': {
    component: 'a-collapse-panel',
    props: {
      'name': 'key', // ✅ 正确
      'show-arrow': 'showArrow' // ✅ 正确
    }
  },

  // TreeSelect 组件
  'b-tree-select': {
    component: 'a-tree-select',
    props: {
      'v-model': 'v-model:value', // ✅ 正确
      'clearable': 'allowClear', // ✅ 正确
      'multiple': 'multiple'
    }
  },

  // Popover 组件
  'b-popover': {
    component: 'a-popover',
    props: {
      'v-model:visible': 'v-model:visible', // ✅ 正确：使用 v-model:visible
      'width': 'overlayStyle'
    }
  },

  // Skeleton 组件
  'b-skeleton': {
    component: 'a-skeleton',
    props: {
      'animation': 'active', // ✅ 正确
      'rows': 'paragraph="{ rows: 15 }"' // ✅ 正确
    }
  },

  // Tag 组件
  'b-tag': {
    component: 'a-tag',
    props: {
      'type': 'color' // ✅ 正确
    }
  },

  // Scrollbar 组件 - Ant Design Vue 没有对应组件
  'b-scrollbar': {
    component: 'div',
    props: {
      'native': 'style="overflow-y: auto;"'
    },
    customClass: 'ant-scrollbar'
  }
}

// 特殊组件处理
const specialComponents = {
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

// 导入替换
const importReplacements = {
  'MessageBox': {
    from: "import { MessageBox } from 'bin-ui-design'",
    to: "import { Modal } from 'ant-design-vue'",
    usage: 'MessageBox.confirm → Modal.confirm'
  },
  'Utils': {
    from: "import { Utils } from 'bin-ui-design'",
    to: "// Utils 需要手动实现对应功能",
    usage: 'Utils.color.alpha → 需要实现颜色透明度函数'
  }
}

module.exports = {
  componentMappings,
  specialComponents,
  importReplacements
}
