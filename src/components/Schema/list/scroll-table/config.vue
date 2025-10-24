<template>
  <div class="setting-panel-gui">
    <g-field-collapse label="通用配置" default-open>
      <g-field label="表行数">
        <g-input-number v-model="config.rowNum" :min="1" :max="10" :step="1" />
      </g-field>
      <g-field label="表头高度">
        <g-input-number v-model="config.headerHeight" :min="10" :max="50" :step="1" suffix="px" />
      </g-field>
      <g-field label="表头背景">
        <g-color-picker v-model="config.headerBGC" />
      </g-field>
      <g-field label="行背景" flat>
        <g-color-picker v-model="config.oddRowBGC" label="奇数行" inline />
        <g-color-picker v-model="config.evenRowBGC" label="偶数行背" inline />
      </g-field>

      <g-field label="轮播方式">
        <a-radio-group v-model:value="config.carousel" size="small">
          <a-radio-button value="single">单行</a-radio-button>
          <a-radio-button value="page">整页</a-radio-button>
        </a-radio-group>
      </g-field>
      <g-field label="轮播间隔">
        <g-slider v-model="config.waitTime" :min="1000" :max="3000" :step="100" suffix="ms" />
      </g-field>
      <g-field label="悬停暂停">
        <a-switch v-model:checked="config.hoverPause" size="small" />
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="行号" toggle v-model="config.index">
      <g-field label="表头" flat>
        <g-input v-model="config.indexHeader" inline label="行号文字" />
        <g-input-number
          v-model="config.indexWidth"
          :min="1"
          :max="100"
          :step="1"
          inline
          label="行号列宽"
        />
      </g-field>
      <g-field label="行号对齐">
        <a-radio-group v-model:value="config.indexAlign" size="mini">
          <a-radio-button value="left">左对齐</a-radio-button>
          <a-radio-button value="center">居中</a-radio-button>
          <a-radio-button value="right">右对齐</a-radio-button>
        </a-radio-group>
      </g-field>
    </g-field-collapse>
    <g-field-collapse label="列配置">
      <template #add>
        <a-button type="text" @click="addSeries" title="新增一个列配置">
          <AntIcon name="PlusOutlined" size="16"></AntIcon>
        </a-button>
        <a-button
          type="text"
          :disabled="config.columnWidth.length === 0"
          @click="deleteLast"
          title="移除最后一个列配置"
        >
          <AntIcon name="DeleteOutlined" size="16"></AntIcon>
        </a-button>
      </template>
      <template v-for="(s, index) in config.columnWidth" :key="index">
        <g-field flat :label="`列${index + 1}`">
          <template #label>
            <div class="series-title inline">
              <span>列{{ index + 1 }}</span>
            </div>
          </template>
          <g-input-number
            v-model="config.columnWidth[index]"
            :min="30"
            :step="1"
            inline
            label="列宽"
          />
          <g-select v-model="config.align[index]" :data="HAlignOptions" inline label="列对齐方式" />
        </g-field>
      </template>
      <div
        v-if="config.columnWidth.length === 0"
        style="min-height: 80px"
        flex="main:center cross:center"
      >
        暂无配置，所有列自适应
      </div>
    </g-field-collapse>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { HAlignOptions } from '@/config/select-options'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
const config = computed(() => props.data.config)

const addSeries = () => {
  config.value.columnWidth.push(100)
  config.value.align.push('left')
}
const deleteLast = () => {
  config.value.columnWidth.pop()
  config.value.align.pop()
}
</script>
