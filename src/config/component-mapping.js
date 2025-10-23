/**
 * bin-ui-design 到 ant-design-vue 的组件映射配置
 */
export const componentMapping = {
  // 基础组件映射
  'b-input': 'a-input',
  'b-button': 'a-button',
  'b-icon': 'a-icon',
  'b-tooltip': 'a-tooltip',
  'b-switch': 'a-switch',
  'b-collapse-transition': 'a-collapse',
  'b-breadcrumb': 'a-breadcrumb',
  'b-upload': 'a-upload',
  'b-divider': 'a-divider',
  'b-space': 'a-space',
  'b-checkbox': 'a-checkbox',
  'b-input-number': 'a-input-number',
  'b-select': 'a-select',
  'b-slider': 'a-slider',
  'b-color-picker': 'a-color-picker',
  'b-date-picker': 'a-date-picker',
  'b-modal': 'a-modal',
  'b-drawer': 'a-drawer',
  'b-table': 'a-table',
  'b-form': 'a-form',
  'b-form-item': 'a-form-item',
  'b-config-provider': 'a-config-provider',
}

// Props 映射配置
export const propsMapping = {
  'b-input': {
    'size': 'size',
    'placeholder': 'placeholder',
    'readonly': 'readonly',
    'allowClear': 'allowClear',
    'type': 'type'
  },
  'b-button': {
    'type': 'type',
    'size': 'size',
    'loading': 'loading',
    'disabled': 'disabled',
    'icon': 'icon'
  }
}

// 事件映射配置
export const eventsMapping = {
  'b-input': {
    'change': 'change',
    'blur': 'blur',
    'focus': 'focus'
  },
  'b-button': {
    'click': 'click'
  }
}
