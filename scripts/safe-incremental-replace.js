/**
 * 安全的增量替换策略
 * 只处理尚未替换的 b-xxx 组件，避免覆盖已有的正确替换
 */

const fs = require('fs')
const path = require('path')

// 需要处理的文件目录
const targetDirs = [
  'src/views',
  'src/components',
  'src/layouts'
]

// 文件扩展名
const extensions = ['.vue', '.js']

/**
 * 检查文件是否已经包含 Ant Design 组件
 */
function hasAntdComponents(content) {
  const antdPatterns = [
    /<a-modal/,
    /<a-dropdown/,
    /<a-radio/,
    /<a-select/,
    /<a-button/,
    /<a-input/,
    /<a-form/,
    /<AntIcon/
  ]
  
  return antdPatterns.some(pattern => pattern.test(content))
}

/**
 * 检查文件是否还有未替换的 bin-ui-design 组件
 */
function hasBinComponents(content) {
  const binPatterns = [
    /<b-modal/,
    /<b-dropdown/,
    /<b-radio/,
    /<b-select/,
    /<b-button/,
    /<b-input/,
    /<b-form/,
    /<b-icon/,
    /<b-scrollbar/,
    /<b-collapse/,
    /<b-tree-select/,
    /<b-popover/,
    /<b-skeleton/,
    /<b-tag/
  ]
  
  return binPatterns.some(pattern => pattern.test(content))
}

/**
 * 精确替换组件标签和属性
 */
function replaceComponent(template) {
  let result = template
  
  // 特殊处理 Modal 组件
  result = result.replace(
    /<b-modal\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/v-model="([^"]+)"/g, 'v-model:visible="$1"')
        .replace(/body-styles="([^"]+)"/g, 'bodyStyle="$1"')
        .replace(/destroy-on-close/g, 'destroyOnClose')
        .replace(/append-to-body/g, 'getContainer')
        .replace(/draggable/g, '') // 移除不支持的属性
        .replace(/top="([^"]+)"/g, '') // 移除不支持的属性
        .replace(/width="([^"]+)"/g, ':width="$1"')
      return `<a-modal ${newAttrs}>`
    }
  )
  
  // 特殊处理 Dropdown 组件
  result = result.replace(
    /<b-dropdown\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/@command="([^"]+)"/g, '@click="$1"')
        .replace(/append-to-body/g, 'getPopupContainer')
      return `<a-dropdown ${newAttrs}>`
    }
  )
  
  // 特殊处理 Dropdown Menu
  result = result.replace(/<b-dropdown-menu/g, '<a-menu')
  result = result.replace(/<\/b-dropdown-menu>/g, '</a-menu>')
  
  // 特殊处理 Dropdown Item
  result = result.replace(
    /<b-dropdown-item\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs.replace(/name="([^"]+)"/g, 'key="$1"')
      return `<a-menu-item ${newAttrs}>`
    }
  )
  result = result.replace(/<\/b-dropdown-item>/g, '</a-menu-item>')
  
  // 特殊处理 Radio Group
  result = result.replace(
    /<b-radio-group\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/type="button"/g, 'button')
        .replace(/v-model="([^"]+)"/g, 'v-model:value="$1"')
      return `<a-radio-group ${newAttrs}>`
    }
  )
  
  // 特殊处理 Radio
  result = result.replace(
    /<b-radio\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs.replace(/label="([^"]+)"/g, 'value="$1"')
      return `<a-radio ${newAttrs}>`
    }
  )
  
  // 特殊处理 Select
  result = result.replace(
    /<b-select\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/v-model="([^"]+)"/g, 'v-model:value="$1"')
        .replace(/clearable/g, 'allowClear')
      return `<a-select ${newAttrs}>`
    }
  )
  
  // 特殊处理 Option
  result = result.replace(
    /<a-option\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/label="([^"]+)"/g, 'label="$1"')
        .replace(/value="([^"]+)"/g, 'value="$1"')
      return `<a-select-option ${newAttrs}>`
    }
  )
  result = result.replace(/<\/b-option>/g, '</a-select-option>')
  
  // 特殊处理 Option Group
  result = result.replace(
    /<a-option-group\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs.replace(/label="([^"]+)"/g, 'label="$1"')
      return `<a-select-opt-group ${newAttrs}>`
    }
  )
  result = result.replace(/<\/b-option-group>/g, '</a-select-opt-group>')
  
  // 特殊处理 Collapse
  result = result.replace(
    /<b-collapse\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/model-value="([^"]+)"/g, 'v-model:activeKey="$1"')
        .replace(/simple/g, 'ghost')
      return `<a-collapse ${newAttrs}>`
    }
  )
  
  // 特殊处理 Collapse Panel
  result = result.replace(
    /<b-collapse-panel\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/name="([^"]+)"/g, 'key="$1"')
        .replace(/show-arrow="([^"]+)"/g, 'showArrow="$1"')
      return `<a-collapse-panel ${newAttrs}>`
    }
  )
  result = result.replace(/<\/b-collapse-panel>/g, '</a-collapse-panel>')
  
  // 特殊处理 Scrollbar
  result = result.replace(
    /<b-scrollbar\s*([^>]*)>/g,
    (match, attrs) => {
      if (attrs.includes('native')) {
        return '<div class="ant-scrollbar" style="overflow-y: auto;">'
      }
      return '<div class="ant-scrollbar">'
    }
  )
  result = result.replace(/<\/b-scrollbar>/g, '</div>')
  
  // 特殊处理 TreeSelect
  result = result.replace(
    /<b-tree-select\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/v-model="([^"]+)"/g, 'v-model:value="$1"')
        .replace(/clearable/g, 'allowClear')
      return `<a-tree-select ${newAttrs}>`
    }
  )
  
  // 特殊处理 Popover
  result = result.replace(
    /<b-popover\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/v-model:visible="([^"]+)"/g, 'v-model:visible="$1"')
        .replace(/width="([^"]+)"/g, 'overlayStyle="{ width: \'$1\' }"')
      return `<a-popover ${newAttrs}>`
    }
  )
  
  // 特殊处理 Skeleton
  result = result.replace(
    /<b-skeleton\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/animation/g, 'active')
        .replace(/rows="([^"]+)"/g, 'paragraph="{ rows: $1 }"')
      return `<a-skeleton ${newAttrs}>`
    }
  )
  
  // 特殊处理 Tag
  result = result.replace(
    /<b-tag\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs.replace(/type="([^"]+)"/g, 'color="$1"')
      return `<a-tag ${newAttrs}>`
    }
  )
  
  // 处理其他简单替换
  const simpleReplacements = {
    'b-input': 'a-input',
    'b-button': 'a-button',
    'b-icon': 'AntIcon',
    'b-tooltip': 'a-tooltip',
    'b-switch': 'a-switch',
    'b-collapse-transition': 'a-collapse',
    'b-breadcrumb': 'a-breadcrumb',
    'b-breadcrumb-item': 'a-breadcrumb-item',
    'b-upload': 'a-upload',
    'b-divider': 'a-divider',
    'b-space': 'a-space',
    'b-checkbox': 'a-checkbox',
    'b-input-number': 'a-input-number',
    'b-slider': 'a-slider',
    'b-color-picker': 'a-color-picker',
    'b-date-picker': 'a-date-picker',
    'b-drawer': 'a-drawer',
    'b-table': 'a-table',
    'b-form': 'a-form',
    'b-form-item': 'a-form-item',
    'b-config-provider': 'a-config-provider',
    'b-charts': 'div', // 需要特殊处理
    'b-ace-editor': 'div', // 需要特殊处理
  }
  
  Object.entries(simpleReplacements).forEach(([oldTag, newTag]) => {
    const regex = new RegExp(`<${oldTag}([^>]*)>`, 'g')
    result = result.replace(regex, `<${newTag}$1>`)
    
    const closeRegex = new RegExp(`</${oldTag}>`, 'g')
    result = result.replace(closeRegex, `</${newTag}>`)
  })
  
  return result
}

/**
 * 替换图标
 */
function replaceIcons(template) {
  let result = template
  
  // 替换 b-icon 为 AntIcon
  const iconRegex = /<b-icon\s+name="([^"]+)"([^>]*)>/g
  result = result.replace(iconRegex, (match, iconName, attrs) => {
    return `<AntIcon name="${iconName}"${attrs}>`
  })
  
  // 替换闭合标签
  result = result.replace(/<\/b-icon>/g, '</AntIcon>')
  
  return result
}

/**
 * 处理特殊导入和工具函数
 */
function replaceImports(content) {
  let result = content
  
  // 替换 MessageBox
  result = result.replace(
    /import\s*{\s*MessageBox\s*}\s*from\s*['"]bin-ui-design['"]/g,
    "import { Modal } from 'ant-design-vue'"
  )
  
  result = result.replace(/MessageBox\.confirm/g, 'Modal.confirm')
  
  // 替换 Utils
  result = result.replace(
    /import\s*{\s*Utils\s*}\s*from\s*['"]bin-ui-design['"]/g,
    "// Utils 需要手动实现对应功能"
  )
  
  result = result.replace(/Utils\.color\.alpha/g, '// 需要实现颜色透明度函数')
  
  return result
}

/**
 * 递归处理目录
 */
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath)
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      processDirectory(filePath)
    } else if (extensions.some(ext => file.endsWith(ext))) {
      processFile(filePath)
    }
  })
}

/**
 * 安全处理单个文件
 */
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    
    // 检查是否还有未替换的 bin-ui-design 组件
    if (!hasBinComponents(content)) {
      console.log(`⏭️  跳过: ${filePath} (已完全替换)`)
      return
    }
    
    // 检查是否已经包含 Ant Design 组件
    const hasAntd = hasAntdComponents(content)
    
    let modified = false
    
    // 替换组件
    const newContent = replaceComponent(content)
    if (newContent !== content) {
      content = newContent
      modified = true
    }
    
    // 替换图标
    const newContent2 = replaceIcons(content)
    if (newContent2 !== content) {
      content = newContent2
      modified = true
    }
    
    // 替换导入
    const newContent3 = replaceImports(content)
    if (newContent3 !== content) {
      content = newContent3
      modified = true
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
      const status = hasAntd ? '🔄 增量更新' : '✅ 全新替换'
      console.log(`${status}: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

// 执行替换
console.log('🚀 开始安全的增量替换组件...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ 安全增量替换完成!')
