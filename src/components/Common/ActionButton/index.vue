<template>
  <a-popover v-model:visible="visible" :overlayStyle="{ width: 'popperWidth' }" :disabled="!confirm">
    <a-button v-bind="btnProps" @click="handleClick" :title="tooltip">
      <AntIcon v-if="icon" :name="icon" :style="iconStyle" />
      <slot></slot>
    </a-button>
    <template #content>
      <p style="line-height: 22px; margin-bottom: 8px">
        <AntIcon name="QuestionCircleOutlined" size="16" color="#fa8c16"></AntIcon>
        {{ message }}
      </p>
      <div style="text-align: right; margin: 0">
        <a-button size="small" type="text" @click="handleCancel">取消</a-button>
        <a-button type="primary" size="small" @click="handleOk">确认</a-button>
      </div>
    </template>
  </a-popover>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    buttonProps: {
      type: Object,
    },
    popperWidth: {
      type: Number,
      default: 260,
    },
    message: {
      type: String,
      default: '确定删除本条数据吗？',
    },
    disabled: Boolean,
    confirm: Boolean,
    tooltip: String,
    icon: String, // 按钮的icon
    type: String, // 按钮的样式
    color: String, // 图标按钮时的颜色
    isIcon: Boolean, // 仅为图标按钮
    loading: Boolean,
    iconStyle: {
      type: Object,
      default: () => ({
        fontSize: '18px',
      }),
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  emits: ['cancel', 'click'],
  computed: {
    btnProps() {
      return {
        type: this.type,
        textColor: this.color,
        disabled: this.disabled,
        loading: this.loading,
        ...this.buttonProps,
      }
    },
  },
  methods: {
    handleCancel() {
      this.visible = false
      this.$emit('cancel')
    },
    handleOk() {
      this.visible = false
      this.$emit('click')
    },
    handleClick() {
      if (this.confirm) {
        return
      }
      this.$emit('click')
    },
  },
}
</script>
