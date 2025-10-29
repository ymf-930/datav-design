import { loadAsyncComponent } from '@/utils/async-component'
import Progress from './main.vue'

Progress.install = app => {
  app.component(Progress.name, Progress)
  app.component(
    'VProgressConfig',
    loadAsyncComponent(() => import('./config.vue')),
  )
}

export default Progress
