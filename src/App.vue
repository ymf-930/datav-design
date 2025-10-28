<template>
  <a-config-provider :theme="dynamicThemeConfig">
    <router-view />
    <ThemeConfig v-if="$route.name !== 'Screen' && $route.name !== 'Preview'" />
  </a-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import config from '../package.json'
import { useThemeInit, themeConfigRef, ThemeConfig } from '@/theme'

// 动态 Ant Design 主题配置 - 跟随用户选择的主题色
const dynamicThemeConfig = computed(() => ({
  token: {
    colorPrimary: themeConfigRef.value?.antPrimaryColor || '#1890ff',
    borderRadius: 6,
    fontFamily: 'PingFang SC, Microsoft YaHei, Arial, sans-serif',
  }
}))

document.title = config.description

// 初始化主题系统（会自动将 CSS 变量应用到 HTML 根元素）
useThemeInit()
</script>
