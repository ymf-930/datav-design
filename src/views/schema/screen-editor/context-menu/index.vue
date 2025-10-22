<template>
  <transition name="fade-scale-move">
    <div v-if="contextMenu.show" class="context-menu-wrap" :style="contextMenuStyle">
      <template v-if="isMultiSelect && !selectedCom">
        <div class="context-menu-item" @click="schemaStore.group()">
          <AntIcon name="GroupOutlined" class="menu-icon" />
          创建分组
        </div>
        <div class="context-menu-divider"></div>
        <div
          class="context-menu-item"
          v-for="em in MultiplAlignOptions"
          :key="em.value"
          @click="schemaStore.doAlign(em.value)"
          style="padding-right: 8px"
        >
          <AntIcon :name="alignIconMap[em.value]" class="menu-icon iconfont-align" />
          {{ em.label }}
        </div>

        <div class="context-menu-divider"></div>
        <div class="context-menu-item" @click="toDeleteCom">
          <AntIcon name="DeleteOutlined" class="menu-icon" />
          删除
          <span class="key-code">Delete</span>
        </div>
      </template>
      <!-- 单选组件内容 -->
      <template v-if="selectedCom">
        <template v-if="curComIsGroup">
          <div class="context-menu-item" @click="schemaStore.ungroup()">
            <AntIcon name="UngroupOutlined" class="menu-icon" />
            解除分组
          </div>
          <div class="context-menu-divider"></div>
        </template>

        <div class="context-menu-item" @click="moveTop">
          <AntIcon name="VerticalAlignTopOutlined" class="menu-icon" />
          置顶
          <span class="key-code">Alt + Home</span>
        </div>
        <div class="context-menu-item" @click="moveBottom">
          <AntIcon name="VerticalAlignBottomOutlined" class="menu-icon" />
          置底
          <span class="key-code">Alt + End</span>
        </div>
        <div class="context-menu-item" @click="moveUp">
          <AntIcon name="ArrowUpOutlined" class="menu-icon" />
          上移一层
          <span class="key-code">Alt + ↑</span>
        </div>
        <div class="context-menu-item" @click="moveDown">
          <AntIcon name="ArrowDownOutlined" class="menu-icon" />
          下移一层
          <span class="key-code">Alt + ↓</span>
        </div>

        <div class="context-menu-divider"></div>

        <div class="context-menu-item" @click="lockCom">
          <template v-if="isLocked">
            <AntIcon name="UnlockOutlined" class="menu-icon" />
            解锁
          </template>
          <template v-else>
            <AntIcon name="LockOutlined" class="menu-icon" />
            锁定
          </template>
        </div>
        <div class="context-menu-item" @click="hideCom">
          <template v-if="isHided">
            <AntIcon name="EyeOutlined" class="menu-icon" />
            显示
          </template>
          <template v-else>
            <AntIcon name="EyeInvisibleOutlined" class="menu-icon" />
            隐藏
          </template>
        </div>
        <div class="context-menu-item" @click="saveCom">
          <AntIcon name="SaveOutlined" class="menu-icon" />
          保存
        </div>

        <div class="context-menu-divider"></div>
        <div class="context-menu-item" @click="renameCom">
          <AntIcon name="EditOutlined" class="menu-icon" />
          重命名
          <span class="key-code">F2</span>
        </div>
        <div class="context-menu-item" @click="toCopyCom">
          <AntIcon name="CopyOutlined" class="menu-icon" />
          复制
          <span class="key-code">Ctrl + C,V</span>
        </div>
        <div class="context-menu-item" @click="toDeleteCom">
          <AntIcon name="DeleteOutlined" class="menu-icon" />
          删除
          <span class="key-code">Delete</span>
        </div>
      </template>
    </div>
  </transition>
</template>

<script setup>
import useSchemaContextMenu from '@/hooks/schema/useSchemaContextMenu'
import { h, onBeforeUnmount, onMounted, ref } from 'vue'
import { on, off, throwError } from '@/utils/util'
import { MoveType } from '@/config/enum'
import { useStore } from '@/store'
import { Message, MessageBox, BSelect, BOption } from 'bin-ui-design'
import * as api from '@/api/comps/comps.api'
import { uploadImagesToGroup } from '@/api/images/images.api'
import { createPreviewThumb } from '@/hooks/usePreviewImg'
import { dataURLtoFile } from '@/utils/file-helper'
import { EventBus, EventMap } from '@/utils/event-bus'
import { MultiplAlignOptions } from '@/config/select-options'

// map align action to Ant Design icons
const alignIconMap = {
  'align-top': 'VerticalAlignTopOutlined',
  'align-center': 'VerticalAlignMiddleOutlined', // vertical center
  'align-bottom': 'VerticalAlignBottomOutlined',
  'align-left': 'AlignLeftOutlined',
  'align-middle': 'AlignCenterOutlined', // horizontal center
  'align-right': 'AlignRightOutlined',
}

const groups = ref([]) // 组件库
const selectGroup = ref({})

const { schemaStore, storeToRefs } = useStore()
const { selectedCom, selectedComs, curComIsGroup, isMultiSelect, areaData } =
  storeToRefs(schemaStore)

const { isLocked, isHided, contextMenu, contextMenuStyle } = useSchemaContextMenu()

const moveCom = moveType => {
  if (selectedCom.value) {
    schemaStore.moveCom({ id: selectedCom.value.id, moveType })
  }
}

const moveUp = () => moveCom(MoveType.up)
const moveDown = () => moveCom(MoveType.down)
const moveTop = () => moveCom(MoveType.top)
const moveBottom = () => moveCom(MoveType.bottom)

const lockCom = () => {
  if (selectedCom.value) {
    selectedCom.value.locked = !selectedCom.value.locked
  }
}

const hideCom = () => {
  if (selectedCom.value) {
    selectedCom.value.hided = !selectedCom.value.hided
  }
}

const saveCom = async () => {
  groups.value = await api.getCompGroup()
  if (groups.value.length === 0) {
    Message.warning('请先创建一个默认的组件分组在进行保存！')
    return
  }
  selectGroup.value = groups.value[0].key // 默认选中第一个组件库
  // const id = `component_${selectedCom.value.id}`
  MessageBox({
    type: 'success',
    title: '指定组件分组',
    message: h(
      BSelect,
      {
        modelValue: selectGroup.value,
        onChange: val => (selectGroup.value = val),
      },
      () => groups.value.map(i => h(BOption, { label: i.value, value: i.key })),
    ),
    showCancelButton: true,
    confirmText: '保存',
    cancelText: '取消',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        try {
          const el = document.getElementById(`component_${selectedCom.value.id}`)
          const tumb = await createPreviewThumb(el)
          const img = {
            groupKey: 'analysis_material',
            name: selectedCom.value.alias,
            attr: { w: el.clientWidth, h: el.clientHeight },
            file: dataURLtoFile(tumb, selectedCom.value.alias),
          }
          // 上传缩略图
          const tumbUrl = await uploadImagesToGroup(img)
          // TODO 这里保存了base64格式的缩略图，实际可能需要调用一次上传后存储路径
          await api.saveComps(selectGroup.value, selectedCom.value, tumbUrl)
          instance.confirmButtonLoading = true
          Message.success('保存成功!')
          EventBus.emit(EventMap.SaveCompSuccess)
        } catch (error) {
          console.log(error)
          throwError('createPreviewThumb', error)
        }

        instance.confirmButtonLoading = false
        done()
      } else {
        done()
      }
    },
  })
    .then(() => {})
    .catch(() => {})
}

const toDeleteCom = () => {
  const coms = selectedComs.value
  // 暂时去掉删除拦截
  if (coms && coms.length > 0) {
    // MessageBox.confirm({
    //   type: 'error',
    //   title: '提示',
    //   message: '是否删除选中的组件?',
    // })
    //   .then(() => {
    schemaStore.batchDeleteComs(coms)
    schemaStore.recordSnapshot()
    areaData.value.showArea = false
    // })
    // .catch(() => {})
  }
}

const renameCom = () => {
  const com = selectedCom.value
  if (com) {
    schemaStore.renamingCom(com.id)
  }
}

const toCopyCom = () => {
  schemaStore.copyComs(selectedComs.value)
}

const handleContextmenu = ev => {
  ev.preventDefault()
}
onMounted(() => {
  on(document, 'contextmenu', handleContextmenu)
})
onBeforeUnmount(() => {
  off(document, 'contextmenu', handleContextmenu)
})

defineExpose({
  moveUp,
  moveBottom,
  moveDown,
  moveTop,
  lockCom,
  hideCom,
  toDeleteCom,
  renameCom,
  toCopyCom,
})
</script>

<style scoped>
.context-menu-wrap {
  position: fixed;
  z-index: 9999;
  width: 152px;
  background: var(--s-color-2);
  border-radius: var(--bin-border-radius-default);
  user-select: none;
}

.context-menu-item {
  position: relative;
  display: flex;
  height: 28px;
  padding: 0 6px;
  padding-right: 3em;
  overflow: hidden;
  line-height: 28px;
  cursor: pointer;
  margin: 4px;
  color: var(--s-text-color);
  border-radius: var(--bin-border-radius-default);
  &:hover {
    background-color: var(--s-color-1);
  }

  .menu-icon {
    margin-right: 6px;
  }

  .key-code {
    position: absolute;
    top: 0;
    right: 6px;
    color: var(--s-text-color-3);
    font-size: 12px;
    transform: scale(0.9);
  }
}

.context-menu-divider {
  width: 100%;
  height: 1px;
  background-color: var(--s-border-color-2);
}
</style>
