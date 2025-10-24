<template>
  <div class="group-wrap">
    <div class="group-list">
      <ScrollContainer height="100%" scrollbar-size="6" scrollbar-color="rgba(255, 255, 255, 0.2)" scrollbar-hover-color="rgba(255, 255, 255, 0.4)">
        <Collapse
          v-for="group in groups"
          :key="group.key"
          :name="group.key"
          :title="group.value"
          :can-edit="false"
        >
          <ImagesItem :group-id="group.key" @dragstart="dragStart" @click="click" />
        </Collapse>
      </ScrollContainer>
    </div>
  </div>
</template>

<script setup>
import Collapse from './collapse.vue'
import ImagesItem from './images-item.vue'
import { ref } from 'vue'
import { defaultGroup } from '@/api/images/default'
import { useCollapse } from '@/hooks/collapseHook'
import ScrollContainer from '@/components/Common/ScrollContainer/index.vue'

const emit = defineEmits(['dragstart', 'click'])
const groups = ref(defaultGroup) // 图片分组

useCollapse()

const dragStart = (e, comp) => emit('dragstart', e, comp)
const click = comp => emit('click', comp)
</script>

<style scoped>
.group-wrap {
  position: relative;
  height: calc(100vh - 80px);
  .group-list {
    height: 100%;
  }
}
</style>
