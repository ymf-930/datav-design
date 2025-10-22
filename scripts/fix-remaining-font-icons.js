/**
 * 处理剩余的字体图标
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
 * 处理剩余的字体图标
 */
function fixRemainingFontIcons(content) {
  let result = content
  
  // 替换字体图标为 AntIcon
  result = result.replace(
    /<i\s+([^>]*?)class="b-iconfont b-icon-([^"]+)"([^>]*)><\/i>/g,
    '<AntIcon name="$2"$1$3></AntIcon>'
  )
  
  // 移除相关的 CSS 样式
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
    const fixedContent = fixRemainingFontIcons(content)
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8')
      console.log(`✅ 已处理剩余字体图标: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

// 执行处理
console.log('🎨 开始处理剩余的字体图标...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ 剩余字体图标处理完成!')
