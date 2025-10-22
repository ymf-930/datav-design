/**
 * 修复主题组件中标签和属性连在一起的问题
 */

const fs = require('fs')
const path = require('path')

// 需要处理的文件目录
const targetDir = 'src/theme/components'

/**
 * 修复标签和属性连在一起的问题
 */
function fixTagAttributeSpacing(content) {
  let result = content
  
  // 修复常见的标签和属性连在一起的问题
  const patterns = [
    // Modal 相关
    { regex: /<a-modalv-model:visible=/g, replacement: '<a-modal v-model:visible=' },
    { regex: /<a-modalv-model="([^"]+)"/g, replacement: '<a-modal v-model:visible="$1"' },
    
    // RadioGroup 相关
    { regex: /<a-radio-groupv-model:value=/g, replacement: '<a-radio-group v-model:value=' },
    { regex: /<a-radio-groupv-model="([^"]+)"/g, replacement: '<a-radio-group v-model:value="$1"' },
    
    // Radio 相关
    { regex: /<a-radiovalue=/g, replacement: '<a-radio value=' },
    { regex: /<a-radiolabel="([^"]+)"/g, replacement: '<a-radio value="$1"' },
    
    // Input 相关
    { regex: /<a-inputv-model:value=/g, replacement: '<a-input v-model:value=' },
    { regex: /<a-input:model-value="([^"]+)"/g, replacement: '<a-input v-model:value="$1"' },
    
    // Button 相关
    { regex: /<a-buttontransparent/g, replacement: '<a-button type="text"' },
    { regex: /<a-buttontype="primary"/g, replacement: '<a-button type="primary"' },
    
    // Row 和 Col 相关
    { regex: /<a-row:gutter=/g, replacement: '<a-row :gutter=' },
    { regex: /<a-colspan=/g, replacement: '<a-col :span=' },
    
    // Timeline 相关
    { regex: /<a-timeline-itemcolor=/g, replacement: '<a-timeline-item color=' },
    
    // ColorPicker 相关
    { regex: /<a-color-pickerv-model:value=/g, replacement: '<a-color-picker v-model:value=' },
    
    // Tooltip 相关
    { regex: /<a-tooltipcontent=/g, replacement: '<a-tooltip :content=' },
    
    // Empty 相关
    { regex: /<a-emptystyle=/g, replacement: '<a-empty :style=' },
  ]
  
  patterns.forEach(pattern => {
    result = result.replace(pattern.regex, pattern.replacement)
  })
  
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
    const fixedContent = fixTagAttributeSpacing(content)
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8')
      console.log(`✅ 已修复标签属性间距: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

// 执行修复
console.log('🔧 开始修复主题组件标签属性间距...')
if (fs.existsSync(targetDir)) {
  processDirectory(targetDir)
}
console.log('✨ 主题组件标签属性间距修复完成!')
