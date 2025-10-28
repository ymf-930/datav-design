<template>
  <div class="comp-wrap" v-if="comps.length > 0">
    <div class="comp-item" v-for="(com, index) in comps" :key="index" :title="com.alias">
      <div class="inner">
        <div
          class="comp-item-img"
          :draggable="true"
          @dragstart="dragStart($event, com.name)"
          @click="click(com.name)"
        >
          <img :src="com.img" />
        </div>
        <div class="comp-item-text">{{ com.alias }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['dragstart', 'click'])
defineProps({
  comps: {
    type: Array,
    default: () => [],
  },
})
const dragStart = (e, name) => emit('dragstart', e, name)
const click = name => emit('click', name)
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
  margin-bottom: var(--datav-border-radius-base);
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
    display: flex;
    width: 100%;
    height: 72px;
    border-radius: 2px;
    transition: border-color 0.2s;
    border: 1px dashed var(--s-border-color-2);
    cursor: url('@/assets/images/schema/cursor-move.png') 4 4, auto;
    > img {
      width: 100%;
    }
    &:hover {
      border-color: var(--ant-primary-color-active);
      background: #2a292f;
    }
  }
}
</style>
