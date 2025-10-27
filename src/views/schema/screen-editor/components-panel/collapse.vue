<template>
  <div class="collapse-group">
    <div class="header" :class="[{ active: isActive }]" flex="cross:center" @click="handleClick">
      <div class="name">
        <div class="wrap-label">
          <div class="create-box" v-if="edit" @click.stop>
            <a-input
              v-model:value="editName"
              placeholder="输入名称，回车创建"
              v-focus
              size="small"
              style="width: 150px; top: -2px"
              @blur="onAddInputBlur"
              @keyup.enter="onAddInputEnter"
            />
          </div>
          <div v-else>
            {{ title }}
          </div>
        </div>
        <span class="wrap-edit" v-if="canEdit && !edit">
          <AntIcon name="EditOutlined" @click.stop="handleEdit"></AntIcon>
          <AntIcon name="DeleteOutlined" @click.stop="handleRemove"></AntIcon>
        </span>
        <span class="wrap-arrow" :class="[{ active: isActive }]">
          <AntIcon name="RightOutlined" size="12"></AntIcon>
        </span>
      </div>
    </div>
    <a-collapse>
      <div v-show="isActive" class="content">
        <slot></slot>
      </div>
    </a-collapse>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCollapseItem } from '@/hooks/collapseHook'

const emit = defineEmits(['edit', 'remove'])
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: [String, Number, Object],
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
})

const { isActive, triggerClick } = useCollapseItem(props)

const edit = ref(false)
const editName = ref('')
let cacheName = ''

function handleClick() {
  triggerClick(props.name)
}

function handleEdit() {
  edit.value = true
  editName.value = props.title
  cacheName = props.title
}

function onAddInputBlur(e) {
  const name = (e.target.value || '').trim()
  if (!name || name === cacheName) edit.value = false
}

function onAddInputEnter(e) {
  const name = (e.target.value || '').trim()
  if (name) editSave()
  else edit.value = false
}

function editSave() {
  edit.value = false
  emit('edit', editName.value)
}
const handleRemove = () => emit('remove')
</script>

<style scoped>
.collapse-group {
  position: relative;
  .header {
    padding-left: var(--datav-border-radius-base);
    border-bottom: 1px solid transparent;
    cursor: pointer;
    &.active {
      border-bottom: 1px solid var(--schema-color-border);
    }
    .name {
      width: 100%;
      height: 32px;
      span {
        display: inline-block;
        vertical-align: middle;
      }
      .wrap-arrow {
        transition: 0.2s;
        position: absolute;
        right: 10px;
        top: var(--datav-border-radius-base);
        &.active {
          transform: rotate(90deg);
        }
        &.simple {
          cursor: pointer;
        }
      }
      &:hover {
        .wrap-edit {
          opacity: 1;
        }
      }
      .wrap-edit {
        position: absolute;
        right: 28px;
        top: var(--datav-border-radius-base);
        opacity: 0;
        > .anticon {
          font-size: var(--datav-font-size-base);
          &.b-icon-edit {
            margin-right: 3px;
          }
        }
      }
      .wrap-label {
        position: relative;
        line-height: 32px;
        padding-left: 10px;
        color: #fff;
        &:before {
          content: '';
          position: absolute;
          top: 10px;
          bottom: 10px;
          left: 0;
          width: 3px;
          border-radius: 2px;
          background-color: var(--datav-primary-color);
        }
      }
    }
  }
  .content {
    background-color: var(--schema-color-bg-3);
    padding: 0;
    color: var(--text-color);
  }
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 1px solid var(--schema-color-border);
  }
}
</style>
