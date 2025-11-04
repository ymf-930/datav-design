import { createApp } from 'vue'
import App from './App.vue'
import router, { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { registerDirectives } from '@/directives'
import { registerLazy } from '@/plugins/lazy-load'
import { registerAntd } from '@/plugins/ant-design-vue'
import { registerCharts } from '@/plugins/vue-echarts'
import { registerEditor } from '@/plugins/vue3-ace-editor'
import { registerDatav } from '@/plugins/bin-datav'

import { registerCommonComps } from '@/components/Common'
import { registerGUI } from '@/components/GUI'
import { registerVCharts } from '@/components/Schema'

// 使用 variable 版本支持动态主题切换
import 'ant-design-vue/dist/antd.variable.css'
import 'bin-datav/lib/styles/index.css'
// 引入动画
import 'animate.css'

import '@/assets/styles/index.css' // 项目样式

/**
 * mock 模块
 * 注意：线上版本需要首先移除mock模块再进行调试，切记切记！！！
 */
// if (process.env.NODE_ENV !== 'production') {
// 判断环境不是 prod 或者 preview 是 true 时，加载 mock 服务
import './mock'
// }

const app = createApp(App)
registerLazy(app)
registerDirectives(app)

registerDatav(app)
registerAntd(app)
registerCharts(app)
registerEditor(app)

registerCommonComps(app)
registerGUI(app)
registerVCharts(app)
setupRouter(app)
setupStore(app)
// Mount when the route is ready
router.isReady().then(() => {
  app.mount('#app', true)
})
