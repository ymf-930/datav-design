/**
 * 批量修正组件属性脚本
 * 修正剩余的属性映射问题
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
 * 修正组件属性
 */
function fixComponentProps(content) {
  let result = content
  
  // 修正 Modal 组件的 v-model
  result = result.replace(
    /<a-modal\s+([^>]*?)v-model="([^"]+)"([^>]*)>/g,
    '<a-modal $1v-model:visible="$2"$3>'
  )
  
  // 修正 Select 组件的 v-model
  result = result.replace(
    /<a-select\s+([^>]*?)v-model="([^"]+)"([^>]*)>/g,
    '<a-select $1v-model:value="$2"$3>'
  )
  
  // 修正 Select 组件的 clearable
  result = result.replace(
    /<a-select\s+([^>]*?)clearable([^>]*)>/g,
    '<a-select $1allowClear$2>'
  )
  
  // 修正 RadioGroup 组件的 v-model
  result = result.replace(
    /<a-radio-group\s+([^>]*?)v-model="([^"]+)"([^>]*)>/g,
    '<a-radio-group $1v-model:value="$2"$3>'
  )
  
  // 修正 TreeSelect 组件的 v-model
  result = result.replace(
    /<a-tree-select\s+([^>]*?)v-model="([^"]+)"([^>]*)>/g,
    '<a-tree-select $1v-model:value="$2"$3>'
  )
  
  // 修正 Collapse 组件的 model-value
  result = result.replace(
    /<a-collapse\s+([^>]*?)model-value="([^"]+)"([^>]*)>/g,
    '<a-collapse $1v-model:activeKey="$2"$3>'
  )
  
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
    const fixedContent = fixComponentProps(content)
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8')
      console.log(`✅ 已修正: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

// 执行修正
console.log('🔧 开始批量修正组件属性...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ 组件属性修正完成!')
