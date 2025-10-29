import VChart from 'vue-echarts'
import { use } from 'echarts/core'

// 引入 echarts 图表类型
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  EffectScatterChart,
  FunnelChart,
  GaugeChart,
  BoxplotChart,
  MapChart,
} from 'echarts/charts'

// 引入 echarts 组件
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PolarComponent,
  GeoComponent,
  VisualMapComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent,
  MarkPointComponent,
  MarkAreaComponent,
  DatasetComponent,
} from 'echarts/components'

// 引入渲染器
import { CanvasRenderer } from 'echarts/renderers'

// 引入 echarts-wordcloud 支持词云图
import 'echarts-wordcloud'

// 注册必须的组件
use([
  // 图表类型
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  EffectScatterChart,
  FunnelChart,
  GaugeChart,
  BoxplotChart,
  MapChart,
  
  // 组件
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PolarComponent,
  GeoComponent,
  VisualMapComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent,
  MarkPointComponent,
  MarkAreaComponent,
  DatasetComponent,
  
  // 渲染器
  CanvasRenderer,
])

/**
 * 注册图表组件
 * @param {App} app - Vue 应用实例
 */
export function registerCharts(app) {
  // 全局注册 vue-echarts 组件（官方推荐名称）
  app.component('VChart', VChart)
}

