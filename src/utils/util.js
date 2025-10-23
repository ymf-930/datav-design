// 使用成熟的依赖包替代自定义工具函数
import { camelize, isObject } from '@vue/shared'
import { message } from 'ant-design-vue'

// 导入 lodash-es 函数
import { 
  debounce as lodashDebounce, 
  throttle as lodashThrottle, 
  isEmpty as lodashIsEmpty, 
  isEqual, 
  merge, 
  cloneDeep,
  uniqueId,
  random
} from 'lodash-es'

// 导入其他工具库
import { v4 as uuidv4 } from 'uuid'
import clone from 'rfdc'
import Color from 'color'

// ==================== 工具函数实现 ====================

/**
 * 生成唯一ID（使用 lodash 的 uniqueId）
 */
export const generateId = () => uniqueId()

/**
 * 生成UUID（使用 uuid 库）
 */
export const uuid = () => uuidv4()

/**
 * 日志工具
 */
export const logger = {
  pretty: (module, action, level = 'info') => {
    const colors = {
      info: '#1890ff',
      success: '#52c41a',
      warning: '#faad14',
      danger: '#f5222d'
    }
    console.log(`%c[${module}] ${action}`, `color: ${colors[level] || colors.info}`)
  },
  info: (msg) => console.log(msg),
  success: (msg) => console.log(`%c${msg}`, 'color: #52c41a'),
  warning: (msg) => console.log(`%c${msg}`, 'color: #faad14'),
  danger: (msg) => console.log(`%c${msg}`, 'color: #f5222d')
}

/**
 * 复制文本到剪贴板
 */
export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    message.success('复制成功')
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    message.success('复制成功')
  }
}

/**
 * 获取数据类型
 */
export const typeOf = (obj) => {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

/**
 * 深拷贝（使用 rfdc，性能更好）
 */
export const deepCopy = clone()

/**
 * 深合并（使用 lodash merge）
 */
export const deepMerge = merge

/**
 * 获取随机整数（使用 lodash random）
 */
export const getRandomInt = (min, max) => random(min, max, false)

/**
 * 节流函数（使用 lodash throttle）
 */
export const throttle = lodashThrottle

/**
 * 防抖函数（使用 lodash debounce）
 */
export const debounce = lodashDebounce

/**
 * 判断是否为空（使用 lodash isEmpty）
 */
export const isEmpty = lodashIsEmpty

/**
 * DOM 事件监听
 */
export const on = (element, event, handler) => {
  if (element && event && handler) {
    element.addEventListener(event, handler, false)
  }
}

export const off = (element, event, handler) => {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false)
  }
}

/**
 * DOM 类名操作
 */
export const addClass = (element, className) => {
  if (element && className) {
    element.classList.add(className)
  }
}

export const removeClass = (element, className) => {
  if (element && className) {
    element.classList.remove(className)
  }
}

export const hasClass = (element, className) => {
  return element && element.classList.contains(className)
}

/**
 * 窗口大小监听
 */
const resizeHandlers = new Map()

export const addResizeListener = (element, handler) => {
  if (!element || !handler) return
  
  if (!resizeHandlers.has(element)) {
    resizeHandlers.set(element, new Set())
  }
  
  resizeHandlers.get(element).add(handler)
  
  // 添加全局 resize 监听
  if (resizeHandlers.size === 1) {
    window.addEventListener('resize', handleResize)
  }
}

export const removeResizeListener = (element, handler) => {
  if (!element || !handler) return
  
  const handlers = resizeHandlers.get(element)
  if (handlers) {
    handlers.delete(handler)
    if (handlers.size === 0) {
      resizeHandlers.delete(element)
    }
  }
  
  // 如果没有元素监听了，移除全局监听
  if (resizeHandlers.size === 0) {
    window.removeEventListener('resize', handleResize)
  }
}

const handleResize = () => {
  resizeHandlers.forEach((handlers, element) => {
    handlers.forEach(handler => {
      handler()
    })
  })
}

/**
 * 颜色工具（使用 color 库）
 */
export const ColorHelper = {
  // 颜色混合
  mix: (color1, color2, ratio) => {
    try {
      const c1 = Color(color1)
      const c2 = Color(color2)
      return c1.mix(c2, ratio).hex()
    } catch (e) {
      return color1
    }
  },
  
  // 透明度
  alpha: (color, alpha) => {
    try {
      return Color(color).alpha(alpha).toString()
    } catch (e) {
      return color
    }
  },
  
  // 亮度调整
  lighten: (color, amount) => {
    try {
      return Color(color).lighten(amount).hex()
    } catch (e) {
      return color
    }
  },
  
  // 暗度调整
  darken: (color, amount) => {
    try {
      return Color(color).darken(amount).hex()
    } catch (e) {
      return color
    }
  }
}

/**
 * 抛异常公共函数，用于请求接口或其他异常捕捉错误信息
 * @param callFun 调用函数，用于记录错误调用来源 ，一般复制当前啊函数名称，或者填入说明信息 login/getVerifyCode
 * @param e 错误消息
 * @param title alert和notice模块选填，错误标题
 * @param log 是否打印到控制台
 */
export function throwError(callFun, e, title, log = true) {
  console.log('.........................', e)
  if (e.statusCode === 401 || e.code === '416') {
    message.warning(e.message || '操作错误！')
  } else {
    message.error(e.message || '操作错误！')
  }
  if (log) {
    const str = callFun.split('/')
    if (str && str.length >= 2) {
      logger.pretty(str[0], str[1], 'danger')
    }
    console.log(e)
    logger.danger('----------------------------------------------------------')
  }
}

/**
 * 转换为json对象
 * @param data
 * @param defaultValue
 * @returns {any}
 */
export function toJson(data, defaultValue) {
  try {
    if (!data) {
      return defaultValue
    }
    if (typeOf(data) === 'string') {
      return JSON.parse(data)
    }
    return data
  } catch {
    return defaultValue
  }
}

// 设置dom style
export function setStyle(element, styleName, value) {
  if (!element || !styleName) return

  if (isObject(styleName)) {
    Object.keys(styleName).forEach(prop => {
      setStyle(element, prop, styleName[prop])
    })
  } else {
    styleName = camelize(styleName)
    element.style[styleName] = value
  }
}

// 查找索引
export function findIndex(data, value, key = 'id') {
  return data.findIndex(i => i[key] === value)
}

// 判断是否存在一个属性
export function hasProperty(obj, property) {
  // eslint-disable-next-line no-prototype-builtins
  return obj ? obj.hasOwnProperty(property) : false
}