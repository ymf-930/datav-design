const fs = require('fs')
const path = require('path')

// 专门修复 context-menu/index.vue 文件
const filePath = 'src/views/schema/screen-editor/context-menu/index.vue'

// 图标名称映射
const iconNameMapping = {
  'delete': 'DeleteOutlined',
  'ungroup': 'UngroupOutlined',
  'vertical-align-botto': 'VerticalAlignBottomOutlined',
  'arrowup': 'ArrowUpOutlined',
  'arrowdown': 'ArrowDownOutlined',
  'unlock': 'UnlockOutlined',
  'lock': 'LockOutlined',
  'eye': 'EyeOutlined',
  'eye-close': 'EyeInvisibleOutlined',
  'save': 'SaveOutlined',
  'edit': 'EditOutlined',
  'file-copy': 'CopyOutlined'
}

function fixContextMenu(content) {
  let result = content

  // 修复所有 <i class="menu-icon b-iconfont b-icon-xxx"></AntIcon> 的情况
  result = result.replace(/<i\s+class="menu-icon\s+b-iconfont\s+b-icon-([^"]+)"[^>]*><\/AntIcon>/g, (match, iconName) => {
    const officialIconName = iconNameMapping[iconName] || iconName
    return `<AntIcon name="${officialIconName}" class="menu-icon" />`
  })

  // 修复 <i class="menu-icon b-iconfont b-icon-xxx" /> 的情况
  result = result.replace(/<i\s+class="menu-icon\s+b-iconfont\s+b-icon-([^"]+)"[^>]*\/>/g, (match, iconName) => {
    const officialIconName = iconNameMapping[iconName] || iconName
    return `<AntIcon name="${officialIconName}" class="menu-icon" />`
  })

  return result
}

try {
  let content = fs.readFileSync(filePath, 'utf8')
  const newContent = fixContextMenu(content)
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8')
    console.log(`✅ 已修复 context-menu: ${filePath}`)
  }
} catch (error) {
  console.error(`❌ 处理失败: ${filePath}`, error.message)
}
