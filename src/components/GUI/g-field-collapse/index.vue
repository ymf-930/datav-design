<template>
  <div class="g-field-toggle" :class="{ disable: toggle && !modelValue }">
    <div class="g-field-header" :class="[{ active: show }]" flex="cross:center" @click="toggleShow">
      <div class="wrap-name">
        <span class="wrap-label">{{ label }}</span>
        <span class="wrap-right" @click.stop>
          <div class="ant-switch--mini" @click.stop>
            <a-switch
              v-if="toggle"
              v-model:checked="visible"
              size="small"
              @change="toggleVisible"
            />
          </div>
          <slot name="add"></slot>
        </span>
        <span class="wrap-arrow" :class="[{ show }]">
          <AntIcon name="RightOutlined" />
        </span>
      </div>
    </div>
    <a-collapse v-if="!modal" v-model:activeKey="collapseActiveKey">
      <a-collapse-panel v-if="show" key="1" :showArrow="false">
        <div class="g-field-content">
          <slot></slot>
        </div>
      </a-collapse-panel>
    </a-collapse>

    <g-modal-config v-else v-model="show" :title="label">
      <div v-if="show" class="g-field-content" style="padding: 0 10px">
        <slot></slot>
      </div>
    </g-modal-config>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AntIcon from '@/components/Common/AntIcon/index.vue'

defineOptions({
  name: 'GFieldCollapse',
})

const emit = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  defaultOpen: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Boolean,
    default: true,
  },
  toggle: {
    type: Boolean,
    default: false,
  },
  modal: {
    type: Boolean,
    default: false,
  },
})

const show = ref(props.defaultOpen)
const collapseActiveKey = ref(props.defaultOpen ? ['1'] : [])

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const toggleVisible = () => {
  if (visible.value) {
    show.value = false
    collapseActiveKey.value = []
  } else {
    show.value = true
    collapseActiveKey.value = ['1']
  }
  emit('change', visible.value)
}

const toggleShow = () => {
  if (!props.modelValue) return
  show.value = !show.value
  collapseActiveKey.value = show.value ? ['1'] : []
}
</script>

<style scoped>
.g-field-toggle {
  position: relative;
  .g-field-header {
    position: relative;
    border-bottom: 1px solid transparent;
    background: var(--schema-color-bg-2);
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 10px;
      bottom: 10px;
      width: 3px;
      border-radius: 2px;
      background-color: var(--s-border-color);
      transition: 0.2s;
    }
    &.active {
      border-bottom: 1px solid var(--s-color-1);
      &::before {
        background-color: var(--ant-primary-color);
      }
    }
    .wrap-name {
      height: 36px;
      span {
        display: inline-block;
        vertical-align: middle;
      }
      .wrap-right {
        position: absolute;
        right: 30px;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .wrap-arrow {
        transition: 0.2s;
        position: absolute;
        right: 10px;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
        &.show {
          transform: rotate(90deg);
        }
        &.simple {
          cursor: pointer;
        }
      }
      .wrap-label {
        line-height: 36px;
        padding-left: 10px;
        color: #fff;
      }
    }
  }
  .g-field-content {
    background-color: var(--schema-color-bg-2);
    padding: 0;
    color: var(--s-text-color);
  }
  &.disable {
    color: var(--s-text-color-3);
    .g-field-header {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 1px solid var(--s-color-1);
  }
}

/* 隐藏 ant-collapse 的默认样式 */
:deep(.ant-collapse) {
  border: none;
  background: transparent;
}

:deep(.ant-collapse-item) {
  border: none;
}

:deep(.ant-collapse-content) {
  border: none;
  background: transparent;
}

:deep(.ant-collapse-content-box) {
  padding: 0;
}
</style>
