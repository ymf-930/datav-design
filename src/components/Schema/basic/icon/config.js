import { ComType } from '@/config/data-source'

export default {
  name: 'VIcon',
  alias: '图标',
  icon: 'SmileOutlined',
  type: ComType.com,
  attr: { w: 80, h: 80, lockedRatio: true },
  config: {
    attr: { w: 80, h: 80 },
    pointerType: 'other', // 取值为image和border
    src: 'SmileOutlined',
    color: '#fff',
    size: 80,
    urlConfig: {
      url: '',
      ifBlank: false,
    },
  },
  apiData: {},
  events: {},
}

// 图标预设模式
export const pointerType = [
  { value: 'other', label: '图标' },
  { value: 'btn', label: '按钮' },
]
