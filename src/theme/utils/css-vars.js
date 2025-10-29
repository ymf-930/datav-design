/**
 * CSS 变量工具函数
 */

/**
 * 将驼峰命名转换为 CSS 变量名
 * @param {string} key - 驼峰命名的键名
 * @returns {string} CSS 变量名
 * @example convertToCSSVariableName('antPrimaryColor') => '--ant-primary-color'
 */
export function convertToCSSVariableName(key) {
  return `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
}

/**
 * 十六进制转 RGB
 * @param {string} hex - 十六进制颜色
 * @returns {{r: number, g: number, b: number}}
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

/**
 * RGB 转十六进制
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * 添加透明度到颜色
 * @param {string} color - 颜色值
 * @param {number} alpha - 透明度 (0-1)
 * @returns {string} rgba 颜色
 */
export function alpha(color, alpha) {
  if (!color) return ''
  
  // 如果已经是 rgba 格式
  if (color.startsWith('rgba')) return color
  
  // 如果是 rgb 格式
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`)
  }
  
  // 如果是十六进制
  const rgb = hexToRgb(color)
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

/**
 * 调整颜色亮度
 * @param {string} color - 十六进制颜色
 * @param {number} amount - 调整量 (-255 到 255)
 * @returns {string} 调整后的颜色
 */
function lighten(color, amount) {
  if (!color) return ''
  
  const rgb = hexToRgb(color)
  const r = Math.min(255, Math.max(0, rgb.r + amount))
  const g = Math.min(255, Math.max(0, rgb.g + amount))
  const b = Math.min(255, Math.max(0, rgb.b + amount))
  
  return rgbToHex(Math.round(r), Math.round(g), Math.round(b))
}

/**
 * 生成颜色色板（10个层级）
 * @param {string} color - 基础颜色
 * @returns {string[]} 色板数组
 */
export function getPalette(color) {
  if (!color) return Array(11).fill('#000000')
  
  // 简化版色板生成
  // 0-2: 较暗, 3: 活跃态, 4: 原色, 5-10: 渐亮
  return [
    lighten(color, -60), // 0 - 最暗
    lighten(color, -40), // 1
    lighten(color, -20), // 2
    lighten(color, -10), // 3 - active
    color,               // 4 - 原色
    lighten(color, 20),  // 5 - light1
    lighten(color, 40),  // 6 - light2
    lighten(color, 60),  // 7 - light3
    lighten(color, 80),  // 8 - light4
    lighten(color, 100), // 9 - light5
    lighten(color, 130), // 10 - light6 (最亮，增强浅色)
  ]
}

/**
 * 为主要颜色生成衍生色（Ant Design 官方规范）
 * @param {string} varName - CSS 变量名
 * @param {string} color - 颜色值
 * @returns {Object} 衍生色对象
 */
export function generateDerivedColors(varName, color) {
  const colorTypeMap = {
    '--ant-primary-color': 'primary',
    '--ant-success-color': 'success',
    '--ant-warning-color': 'warning',
    '--ant-error-color': 'error',
    '--ant-info-color': 'info',
  }
  
  const colorType = colorTypeMap[varName]
  if (!colorType) {
    return {}
  }
  
  const palette = getPalette(color)
  const derived = {}
  
  // 生成 Ant Design 官方规范的衍生色
  // hover 和 active 状态
  derived[`${varName}-hover`] = palette[5]   // 比原色亮
  derived[`${varName}-active`] = palette[2]  // 比原色暗
  
  // outline（用于聚焦外发光，20% 透明度）
  derived[`${varName}-outline`] = alpha(color, 0.2)
  
  // 色板（1-7，使用 rgba 透明度渐变）
  // --ant-primary-color 是原色（最深），1-7 逐渐变浅
  derived[`--ant-${colorType}-1`] = alpha(color, 0.9)    // 90%
  derived[`--ant-${colorType}-2`] = alpha(color, 0.8)    // 80%
  derived[`--ant-${colorType}-3`] = alpha(color, 0.65)   // 65%
  derived[`--ant-${colorType}-4`] = alpha(color, 0.5)    // 50%
  derived[`--ant-${colorType}-5`] = alpha(color, 0.35)   // 35%
  derived[`--ant-${colorType}-6`] = alpha(color, 0.2)    // 20%
  derived[`--ant-${colorType}-7`] = alpha(color, 0.1)    // 10% 最浅
  
  return derived
}

/**
 * 将对象属性转换为 CSS 变量对象
 * @param {Object} obj - 主题对象 {antColorPrimary: '#1890ff'}
 * @returns {Object} CSS 变量对象 {'--ant-color-primary': '#1890ff', '--ant-color-primary-light1': '...'}
 */
export function convertObjectPropsToCSSVariables(obj) {
  if (!obj || typeof obj !== 'object') return {}
  
  const result = {}
  
  Object.keys(obj).forEach(key => {
    const cssVarName = convertToCSSVariableName(key)
    const value = obj[key]
    
    // 设置主变量
    result[cssVarName] = value
    
    // 生成衍生颜色
    const derived = generateDerivedColors(cssVarName, value)
    Object.assign(result, derived)
  })
  
  return result
}

/**
 * 设置 CSS 变量到元素
 * @param {string} varName - CSS 变量名
 * @param {string} value - 变量值
 * @param {HTMLElement} el - 目标元素
 */
export function setCssVar(varName, value, el = document.documentElement) {
  if (!el || !el.style) return
  el.style.setProperty(varName, value)
}

/**
 * 批量设置 CSS 变量
 * @param {Object} obj - 主题对象
 * @param {HTMLElement} el - 目标元素
 */
export function setObjectPropsCSSVariables(obj, el = document.documentElement) {
  if (!obj || !el) return
  
  const cssVars = convertObjectPropsToCSSVariables(obj)
  
  Object.keys(cssVars).forEach(varName => {
    setCssVar(varName, cssVars[varName], el)
  })
}

/**
 * 设置元素属性
 * @param {string} attrName - 属性名
 * @param {string} value - 属性值
 * @param {HTMLElement} el - 目标元素
 */
export function setAttrVar(attrName, value, el = document.documentElement) {
  if (!el || !el.setAttribute) return
  el.setAttribute(attrName, value)
}

/**
 * 移除元素属性
 * @param {string} attrName - 属性名
 * @param {HTMLElement} el - 目标元素
 */
export function removeAttrVar(attrName, el = document.documentElement) {
  if (!el || !el.removeAttribute) return
  el.removeAttribute(attrName)
}

/**
 * 应用完整主题（包括属性和 CSS 变量）
 * @param {Object} theme - 主题对象
 * @param {string} themeName - 主题名称 (如 'dark', 'light')
 * @param {HTMLElement} el - 目标元素
 */
export function applyTheme(theme, themeName = 'dark', el = document.documentElement) {
  if (!el) return
  
  // 设置 theme-name 属性
  if (themeName) {
    setAttrVar('theme-name', themeName, el)
  }
  
  // 设置 CSS 变量
  if (theme) {
    setObjectPropsCSSVariables(theme, el)
  }
}

/**
 * 移除主题（清除属性和 CSS 变量）
 * @param {Object} theme - 主题对象（用于获取需要清除的变量名）
 * @param {HTMLElement} el - 目标元素
 */
export function removeTheme(theme, el = document.documentElement) {
  if (!el) return
  
  // 移除 theme-name 属性
  removeAttrVar('theme-name', el)
  
  // 移除 CSS 变量
  if (theme) {
    const cssVars = convertObjectPropsToCSSVariables(theme)
    Object.keys(cssVars).forEach(varName => {
      el.style.removeProperty(varName)
    })
  }
}

export default {
  convertToCSSVariableName,
  alpha,
  getPalette,
  generateDerivedColors,
  convertObjectPropsToCSSVariables,
  setCssVar,
  setObjectPropsCSSVariables,
  setAttrVar,
  removeAttrVar,
  applyTheme,
  removeTheme,
}

