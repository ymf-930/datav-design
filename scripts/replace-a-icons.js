/**
 * 替换 a-icon 组件为 AntIcon 组件
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
 * 图标名称映射
 */
const iconMapping = {
  'down': 'DownOutlined',
  'file-text': 'FileTextOutlined',
  'logout': 'LogoutOutlined',
  'home': 'HomeOutlined',
  'container': 'ContainerOutlined',
  'control': 'ControlOutlined',
  'arrowleft': 'LeftOutlined',
  'arrowright': 'RightOutlined',
  'Import': 'ImportOutlined',
  'export': 'ExportOutlined',
  'save': 'SaveOutlined',
  'ellipsis': 'EllipsisOutlined',
  'eye': 'EyeOutlined',
  'send': 'SendOutlined',
  'read': 'ReadOutlined',
  'plus': 'PlusOutlined',
  'delete': 'DeleteOutlined',
  'project': 'ProjectOutlined',
  'shake': 'ShakeOutlined',
  'thunderbolt': 'ThunderboltOutlined',
  'rocket': 'RocketOutlined',
  'desktop': 'DesktopOutlined',
  'code': 'CodeOutlined',
  'image': 'ImageOutlined',
  'question-circle': 'QuestionCircleOutlined',
  'expend': 'ExpandOutlined',
  'clear': 'ClearOutlined',
  'right': 'RightOutlined',
}

/**
 * 替换 a-icon 为 AntIcon
 */
function replaceAIcons(content) {
  let result = content
  
  // 替换 <a-icon name="xxx"> 为 <AntIcon name="xxx">
  const iconRegex = /<a-icon\s+name="([^"]+)"([^>]*)>/g
  result = result.replace(iconRegex, (match, iconName, attrs) => {
    return `<AntIcon name="${iconName}"${attrs}>`
  })
  
  // 替换闭合标签
  result = result.replace(/<\/a-icon>/g, '</AntIcon>')
  
  // 处理动态图标名称的情况
  result = result.replace(
    /<a-icon\s+:name="([^"]+)"([^>]*)>/g,
    '<AntIcon :name="$1"$2>'
  )
  
  // 处理 a-icon-select 组件（这个需要特殊处理）
  result = result.replace(
    /<a-icon-select\s+([^>]*)>/g,
    '<AntIconSelect $1>'
  )
  result = result.replace(/<\/a-icon-select>/g, '</AntIconSelect>')
  
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
 * 处理单个文件
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const fixedContent = replaceAIcons(content)
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8')
      console.log(`✅ 已替换图标: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

// 执行替换
console.log('🎨 开始替换 a-icon 为 AntIcon...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ a-icon 替换完成!')
