<template>
  <div class="theme-select">
    <div class="trigger" @click="visible = true">
      <AntIcon name="BgColorsOutlined"></AntIcon>
    </div>
    <a-modal
      v-model:visible="visible"
      title="主题选择"
      :width="1400"
      :bodyStyle="{
        maxHeight: '520px',
        overflowY: 'hidden',
      }"
      :destroyOnClose="true"
    >
      <div class="main" style="height: 520px">
        <div class="scrollbar-container">
          <div style="width: calc(100% - 300px)">
            <div
              class="color-item"
              v-for="(color, index) in ThemeMainColors"
              :key="index"
              @click="setColor(color)"
            >
              <div class="color-tip" :style="{ backgroundColor: color }"></div>
              <div class="color-info">
                <h2 flex>
                  <div class="color-name" :style="{ color }">{{ ThemeMainColorsText[index] }}</div>
                  <div class="color-pinyin ml-8">{{ ThemeMainColorsTextEn[index] }}</div>
                </h2>
                <div class="color-value">{{ color }}</div>
              </div>
            </div>

            <a-divider />

            <div
              class="color-item"
              v-for="(color, index) in zhongguose.colors"
              :key="index"
              @click="setColor(color)"
            >
              <div class="color-tip" :style="{ backgroundColor: color }"></div>
              <div class="color-info">
                <h2 flex="cross:center">
                  <div class="color-name" :style="{ color }">{{ zhongguose.names[index] }}</div>
                  <div class="color-pinyin ml-8">{{ zhongguose.pinyin[index] }}</div>
                </h2>
                <div class="color-value">{{ color }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-info" flex>
          <div style="width: 180px" flex="dir:top cross:center">
            <div class="current-name">{{ currentName }}</div>
            <div class="en-name">{{ currentNameEn }}</div>
            <div
              class="current-color"
              :style="{ backgroundColor: themeConfigRef.antColorPrimary }"
            ></div>
          </div>

          <div class="color-logo" style="width: 55px">
            <img src="@/assets/images/color-logo.png" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="color-a">
          中国色表参考：
          <a
            :style="{ color: themeConfigRef.antColorPrimary }"
            href="http://zhongguose.com"
            target="_blank"
          >
            http://zhongguose.com
          </a>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  themeConfigRef,
  ThemeMainColors,
  ThemeMainColorsText,
  ThemeMainColorsTextEn,
  zhongguose,
} from '@/theme'
import AntIcon from '@/components/Common/AntIcon/index.vue'

defineOptions({
  name: 'ThemeConfig',
})

const visible = ref(false)

function setColor(color) {
  themeConfigRef.value.antColorPrimary = color
  themeConfigRef.value.antColorPrimaryAlpha1 = color + '1a' // 添加透明度
}

const currentName = computed(() => {
  const color = themeConfigRef.value.antColorPrimary

  const defaultIndex = ThemeMainColors.findIndex(i => i.toLowerCase() === color.toLowerCase())
  if (defaultIndex > -1) return ThemeMainColorsText[defaultIndex]

  const otherIndex = zhongguose.colors.findIndex(i => i.toLowerCase() === color.toLowerCase())
  if (otherIndex > -1) return zhongguose.names[otherIndex]
  return ''
})

const currentNameEn = computed(() => {
  const color = themeConfigRef.value.antColorPrimary

  const defaultIndex = ThemeMainColors.findIndex(i => i.toLowerCase() === color.toLowerCase())
  if (defaultIndex > -1) return ThemeMainColorsTextEn[defaultIndex]

  const otherIndex = zhongguose.colors.findIndex(i => i.toLowerCase() === color.toLowerCase())
  if (otherIndex > -1) return zhongguose.pinyin[otherIndex]

  return ''
})
</script>

<style scoped>
.theme-select {
  position: fixed;
  top: 15px;
  right: 16px;
  z-index: 100;
  .trigger {
    cursor: pointer;
    width: 32px;
    height: 32px;
    > .anticon {
      color: #fff;
      font-size: 20px;
    }
  }
}

.main {
  position: relative;
  .scrollbar-container {
    overflow-y: auto;
    max-height: 520px;
  }
  .right-info {
    position: absolute;
    top: 24px;
    right: 24px;
  }
}

.color-item {
  position: relative;
  display: inline-flex;
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 10px 20px;
  min-width: 300px;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0);
  background-color: rgba(35, 35, 36, 0.3);
  &:hover {
    border-color: var(--s-border-color);
  }
  .color-tip {
    width: 8px;
    border-radius: 4px;
    margin-right: 16px;
  }
  .color-info {
    > h2 {
      margin: 0;
      font-size: 14px;
      font-weight: normal;
      margin-bottom: 8px;
      .color-pinyin {
        font-size: 13px;
      }
    }
  }
}

.current-name {
  font-family: serif;
  font-size: 64px;
  color: #fff;
  display: block;
  width: 110px;
  text-align: center;
  background-position: center top;
  background-repeat: no-repeat;
}
.en-name {
  text-align: center;
  font-family: Georgia;
  font-size: 16px;
}
.current-color {
  margin-top: 20px;
  width: 100px;
  height: 20px;
  border-radius: 3px;
}
.color-a {
  text-align: right;
  margin-top: 16px;
}
</style>
