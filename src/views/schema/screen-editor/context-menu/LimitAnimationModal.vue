<template>
  <a-modal
    v-model:visible="visible"
    title="限制规则"
    width="900px"
    destroyOnClose
    class="schema-modal"
    @close="handleClose"
  >
    <div class="limit-animation-content">
      <!-- 规则表格 -->
      <div class="rules-table">
        <div class="table-header">
          <div class="header-cell" style="width: 120px">限制规则</div>
          <div class="header-cell" style="flex: 1">数值</div>
          <div class="header-cell" style="width: 200px">展示文字</div>
          <div class="header-cell" style="width: 100px">背景颜色</div>
          <div class="header-cell" style="width: 100px">字体颜色</div>
          <div class="header-cell" style="width: 100px">动画样式</div>
          <div class="header-cell" style="width: 50px"></div>
        </div>
        
        <div class="table-body">
          <div v-for="(rule, index) in rules" :key="index" class="table-row">
            <!-- 限制规则 -->
            <div class="table-cell" style="width: 120px">
              <a-select
                v-model:value="rule.ruleType"
                style="width: 100%"
                size="small"
              >
                <a-select-option
                  v-for="item in LimitRuleOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
            
            <!-- 数值 -->
            <div class="table-cell" style="flex: 1">
              <div v-if="rule.ruleType === 'between'" class="value-range">
                <a-input-number
                  v-model:value="rule.value1"
                  :min="0"
                  :precision="2"
                  size="small"
                  style="flex: 1"
                  placeholder="最小值"
                />
                <span class="range-separator">-</span>
                <a-input-number
                  v-model:value="rule.value2"
                  :min="0"
                  :precision="2"
                  size="small"
                  style="flex: 1"
                  placeholder="最大值"
                />
              </div>
              <a-input-number
                v-else
                v-model:value="rule.value1"
                :min="0"
                :precision="2"
                size="small"
                style="width: 100%"
                placeholder="数值"
              />
            </div>
            
            <!-- 展示文字 -->
            <div class="table-cell" style="width: 200px">
              <a-input
                v-model:value="rule.displayText"
                size="small"
                placeholder="请输入"
                :maxlength="20"
              />
            </div>
            
            <!-- 背景颜色 -->
            <div class="table-cell color-picker-cell" style="width: 100px">
              <ColorPicker
                :model-value="rule.bgColor || '#ffffff'"
                :preset-colors="pickerColors"
                :show-alpha="true"
                placement="bottomRight"
                size="small"
                @update:model-value="val => (rule.bgColor = val)"
              />
            </div>
            
            <!-- 字体颜色 -->
            <div class="table-cell color-picker-cell" style="width: 100px">
              <ColorPicker
                :model-value="rule.fontColor || '#000000'"
                :preset-colors="pickerColors"
                :show-alpha="true"
                placement="bottomRight"
                size="small"
                @update:model-value="val => (rule.fontColor = val)"
              />
            </div>
            
            <!-- 动画样式 -->
            <div class="table-cell" style="width: 100px">
              <a-select
                v-model:value="rule.animationStyle"
                style="width: 100%"
                size="small"
              >
                <a-select-option
                  v-for="item in AnimationStyleOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
            
            <!-- 删除按钮 -->
            <div class="table-cell" style="width: 50px; text-align: center">
              <a-button
                type="text"
                size="small"
                danger
                @click="removeRule(index)"
                :disabled="rules.length <= 1"
              >
                <template #icon>
                  <AntIcon name="MinusOutlined" />
                </template>
              </a-button>
            </div>
          </div>
        </div>
        
        <!-- 添加规则按钮 -->
        <div class="table-footer">
          <a-button type="primary" size="small" @click="addRule">
            <template #icon>
              <AntIcon name="PlusOutlined" />
            </template>
            添加规则
          </a-button>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" :loading="loading" @click="handleApply">应用</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { LimitRuleOptions, AnimationStyleOptions } from '@/config/select-options'
import { useStore } from '@/store'
import ColorPicker from '@/components/Common/ColorPicker/index.vue'
import { pickerColors } from '@/theme'

defineOptions({
  name: 'LimitAnimationModal',
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

// 规则列表
const rules = ref([])

// 创建默认规则
const createDefaultRule = () => ({
  ruleType: 'between', // 限制规则：eq, gt, lt, between
  value1: 0, // 数值1
  value2: 0, // 数值2（仅介于时使用）
  displayText: '', // 展示文字
  bgColor: '#ffffff', // 背景颜色
  fontColor: '#000000', // 字体颜色
  animationStyle: 'blink', // 动画样式：blink, bounce, none
})

// 添加规则
const addRule = () => {
  rules.value.push(createDefaultRule())
}

// 删除规则
const removeRule = index => {
  if (rules.value.length > 1) {
    rules.value.splice(index, 1)
  } else {
    message.warning('至少需要保留一条规则')
  }
}

// 重置表单
const resetForm = () => {
  rules.value = [createDefaultRule()]
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
  resetForm()
}

// 应用/保存
const handleApply = async () => {
  // 验证规则
  for (let i = 0; i < rules.value.length; i++) {
    const rule = rules.value[i]
    
    // 验证数值
    if (rule.ruleType === 'between') {
      if (rule.value1 === null || rule.value2 === null || rule.value1 === undefined || rule.value2 === undefined) {
        message.warning(`第 ${i + 1} 条规则的数值不能为空`)
        return
      }
      if (rule.value1 >= rule.value2) {
        message.warning(`第 ${i + 1} 条规则的最小值必须小于最大值`)
        return
      }
    } else {
      if (rule.value1 === null || rule.value1 === undefined) {
        message.warning(`第 ${i + 1} 条规则的数值不能为空`)
        return
      }
    }
    
    // 验证展示文字长度（不超过20个字符）
    if (rule.displayText && rule.displayText.length > 20) {
      message.warning(`第 ${i + 1} 条规则的展示文字不能超过20个字符`)
      return
    }
  }
  
  loading.value = true
  
  try {
    // 数据会通过 emit 传递给父组件，保存到组件配置中
    emit('save', [...rules.value])
    message.success('配置已保存')
    handleClose()
  } catch (error) {
    console.error('保存失败:', error)
    message.error('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

// 从组件配置中加载限值动画数据
const loadLimitAnimation = () => {
  const { schemaStore, storeToRefs } = useStore()
  const { selectedCom } = storeToRefs(schemaStore)
  
  if (selectedCom.value && selectedCom.value.config?.limitAnimation) {
    const la = selectedCom.value.config.limitAnimation
    if (Array.isArray(la) && la.length > 0) {
      rules.value = la.map(rule => ({
        ruleType: rule.ruleType || 'between',
        value1: rule.value1 ?? 0,
        value2: rule.value2 ?? 0,
        displayText: rule.displayText || '',
        bgColor: rule.bgColor || '#ffffff',
        fontColor: rule.fontColor || '#000000',
        animationStyle: rule.animationStyle || 'blink',
      }))
    } else {
      resetForm()
    }
  } else {
    resetForm()
  }
}

// 监听弹窗打开，加载已有配置
watch(
  () => props.modelValue,
  val => {
    if (val) {
      loadLimitAnimation()
    } else {
      resetForm()
    }
  },
)
</script>

<style scoped>
.limit-animation-content {
  padding: 10px 0;
}

.rules-table {
  width: 100%;
}

.table-header {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--s-border-color);
  font-weight: 500;
  color: var(--schema-font-color);
}

.header-cell {
  padding: 0 8px;
  text-align: left;
}

.table-body {
  min-height: 200px;
}

.table-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--s-border-color-2);
}

.table-row:hover {
  background-color: var(--s-color-1);
}

.table-cell {
  padding: 0 8px;
  display: flex;
  align-items: center;
}

.value-range {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.range-separator {
  color: var(--s-text-color-2);
  font-size: 14px;
}

.table-footer {
  padding: 16px 0 8px 0;
  display: flex;
  justify-content: flex-start;
}

:deep(.ant-input-number) {
  width: 100%;
}

:deep(.ant-input) {
  font-size: 12px;
}

.color-picker-cell :deep(.color-picker-wrapper) {
  width: auto;
}
</style>

