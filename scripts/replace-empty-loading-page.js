/**
 * 替换 b-empty、b-loading、b-page 组件为 Ant Design 对应组件
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
 * 替换组件
 */
function replaceComponents(content) {
  let result = content
  
  // 替换 b-empty 为 a-empty
  result = result.replace(/<b-empty\s+([^>]*)>/g, '<a-empty $1>')
  result = result.replace(/<\/b-empty>/g, '</a-empty>')
  
  // 替换 b-loading 为 a-spin
  result = result.replace(/<b-loading\s*([^>]*)>/g, '<a-spin$1>')
  result = result.replace(/<\/b-loading>/g, '</a-spin>')
  
  // 替换 b-page 为 a-pagination
  result = result.replace(
    /<b-page\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/v-model="([^"]+)"/g, 'v-model:current="$1"')
        .replace(/total="([^"]+)"/g, ':total="$1"')
        .replace(/page-size="([^"]+)"/g, ':pageSize="$1"')
        .replace(/show-total/g, 'showTotal')
        .replace(/show-sizer/g, 'showSizeChanger')
        .replace(/show-jumper/g, 'showQuickJumper')
        .replace(/size="([^"]+)"/g, 'size="$1"')
        .replace(/simple/g, 'simple')
        .replace(/disabled/g, 'disabled')
        .replace(/hide-on-single-page/g, 'hideOnSinglePage')
      
      return `<a-pagination ${newAttrs}>`
    }
  )
  result = result.replace(/<\/b-page>/g, '</a-pagination>')
  
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
    const fixedContent = replaceComponents(content)
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8')
      console.log(`✅ 已替换组件: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

// 执行替换
console.log('🔄 开始替换 b-empty、b-loading、b-page 组件...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ 组件替换完成!')
