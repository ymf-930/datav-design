<template>
  <div class="group-comps">
    <div class="comp-wrap">
      <div class="comp-item" v-for="(com, index) in list" :key="index">
        <div class="inner">
          <div
            class="comp-item-img"
            :draggable="true"
            @dragstart="dragStart($event, com)"
            @click="click(com)"
          >
            <img v-lazy="com.url ? com.url : com.src" v-if="!listLoading" />
            <img v-lazy="com.url ? com.url : com.src" v-else />
          </div>
          <div class="comp-item-text" :title="JSON.stringify(com, null, 2)">{{ com.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { throwError } from '@/utils/util'
import { getTopoPath } from '@/utils/env'
import axios from 'axios'

const emit = defineEmits(['dragstart', 'click'])
const props = defineProps({
  groupId: {
    type: String,
    required: true,
  },
})

const list = ref([])
const listLoading = ref(false)

// 获取预设的图片资源
async function getTopoImages(groupKey) {
  try {
    const path = getTopoPath(`/${groupKey}/index.json`)
    const res = await axios.get(path)
    // 拼接附带组件配置的预设资源
    const list = res.data.map(item => ({
      ...item,
      group: groupKey,
      src: getTopoPath(`/${groupKey}/${item.src}`),
    }))
    return list
  } catch (error) {
    return []
  }
}

// 获取组件库
async function getCompList() {
  listLoading.value = true
  try {
    list.value = await getTopoImages(props.groupId)
  } catch (e) {
    throwError(e)
  }
  listLoading.value = false
}

getCompList()

const dragStart = (e, comp) => emit('dragstart', e, comp)
const click = comp => emit('click', comp)
</script>

<style scoped>
.comp-wrap {
  display: flex;
  flex-wrap: wrap;
  padding: var(--datav-border-radius-lg) var(--datav-border-radius-sm);
}
.comp-item {
  width: 50%;
  vertical-align: top;
  user-select: none;
  margin-bottom: var(--datav-border-radius-sm);
  padding: 0 var(--datav-border-radius-sm);
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  .comp-item-text {
    font-size: var(--datav-font-size-sm);
    padding: 0 5px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 22px;
  }
  .comp-item-img {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 72px;
    border-radius: 2px;
    padding: 10px;
    transition: border-color 0.2s;
    border: 1px dashed var(--s-border-color-2);
    cursor: url('@/assets/images/schema/cursor-move.png') 4 4, auto;
    > img {
      min-width: 1px;
      min-height: 1px;
      max-width: 100%;
      max-height: 100%;
    }
    .hover-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(33, 33, 37, 0.7);
      display: none;
      > .anticon {
        position: absolute;
        top: var(--datav-border-radius-sm);
        right: var(--datav-border-radius-sm);
        cursor: pointer;
        color: #fff;
      }
    }
    &:hover {
      border-color: var(--ant-primary-color-active);
      background: #2a292f;
      .hover-layer {
        display: block;
      }
    }
  }
}
</style>
