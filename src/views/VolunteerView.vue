<script setup>
import { ref, onMounted } from 'vue'
import { activityAPI, volunteerAPI } from '@/services/api'

const activities = ref([])
const loading = ref(false)
const error = ref('')
const showEditForm = ref(false)

// 志愿者信息表单
const volunteerForm = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
})

// 编辑志愿者信息
const handleEditInfo = () => {
  showEditForm.value = true
  formError.value = ''
}

// 表单验证
const validateForm = () => {
  if (!volunteerForm.value.name) return '请输入姓名'
  if (!volunteerForm.value.phone) return '请输入手机号'
  if (!volunteerForm.value.email) return '请输入邮箱'
  if (!volunteerForm.value.address) return '请输入地址'

  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(volunteerForm.value.phone)) {
    return '请输入有效的手机号'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(volunteerForm.value.email)) {
    return '请输入有效的邮箱地址'
  }

  return ''
}

const formLoading = ref(false)
const formError = ref('')

// 保存志愿者信息
const saveVolunteerInfo = async () => {
  const validationError = validateForm()
  if (validationError) {
    formError.value = validationError
    return
  }

  formLoading.value = true
  formError.value = ''

  try {
    await volunteerAPI.updateMyInfo(volunteerForm.value)
    showEditForm.value = false
    // 重新加载志愿者信息以确保显示最新数据
    try {
      const volunteerInfo = await volunteerAPI.getMyInfo()
      volunteerForm.value = {
        name: volunteerInfo.name || '',
        phone: volunteerInfo.phone || '',
        email: volunteerInfo.email || '',
        address: volunteerInfo.address || '',
      }
    } catch (err) {
      console.error('更新后重新加载志愿者信息失败:', err)
    }
  } catch (err) {
    formError.value = err.message
  } finally {
    formLoading.value = false
  }
}

// 加载数据
const loadData = async () => {
  loading.value = true
  error.value = ''

  try {
    // 获取活动列表并继续加载，即使列表加载失败
    try {
      const activitiesRes = await activityAPI.getActivities()
      activities.value = activitiesRes?.activities || []
    } catch (err) {
      console.error('加载活动列表失败:', err)
      activities.value = []
    }

    // 获取当前登录用户的个人信息
    try {
      const volunteerInfo = await volunteerAPI.getMyInfo()
      volunteerForm.value = {
        name: volunteerInfo.name || '',
        phone: volunteerInfo.phone || '',
        email: volunteerInfo.email || '',
        address: volunteerInfo.address || '',
      }
    } catch (err) {
      console.error('加载志愿者信息失败:', err)
      error.value = '加载个人信息失败，请检查网络连接或重新登录'
    }
  } finally {
    loading.value = false
  }
}

// 活动报名
const handleRegister = async (activity) => {
  try {
    // TODO: Add registration endpoint in API
    console.log('Register for activity:', activity.id)
  } catch (err) {
    error.value = err.message
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">志愿者中心</h1>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="text-center py-12 text-red-500">
        {{ error }}
      </div>

      <div v-else>
        <!-- 个人信息卡片 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden max-w-3xl mx-auto mb-8">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">个人信息</h2>
          </div>
          <div class="px-6 py-4">
            <template v-if="!showEditForm">
              <div class="space-y-4">
                <p>
                  <span class="font-medium">姓名：</span>
                  {{ volunteerForm.name }}
                </p>
                <p>
                  <span class="font-medium">电话：</span>
                  {{ volunteerForm.phone }}
                </p>
                <p>
                  <span class="font-medium">邮箱：</span>
                  {{ volunteerForm.email }}
                </p>
                <p>
                  <span class="font-medium">地址：</span>
                  {{ volunteerForm.address }}
                </p>
              </div>
              <div class="mt-4">
                <button
                  @click="handleEditInfo"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90"
                >
                  编辑信息
                </button>
              </div>
            </template>
            <template v-else>
              <form @submit.prevent="saveVolunteerInfo" class="space-y-4">
                <!-- 错误提示 -->
                <div v-if="formError" class="rounded-md bg-red-50 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <i class="fas fa-exclamation-circle text-red-400"></i>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">{{ formError }}</h3>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    姓名 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="volunteerForm.name"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    电话 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="volunteerForm.phone"
                    type="tel"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    邮箱 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="volunteerForm.email"
                    type="email"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    地址 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="volunteerForm.address"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div class="flex space-x-4">
                  <button
                    type="submit"
                    :disabled="formLoading"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90"
                  >
                    <i v-if="formLoading" class="fas fa-spinner fa-spin mr-2"></i>
                    {{ formLoading ? '保存中...' : '保存' }}
                  </button>
                  <button
                    type="button"
                    @click="showEditForm = false"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    取消
                  </button>
                </div>
              </form>
            </template>
          </div>
        </div>

        <!-- 可报名活动 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden max-w-3xl mx-auto">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">可报名活动</h2>
          </div>
          <div class="px-6 py-4">
            <div v-if="activities.length === 0" class="text-center py-8 text-gray-500">
              暂无可报名活动
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="activity in activities"
                :key="activity.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <h3 class="font-medium">{{ activity.title }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ activity.description }}</p>
                <div class="mt-2 space-y-1">
                  <p class="text-sm text-gray-500">
                    <i class="fas fa-calendar-alt mr-2"></i>
                    {{ activity.date }}
                  </p>
                  <p class="text-sm text-gray-500">
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    {{ activity.location }}
                  </p>
                  <p class="text-sm text-gray-500">
                    <i class="fas fa-user-friends mr-2"></i>
                    已报名：{{ activity.registered }}/{{ activity.capacity }}
                  </p>
                </div>
                <div class="mt-4">
                  <button
                    v-if="activity.registered < activity.capacity"
                    @click="handleRegister(activity)"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90"
                  >
                    立即报名
                  </button>
                  <button
                    v-else
                    disabled
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
                  >
                    名额已满
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
</style>
