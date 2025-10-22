<template>
  <component :is="iconComponent" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import * as Icons from '@ant-design/icons-vue'

defineOptions({
  name: 'AntIcon',
  inheritAttrs: false
})

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

// 图标名称映射
const iconNameMapping = {
  'user': 'UserOutlined',
  'lock': 'LockOutlined',
  'home': 'HomeOutlined',
  'container': 'AppstoreOutlined',
  'control': 'SettingOutlined',
  'arrowleft': 'LeftOutlined',
  'arrowright': 'RightOutlined',
  'edit': 'EditOutlined',
  'edit-square': 'EditSquareOutlined',
  'send': 'SendOutlined',
  'plus': 'PlusOutlined',
  'minus': 'MinusOutlined',
  'right': 'RightOutlined',
  'left': 'LeftOutlined',
  'up': 'UpOutlined',
  'down': 'DownOutlined',
  'close': 'CloseOutlined',
  'check': 'CheckOutlined',
  'search': 'SearchOutlined',
  'filter': 'FilterOutlined',
  'refresh': 'ReloadOutlined',
  'save': 'SaveOutlined',
  'delete': 'DeleteOutlined',
  'copy': 'CopyOutlined',
  'download': 'DownloadOutlined',
  'upload': 'UploadOutlined',
  'eye': 'EyeOutlined',
  'eye-invisible': 'EyeInvisibleOutlined',
  'info': 'InfoCircleOutlined',
  'warning': 'ExclamationCircleOutlined',
  'error': 'CloseCircleOutlined',
  'success': 'CheckCircleOutlined'
}

const iconComponent = computed(() => {
  const iconName = iconNameMapping[props.name] || props.name
  return Icons[iconName] || Icons['QuestionCircleOutlined']
})
</script>
