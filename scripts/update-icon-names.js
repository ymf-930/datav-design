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
  'user': 'UserOutlined',
  'lock': 'LockOutlined',
  'home': 'HomeOutlined',
  'container': 'AppstoreOutlined',
  'control': 'SettingOutlined',
  'arrowleft': 'LeftOutlined',
  'arrowright': 'RightOutlined',
  'edit': 'EditOutlined',
  'edit-square': 'EditOutlined',
  'send': 'SendOutlined',
  'plus': 'PlusOutlined',
  'minus': 'MinusOutlined',
  'right': 'RightOutlined',
  'left': 'LeftOutlined',
  'up': 'UpOutlined',
  'down': 'DownOutlined',
  'close': 'CloseOutlined',
  'check': 'CheckOutlined',
  'search': 'SearchOutlined',
  'filter': 'FilterOutlined',
  'refresh': 'ReloadOutlined',
  'save': 'SaveOutlined',
  'delete': 'DeleteOutlined',
  'copy': 'CopyOutlined',
  'download': 'DownloadOutlined',
  'upload': 'UploadOutlined',
  'eye': 'EyeOutlined',
  'eye-invisible': 'EyeInvisibleOutlined',
  'info': 'InfoCircleOutlined',
  'warning': 'ExclamationCircleOutlined',
  'error': 'CloseCircleOutlined',
  'success': 'CheckCircleOutlined',
  'setting': 'SettingOutlined',
  'export': 'ExportOutlined',
  'Import': 'ImportOutlined',
  'read': 'ReadOutlined',
  'file-text': 'FileTextOutlined',
  'logout': 'LogoutOutlined',
  'project': 'ProjectOutlined',
  'shake': 'ShakeOutlined',
  'thunderbolt': 'ThunderboltOutlined',
  'rocket': 'RocketOutlined',
  'desktop': 'DesktopOutlined',
  'code': 'CodeOutlined',
  'image': 'ImageOutlined',
  'question-circle': 'QuestionCircleOutlined',
  'expend': 'ExpandOutlined',
  'clear': 'ClearOutlined',
  'ellipsis': 'EllipsisOutlined',
  'laptop': 'LaptopOutlined',
  'mobile': 'MobileOutlined',
  'gateway': 'GatewayOutlined',
  'apartment': 'ApartmentOutlined',
  'branches': 'BranchesOutlined',
  'arrowup': 'ArrowUpOutlined',
  'arrowdown': 'ArrowDownOutlined',
  'vertical-align-botto': 'VerticalAlignBottomOutlined',
  'swap': 'SwapOutlined',
  'delete-fill': 'DeleteFilled',
  'file-copy': 'CopyOutlined',
  'font-colors': 'FontColorsOutlined',
  'smile': 'SmileOutlined',
  'bg-colors': 'BgColorsOutlined'
}

function updateIconNames(content) {
  let result = content

  // 替换 <AntIcon name="customName"> 为 <AntIcon name="OfficialName">
  result = result.replace(/<AntIcon\s+name="([^"]+)"([^>]*)>/g, (match, iconName, attrs) => {
    const officialName = iconNameMapping[iconName] || iconName
    return `<AntIcon name="${officialName}"${attrs}>`
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

    const newContent = updateIconNames(content)
    if (newContent !== content) {
      content = newContent
      modified = true
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ 已更新图标名称: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ 处理失败: ${filePath}`, error.message)
  }
}

console.log('🎨 开始更新图标名称为 Ant Design Vue 官方名称...')
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir)
  }
})
console.log('✨ 图标名称更新完成!')
