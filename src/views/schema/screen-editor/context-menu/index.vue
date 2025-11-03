<template>
  <transition name="fade-scale-move">
    <div v-if="contextMenu.show" class="context-menu-wrap" :style="contextMenuStyle">
      <template v-if="isMultiSelect && !selectedCom">
        <div class="context-menu-item" @click="schemaStore.group()">
          <span>
            <AntIcon name="GroupOutlined" class="menu-icon" />
            创建分组
          </span>
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" v-for="em in MultiplAlignOptions" :key="em.value"
          @click="schemaStore.doAlign(em.value)" style="padding-right: var(--datav-border-radius-lg)">
          <span>
            <AntIcon :name="alignIconMap[em.value]" class="menu-icon iconfont-align" />
            {{ em.label }}
          </span>
        </div>

        <div class="context-menu-divider"></div>
        <div class="context-menu-item" @click="toDeleteCom">
          <span>
            <AntIcon name="DeleteOutlined" class="menu-icon" />
            删除
          </span>
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
          <span>
            <AntIcon name="VerticalAlignTopOutlined" class="menu-icon" />
            置顶
          </span>
          <span class="key-code">Alt + Home</span>
        </div>
        <div class="context-menu-item" @click="moveBottom">
          <span>
            <AntIcon name="VerticalAlignBottomOutlined" class="menu-icon" />
            置底
          </span>
          <span class="key-code">Alt + End</span>
        </div>
        <div class="context-menu-item" @click="moveUp">
          <span>
            <AntIcon name="ArrowUpOutlined" class="menu-icon" />
            上移一层
          </span>
          <span class="key-code">Alt + ↑</span>
        </div>
        <div class="context-menu-item" @click="moveDown">
          <span>
            <AntIcon name="ArrowDownOutlined" class="menu-icon" />
            下移一层
          </span>
          <span class="key-code">Alt + ↓</span>
        </div>

        <div class="context-menu-divider"></div>

        <div class="context-menu-item" @click="lockCom">
          <template v-if="isLocked">
            <span>
              <AntIcon name="UnlockOutlined" class="menu-icon" />
              解锁
            </span>
          </template>
          <template v-else>
            <span>
              <AntIcon name="LockOutlined" class="menu-icon" />
              锁定
            </span>
          </template>
        </div>
        <div class="context-menu-item" @click="hideCom">
          <template v-if="isHided">
            <span>
              <AntIcon name="EyeOutlined" class="menu-icon" />
              显示
            </span>
          </template>
          <template v-else>
            <span>
              <AntIcon name="EyeInvisibleOutlined" class="menu-icon" />
              隐藏
            </span>
          </template>
        </div>
        <div class="context-menu-item" @click="saveCom">
          <span>
            <AntIcon name="SaveOutlined" class="menu-icon" />
            保存
          </span>
        </div>

        <div class="context-menu-divider"></div>
        <div class="context-menu-item" @click="renameCom">
          <span>
            <AntIcon name="EditOutlined" class="menu-icon" />
            重命名
          </span>
          <span class="key-code">F2</span>
        </div>
        <div class="context-menu-item" @click="toCopyCom">
          <span>
            <AntIcon name="CopyOutlined" class="menu-icon" />
            复制
          </span>
          <span class="key-code">Ctrl + C,V</span>
        </div>
        <!-- 数字指标组件专用菜单 -->
        <template v-if="isNumberTitleFlop">
          <div class="context-menu-divider"></div>
          <div class="context-menu-item" @click="handlePointAssociation">
            <span>
              <AntIcon name="LinkOutlined" class="menu-icon" />
              测点关联
            </span>
          </div>
          <div class="context-menu-item" @click="handleLimitAnimation">
            <span>
              <AntIcon name="ThunderboltOutlined" class="menu-icon" />
              限值动画
            </span>
          </div>
        </template>
        <div class="context-menu-divider" v-if="isNumberTitleFlop"></div>
        <div class="context-menu-item" @click="toDeleteCom">
          <span>
            <AntIcon name="DeleteOutlined" class="menu-icon" />
            删除
          </span>
          <span class="key-code">Delete</span>
        </div>
      </template>
    </div>
  </transition>
  <!-- 测点关联弹窗 -->
  <PointAssociationModal
    v-model:modelValue="pointAssociationVisible"
    :component-id="selectedCom?.id"
    @save="handlePointAssociationSave"
  />
  <!-- 限值动画弹窗 -->
  <LimitAnimationModal
    v-model:modelValue="limitAnimationVisible"
    :component-id="selectedCom?.id"
    @save="handleLimitAnimationSave"
  />
</template>

<script setup>
import useSchemaContextMenu from '@/hooks/schema/useSchemaContextMenu'
import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { on, off, throwError } from '@/utils/util'
import { MoveType } from '@/config/enum'
import { useStore } from '@/store'
import { message, Modal } from 'ant-design-vue'
import * as api from '@/api/comps/comps.api'
import { uploadImagesToGroup } from '@/api/images/images.api'
import { createPreviewThumb } from '@/hooks/usePreviewImg'
import { dataURLtoFile } from '@/utils/file-helper'
import { EventBus, EventMap } from '@/utils/event-bus'
import { MultiplAlignOptions } from '@/config/select-options'
import PointAssociationModal from './PointAssociationModal.vue'
import LimitAnimationModal from './LimitAnimationModal.vue'

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

// 判断是否是数字指标组件
const isNumberTitleFlop = computed(() => {
  return selectedCom.value && selectedCom.value.name === 'VNumberTitleFlop'
})

// 测点关联弹窗显示状态
const pointAssociationVisible = ref(false)
// 限值动画弹窗显示状态
const limitAnimationVisible = ref(false)

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
    message.warning('请先创建一个默认的组件分组在进行保存！')
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
          message.success('保存成功!')
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
    .then(() => { })
    .catch(() => { })
}

const toDeleteCom = () => {
  const coms = selectedComs.value
  // 暂时去掉删除拦截
  if (coms && coms.length > 0) {
    // Modal.confirm({
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

// 测点关联
const handlePointAssociation = () => {
  // message.info('测点关联功能待开发')
  contextMenu.value.show = false
  pointAssociationVisible.value = true
}

// 测点关联保存回调
const handlePointAssociationSave = data => {
  if (selectedCom.value) {
    // 保存到组件配置中，会在保存页面时自动序列化到 componentContent 中
    if (!selectedCom.value.config.pointAssociation) {
      selectedCom.value.config.pointAssociation = {}
    }
    Object.assign(selectedCom.value.config.pointAssociation, data)
    // 记录快照，确保保存时包含最新数据
    schemaStore.recordSnapshot()
  }
}

// 限值动画
const handleLimitAnimation = () => {
  contextMenu.value.show = false
  limitAnimationVisible.value = true
}

// 限值动画保存回调
const handleLimitAnimationSave = data => {
  if (selectedCom.value) {
    // 保存到组件配置中，会在保存页面时自动序列化到 componentContent 中
    selectedCom.value.config.limitAnimation = data
    // 记录快照，确保保存时包含最新数据
    schemaStore.recordSnapshot()
  }
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
  border-radius: var(--datav-border-radius-base);
  user-select: none;
}

.context-menu-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  padding: 0 var(--datav-border-radius-base);
  padding-right: 3em;
  overflow: hidden;
  line-height: 28px;
  cursor: pointer;
  margin: var(--datav-border-radius-sm);
  color: var(--s-text-color);
  border-radius: var(--datav-border-radius-base);

  &:hover {
    background-color: var(--s-color-1);
  }

  .menu-icon {
    margin-right: var(--datav-border-radius-base);
  }

  .key-code {
    position: absolute;
    top: 0;
    right: var(--datav-border-radius-base);
    color: var(--s-text-color-3);
    font-size: var(--datav-font-size-sm);
    transform: scale(0.9);
  }
}

.context-menu-divider {
  width: 100%;
  height: 1px;
  background-color: var(--s-border-color-2);
}
</style>
