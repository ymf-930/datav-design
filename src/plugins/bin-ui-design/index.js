import BinUI from 'bin-ui-design'
import config from '../../../package.json'

export function registerUI(app) {
  app.use(BinUI, { disabledDoc: true })
  console.log('Datav Design - Data Visualization Platform')
}
