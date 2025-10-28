import { loadAsyncComponent } from '@/utils/async-component'
import VBrokenLine from './main.vue'

VBrokenLine.install = (app) => {
  app.component(VBrokenLine.name, VBrokenLine)
  app.component('VBrokenLineConfig', loadAsyncComponent(() => import('./config.vue')))
}

export default VBrokenLine


