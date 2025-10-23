<template>
  <div class="layer-panel-wp" :class="{ 'is-hide': !toolbar.layer }">
    <div class="layer-panel">
      <div class="layer-top">
        <div class="layer-num pl-10">图层</div>
        <div class="layer-action" @click="schemaStore.toggleLayerPanel(false)">
          <AntIcon name="LeftOutlined" title="收起"></AntIcon>
        </div>
      </div>
      <div class="layer-toolbar layer-toolbar-top">
        <AntIcon name="ArrowUpOutlined" class="toolbar-icon standard" title="上移一层"
          
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveUp"
        ></AntIcon>
        <AntIcon name="ArrowDownOutlined" class="toolbar-icon standard" title="下移一层"
          
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveDown"
        ></AntIcon>
        <AntIcon name="VerticalAlignBottomOutlined" class="toolbar-icon standard" title="置顶"
          
          :class="enableBtnClass"
          :style="{ transform: `rotate(180deg)`, ...enableBtnStyle }"
          @click="moveTop"
        ></AntIcon>
        <AntIcon name="VerticalAlignBottomOutlined" class="toolbar-icon standard" title="置底"
          
          :class="enableBtnClass"
          :style="enableBtnStyle"
          @click="moveBottom"
        ></AntIcon>
      </div>
      <div class="layer-manager-wrap">
        <draggable v-model="descComs" class="drag-area" item-key="id" v-bind="{ animation: 200 }">
          <template #item="{ element: com }">
            <div
              :title="com.alias"
              class="layer-manager-item"
              :class="[
                {
                  hided: com.hided,
                  locked: com.locked,
                  hovered: com.id === hoveredComId,
                  selected: isSelected(com),
                },
              ]"
              @mousedown="selectCom(com.id)"
              @mouseenter="onEnter(com.id)"
              @mouseleave="onLeave"
              @dblclick="schemaStore.renamingCom(com.id)"
              @contextmenu="showMenu($event)"
            >
              <AntIcon :name="com.name === 'VIcon' ? com.config.src : com.icon" size="18"></AntIcon>
              <input
                v-if="com.id === renamingComId"
                v-model.trim="com.alias"
                v-focus
                class="layer-item-input"
                @blur="schemaStore.renamingCom('')"
                @keydown.enter="schemaStore.renamingCom('')"
              />
              <span v-else class="layer-item-span">
                <span class="layer-item-text">{{ com.alias }}</span>
              </span>
                <AntIcon
                  :name="com.hided ? 'EyeInvisibleOutlined' : 'EyeOutlined'"
                  class="show-toggle-btn"
                  :title="com.hided ? '显示' : '隐藏'"
                  @click="com.hided = !com.hided"
                />
                <AntIcon
                  :name="com.locked ? 'LockOutlined' : 'UnlockOutlined'"
                  class="show-toggle-btn"
                  :title="com.locked ? '解锁' : '锁定'"
                  @click="com.locked = !com.locked"
                />
            </div>
          </template>
        </draggable>
        <div class="last-flex-item" @click="cancelSelectCom"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import { computed } from 'vue'
import { useStore } from '@/store'
import useSchemaContextMenu from '@/hooks/schema/useSchemaContextMenu'
import { MoveType } from '@/config/enum'
import { isEmpty } from '@/utils/util'

const { schemaStore, storeToRefs } = useStore()
const { comps, toolbar, hoveredComId, selectedCom, renamingComId, isMultiSelect, selectedComs } =
  storeToRefs(schemaStore)

const { showMenu } = useSchemaContextMenu()

const enableBtnClass = computed(() => !!selectedCom.value)
const enableBtnStyle = computed(() => ({ opacity: selectedCom.value ? 1 : 0.5 }))

function isSelected(com) {
  if (isMultiSelect.value) return selectedComs.value.map(i => i.id).includes(com.id)
  return !isEmpty(selectedCom.value) && selectedCom.value.id === com.id
}

const descComs = computed({
  get: () => [...comps.value].reverse(),
  set: val => (comps.value = val.reverse()),
})

const moveCom = moveType => {
  if (selectedCom.value) {
    schemaStore.moveCom({ id: selectedCom.value.id, moveType })
  }
}

const moveUp = () => moveCom(MoveType.up)
const moveDown = () => moveCom(MoveType.down)
const moveTop = () => moveCom(MoveType.top)
const moveBottom = () => moveCom(MoveType.bottom)

const onEnter = id => schemaStore.hoverCom(id)

const onLeave = () => schemaStore.hoverCom('')

const selectCom = id => {
  const com = comps.value.find(i => i.id === id)
  if (com) {
    schemaStore.selectCom(com) // 层级不允许ctrl 进行多选 , false
  }
}
const cancelSelectCom = () => schemaStore.selectCom()
</script>

<style scoped>
.layer-panel-wp {
  position: relative;
  z-index: 5;
  display: flex;
  width: var(--schema-layer-width);
  height: 100%;
  overflow: hidden;
  background: var(--schema-color-bg-2);
  border-right: 1px solid var(--schema-color-border);
  transition: width 0.2s ease;
  flex: none;
  flex-direction: column;
  .layer-panel {
    z-index: 9;
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: 0.2s ease;
    flex-direction: column;
    flex: auto;
    .layer-top {
      position: relative;
      height: 30px;
      line-height: 30px;
      user-select: none;
      background: var(--schema-color-bg-3);
      border-bottom: 1px solid var(--schema-color-border);
    }
    .layer-action {
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 100%;
      > .anticon {
        cursor: pointer;
        width: 20px;
        font-size: var(--datav-font-size-base);
      }
    }
  }
  &.is-hide {
    width: 0;
    .layer-panel {
      transform: translateX(-100%);
    }
  }
}

.layer-toolbar {
  display: flex;
  height: 32px;
  padding: 0 18px;
  background: var(--schema-color-bg-2);
  align-items: center;
  justify-content: center;
  flex: none;

  &.layer-toolbar-top {
    border-bottom: 1px solid var(--schema-color-border);
  }
  .toolbar-icon {
    width: 24px;
    height: 24px;
    font-size: var(--datav-font-size-lg);
    transition: background 0.2s;
    margin: 0 10px;
    line-height: 24px;
    text-align: center;
    border-radius: 3px;
    background: var(--schema-color-bg-1);

    &.standard:hover {
      cursor: pointer;
      background: var(--s-color-1);
      opacity: 1 !important;
    }
  }
}

.layer-manager-wrap {
  position: relative;
  display: flex;
  width: 100%;
  height: calc(100% - 62px);
  overflow-y: auto;
  font-size: var(--datav-font-size-sm);
  line-height: 2;
  padding: var(--datav-border-radius-base);
  color: var(--schema-font-color);
  list-style: none;
  background: var(--schema-color-bg-2);
  user-select: none;
  flex: auto;
  flex-direction: column;

  .layer-manager-item {
    position: relative;
    display: flex;
    width: 100%;
    height: 40px;
    padding: 0 var(--datav-border-radius-base);
    padding-left: var(--datav-border-radius-lg);
    margin-bottom: var(--datav-border-radius-sm);
    cursor: pointer;
    box-sizing: border-box;
    transition: background 0.2s;
    align-items: center;
    border-radius: var(--datav-border-radius-base);
    border: 1px solid transparent;
    flex: none;
    &.hided,
    &.locked {
      color: var(--s-text-color-2);
    }

    .layer-item-span {
      width: 126px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 var(--datav-border-radius-sm);
      .layer-item-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 20px;
        line-height: 20px;
      }
    }

    .layer-item-input {
      width: 126px;
      padding: 0 var(--datav-border-radius-sm);
      height: 20px;
      line-height: 20px;
      background: 0 0;
      border: none;
      outline: 0;
      font-size: var(--datav-font-size-sm);
    }

    .show-toggle-btn {
      padding: 0 2px;
      font-size: 18px;
      display: none;
    }
    &.hovered {
      background: var(--s-color-1);
      .show-toggle-btn {
        display: block;
      }
    }
    &.hided,
    &.locked {
      .show-toggle-btn {
        display: block;
        &.b-icon-lock {
          color: var(--datav-primary-color);
        }
      }
    }

    &.selected {
      background: var(--s-color-1);
      border: 1px solid var(--datav-primary-color);
      .show-toggle-btn {
        display: block;
      }
    }

    &.sortable-ghost {
      opacity: 0.4;
    }
  }
  .last-flex-item {
    flex: auto;
    min-height: 40px;
  }
}
</style>
