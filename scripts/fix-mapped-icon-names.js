/**
 * 修复映射后的图标名称，改回原始名称
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
 * 修复映射后的图标名称
 */
function fixMappedIconNames(content) {
  let result = content
  
  // 图标名称映射（反向映射）
  const reverseMapping = {
    'DownOutlined': 'down',
    'FileTextOutlined': 'file-text',
    'LogoutOutlined': 'logout',
    'HomeOutlined': 'home',
    'AppstoreOutlined': 'container',
    'SettingOutlined': 'control',
    'LeftOutlined': 'arrowleft',
    'RightOutlined': 'arrowright',
    'ImportOutlined': 'Import',
    'ExportOutlined': 'export',
    'SaveOutlined': 'save',
    'EllipsisOutlined': 'ellipsis',
    'EyeOutlined': 'eye',
    'SendOutlined': 'send',
    'ReadOutlined': 'read',
    'PlusOutlined': 'plus',
    'DeleteOutlined': 'delete',
    'ProjectOutlined': 'project',
    'ShakeOutlined': 'shake',
    'ThunderboltOutlined': 'thunderbolt',
    'RocketOutlined': 'rocket',
    'DesktopOutlined': 'desktop',
    'CodeOutlined': 'code',
    'ImageOutlined': 'image',
    'QuestionCircleOutlined': 'question-circle',
    'ExpandOutlined': 'expend',
    'ClearOutlined': 'clear',
  }
  
  // 替换映射后的图标名称
  Object.entries(reverseMapping).forEach(([mappedName, originalName]) => {
    const regex = new RegExp(`<AntIcon name="${mappedName}"`, 'g')
    result = result.replace(regex, `<AntIcon name="${originalName}"`)
  })
  
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
    const fixedContent = fixMappedIconNames(content)
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8')
      console.log(`✅ 已修复图标名称: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

// 执行修复
console.log('🔧 开始修复映射后的图标名称...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ 图标名称修复完成!')
