// @kjgl77/datav-vue3 专为 Vue 3 设计，使用插件方式全局注册
import DataVVue3 from '@kjgl77/datav-vue3'

export function registerDatav(app) {
  // 使用 app.use() 全局注册所有组件
  app.use(DataVVue3)
}
