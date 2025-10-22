const fs = require('fs')
const path = require('path')

const targetDirs = [
  'src/views',
  'src/components',
  'src/layouts',
  'src/theme/components'
]

function fixIconSelectors(content) {
  let result = content

  // 替换 > i { 为 > .anticon {
  result = result.replace(/> i \{/g, '> .anticon {')
  
  // 替换 .some-class > i { 为 .some-class > .anticon {
  result = result.replace(/(\.[\w-]+)\s+>\s+i\s+\{/g, '$1 > .anticon {')
  
  // 替换 .some-class > i 为 .some-class > .anticon (不带大括号的情况)
  result = result.replace(/(\.[\w-]+)\s+>\s+i\s*([^{])/g, '$1 > .anticon$2')
  
  // 替换 .some-class > i:hover 为 .some-class > .anticon:hover
  result = result.replace(/(\.[\w-]+)\s+>\s+i:hover/g, '$1 > .anticon:hover')
  
  // 替换 .some-class > i:before 为 .some-class > .anticon:before
  result = result.replace(/(\.[\w-]+)\s+>\s+i:before/g, '$1 > .anticon:before')
  
  // 替换 .some-class > i:after 为 .some-class > .anticon:after
  result = result.replace(/(\.[\w-]+)\s+>\s+i:after/g, '$1 > .anticon:after')

  return result
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      processDirectory(filePath)
    } else if (file.endsWith('.vue') || file.endsWith('.css')) {
      processFile(filePath)
    }
  })
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false

    const newContent = fixIconSelectors(content)
    if (newContent !== content) {
      content = newContent
      modified = true
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ 已修复图标选择器: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

console.log('🎨 开始修复图标选择器...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ 图标选择器修复完成!')
