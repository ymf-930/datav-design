/**
 * 主题切换工具函数
 * 支持暗黑主题和亮色主题的动态切换
 */

// 主题类型枚举
export const THEME_TYPES = {
  DARK: 'dark',
  LIGHT: 'light'
}

// 当前主题状态
let currentTheme = THEME_TYPES.DARK

/**
 * 获取当前主题
 * @returns {string} 当前主题类型
 */
export function getCurrentTheme() {
  return currentTheme
}

/**
 * 设置主题
 * @param {string} theme - 主题类型 (THEME_TYPES.DARK 或 THEME_TYPES.LIGHT)
 */
export function setTheme(theme) {
  if (!Object.values(THEME_TYPES).includes(theme)) {
    console.warn(`Invalid theme: ${theme}. Using default theme: ${THEME_TYPES.DARK}`)
    theme = THEME_TYPES.DARK
  }
  
  currentTheme = theme
  
  // 更新 HTML 元素的 theme-name 属性
  document.documentElement.setAttribute('theme-name', theme)
  
  // 更新 body 的 class
  document.body.className = document.body.className.replace(/theme-\w+/g, '')
  document.body.classList.add(`theme-${theme}`)
  
  // 触发主题切换事件
  window.dispatchEvent(new CustomEvent('theme-change', { 
    detail: { theme, previousTheme: currentTheme } 
  }))
  
  console.log(`Theme switched to: ${theme}`)
}

/**
 * 切换主题（在暗黑和亮色之间切换）
 */
export function toggleTheme() {
  const newTheme = currentTheme === THEME_TYPES.DARK ? THEME_TYPES.LIGHT : THEME_TYPES.DARK
  setTheme(newTheme)
}

/**
 * 初始化主题
 * 从 localStorage 或系统偏好设置中读取主题
 */
export function initTheme() {
  // 优先从 localStorage 读取
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme && Object.values(THEME_TYPES).includes(savedTheme)) {
    setTheme(savedTheme)
    return
  }
  
  // 从系统偏好设置读取
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme(THEME_TYPES.DARK)
  } else {
    setTheme(THEME_TYPES.LIGHT)
  }
  
  // 保存到 localStorage
  localStorage.setItem('theme', currentTheme)
}

/**
 * 监听系统主题变化
 */
export function watchSystemTheme() {
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      // 只有在没有手动设置主题时才跟随系统
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? THEME_TYPES.DARK : THEME_TYPES.LIGHT)
      }
    })
  }
}

/**
 * 动态加载主题样式
 * @param {string} theme - 主题类型
 */
export function loadThemeStyles(theme) {
  // 移除现有的主题样式
  const existingLink = document.querySelector('link[data-theme-styles]')
  if (existingLink) {
    existingLink.remove()
  }
  
  // 动态加载新的主题样式
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.setAttribute('data-theme-styles', 'true')
  
  if (theme === THEME_TYPES.DARK) {
    link.href = '/node_modules/ant-design-vue/dist/antd.dark.css'
  } else {
    link.href = '/node_modules/ant-design-vue/dist/antd.css'
  }
  
  document.head.appendChild(link)
}

// 监听主题切换事件，动态加载样式
window.addEventListener('theme-change', (e) => {
  loadThemeStyles(e.detail.theme)
})

// 导出默认对象
export default {
  THEME_TYPES,
  getCurrentTheme,
  setTheme,
  toggleTheme,
  initTheme,
  watchSystemTheme,
  loadThemeStyles
}
