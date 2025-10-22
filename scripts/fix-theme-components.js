/**
 * 修复主题组件中的 bin-ui-design 组件
 */

const fs = require('fs')
const path = require('path')

// 需要处理的文件目录
const targetDir = 'src/theme/components'

/**
 * 修复主题组件
 */
function fixThemeComponents(content) {
  let result = content
  
  // 替换组件标签
  const componentReplacements = [
    { from: 'b-icon', to: 'AntIcon' },
    { from: 'b-modal', to: 'a-modal' },
    { from: 'b-radio-group', to: 'a-radio-group' },
    { from: 'b-radio', to: 'a-radio' },
    { from: 'b-scrollbar', to: 'div' },
    { from: 'b-empty', to: 'a-empty' },
    { from: 'b-color-picker', to: 'a-color-picker' },
    { from: 'b-button', to: 'a-button' },
    { from: 'b-input', to: 'a-input' },
    { from: 'b-row', to: 'a-row' },
    { from: 'b-col', to: 'a-col' },
    { from: 'b-tooltip', to: 'a-tooltip' },
    { from: 'b-timeline', to: 'a-timeline' },
    { from: 'b-timeline-item', to: 'a-timeline-item' },
    { from: 'b-charts', to: 'div' }, // 需要特殊处理
  ]
  
  // 替换组件标签
  componentReplacements.forEach(({ from, to }) => {
    const openRegex = new RegExp(`<${from}([^>]*)>`, 'g')
    result = result.replace(openRegex, `<${to} $1>`)
    
    const closeRegex = new RegExp(`</${from}>`, 'g')
    result = result.replace(closeRegex, `</${to}>`)
  })
  
  // 特殊处理 Modal 组件
  result = result.replace(
    /<a-modal\s+([^>]*?)v-model="([^"]+)"([^>]*)>/g,
    '<a-modal $1v-model:visible="$2"$3>'
  )
  
  // 特殊处理 RadioGroup 组件
  result = result.replace(
    /<a-radio-group\s+([^>]*?)v-model="([^"]+)"([^>]*)>/g,
    '<a-radio-group $1v-model:value="$2"$3>'
  )
  
  // 特殊处理 Radio 组件
  result = result.replace(
    /<a-radio\s+([^>]*?)label="([^"]+)"([^>]*)>/g,
    '<a-radio $1value="$2"$3>'
  )
  
  // 特殊处理 Input 组件
  result = result.replace(
    /<a-input\s+([^>]*?):model-value="([^"]+)"([^>]*)>/g,
    '<a-input $1v-model:value="$2"$3>'
  )
  
  // 特殊处理 Scrollbar 组件
  result = result.replace(
    /<div\s+class="b-scrollbar"([^>]*)>/g,
    '<div class="ant-scrollbar" style="overflow-y: auto;" $1>'
  )
  
  // 特殊处理 Row 和 Col 组件
  result = result.replace(
    /<a-row\s+([^>]*?):gutter="([^"]+)"([^>]*)>/g,
    '<a-row $1:gutter="$2"$3>'
  )
  
  result = result.replace(
    /<a-col\s+([^>]*?)span="([^"]+)"([^>]*)>/g,
    '<a-col $1:span="$2"$3>'
  )
  
  // 特殊处理 Timeline 组件
  result = result.replace(
    /<a-timeline-item\s+([^>]*?)color="([^"]+)"([^>]*)>/g,
    '<a-timeline-item $1color="$2"$3>'
  )
  
  // 特殊处理 Button 组件
  result = result.replace(
    /<a-button\s+([^>]*?)transparent([^>]*)>/g,
    '<a-button $1type="text"$2>'
  )
  
  // 特殊处理 Charts 组件 - 替换为占位 div
  result = result.replace(
    /<div\s+([^>]*?)ref="chartRef"([^>]*)>/g,
    '<div $1ref="chartRef"$2>'
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
    const fixedContent = fixThemeComponents(content)
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8')
      console.log(`✅ 已修复主题组件: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

// 执行修复
console.log('🎨 开始修复主题组件...')
if (fs.existsSync(targetDir)) {
  processDirectory(targetDir)
}
console.log('✨ 主题组件修复完成!')
