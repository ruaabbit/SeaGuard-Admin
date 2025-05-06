<script setup>
import { ref, onMounted } from 'vue'
import { activityAPI } from '@/services/api'

const props = defineProps({
  activity: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const form = ref({
  title: '',
  description: '',
  date: '',
  location: '',
  capacity: 20,
  status: 'pending'
})

const loading = ref(false)

// 初始化表单数据
onMounted(() => {
  if (props.activity) {
    form.value = {
      ...props.activity
    }
  }
})

// 验证表单
const validateForm = () => {
  if (!form.value.title) return '请输入活动名称'
  if (!form.value.description) return '请输入活动描述'
  if (!form.value.date) return '请选择活动日期'
  if (!form.value.location) return '请输入活动地点'
  if (!form.value.capacity || form.value.capacity < 1) return '请输入有效的活动人数'
  return ''
}

// 提交表单
const handleSubmit = async () => {
  const error = validateForm()
  if (error) {
    alert(error)
    return
  }

  loading.value = true

  try {
    if (props.activity) {
      await activityAPI.updateActivity(props.activity.id, form.value)
    } else {
      await activityAPI.createActivity(form.value)
    }
    emit('success')
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <!-- 标题 -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ activity ? '编辑活动' : '创建活动' }}
        </h2>
        <button class="text-gray-400 hover:text-gray-500" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- 表单 -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            活动名称 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            活动描述 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            活动日期 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.date"
            type="date"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            活动地点 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.location"
            type="text"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            活动人数 <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.capacity"
            type="number"
            min="1"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            活动状态
          </label>
          <select
            v-model="form.status"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="pending">报名中</option>
            <option value="ongoing">进行中</option>
            <option value="completed">已结束</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>

        <!-- 按钮 -->
        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            @click="$emit('close')"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-md text-white bg-primary hover:bg-opacity-90"
          >
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              处理中...
            </span>
            <span v-else>
              {{ activity ? '保存' : '创建' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.text-primary {
  color: #0077b6;
}
.bg-primary {
  background-color: #0077b6;
}
.ring-primary {
  --tw-ring-color: #0077b6;
}
.border-primary {
  border-color: #0077b6;
}
</style>
