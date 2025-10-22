/**
 * 组件功能验证脚本
 * 检查已替换组件的属性是否正确
 */

const fs = require('fs')
const path = require('path')

// 需要检查的文件目录
const targetDirs = [
  'src/views',
  'src/components',
  'src/layouts'
]

// 文件扩展名
const extensions = ['.vue', '.js']

// 组件属性检查规则
const componentChecks = {
  'a-modal': {
    correctProps: ['v-model:visible'],
    incorrectProps: ['v-model:open', 'v-model'],
    warnings: {
      'v-model:open': 'Modal 组件应该使用 v-model:visible',
      'v-model': 'Modal 组件应该使用 v-model:visible'
    }
  },
  'a-dropdown': {
    correctProps: ['trigger', 'getPopupContainer'],
    incorrectProps: ['append-to-body'],
    warnings: {
      'append-to-body': 'Dropdown 组件应该使用 getPopupContainer'
    }
  },
  'a-radio-group': {
    correctProps: ['v-model:value', 'button'],
    incorrectProps: ['v-model', 'type="button"'],
    warnings: {
      'v-model': 'RadioGroup 组件应该使用 v-model:value',
      'type="button"': 'RadioGroup 组件应该使用 button 属性'
    }
  },
  'a-select': {
    correctProps: ['v-model:value', 'allowClear'],
    incorrectProps: ['v-model', 'clearable'],
    warnings: {
      'v-model': 'Select 组件应该使用 v-model:value',
      'clearable': 'Select 组件应该使用 allowClear'
    }
  },
  'a-collapse': {
    correctProps: ['v-model:activeKey', 'ghost'],
    incorrectProps: ['model-value', 'simple'],
    warnings: {
      'model-value': 'Collapse 组件应该使用 v-model:activeKey',
      'simple': 'Collapse 组件应该使用 ghost'
    }
  },
  'a-popover': {
    correctProps: ['v-model:visible'],
    incorrectProps: ['v-model:open', 'v-model'],
    warnings: {
      'v-model:open': 'Popover 组件应该使用 v-model:visible',
      'v-model': 'Popover 组件应该使用 v-model:visible'
    }
  }
}

/**
 * 检查文件中的组件属性
 */
function checkComponentProps(content, filePath) {
  const issues = []
  
  Object.entries(componentChecks).forEach(([component, rules]) => {
    // 查找组件使用
    const componentRegex = new RegExp(`<${component}\\s+([^>]*)>`, 'g')
    let match
    
    while ((match = componentRegex.exec(content)) !== null) {
      const attrs = match[1]
      const lineNumber = content.substring(0, match.index).split('\n').length
      
  // 检查错误的属性
  rules.incorrectProps.forEach(incorrectProp => {
    if (attrs.includes(incorrectProp)) {
      issues.push({
        file: filePath,
        line: lineNumber,
        component: component,
        issue: rules.warnings[incorrectProp] || `不应该使用 ${incorrectProp}`,
        severity: 'warning'
      })
    }
  })
  
  // 特殊检查：Modal 组件必须使用 v-model:visible
  if (component === 'a-modal' && attrs.includes('v-model="') && !attrs.includes('v-model:visible')) {
    issues.push({
      file: filePath,
      line: lineNumber,
      component: component,
      issue: 'Modal 组件应该使用 v-model:visible',
      severity: 'warning'
    })
  }
  
  // 特殊检查：Select 组件必须使用 v-model:value
  if (component === 'a-select' && attrs.includes('v-model="')) {
    issues.push({
      file: filePath,
      line: lineNumber,
      component: component,
      issue: 'Select 组件应该使用 v-model:value',
      severity: 'warning'
    })
  }
  
  // 特殊检查：Select 组件必须使用 allowClear
  if (component === 'a-select' && attrs.includes('clearable')) {
    issues.push({
      file: filePath,
      line: lineNumber,
      component: component,
      issue: 'Select 组件应该使用 allowClear',
      severity: 'warning'
    })
  }
      
      // 检查缺失的正确属性
      if (component === 'a-modal' && attrs.includes('v-model:visible')) {
        // Modal 组件检查
      } else if (component === 'a-dropdown' && attrs.includes('@command')) {
        issues.push({
          file: filePath,
          line: lineNumber,
          component: component,
          issue: 'Dropdown 组件应该使用 @click 而不是 @command',
          severity: 'error'
        })
      }
    }
  })
  
  return issues
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
      checkFile(filePath)
    }
  })
}

/**
 * 检查单个文件
 */
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const issues = checkComponentProps(content, filePath)
    
    if (issues.length > 0) {
      console.log(`\n📋 检查文件: ${filePath}`)
      issues.forEach(issue => {
        const icon = issue.severity === 'error' ? '❌' : '⚠️'
        console.log(`  ${icon} 第${issue.line}行: ${issue.component} - ${issue.issue}`)
      })
    }
  } catch (error) {
    console.error(`❌ 检查失败: ${filePath}`, error.message)
  }
}

// 执行检查
console.log('🔍 开始检查组件属性...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('\n✨ 组件属性检查完成!')
