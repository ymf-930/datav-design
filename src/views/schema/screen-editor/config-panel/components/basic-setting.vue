<template>
  <div class="basic-setting-wp">
    <g-field label="尺寸" style="padding-top: 0" flat>
      <template #label>
        <div flex="main:justify cross:center" class="pr-8">
          <span>尺寸</span>
          <AntIcon :name="data.lockedRatio ? 'LinkOutlined' : 'DisconnectOutlined'"
            :color="data.lockedRatio ? 'var(--datav-primary-color)' : 'var(--s-text-color)'"
            :title="data.lockedRatio ? '解除锁定宽高关联' : '锁定宽高关联'"
            type="button"
            @click="data.lockedRatio = !data.lockedRatio"
          ></AntIcon>
        </div>
      </template>

      <g-input-number
        v-model="data.x"
        suffix="X"
        inline
        :disabled="readonly || isGroupChild"
        style="margin-bottom: var(--datav-border-radius-lg); width: 85px"
      />
      <g-input-number
        v-model="data.y"
        suffix="Y"
        inline
        :disabled="readonly || isGroupChild"
        style="margin-bottom: var(--datav-border-radius-lg); width: 85px"
      />
      <div
        style="
          width: 81px;
          padding: 0 var(--datav-border-radius-sm);
          margin-bottom: var(--datav-border-radius-lg);
          display: inline-flex;
          justify-content: space-between;
        "
      >
        <span
          title="左转90°"
          @click="rotateL()"
          class="align-btn"
          :class="{ disabled: readonly || isGroupChild }"
        >
          <AntIcon name="RotateLeftOutlined" />
        </span>
        <span
          title="右转90°"
          @click="rotateR()"
          class="align-btn"
          :class="{ disabled: readonly || isGroupChild }"
        >
          <AntIcon name="RotateRightOutlined" />
        </span>
      </div>
      <g-input-number
        v-model="data.w"
        suffix="W"
        :min="10"
        :max="4000"
        inline
        style="width: 85px"
        :disabled="readonly || isGroupChild"
      />
      <g-input-number
        v-model="data.h"
        suffix="H"
        :min="10"
        :max="4000"
        inline
        style="width: 85px"
        :disabled="readonly || isGroupChild"
      />
      <g-input-number
        v-model="data.rotate"
        :min="0"
        :max="360"
        :step="1"
        inline
        suffix="°"
        :disabled="readonly || isGroupChild"
        style="width: 81px; padding: 0 var(--datav-border-radius-sm)"
      />
    </g-field>

    <g-field label="颜色" v-if="data.chartThemeColor !== undefined" style="padding: var(--datav-border-radius-base) 0 var(--datav-font-size-sm)">
      <CompColor />
    </g-field>
    <g-field label="对齐">
      <div flex="main:justify" style="width: 100%">
        <span
          v-for="em in PositionOptions"
          :key="em.value"
          :title="em.label"
          @click="schemaStore.doAdsorption(em.value)"
          class="align-btn"
          :class="{ disabled: readonly || isGroupChild }"
        >
          <AntIcon :name="adsorbIconMap[em.value]" class="iconfont-align" />
        </span>
      </div>
    </g-field>

    <div class="divider" />

    <g-field-collapse label="滤镜&变换">
      <g-field label="启用">
        <a-switch v-model="data.filterShow" size="small" />
      </g-field>
      <g-field label="色相">
        <g-slider
          v-model="data.hueRotate"
          :step="3"
          :min="0"
          :max="360"
          :label="`值：${data.hueRotate}deg`"
          :show-input="false"
          style="margin-bottom: 0"
        />
        <div class="preset-filter-box">
          <div
            class="pre-desc"
            style="
              display: flex;
              flex-flow: wrap;
              justify-content: space-between;
              align-items: center;
              height: 20px;
              width: 50px;
            "
          >
            <div style="width: 24px; height: 20px; line-height: 20px; font-size: var(--datav-font-size-sm)">底色</div>

            <div :style="{ backgroundColor: hueRotateColor }"></div>
          </div>
          <div class="preset-filter">
            <div
              class="item"
              style="filter: hue-rotate(36deg)"
              :style="{ backgroundColor: hueRotateColor }"
              @click="data.hueRotate = 36"
            ></div>
            <div
              class="item"
              style="filter: hue-rotate(72deg)"
              :style="{ backgroundColor: hueRotateColor }"
              @click="data.hueRotate = 72"
            ></div>
            <div
              class="item"
              style="filter: hue-rotate(108deg)"
              :style="{ backgroundColor: hueRotateColor }"
              @click="data.hueRotate = 108"
            ></div>
            <div
              class="item"
              style="filter: hue-rotate(144deg)"
              :style="{ backgroundColor: hueRotateColor }"
              @click="data.hueRotate = 144"
            ></div>
            <div
              class="item"
              style="filter: hue-rotate(180deg)"
              :style="{ backgroundColor: hueRotateColor }"
              @click="data.hueRotate = 180"
            ></div>
            <div
              class="item"
              style="filter: hue-rotate(216deg)"
              :style="{ backgroundColor: hueRotateColor }"
              @click="data.hueRotate = 216"
            ></div>
            <div
              class="item"
              style="filter: hue-rotate(252deg)"
              :style="{ backgroundColor: hueRotateColor }"
              @click="data.hueRotate = 252"
            ></div>
            <div
              class="item"
              style="filter: hue-rotate(288deg)"
              :style="{ backgroundColor: hueRotateColor }"
              @click="data.hueRotate = 288"
            ></div>
            <div
              class="item"
              style="filter: hue-rotate(324deg)"
              :style="{ backgroundColor: hueRotateColor }"
              @click="data.hueRotate = 324"
            ></div>
            <div
              class="item"
              style="filter: hue-rotate(360deg)"
              :style="{ backgroundColor: hueRotateColor }"
              @click="data.hueRotate = 360"
            ></div>
          </div>
        </div>
      </g-field>
      <g-field label="饱和度">
        <g-slider
          v-model="data.saturate"
          :step="0.1"
          :min="0"
          :max="2"
          :label="`值：${(parseFloat(data.saturate) * 100).toFixed(0)}%`"
          :show-input="false"
        />
      </g-field>
      <g-field label="对比度">
        <g-slider
          v-model="data.contrast"
          :step="0.1"
          :min="0"
          :max="2"
          :label="`值：${(parseFloat(data.contrast) * 100).toFixed(0)}%`"
          :show-input="false"
        />
      </g-field>
      <g-field label="亮度">
        <g-slider
          v-model="data.brightness"
          :step="0.1"
          :min="0"
          :max="2"
          :label="`值：${(parseFloat(data.brightness) * 100).toFixed(0)}%`"
          :show-input="false"
        />
      </g-field>
      <g-field label="透明">
        <g-slider
          v-model="data.opacity"
          :min="0"
          :max="1"
          :step="0.05"
          :label="`值：${(parseFloat(data.opacity) * 100).toFixed(0)}%`"
          :show-input="false"
        />
      </g-field>
      <g-field label="混合">
        <g-select v-model="data.blendMode" :data="BlendModeOptions" />
      </g-field>
      <g-field label="旋转" flat>
        <g-input-number
          v-model="data.rotate"
          label="Z轴(平面)-旋转"
          :min="0"
          :max="360"
          :step="1"
          inline
          suffix="°"
          slider
        />
        <g-input-number
          v-model="data.rotateX"
          label="X轴-旋转"
          :min="0"
          :max="360"
          :step="1"
          inline
          suffix="°"
          slider
        />
        <g-input-number
          v-model="data.rotateY"
          label="Y轴-旋转"
          :min="0"
          :max="360"
          :step="1"
          inline
          suffix="°"
          slider
        />
        <g-input-number
          v-model="data.perspective"
          label="透视像素"
          :min="100"
          :max="2000"
          :step="1"
          inline
          suffix="px"
          slider
        />
      </g-field>
    </g-field-collapse>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { hueRotateColor, CompColor } from '@/theme'
import { PositionOptions, BlendModeOptions } from '@/config/select-options'
const adsorbIconMap = {
  'align-to-top': 'VerticalAlignTopOutlined',
  'align-to-center': 'VerticalAlignMiddleOutlined',
  'align-to-bottom': 'VerticalAlignBottomOutlined',
  'align-to-left': 'AlignLeftOutlined',
  'align-to-middle': 'AlignCenterOutlined',
  'align-to-right': 'AlignRightOutlined',
}
import { useStore } from '@/store'
import { isEmpty } from '@/utils/util'

const emit = defineEmits(['update:attr'])
const props = defineProps({
  attr: {
    type: Object,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})
const data = computed({
  get: () => props.attr,
  set: val => emit('update:attr', val),
})

const { schemaStore, storeToRefs } = useStore()
const { selectedCom } = storeToRefs(schemaStore)

const isGroupChild = computed(() => !isEmpty(selectedCom.value.groupStyle))

function rotateL() {
  if (selectedCom.value.attr.rotate <= 0) return
  selectedCom.value.attr.rotate -= 90
}

function rotateR() {
  if (selectedCom.value.attr.rotate >= 360) return
  selectedCom.value.attr.rotate += 90
}
</script>

<style scoped>
.basic-setting-wp {
  padding: 0 10px;
}
.align-btn {
  padding: 0 var(--datav-border-radius-lg);
  background-color: var(--s-border-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  border-radius: var(--datav-border-radius-sm);
  cursor: pointer;
  transition: 0.2s;
  color: var(--s-text-color-2);
  &:hover {
    background-color: var(--s-color-3);
  }
  > .anticon {
    font-size: 18px;
  }
  &.disabled {
    background-color: var(--s-color-1);
    color: var(--s-text-color-3);
    cursor: not-allowed;
  }
}
.preset-filter-box {
  position: relative;
  width: 100%;
  margin-bottom: var(--datav-border-radius-lg);
  .pre-desc {
    position: absolute;
    right: 0;
    top: -20px;
    div {
      width: 20px;
      height: var(--datav-font-size-sm);
      border-radius: 2px;
    }
  }
  .preset-filter {
    display: grid;
    grid-template-columns: repeat(10, 10%);
    border-radius: 2px;
    overflow: hidden;
    cursor: pointer;
    margin-top: var(--datav-border-radius-sm);
    height: 10px;
    width: 100%;
    .item {
      height: 100%;
    }
  }
}
</style>
