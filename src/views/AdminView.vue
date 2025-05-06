<script setup>
import { ref, onMounted } from 'vue'
import { activityAPI, registrationAPI } from '@/services/api'
import ActivityList from '@/components/ActivityList.vue'
import VolunteerList from '@/components/VolunteerList.vue'
import ActivityFormDialog from '@/components/ActivityFormDialog.vue'
import VolunteerFormDialog from '@/components/VolunteerFormDialog.vue'
import RegistrationListDialog from '@/components/RegistrationListDialog.vue'

// 当前选中的标签
const currentTab = ref('activities')

// 对话框状态
const showActivityForm = ref(false)
const showVolunteerForm = ref(false)
const showRegistrations = ref(false)

// 报名数据
const registrations = ref([])
const registrationsLoading = ref(false)
const registrationsError = ref('')

// 选中的项目
const selectedActivity = ref(null)
const selectedVolunteer = ref(null)

// 打开活动表单
const openActivityForm = (activity = null) => {
  selectedActivity.value = activity
  showActivityForm.value = true
}

// 打开志愿者表单
const openVolunteerForm = (volunteer = null) => {
  selectedVolunteer.value = volunteer
  showVolunteerForm.value = true
}

// 加载活动报名列表
const loadRegistrations = async (activityId) => {
  registrationsLoading.value = true
  registrationsError.value = ''

  try {
    const response = await activityAPI.getRegistrations(activityId)
    registrations.value = response.registrations || []
  } catch (err) {
    registrationsError.value = err.message
  } finally {
    registrationsLoading.value = false
  }
}

// 打开报名列表
const openRegistrations = async (activity) => {
  selectedActivity.value = activity
  showRegistrations.value = true
  await loadRegistrations(activity.id)
}

// 处理报名状态更新
const handleUpdateStatus = async ({ registration, status }) => {
  try {
    await registrationAPI.updateStatus(registration.id, status)
    await loadRegistrations(selectedActivity.value.id) // 重新加载报名列表
  } catch (err) {
    alert(err.message)
  }
}

// 统计数据
const stats = ref({
  totalActivities: 0,
  totalVolunteers: 0,
  totalHours: 0,
  pendingRegistrations: 0
})

// 加载统计数据
const loadStats = async () => {
  // TODO: 从API获取统计数据
  stats.value = {
    totalActivities: 25,
    totalVolunteers: 150,
    totalHours: 1200,
    pendingRegistrations: 8
  }
}

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">管理后台</h1>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-calendar text-2xl text-primary"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">总活动数</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.totalActivities }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-users text-2xl text-primary"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">志愿者总数</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.totalVolunteers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-clock text-2xl text-primary"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">总服务时长</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.totalHours }}小时</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-clipboard-list text-2xl text-primary"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">待审核报名</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.pendingRegistrations }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <div class="bg-white shadow rounded-lg">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              @click="currentTab = 'activities'"
              class="px-6 py-4 text-sm font-medium border-b-2"
              :class="[
                currentTab === 'activities'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              活动管理
            </button>
            <button
              @click="currentTab = 'volunteers'"
              class="px-6 py-4 text-sm font-medium border-b-2 ml-8"
              :class="[
                currentTab === 'volunteers'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              志愿者管理
            </button>
          </nav>
        </div>

        <div class="p-4">
          <!-- 活动管理 -->
          <div v-if="currentTab === 'activities'">
            <div class="mb-4 flex justify-end">
              <button
                @click="openActivityForm()"
                class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
              >
                <i class="fas fa-plus mr-2"></i>
                新建活动
              </button>
            </div>
            <ActivityList
              :allow-manage="true"
              @edit="openActivityForm"
              @view-registrations="openRegistrations"
            />
          </div>

          <!-- 志愿者管理 -->
          <div v-if="currentTab === 'volunteers'">
            <div class="mb-4 flex justify-end">
              <button
                @click="openVolunteerForm()"
                class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
              >
                <i class="fas fa-plus mr-2"></i>
                添加志愿者
              </button>
            </div>
            <VolunteerList
              :allow-manage="true"
              @edit="openVolunteerForm"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 活动表单对话框 -->
    <ActivityFormDialog
      v-if="showActivityForm"
      :activity="selectedActivity"
      @close="showActivityForm = false"
      @success="showActivityForm = false"
    />

    <!-- 志愿者表单对话框 -->
    <VolunteerFormDialog
      v-if="showVolunteerForm"
      :volunteer="selectedVolunteer"
      @close="showVolunteerForm = false"
      @success="showVolunteerForm = false"
    />

    <!-- 报名列表对话框 -->
    <RegistrationListDialog
      v-if="showRegistrations"
      :show="showRegistrations"
      :activity="selectedActivity"
      :registrations="registrations"
      :loading="registrationsLoading"
      :error="registrationsError"
      @close="showRegistrations = false"
      @update-status="handleUpdateStatus"
    />
  </div>
</template>

<style scoped>
.text-primary {
  color: #0077b6;
}
.bg-primary {
  background-color: #0077b6;
}
.border-primary {
  border-color: #0077b6;
}
</style>
