const fs = require('fs')
const path = require('path')

const targetDirs = [
  'src/views',
  'src/components',
  'src/layouts',
  'src/theme/components'
]

// 图标名称映射：从自定义名称到 Ant Design Vue 官方名称
const iconNameMapping = {
  'edit-square': 'EditOutlined',
  'plus': 'PlusOutlined',
  'close-circle': 'CloseCircleOutlined',
  'snippets': 'SnippetsOutlined',
  'file-copy': 'CopyOutlined',
  'group': 'GroupOutlined',
  'save': 'SaveOutlined',
  'edit': 'EditOutlined'
}

function fixButtonIconProps(content) {
  let result = content

  // 处理带有 icon 属性的 a-button
  // 匹配模式：<a-button ... icon="iconName" ...>
  result = result.replace(/<a-button\s+([^>]*?)icon="([^"]+)"([^>]*?)>/g, (match, beforeAttrs, iconName, afterAttrs) => {
    const officialIconName = iconNameMapping[iconName] || iconName
    
    // 移除 icon 属性
    const cleanBeforeAttrs = beforeAttrs.trim()
    const cleanAfterAttrs = afterAttrs.trim()
    
    // 构建新的按钮标签
    let newButton = `<a-button ${cleanBeforeAttrs}${cleanAfterAttrs ? ' ' + cleanAfterAttrs : ''}>`
    
    // 添加图标插槽
    newButton += `\n        <template #icon>\n          <AntIcon name="${officialIconName}" />\n        </template>`
    
    return newButton
  })

  // 处理自闭合的 a-button 标签
  result = result.replace(/<a-button\s+([^>]*?)icon="([^"]+)"([^>]*?)\s*\/>/g, (match, beforeAttrs, iconName, afterAttrs) => {
    const officialIconName = iconNameMapping[iconName] || iconName
    
    // 移除 icon 属性
    const cleanBeforeAttrs = beforeAttrs.trim()
    const cleanAfterAttrs = afterAttrs.trim()
    
    // 构建新的按钮标签
    let newButton = `<a-button ${cleanBeforeAttrs}${cleanAfterAttrs ? ' ' + cleanAfterAttrs : ''}>`
    
    // 添加图标插槽
    newButton += `\n        <template #icon>\n          <AntIcon name="${officialIconName}" />\n        </template>\n      </a-button>`
    
    return newButton
  })

  return result
}

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

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false

    const newContent = fixButtonIconProps(content)
    if (newContent !== content) {
      content = newContent
      modified = true
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ 已修复按钮图标属性: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

console.log('🔧 开始修复 a-button 的 icon 属性...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ 按钮图标属性修复完成!')
