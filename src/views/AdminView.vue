<script setup>
import { ref } from 'vue'

const activities = ref([
  {
    id: 1,
    title: '深圳湾海滩清理行动',
    date: '2024-02-20',
    status: '报名中',
    location: '深圳湾',
    capacity: 20,
    registered: 15,
  },
  {
    id: 2,
    title: '珠海情侣路海岸清洁',
    date: '2024-02-18',
    status: '进行中',
    location: '珠海',
    capacity: 25,
    registered: 25,
  },
  {
    id: 3,
    title: '大鹏新区海洋保护行动',
    date: '2024-02-25',
    status: '报名中',
    location: '大鹏新区',
    capacity: 15,
    registered: 8,
  },
])

const volunteers = ref([
  {
    id: 1,
    name: '张志远',
    hours: 120,
    activities: 15,
    phone: '13800138000',
    status: '活跃',
  },
  {
    id: 2,
    name: '林美琪',
    hours: 98,
    activities: 12,
    phone: '13800138001',
    status: '活跃',
  },
  {
    id: 3,
    name: '王浩然',
    hours: 86,
    activities: 10,
    phone: '13800138002',
    status: '活跃',
  },
  {
    id: 4,
    name: '李雨欣',
    hours: 75,
    activities: 8,
    phone: '13800138003',
    status: '活跃',
  },
])

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

function addActivity() {
  activities.value.push({
    id: activities.value.length + 1,
    ...newActivity.value,
    status: '报名中',
    registered: 0,
  })
  showAddActivity.value = false
  newActivity.value = {
    title: '',
    date: '',
    location: '',
    capacity: '',
    description: '',
  }
}

function addVolunteer() {
  volunteers.value.push({
    id: volunteers.value.length + 1,
    ...newVolunteer.value,
    hours: 0,
    activities: 0,
    status: '活跃',
  })
  showAddVolunteer.value = false
  newVolunteer.value = {
    name: '',
    phone: '',
    email: '',
    address: '',
  }
}

function switchTab(tab) {
  currentTab.value = tab
}

function deleteActivity(id) {
  activities.value = activities.value.filter((activity) => activity.id !== id)
}

function deleteVolunteer(id) {
  volunteers.value = volunteers.value.filter((volunteer) => volunteer.id !== id)
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

          <div class="overflow-x-auto">
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
                    <button class="text-primary hover:text-opacity-75 mr-3">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="text-red-500 hover:text-opacity-75"
                      @click="deleteActivity(activity.id)"
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

          <div class="overflow-x-auto">
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
                    <button class="text-primary hover:text-opacity-75 mr-3">
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
