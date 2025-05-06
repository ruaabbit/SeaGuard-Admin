<script setup>
import { ref, onMounted } from 'vue'
import { activityAPI } from '@/services/api'

const activities = ref([])
const loading = ref(false)
const error = ref('')

// 加载数据
const loadData = async () => {
  loading.value = true
  error.value = ''

  try {
    const activitiesRes = await activityAPI.getActivities()
    activities.value = activitiesRes.activities || []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
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
                    @click="$router.push('/')"
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
