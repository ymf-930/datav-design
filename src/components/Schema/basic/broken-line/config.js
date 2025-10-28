import { ComType } from '@/config/data-source'

export default {
  name: 'VBrokenLine',
  alias: '折线',
  icon: 'EnterOutlined',
  type: ComType.com,
  attr: { w: 300, h: 200 }, // w: 宽度, h: 高度
  config: {
    // 折线点集合，JSON字符串格式，默认3个点形成弯曲的折线
    // 坐标使用百分比(0-100)，实际有效范围为2-98以容纳折点手柄
    points: JSON.stringify([
      { x: 10, y: 60 },  // 起点（左下）
      { x: 50, y: 30 }, // 中点（顶部中间）
      { x: 90, y: 70 }, // 终点（右上）
    ]),
    // 线条宽度（粗细）
    width: 2,
    // 线段颜色
    color: '#008bff',
    // 线条样式：solid(实线), dashed(虚线)
    dashStyle: 'solid',
    // 箭头样式：none(无), start(起点), end(终点), both(双向)
    arrowStyle: 'none',
  },
  apiData: {},
  events: {},
}
