<script setup>
import { ref, onMounted } from 'vue'
import { activityAPI, registrationAPI, volunteerAPI } from '../services/api'

// 状态数据
const activities = ref([])
const volunteers = ref([])
const registrations = ref([])

// 加载状态
const loading = ref({
  activities: false,
  volunteers: false,
  registrations: false,
})

// 错误信息
const error = ref({
  activities: null,
  volunteers: null,
  registrations: null,
})

// 加载活动列表
async function loadActivities() {
  loading.value.activities = true
  error.value.activities = null
  try {
    activities.value = await activityAPI.getActivities()
  } catch (err) {
    error.value.activities = err.message
    console.error('加载活动列表失败:', err)
  } finally {
    loading.value.activities = false
  }
}

// 加载志愿者列表
async function loadVolunteers() {
  loading.value.volunteers = true
  error.value.volunteers = null
  try {
    volunteers.value = await volunteerAPI.getVolunteers()
  } catch (err) {
    error.value.volunteers = err.message
    console.error('加载志愿者列表失败:', err)
  } finally {
    loading.value.volunteers = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadActivities()
  loadVolunteers()
})

// 新建活动表单数据
const newActivity = ref({
  title: '',
  date: '',
  location: '',
  capacity: '',
  description: '',
})

// 新建志愿者表单数据
const newVolunteer = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
})

const currentTab = ref('activities')
const showAddActivity = ref(false)
const showAddVolunteer = ref(false)
const showRegistrations = ref(false)
const showEditActivity = ref(false)
const showEditVolunteer = ref(false)
const currentActivity = ref(null)
const currentVolunteer = ref(null)

// 编辑活动表单数据
const editActivity = ref({
  title: '',
  date: '',
  location: '',
  capacity: '',
  description: '',
  status: '',
})

// 编辑志愿者表单数据
const editVolunteer = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
})

// 查看报名列表
async function viewRegistrations(activity) {
  currentActivity.value = activity
  showRegistrations.value = true
  loading.value.registrations = true
  error.value.registrations = null
  try {
    registrations.value = await activityAPI.getRegistrations(activity.id)
  } catch (err) {
    error.value.registrations = err.message
    console.error('获取报名列表失败:', err)
  } finally {
    loading.value.registrations = false
  }
}

// 更新报名状态
async function updateRegistrationStatus(registration, status) {
  try {
    await registrationAPI.updateStatus(registration.id, { status })
    registration.status = status
  } catch (err) {
    console.error('更新报名状态失败:', err)
  }
}

// 打开编辑活动对话框
function openEditActivity(activity) {
  currentActivity.value = activity
  editActivity.value = {
    title: activity.title,
    date: activity.date,
    location: activity.location,
    capacity: activity.capacity,
    description: activity.description,
    status: activity.status,
  }
  showEditActivity.value = true
}

// 保存活动编辑
async function saveActivityEdit() {
  if (currentActivity.value) {
    try {
      await activityAPI.updateActivity(currentActivity.value.id, editActivity.value)
      const activity = activities.value.find((a) => a.id === currentActivity.value.id)
      if (activity) {
        Object.assign(activity, editActivity.value)
      }
      showEditActivity.value = false
    } catch (err) {
      console.error('更新活动失败:', err)
    }
  }
}

// 打开编辑志愿者对话框
function openEditVolunteer(volunteer) {
  currentVolunteer.value = volunteer
  editVolunteer.value = {
    name: volunteer.name,
    phone: volunteer.phone,
    email: volunteer.email,
    address: volunteer.address,
  }
  showEditVolunteer.value = true
}

// 保存志愿者编辑
async function saveVolunteerEdit() {
  if (currentVolunteer.value) {
    try {
      await volunteerAPI.updateVolunteer(currentVolunteer.value.id, editVolunteer.value)
      const volunteer = volunteers.value.find((v) => v.id === currentVolunteer.value.id)
      if (volunteer) {
        Object.assign(volunteer, editVolunteer.value)
      }
      showEditVolunteer.value = false
    } catch (err) {
      console.error('更新志愿者失败:', err)
    }
  }
}

async function addActivity() {
  try {
    const activity = await activityAPI.createActivity({
      ...newActivity.value,
      status: '报名中',
      registered: 0,
    })
    activities.value.push(activity)
    showAddActivity.value = false
    newActivity.value = {
      title: '',
      date: '',
      location: '',
      capacity: '',
      description: '',
    }
  } catch (err) {
    console.error('创建活动失败:', err)
  }
}

async function addVolunteer() {
  try {
    const volunteer = await volunteerAPI.createVolunteer({
      ...newVolunteer.value,
      hours: 0,
      activities: 0,
      status: '活跃',
    })
    volunteers.value.push(volunteer)
    showAddVolunteer.value = false
    newVolunteer.value = {
      name: '',
      phone: '',
      email: '',
      address: '',
    }
  } catch (err) {
    console.error('创建志愿者失败:', err)
  }
}

function switchTab(tab) {
  currentTab.value = tab
}

async function deleteActivity(id) {
  try {
    await activityAPI.deleteActivity(id)
    activities.value = activities.value.filter((activity) => activity.id !== id)
  } catch (err) {
    console.error('删除活动失败:', err)
  }
}

async function deleteVolunteer(id) {
  try {
    await volunteerAPI.deleteVolunteer(id)
    volunteers.value = volunteers.value.filter((volunteer) => volunteer.id !== id)
  } catch (err) {
    console.error('删除志愿者失败:', err)
  }
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <main class="pt-16">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- 选项卡 -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div class="flex space-x-4 border-b border-gray-200">
            <button
              :class="[
                'py-4 px-6 font-medium focus:outline-none',
                currentTab === 'activities'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-primary',
              ]"
              @click="switchTab('activities')"
            >
              活动管理
            </button>
            <button
              :class="[
                'py-4 px-6 font-medium focus:outline-none',
                currentTab === 'volunteers'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-primary',
              ]"
              @click="switchTab('volunteers')"
            >
              志愿者管理
            </button>
          </div>
        </div>

        <!-- 活动管理 -->
        <div v-if="currentTab === 'activities'" class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between mb-6">
            <h2 class="text-xl font-semibold">活动列表</h2>
            <button
              class="bg-primary text-white px-4 py-2 !rounded-button hover:bg-opacity-90"
              @click="showAddActivity = true"
            >
              <i class="fas fa-plus mr-2"></i>新建活动
            </button>
          </div>

          <div v-if="loading.activities" class="py-12 text-center">
            <i class="fas fa-spinner fa-spin text-primary text-2xl"></i>
            <p class="mt-2 text-gray-600">加载中...</p>
          </div>

          <div v-else-if="error.activities" class="py-12 text-center">
            <i class="fas fa-exclamation-circle text-red-500 text-2xl"></i>
            <p class="mt-2 text-red-500">{{ error.activities }}</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    活动名称
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    日期
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    地点
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    状态
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    报名情况
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="activity in activities" :key="activity.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ activity.title }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ activity.date }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ activity.location }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-2 py-1 text-xs rounded-full',
                        activity.status === '报名中'
                          ? 'bg-blue-100 text-primary'
                          : 'bg-green-100 text-green-600',
                      ]"
                    >
                      {{ activity.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ activity.registered }}/{{ activity.capacity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      class="text-blue-600 hover:text-opacity-75 mr-3"
                      @click="viewRegistrations(activity)"
                      title="查看报名"
                    >
                      <i class="fas fa-user-friends"></i>
                    </button>
                    <button
                      class="text-primary hover:text-opacity-75 mr-3"
                      title="编辑活动"
                      @click="openEditActivity(activity)"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="text-red-500 hover:text-opacity-75"
                      @click="deleteActivity(activity.id)"
                      title="删除活动"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 志愿者管理 -->
        <div v-if="currentTab === 'volunteers'" class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between mb-6">
            <h2 class="text-xl font-semibold">志愿者列表</h2>
            <button
              class="bg-primary text-white px-4 py-2 !rounded-button hover:bg-opacity-90"
              @click="showAddVolunteer = true"
            >
              <i class="fas fa-plus mr-2"></i>添加志愿者
            </button>
          </div>

          <div v-if="loading.volunteers" class="py-12 text-center">
            <i class="fas fa-spinner fa-spin text-primary text-2xl"></i>
            <p class="mt-2 text-gray-600">加载中...</p>
          </div>

          <div v-else-if="error.volunteers" class="py-12 text-center">
            <i class="fas fa-exclamation-circle text-red-500 text-2xl"></i>
            <p class="mt-2 text-red-500">{{ error.volunteers }}</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    姓名
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    联系电话
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    服务时长
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    参与活动
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    状态
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="volunteer in volunteers" :key="volunteer.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ volunteer.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ volunteer.phone }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ volunteer.hours }} 小时</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ volunteer.activities }} 次</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                      {{ volunteer.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      class="text-primary hover:text-opacity-75 mr-3"
                      @click="openEditVolunteer(volunteer)"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="text-red-500 hover:text-opacity-75"
                      @click="deleteVolunteer(volunteer.id)"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- 新建活动对话框 -->
    <div
      v-if="showAddActivity"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">新建活动</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="showAddActivity = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">活动名称</label>
            <input
              v-model="newActivity.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">活动日期</label>
            <input
              v-model="newActivity.date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">活动地点</label>
            <input
              v-model="newActivity.location"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">人数上限</label>
            <input
              v-model="newActivity.capacity"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">活动描述</label>
            <textarea
              v-model="newActivity.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            @click="showAddActivity = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            @click="addActivity"
          >
            确认
          </button>
        </div>
      </div>
    </div>

    <!-- 新建志愿者对话框 -->
    <div
      v-if="showAddVolunteer"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">添加志愿者</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="showAddVolunteer = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input
              v-model="newVolunteer.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
            <input
              v-model="newVolunteer.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
            <input
              v-model="newVolunteer.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系地址</label>
            <input
              v-model="newVolunteer.address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            @click="showAddVolunteer = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            @click="addVolunteer"
          >
            确认
          </button>
        </div>
      </div>
    </div>

    <!-- 报名列表对话框 -->
    <div
      v-if="showRegistrations"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-6xl p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">报名列表 - {{ currentActivity?.title }}</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="showRegistrations = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="loading.registrations" class="py-12 text-center">
          <i class="fas fa-spinner fa-spin text-primary text-2xl"></i>
          <p class="mt-2 text-gray-600">加载中...</p>
        </div>

        <div v-else-if="error.registrations" class="py-12 text-center">
          <i class="fas fa-exclamation-circle text-red-500 text-2xl"></i>
          <p class="mt-2 text-red-500">{{ error.registrations }}</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  报名时间
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  姓名
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  联系电话
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  身份证号
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  紧急联系人
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  状态
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="registration in registrations.filter(
                  (r) => r.activityId === currentActivity?.id,
                )"
                :key="registration.id"
              >
                <td class="px-6 py-4 whitespace-nowrap">{{ registration.createTime }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ registration.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ registration.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ registration.idCard }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ registration.emergencyContact }}
                  <br />
                  <span class="text-gray-500 text-sm">{{ registration.emergencyPhone }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      registration.status === '待审核'
                        ? 'bg-yellow-100 text-yellow-600'
                        : registration.status === '已通过'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600',
                    ]"
                  >
                    {{ registration.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="registration.status === '待审核'" class="space-x-2">
                    <button
                      class="text-green-600 hover:text-opacity-75"
                      @click="updateRegistrationStatus(registration, '已通过')"
                      title="通过"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                    <button
                      class="text-red-500 hover:text-opacity-75"
                      @click="updateRegistrationStatus(registration, '已拒绝')"
                      title="拒绝"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <span v-else class="text-gray-400">--</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            @click="showRegistrations = false"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑活动对话框 -->
    <div
      v-if="showEditActivity"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">编辑活动</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="showEditActivity = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">活动名称</label>
            <input
              v-model="editActivity.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">活动日期</label>
            <input
              v-model="editActivity.date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">活动地点</label>
            <input
              v-model="editActivity.location"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">人数上限</label>
            <input
              v-model="editActivity.capacity"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">活动状态</label>
            <select
              v-model="editActivity.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="报名中">报名中</option>
              <option value="进行中">进行中</option>
              <option value="已结束">已结束</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">活动描述</label>
            <textarea
              v-model="editActivity.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            @click="showEditActivity = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            @click="saveActivityEdit"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑志愿者对话框 -->
    <div
      v-if="showEditVolunteer"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">编辑志愿者</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="showEditVolunteer = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input
              v-model="editVolunteer.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
            <input
              v-model="editVolunteer.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
            <input
              v-model="editVolunteer.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系地址</label>
            <input
              v-model="editVolunteer.address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            @click="showEditVolunteer = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            @click="saveVolunteerEdit"
          >
            保存
          </button>
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
.\!rounded-button {
  border-radius: 4px !important;
}
</style>
