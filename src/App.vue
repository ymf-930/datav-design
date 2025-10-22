<template>
  <a-config-provider :theme="simpleThemeConfig">
    <router-view />
    <ThemeConfig v-if="$route.name !== 'Screen' && $route.name !== 'Preview'" />
  </a-config-provider>
</template>

<script setup>
import config from '../package.json'
import { useThemeInit, themeConfigRef, ThemeConfig } from '@/theme'

// 简单的 Ant Design 主题配置
const simpleThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
    fontFamily: 'PingFang SC, Microsoft YaHei, Arial, sans-serif',
  }
}

document.title = config.description

useThemeInit()
</script>
