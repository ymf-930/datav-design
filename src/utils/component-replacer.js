/**
 * 组件替换工具
 */
import { componentMapping, propsMapping, eventsMapping } from '@/config/component-mapping'

export function replaceComponent(template) {
  let result = template
  
  // 替换组件标签
  Object.entries(componentMapping).forEach(([oldTag, newTag]) => {
    const regex = new RegExp(`<${oldTag}([^>]*)>`, 'g')
    result = result.replace(regex, `<${newTag}$1>`)
    
    const closeRegex = new RegExp(`</${oldTag}>`, 'g')
    result = result.replace(closeRegex, `</${newTag}>`)
  })
  
  return result
}

export function replaceProps(template) {
  let result = template
  
  // 替换属性名
  Object.entries(propsMapping).forEach(([component, props]) => {
    Object.entries(props).forEach(([oldProp, newProp]) => {
      if (oldProp !== newProp) {
        const regex = new RegExp(`:${oldProp}=`, 'g')
        result = result.replace(regex, `:${newProp}=`)
        
        const attrRegex = new RegExp(`${oldProp}=`, 'g')
        result = result.replace(attrRegex, `${newProp}=`)
      }
    })
  })
  
  return result
}

export function replaceEvents(template) {
  let result = template
  
  // 替换事件名
  Object.entries(eventsMapping).forEach(([component, events]) => {
    Object.entries(events).forEach(([oldEvent, newEvent]) => {
      if (oldEvent !== newEvent) {
        const regex = new RegExp(`@${oldEvent}=`, 'g')
        result = result.replace(regex, `@${newEvent}=`)
      }
    })
  })
  
  return result
}

/**
 * 批量替换模板中的所有 bin-ui-design 组件
 * @param {string} template - Vue 模板字符串
 * @returns {string} 替换后的模板
 */
export function replaceAll(template) {
  let result = template
  
  // 按顺序执行替换
  result = replaceComponent(result)
  result = replaceProps(result)
  result = replaceEvents(result)
  
  return result
}
