import { ComType } from '@/config/data-source'

export default {
  name: 'VStraightLine',
  alias: '直线',
  icon: 'LineOutlined',
  type: ComType.com,
  attr: { w: 200, h: 50 }, // w: 线段长度, h: 高度
  config: {
    // 端点坐标（使用百分比0-100）
    startX: 10,   // 起点X百分比
    startY: 50,   // 起点Y百分比
    endX: 90,     // 终点X百分比
    endY: 50,     // 终点Y百分比
    
    // 线条方向：horizontal(水平), vertical(垂直)
    direction: 'horizontal',
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
