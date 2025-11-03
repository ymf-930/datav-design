<template>
  <a-modal
    v-model:visible="visible"
    title="测点关联"
    width="600px"
    destroyOnClose
    class="schema-modal"
    @close="handleClose"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="测点位置" name="location" :rules="rules.location">
        <a-select
          v-model:value="formData.location"
          placeholder="请选择测点位置"
          allow-clear
        >
          <a-select-option
            v-for="item in PointLocationOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="设备名称" name="deviceName" :rules="rules.deviceName">
        <a-select
          v-model:value="formData.deviceName"
          placeholder="请选择设备名称"
          allow-clear
        >
          <a-select-option value="transformer">变压器</a-select-option>
          <!-- 后续可以动态加载设备列表 -->
        </a-select>
      </a-form-item>

      <a-form-item label="测点名称" name="pointName" :rules="rules.pointName">
        <a-select
          v-model:value="formData.pointName"
          placeholder="请选择测点名称"
          allow-clear
        >
          <a-select-option value="transformer">变压器</a-select-option>
          <!-- 后续可以动态加载测点列表 -->
        </a-select>
      </a-form-item>

      <a-form-item label="实时数据刷新频率" name="refreshFrequency" :rules="rules.refreshFrequency">
        <a-select
          v-model:value="formData.refreshFrequency"
          placeholder="请选择刷新频率"
          allow-clear
        >
          <a-select-option
            v-for="item in RefreshFrequencyOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="测点显示名称" name="displayName">
        <a-input v-model:value="formData.displayName" placeholder="请输入" />
      </a-form-item>

      <a-form-item label="测点显示单位" name="displayUnit">
        <a-input v-model:value="formData.displayUnit" placeholder="请输入" />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" :loading="loading" @click="handleSave">保存</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { PointLocationOptions, RefreshFrequencyOptions } from '@/config/select-options'

defineOptions({
  name: 'PointAssociationModal',
})

const emit = defineEmits(['update:modelValue', 'save'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  componentId: {
    type: String,
    default: '',
  },
})

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const formRef = ref(null)
const loading = ref(false)

// 表单数据
const formData = reactive({
  location: '',
  deviceName: '',
  pointName: '',
  refreshFrequency: '',
  displayName: '',
  displayUnit: '',
})

// 表单验证规则
const rules = {
  location: [{ required: true, message: '请选择测点位置', trigger: 'change' }],
  deviceName: [{ required: true, message: '请选择设备名称', trigger: 'change' }],
  pointName: [{ required: true, message: '请选择测点名称', trigger: 'change' }],
  refreshFrequency: [{ required: true, message: '请选择实时数据刷新频率', trigger: 'change' }],
}

// 重置表单
const resetForm = () => {
  formData.location = ''
  formData.deviceName = ''
  formData.pointName = ''
  formData.refreshFrequency = ''
  formData.displayName = ''
  formData.displayUnit = ''
  formRef.value?.resetFields()
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
  resetForm()
}

// 保存
const handleSave = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    
    // TODO: 调用API保存数据
    // await savePointAssociation(props.componentId, formData)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('保存成功')
    emit('save', { ...formData })
    handleClose()
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听弹窗打开，重置表单
watch(
  () => props.modelValue,
  val => {
    if (val) {
      resetForm()
      // TODO: 如果已有数据，可以在这里加载
      // loadPointAssociation(props.componentId)
    }
  },
)
</script>

<style scoped>

</style>

