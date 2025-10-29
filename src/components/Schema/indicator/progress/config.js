// 基本饼图配置项
import { initApiData, ComType, CIRCLE as compType } from '@/config/data-source'
import { getBaseActions } from '@/utils/events'

export default {
  name: 'VProgress',
  alias: '进度条',
  icon: 'RedoOutlined',
  type: ComType.com,
  componentType: 'progress',
  attr: { w: 200, h: 200 },
  config: {
    // Progress 组件配置
    type: 'circle', // 进度条类型: 'line' | 'circle' | 'dashboard'
    linecap: 'round', // 端点形状: 'round' | 'butt' | 'square'
    strokeWidth: 8, // 进度条线宽（官方属性名）
    strokeColor: '#2db7f5', // 进度条颜色（官方属性名）
    trailColor: '#eaeef2', // 轨道颜色
    showInfo: true, // 是否显示进度数值或状态图标
    
    // Dashboard 专用配置（仅当 type='dashboard' 时生效）
    gapDegree: 75, // 仪表盘缺口角度（0-295度，0表示完整圆形）
    gapPosition: 'bottom', // 缺口位置: 'top' | 'bottom' | 'left' | 'right'
    
    // 自定义内容显示配置
    value: {
      show: true,
      fontSize: 24,
      color: '#fff',
    },
    title: {
      show: false,
      content: '我是标题',
      fontSize: 24,
      color: '#fff',
    },
    num: {
      show: false,
      fontSize: 24,
      color: '#fff',
    },
    numFormat: '{num}条',
  },
  apiData: initApiData({ staticPath: 'progress/progress', compType }),
  events: {
    onEvents: [],
    defaultAction: true,
    actions: getBaseActions(),
    click: {
      name: '点击数据项',
      params: [],
    },
    customScript: {
      augments: ['curComp', 'components'],
      enable: false,
    },
  },
}
