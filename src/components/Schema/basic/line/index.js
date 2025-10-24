import { loadAsyncComponent } from '@/utils/async-component'
import VLine from './main.vue'

VLine.install = (app) => {
  app.component(VLine.name, VLine)
  app.component('VLineConfig', loadAsyncComponent(() => import('./config.vue')))
}

export default VLine

