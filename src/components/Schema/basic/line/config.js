import { ComType } from '@/config/data-source'

export default {
  name: 'VLine',
  alias: '连线',
  icon: 'LineOutlined',
  type: ComType.com,
  attr: { w: 200, h: 5 }, // w: 线段长度, h: 线段宽度（粗细）
  config: {
    // 样式设置
    color: '#008bff', // 线段颜色
    dashStyle: 'solid', // 线条样式：solid, dashed, dotted, dashdot
    arrowStyle: 'end', // 箭头样式：none, start, end, both
  },
  apiData: {},
  events: {},
}
