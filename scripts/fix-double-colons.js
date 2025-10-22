/**
 * 修复双冒号问题
 */

const fs = require('fs')
const path = require('path')

// 需要处理的文件目录
const targetDirs = [
  'src/views',
  'src/components',
  'src/layouts',
  'src/theme'
]

// 文件扩展名
const extensions = ['.vue', '.js']

/**
 * 修复双冒号问题
 */
function fixDoubleColons(content) {
  let result = content
  
  // 修复双冒号问题，但保留CSS中的::after, ::before等伪元素
  result = result.replace(/::([a-zA-Z][a-zA-Z0-9-]*)=/g, ':$1=')
  
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
    const fixedContent = fixDoubleColons(content)
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8')
      console.log(`✅ 已修复双冒号: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

// 执行修复
console.log('🔧 开始修复双冒号问题...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ 双冒号修复完成!')
