/**
 * 修复主题组件中的字体图标
 */

const fs = require('fs')
const path = require('path')

// 需要处理的文件目录
const targetDir = 'src/theme/components'

/**
 * 修复字体图标
 */
function fixFontIcons(content) {
  let result = content
  
  // 字体图标映射
  const iconMappings = [
    { from: 'b-icon-edit', to: 'edit' },
    { from: 'b-icon-delete', to: 'delete' },
    { from: 'b-icon-swap', to: 'swap' },
    { from: 'b-icon-close', to: 'close' },
    { from: 'b-icon-plus', to: 'plus' },
    { from: 'b-icon-minus', to: 'minus' },
  ]
  
  // 替换字体图标为 AntIcon
  iconMappings.forEach(({ from, to }) => {
    // 替换 <i class="b-iconfont b-icon-xxx"> 为 <AntIcon name="xxx">
    const iconRegex = new RegExp(`<i class="b-iconfont ${from}([^"]*)"([^>]*)></i>`, 'g')
    result = result.replace(iconRegex, `<AntIcon name="${to}"$2></AntIcon>`)
    
    // 替换 <i class="b-iconfont b-icon-xxx btn-text"> 为 <AntIcon name="xxx">
    const iconWithClassRegex = new RegExp(`<i class="b-iconfont ${from} btn-text"([^>]*)></i>`, 'g')
    result = result.replace(iconWithClassRegex, `<AntIcon name="${to}"$1></AntIcon>`)
  })
  
  // 移除相关的 CSS 样式
  result = result.replace(/:deep\(\.b-color-picker\)\s*{[^}]*}/g, '')
  result = result.replace(/\.b-iconfont\s*{[^}]*}/g, '')
  
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
    } else if (file.endsWith('.vue')) {
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
    const fixedContent = fixFontIcons(content)
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8')
      console.log(`✅ 已修复字体图标: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

// 执行修复
console.log('🎨 开始修复主题组件字体图标...')
if (fs.existsSync(targetDir)) {
  processDirectory(targetDir)
}
console.log('✨ 主题组件字体图标修复完成!')
