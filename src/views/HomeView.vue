<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 页面滚动
const activitiesSection = ref(null)

function scrollToActivities() {
  activitiesSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// 活动数据
const activities = ref([
  {
    id: 1,
    title: '深圳湾海滩清理行动',
    date: '2024-02-20',
    status: '报名中',
    location: '深圳湾',
    capacity: 20,
    registered: 15,
    image: 'https://ai-public.mastergo.com/ai/img_res/00f4b1cfe474a89e3c6f7e517b1ed3c1.jpg',
    description: '携手清理深圳湾海滩垃圾，保护海洋生态环境。需要 20 名志愿者，欢迎具备基本体能的志愿者参与。'
  },
  {
    id: 2,
    title: '珠海情侣路海岸清洁',
    date: '2024-02-18',
    status: '进行中',
    location: '珠海',
    capacity: 25,
    registered: 25,
    image: 'https://ai-public.mastergo.com/ai/img_res/dee0d3b6c55a24b504c01969c7a9526a.jpg',
    description: '对珠海情侣路沿线进行海洋垃圾清理，需要具备防晒意识，建议携带防晒装备。'
  },
  {
    id: 3,
    title: '大鹏新区海洋保护行动',
    date: '2024-02-25',
    status: '报名中',
    location: '大鹏新区',
    capacity: 15,
    registered: 8,
    image: 'https://ai-public.mastergo.com/ai/img_res/db05f226a901365b5e278586b1a9b0fe.jpg',
    description: '需要潜水证书持有者优先，将进行水下垃圾清理工作。提供专业装备和安全保障。'
  }
])

// 报名表单数据
const showSignupForm = ref(false)
const currentActivity = ref(null)
const signupForm = ref({
  name: '',
  phone: '',
  email: '',
  idCard: '',
  emergencyContact: '',
  emergencyPhone: ''
})

// 表单验证规则
const validateForm = () => {
  if (!signupForm.value.name) return '请填写姓名'
  if (!signupForm.value.phone) return '请填写手机号码'
  if (!signupForm.value.idCard) return '请填写身份证号'
  if (!signupForm.value.emergencyContact) return '请填写紧急联系人'
  if (!signupForm.value.emergencyPhone) return '请填写紧急联系人电话'

  // 手机号码验证
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(signupForm.value.phone)) return '请输入正确的手机号码'
  if (!phoneReg.test(signupForm.value.emergencyPhone)) return '请输入正确的紧急联系人电话'

  // 身份证号验证
  const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!idCardReg.test(signupForm.value.idCard)) return '请输入正确的身份证号'

  return ''
}

// 打开报名表单
const openSignupForm = (activity) => {
  currentActivity.value = activity
  showSignupForm.value = true
}

// 提交报名
const handleSignup = () => {
  const error = validateForm()
  if (error) {
    alert(error)
    return
  }

  // TODO: 这里应该调用API提交报名信息
  alert('报名成功！')
  showSignupForm.value = false
  signupForm.value = {
    name: '',
    phone: '',
    email: '',
    idCard: '',
    emergencyContact: '',
    emergencyPhone: ''
  }
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
                class="bg-primary text-white px-8 py-3 text-lg font-medium !rounded-button hover:bg-opacity-90"
                @click="scrollToActivities"
              >
                立即加入
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动 -->
      <section ref="activitiesSection" class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">近期活动</h2>
          <div class="grid grid-cols-3 gap-8">
            <div v-for="activity in activities" :key="activity.id" class="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                class="w-full h-48 object-cover"
                :src="activity.image"
                :alt="activity.title"
              />
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <span
                    :class="[
                      'px-3 py-1 text-sm rounded-full',
                      activity.status === '报名中'
                        ? 'bg-blue-100 text-primary'
                        : 'bg-green-100 text-green-600'
                    ]"
                  >
                    {{ activity.status }}
                  </span>
                  <span class="ml-3 text-gray-500 text-sm">{{ activity.date }}</span>
                </div>
                <h3 class="text-xl font-semibold mb-2">{{ activity.title }}</h3>
                <p class="text-gray-600 mb-4">{{ activity.description }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <i class="fas fa-user-friends text-gray-400 mr-2"></i>
                    <span class="text-gray-600">已报名：{{ activity.registered }}/{{ activity.capacity }}</span>
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

      <!-- 志愿者风采 -->
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">志愿者风采</h2>
          <div class="grid grid-cols-4 gap-6">
            <div class="text-center">
              <img
                class="w-full h-64 object-cover rounded-lg mb-4"
                src="https://ai-public.mastergo.com/ai/img_res/68fcdd358ae875940c06f139a7bd6200.jpg"
                alt="志愿者照片"
              />
              <h4 class="font-semibold">张志远</h4>
              <p class="text-gray-500">累计服务 120 小时</p>
            </div>
            <div class="text-center">
              <img
                class="w-full h-64 object-cover rounded-lg mb-4"
                src="https://ai-public.mastergo.com/ai/img_res/064881f428daf5c11228133d97ed325d.jpg"
                alt="志愿者照片"
              />
              <h4 class="font-semibold">林美琪</h4>
              <p class="text-gray-500">累计服务 98 小时</p>
            </div>
            <div class="text-center">
              <img
                class="w-full h-64 object-cover rounded-lg mb-4"
                src="https://ai-public.mastergo.com/ai/img_res/31c6255b81b9bcbad472a87650314536.jpg"
                alt="志愿者照片"
              />
              <h4 class="font-semibold">王浩然</h4>
              <p class="text-gray-500">累计服务 86 小时</p>
            </div>
            <div class="text-center">
              <img
                class="w-full h-64 object-cover rounded-lg mb-4"
                src="https://ai-public.mastergo.com/ai/img_res/d4c980cf77dae76be35ef8c0b825ab48.jpg"
                alt="志愿者照片"
              />
              <h4 class="font-semibold">李雨欣</h4>
              <p class="text-gray-500">累计服务 75 小时</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 报名表单对话框 -->
    <div
      v-if="showSignupForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">活动报名 - {{ currentActivity?.title }}</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="showSignupForm = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名 <span class="text-red-500">*</span></label>
            <input
              v-model="signupForm.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="请输入姓名"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">手机号码 <span class="text-red-500">*</span></label>
            <input
              v-model="signupForm.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="请输入手机号码"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
            <input
              v-model="signupForm.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="请输入电子邮箱"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">身份证号 <span class="text-red-500">*</span></label>
            <input
              v-model="signupForm.idCard"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="请输入身份证号"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">紧急联系人 <span class="text-red-500">*</span></label>
            <input
              v-model="signupForm.emergencyContact"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="请输入紧急联系人姓名"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">紧急联系人电话 <span class="text-red-500">*</span></label>
            <input
              v-model="signupForm.emergencyPhone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="请输入紧急联系人电话"
            />
          </div>
          <div class="text-sm text-gray-500">
            注：带 <span class="text-red-500">*</span> 为必填项
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            @click="showSignupForm = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            @click="handleSignup"
          >
            确认报名
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
