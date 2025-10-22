/**
 * 图标映射工具 - 从字体图标到 Ant Design 图标
 */
import * as Icons from '@ant-design/icons-vue'

// 字体图标名称到 Ant Design 图标的映射
export const iconMapping = {
  // 基础图标
  'user': 'UserOutlined',
  'lock': 'LockOutlined',
  'home': 'HomeOutlined',
  'container': 'AppstoreOutlined',
  'control': 'SettingOutlined',
  
  // 方向图标
  'arrowleft': 'LeftOutlined',
  'arrowright': 'RightOutlined',
  'arrowup': 'UpOutlined',
  'arrowdown': 'DownOutlined',
  'left': 'LeftOutlined',
  'right': 'RightOutlined',
  'up': 'UpOutlined',
  'down': 'DownOutlined',
  
  // 编辑图标
  'edit': 'EditOutlined',
  'edit-square': 'EditOutlined',
  'save': 'SaveOutlined',
  'delete': 'DeleteOutlined',
  'copy': 'CopyOutlined',
  
  // 功能图标
  'search': 'SearchOutlined',
  'filter': 'FilterOutlined',
  'refresh': 'ReloadOutlined',
  'send': 'SendOutlined',
  'download': 'DownloadOutlined',
  'upload': 'UploadOutlined',
  
  // 状态图标
  'check': 'CheckOutlined',
  'close': 'CloseOutlined',
  'plus': 'PlusOutlined',
  'minus': 'MinusOutlined',
  'eye': 'EyeOutlined',
  'eye-invisible': 'EyeInvisibleOutlined',
  
  // 提示图标
  'info': 'InfoCircleOutlined',
  'warning': 'ExclamationCircleOutlined',
  'error': 'CloseCircleOutlined',
  'success': 'CheckCircleOutlined',
}

/**
 * 获取 Ant Design 图标组件
 * @param {string} iconName - 图标名称
 * @returns {Component} Ant Design 图标组件
 */
export function getAntdIcon(iconName) {
  const mappedName = iconMapping[iconName] || iconName
  return Icons[mappedName] || Icons['QuestionCircleOutlined']
}

/**
 * 批量替换模板中的图标
 * @param {string} template - Vue 模板字符串
 * @returns {string} 替换后的模板
 */
export function replaceIconsInTemplate(template) {
  let result = template
  
  // 替换 b-icon 标签
  const iconRegex = /<b-icon\s+name="([^"]+)"([^>]*)>/g
  result = result.replace(iconRegex, (match, iconName, attrs) => {
    const AntdIcon = getAntdIcon(iconName)
    return `<${AntdIcon.name}${attrs}>`
  })
  
  // 替换闭合标签
  result = result.replace(/<\/b-icon>/g, `</${AntdIcon.name}>`)
  
  return result
}
