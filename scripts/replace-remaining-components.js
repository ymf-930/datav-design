/**
 * 替换剩余的 bin-ui-design 组件为 Ant Design Vue 对应组件
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
 * 替换组件
 */
function replaceComponents(content) {
  let result = content
  
  // 替换 b-tree 为 a-tree
  result = result.replace(
    /<b-tree\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/v-model="([^"]+)"/g, 'v-model:checkedKeys="$1"')
        .replace(/data="([^"]+)"/g, ':treeData="$1"')
        .replace(/show-checkbox/g, 'checkable')
        .replace(/node-key="([^"]+)"/g, ':key="$1"')
        .replace(/default-expand-all/g, 'defaultExpandAll')
        .replace(/default-checked-keys="([^"]+)"/g, ':defaultCheckedKeys="$1"')
        .replace(/default-expanded-keys="([^"]+)"/g, ':defaultExpandedKeys="$1"')
        .replace(/@node-click="([^"]+)"/g, '@select="$1"')
        .replace(/@check-change="([^"]+)"/g, '@check="$1"')
      
      return `<a-tree ${newAttrs}>`
    }
  )
  result = result.replace(/<\/b-tree>/g, '</a-tree>')
  
  // 替换 b-row 为 a-row
  result = result.replace(
    /<b-row\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/:gutter="([^"]+)"/g, ':gutter="$1"')
        .replace(/gutter="([^"]+)"/g, ':gutter="$1"')
      
      return `<a-row ${newAttrs}>`
    }
  )
  result = result.replace(/<\/b-row>/g, '</a-row>')
  
  // 替换 b-col 为 a-col
  result = result.replace(
    /<b-col\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/span="([^"]+)"/g, ':span="$1"')
        .replace(/offset="([^"]+)"/g, ':offset="$1"')
        .replace(/push="([^"]+)"/g, ':push="$1"')
        .replace(/pull="([^"]+)"/g, ':pull="$1"')
      
      return `<a-col ${newAttrs}>`
    }
  )
  result = result.replace(/<\/b-col>/g, '</a-col>')
  
  // 替换 b-move-transition 为 Transition
  result = result.replace(
    /<b-move-transition\s+([^>]*)>/g,
    '<Transition name="move" mode="out-in" $1>'
  )
  result = result.replace(/<\/b-move-transition>/g, '</Transition>')
  
  // 替换 b-count-to 为 a-statistic
  result = result.replace(
    /<b-count-to\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/start-val="([^"]+)"/g, ':value="$1"')
        .replace(/end-val="([^"]+)"/g, ':value="$1"')
        .replace(/duration="([^"]+)"/g, ':animationDuration="$1"')
        .replace(/decimals="([^"]+)"/g, ':precision="$1"')
        .replace(/separator="([^"]+)"/g, ':separator="$1"')
        .replace(/prefix="([^"]+)"/g, ':prefix="$1"')
        .replace(/suffix="([^"]+)"/g, ':suffix="$1"')
        .replace(/autoplay/g, '')
      
      return `<a-statistic ${newAttrs}>`
    }
  )
  result = result.replace(/<\/b-count-to>/g, '</a-statistic>')
  
  // 替换 b-circle 为 a-progress
  result = result.replace(
    /<b-circle\s+([^>]*)>/g,
    (match, attrs) => {
      let newAttrs = attrs
        .replace(/percent="([^"]+)"/g, ':percent="$1"')
        .replace(/stroke-width="([^"]+)"/g, ':strokeWidth="$1"')
        .replace(/stroke-color="([^"]+)"/g, ':strokeColor="$1"')
        .replace(/trail-color="([^"]+)"/g, ':trailColor="$1"')
        .replace(/size="([^"]+)"/g, ':size="$1"')
        .replace(/type="([^"]+)"/g, 'type="circle"')
      
      return `<a-progress type="circle" ${newAttrs}>`
    }
  )
  result = result.replace(/<\/b-circle>/g, '</a-progress>')
  
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
console.log('🔄 开始替换剩余的 bin-ui-design 组件...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ 组件替换完成!')
