/**
 * 修复标签和属性连在一起的问题
 * 在标签名和属性之间添加空格
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
 * 修复标签和属性连在一起的问题
 */
function fixTagAttributeSpacing(content) {
  let result = content
  
  // 修复常见的标签和属性连在一起的问题
  const patterns = [
    // Dropdown 相关
    { regex: /<a-dropdowntrigger=/g, replacement: '<a-dropdown trigger=' },
    { regex: /<a-dropdownmenu/g, replacement: '<a-menu' },
    { regex: /<a-dropdownitem/g, replacement: '<a-menu-item' },
    
    // Menu 相关
    { regex: /<a-menu-itemv-for=/g, replacement: '<a-menu-item v-for=' },
    { regex: /<a-menu-item:key=/g, replacement: '<a-menu-item :key=' },
    { regex: /<a-menu-item@click=/g, replacement: '<a-menu-item @click=' },
    
    // Select 相关
    { regex: /<a-select-optionv-for=/g, replacement: '<a-select-option v-for=' },
    { regex: /<a-select-option:key=/g, replacement: '<a-select-option :key=' },
    { regex: /<a-select-option:value=/g, replacement: '<a-select-option :value=' },
    { regex: /<a-select-option:label=/g, replacement: '<a-select-option :label=' },
    
    // Radio 相关
    { regex: /<a-radio:value=/g, replacement: '<a-radio :value=' },
    { regex: /<a-radio:label=/g, replacement: '<a-radio :label=' },
    
    // Collapse 相关
    { regex: /<a-collapse-panel:key=/g, replacement: '<a-collapse-panel :key=' },
    { regex: /<a-collapse-panel:showArrow=/g, replacement: '<a-collapse-panel :showArrow=' },
    
    // TreeSelect 相关
    { regex: /<a-tree-select:tree-data=/g, replacement: '<a-tree-select :tree-data=' },
    { regex: /<a-tree-select:tree-default-expand-all=/g, replacement: '<a-tree-select :tree-default-expand-all=' },
    
    // Popover 相关
    { regex: /<a-popover:title=/g, replacement: '<a-popover :title=' },
    { regex: /<a-popover:content=/g, replacement: '<a-popover :content=' },
    
    // Skeleton 相关
    { regex: /<a-skeleton:active=/g, replacement: '<a-skeleton :active=' },
    { regex: /<a-skeleton:loading=/g, replacement: '<a-skeleton :loading=' },
    
    // Tag 相关
    { regex: /<a-tag:color=/g, replacement: '<a-tag :color=' },
    { regex: /<a-tag:closable=/g, replacement: '<a-tag :closable=' },
    
    // 通用模式：标签名后直接跟属性名（不包含空格）
    { regex: /<a-(\w+)([a-zA-Z-]+)=/g, replacement: '<a-$1 $2=' },
  ]
  
  patterns.forEach(pattern => {
    result = result.replace(pattern.regex, pattern.replacement)
  })
  
  // 特殊处理：修复重复的 :key 属性
  result = result.replace(/:key="([^"]+)"\s+:key=/g, ':key="$1"')
  
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
    const fixedContent = fixTagAttributeSpacing(content)
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8')
      console.log(`✅ 已修复: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

// 执行修复
console.log('🔧 开始修复标签和属性连在一起的问题...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ 标签属性修复完成!')
