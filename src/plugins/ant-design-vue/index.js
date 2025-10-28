import Antd from 'ant-design-vue'
// 样式已在 main.js 中导入（antd.variable.css），避免重复导入

export function registerAntd(app) {
  app.use(Antd)
}
