import { watch, ref, onMounted } from 'vue'
import { Theme } from '../config/default-theme'
import useCaches from '../utils/caches'
import { applyTheme } from '../utils/css-vars'

// 缓存读取器
const { getVal, setVal } = useCaches()

// 是否从缓存取值
const loadCache = true

export const themeConfigRef = loadCache ? ref(getVal()) : ref({ ...Theme })

// 当前主题名称（dark/light）
export const themeNameRef = ref('dark')

// 主题变量hooks , 仅在app中引入一次
export function useThemeInit() {
  // 应用主题到 DOM
  function applyThemeToDOM() {
    applyTheme(themeConfigRef.value, themeNameRef.value)
  }

  // 初始化时应用主题
  onMounted(() => {
    applyThemeToDOM()
  })

  // 监听主题配置变化
  watch(
    () => themeConfigRef.value,
    val => {
      if (loadCache) setVal(val)
      applyThemeToDOM()
    },
    { deep: true },
  )

  // 监听主题名称变化
  watch(
    () => themeNameRef.value,
    () => {
      applyThemeToDOM()
    },
  )

  return {
    themeConfigRef,
    themeNameRef,
  }
}

// 判断一个配置文件是否匹配当前配置
export function isThemeActive(cfg) {
  let flag = true
  Object.keys(cfg).forEach(key => {
    if (cfg[key].toLowerCase() !== themeConfigRef.value[key].toLowerCase()) {
      flag = false
      return
    }
  })
  return flag
}

// 载入一个配置文件
export function loadConfig(cfg) {
  themeConfigRef.value = { ...themeConfigRef.value, ...cfg }
}
