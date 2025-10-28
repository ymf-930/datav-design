import { loadAsyncComponent } from '@/utils/async-component'
import VStraightLine from './main.vue'

VStraightLine.install = (app) => {
  app.component(VStraightLine.name, VStraightLine)
  app.component('VStraightLineConfig', loadAsyncComponent(() => import('./config.vue')))
}

export default VStraightLine


