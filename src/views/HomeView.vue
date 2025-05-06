<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { activityAPI } from '@/services/api'

const router = useRouter()

// 用户信息
const userRole = computed(() => localStorage.getItem('userRole'))
const isVolunteer = computed(() => userRole.value === 'volunteer')

// 页面滚动
const activitiesSection = ref(null)

function scrollToActivities() {
  activitiesSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// 活动数据
const activities = ref([])
const loading = ref(false)
const error = ref('')

// 加载活动列表
const loadActivities = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await activityAPI.getActivities()
    activities.value = response.activities
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 报名表单状态
const showSignupForm = ref(false)
const currentActivity = ref(null)

// 打开报名表单
const openSignupForm = (activity) => {
  if (!isVolunteer.value) {
    // 如果不是志愿者，跳转到登录页面
    router.push({
      path: '/login',
      query: { redirect: router.currentRoute.value.fullPath }
    })
    return
  }
  currentActivity.value = activity
  showSignupForm.value = true
}

// 提交报名
const handleSignup = () => {
  alert('抱歉，报名功能暂时不可用')
  showSignupForm.value = false
}

import * as echarts from 'echarts'

const chart1 = ref(null)
const chart2 = ref(null)
let chart1Instance = null
let chart2Instance = null

const option1 = {
  animation: false,
  tooltip: { trigger: 'axis' },
  legend: { data: ['塑料垃圾', '渔网废弃物', '其他垃圾'] },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: { type: 'value', name: '清理重量(kg)' },
  series: [
    { name: '塑料垃圾', type: 'bar', data: [320, 280, 450, 380, 520, 480] },
    { name: '渔网废弃物', type: 'bar', data: [150, 180, 220, 280, 260, 300] },
    { name: '其他垃圾', type: 'bar', data: [98, 120, 180, 150, 180, 200] },
  ],
}

const option2 = {
  animation: false,
  tooltip: { trigger: 'axis' },
  legend: { data: ['活动场次', '参与人次'] },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: [
    { type: 'value', name: '场次', position: 'left' },
    { type: 'value', name: '人次', position: 'right' },
  ],
  series: [
    { name: '活动场次', type: 'bar', data: [8, 10, 12, 15, 18, 20] },
    { name: '参与人次', type: 'line', yAxisIndex: 1, data: [180, 220, 280, 350, 420, 480] },
  ],
}

function resizeCharts() {
  chart1Instance && chart1Instance.resize()
  chart2Instance && chart2Instance.resize()
}

onMounted(() => {
  loadActivities()
  chart1Instance = echarts.init(chart1.value)
  chart2Instance = echarts.init(chart2.value)
  chart1Instance.setOption(option1)
  chart2Instance.setOption(option2)
  window.addEventListener('resize', resizeCharts)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  chart1Instance && chart1Instance.dispose()
  chart2Instance && chart2Instance.dispose()
})
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <main class="pt-16">
      <!-- Banner -->
      <div class="relative h-[600px] map-container">
        <div class="absolute inset-0 bg-black bg-opacity-50">
          <div class="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div class="w-1/2">
              <h1 class="text-5xl font-bold text-white mb-6">守护海洋，从你我做起</h1>
              <p class="text-xl text-gray-200 mb-8">
                加入我们的志愿者团队，用实际行动保护海洋生态环境。通过先进的AI技术和卫星监测，精准定位海洋垃圾，共同创造更美好的海洋未来。
              </p>
              <button
                v-if="!isVolunteer"
                class="bg-primary text-white px-8 py-3 text-lg font-medium !rounded-button hover:bg-opacity-90"
                @click="router.push('/register')"
              >
                成为志愿者
              </button>
              <button
                v-else
                class="bg-primary text-white px-8 py-3 text-lg font-medium !rounded-button hover:bg-opacity-90"
                @click="scrollToActivities"
              >
                浏览活动
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动 -->
      <section ref="activitiesSection" class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">近期活动</h2>
          <div v-if="loading" class="text-center py-8">
            <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
          </div>
          <div v-else-if="error" class="text-center py-8 text-red-500">
            {{ error }}
          </div>
          <div v-else class="grid grid-cols-3 gap-8">
            <div
              v-for="activity in activities"
              :key="activity.id"
              class="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <img class="w-full h-48 object-cover" :src="activity.image" :alt="activity.title" />
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <span
                    :class="[
                      'px-3 py-1 text-sm rounded-full',
                      activity.status === 'pending'
                        ? 'bg-blue-100 text-primary'
                        : 'bg-green-100 text-green-600',
                    ]"
                  >
                    {{ activity.status === 'pending' ? '报名中' : '进行中' }}
                  </span>
                  <span class="ml-3 text-gray-500 text-sm">{{ activity.date }}</span>
                </div>
                <h3 class="text-xl font-semibold mb-2">{{ activity.title }}</h3>
                <p class="text-gray-600 mb-4">{{ activity.description }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <i class="fas fa-user-friends text-gray-400 mr-2"></i>
                    <span class="text-gray-600"
                      >已报名：{{ activity.registered }}/{{ activity.capacity }}</span
                    >
                  </div>
                  <button
                    v-if="activity.registered < activity.capacity"
                    class="bg-primary text-white px-6 py-2 !rounded-button hover:bg-opacity-90 whitespace-nowrap"
                    @click="openSignupForm(activity)"
                  >
                    立即报名
                  </button>
                  <button
                    v-else
                    class="bg-gray-300 text-white px-6 py-2 !rounded-button cursor-not-allowed whitespace-nowrap"
                  >
                    名额已满
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 数据统计 -->
      <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">数据统计</h2>
          <div class="grid grid-cols-2 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-xl font-semibold mb-4">垃圾清理统计</h3>
              <div ref="chart1" class="h-80"></div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-xl font-semibold mb-4">志愿者参与情况</h3>
              <div ref="chart2" class="h-80"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 报名功能不可用提示对话框 -->
      <div
        v-if="showSignupForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-sm">
          <div class="text-center">
            <i class="fas fa-exclamation-circle text-yellow-500 text-4xl mb-4"></i>
            <h3 class="text-lg font-semibold mb-2">活动报名暂不可用</h3>
            <p class="text-gray-600 mb-4">报名功能正在维护中，请稍后再试。</p>
            <button
              class="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
              @click="showSignupForm = false"
            >
              确定
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="bg-gray-900 text-gray-300 py-12">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-4 gap-8">
            <div>
              <h3 class="font-['Pacifico'] text-2xl text-white mb-4">OUC AI GROUP</h3>
              <p class="text-gray-400">用科技守护海洋，让世界更美好</p>
            </div>
            <div>
              <h4 class="text-white font-semibold mb-4">关于我们</h4>
              <ul class="space-y-2">
                <li><a href="#" class="hover:text-white">组织简介</a></li>
                <li><a href="#" class="hover:text-white">使命愿景</a></li>
                <li><a href="#" class="hover:text-white">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-white font-semibold mb-4">志愿服务</h4>
              <ul class="space-y-2">
                <li><a href="#" class="hover:text-white">活动日历</a></li>
                <li><a href="#" class="hover:text-white">报名指南</a></li>
                <li><a href="#" class="hover:text-white">常见问题</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-white font-semibold mb-4">关注我们</h4>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-400 hover:text-white">
                  <i class="fab fa-weixin text-2xl"></i>
                </a>
                <a href="#" class="text-gray-400 hover:text-white">
                  <i class="fab fa-weibo text-2xl"></i>
                </a>
                <a href="#" class="text-gray-400 hover:text-white">
                  <i class="fab fa-qq text-2xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 海洋卫士. 保留所有权利</p>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<style>
.map-container {
  background-image: url('/map_placeholder.jpg');
  background-position: center;
  background-size: cover;
}
.text-primary {
  color: #0077b6;
}
.text-secondary {
  color: #48cae4;
}
.bg-primary {
  background-color: #0077b6;
}
.bg-secondary {
  background-color: #48cae4;
}
.border-secondary {
  border-color: #48cae4;
}
.\!rounded-button {
  border-radius: 4px !important;
}
</style>
