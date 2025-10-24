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
          <AntIcon name="RightOutlined" size="12"/>
        </span>
      </div>
    </div>
    <div v-if="!modal" class="g-field-content-wrapper" :class="{ 'is-expanded': show }">
      <div class="g-field-content">
        <slot></slot>
      </div>
    </div>

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

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const toggleVisible = () => {
  if (visible.value) {
    show.value = false
  } else {
    show.value = true
  }
  emit('change', visible.value)
}

const toggleShow = () => {
  if (!props.modelValue) return
  show.value = !show.value
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
      background-color: var(--datav-primary-color);
      transition: 0.2s;
    }
    &.active {
      border-bottom: 1px solid var(--s-color-1);
      &::before {
        background-color: var(--datav-primary-color);
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
  .g-field-content-wrapper {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    
    &.is-expanded {
      max-height: 1000px; /* 足够大的值 */
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

/* 移除不再需要的 ant-collapse 样式覆盖 */
</style>
