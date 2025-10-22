const fs = require('fs')
const path = require('path')

const targetDirs = [
  'src/views',
  'src/components',
  'src/layouts',
  'src/theme/components',
  'src/assets/styles'
]

// 图标名称映射：从 b-iconfont 名称到 Ant Design Vue 官方名称
const iconNameMapping = {
  'delete': 'DeleteOutlined',
  'aim': 'AimOutlined',
  'icon-test': 'BugOutlined',
  'edit-square': 'EditOutlined',
  'setting': 'SettingOutlined',
  'clear': 'ClearOutlined',
  'swap': 'SwapOutlined',
  'close': 'CloseOutlined',
  'rotate-left': 'RotateLeftOutlined',
  'rotate-right': 'RotateRightOutlined',
  'edit': 'EditOutlined',
  'group': 'GroupOutlined',
  'ungroup': 'UngroupOutlined',
  'vertical-align-botto': 'VerticalAlignBottomOutlined',
  'arrowup': 'ArrowUpOutlined',
  'arrowdown': 'ArrowDownOutlined',
  'unlock': 'UnlockOutlined',
  'lock': 'LockOutlined',
  'eye': 'EyeOutlined',
  'eye-close': 'EyeInvisibleOutlined',
  'save': 'SaveOutlined',
  'file-copy': 'CopyOutlined'
}

function replaceBIconfont(content) {
  let result = content

  // 替换 <i class="b-iconfont b-icon-xxx"> 为 <AntIcon name="XxxOutlined">
  result = result.replace(/<i\s+class="b-iconfont\s+b-icon-([^"]+)"([^>]*)>/g, (match, iconName, attrs) => {
    const officialIconName = iconNameMapping[iconName] || iconName
    
    // 提取 style 属性
    const styleMatch = attrs.match(/style="([^"]+)"/)
    const styleAttr = styleMatch ? ` :style="${styleMatch[1]}"` : ''
    
    // 提取其他属性（除了 class）
    let otherAttrs = attrs.replace(/class="[^"]+"/g, '').trim()
    
    return `<AntIcon name="${officialIconName}"${styleAttr}${otherAttrs ? ' ' + otherAttrs : ''}>`
  })

  // 替换 <i :class="`b-iconfont b-icon-${icon}`"> 为 <AntIcon :name="icon">
  result = result.replace(/<i\s+(:class="`b-iconfont\s+b-icon-([^`]+)`")([^>]*)>/g, (match, classAttr, iconName, otherAttrs) => {
    const officialIconName = iconNameMapping[iconName] || iconName
    
    // 提取 style 属性
    const styleMatch = otherAttrs.match(/style="([^"]+)"/)
    const styleAttr = styleMatch ? ` :style="${styleMatch[1]}"` : ''
    
    // 移除 class 属性
    let cleanAttrs = otherAttrs.replace(/class="[^"]+"/g, '').trim()
    
    return `<AntIcon name="${officialIconName}"${styleAttr}${cleanAttrs ? ' ' + cleanAttrs : ''}>`
  })

  // 替换闭合标签
  result = result.replace(/<\/i>/g, '</AntIcon>')

  // 替换 CSS 类选择器 .b-iconfont 为 .ant-icon
  result = result.replace(/\.b-iconfont/g, '.ant-icon')

  // 替换特定的 CSS 选择器
  result = result.replace(/\.bin-select__caret\.b-iconfont\.b-icon-down/g, '.ant-select-arrow .anticon-down')
  result = result.replace(/\.bin-select__caret\.b-iconfont\.is-show-close/g, '.ant-select-clear')

  return result
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      processDirectory(filePath)
    } else if (file.endsWith('.vue') || file.endsWith('.js') || file.endsWith('.css')) {
      processFile(filePath)
    }
  })
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false

    const newContent = replaceBIconfont(content)
    if (newContent !== content) {
      content = newContent
      modified = true
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ 已替换 b-iconfont: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

console.log('🎨 开始替换 b-iconfont 为 AntIcon...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ b-iconfont 替换完成!')
