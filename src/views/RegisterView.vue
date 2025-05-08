<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'

const router = useRouter()

// 表单数据
const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  role: 'volunteer',
  name: '',
  phone: '',
  email: '',
  address: ''
})

const loading = ref(false)
const error = ref('')

// 表单验证
const validateForm = () => {
  if (!form.value.username) return '请输入用户名'
  if (form.value.username.length < 4) return '用户名至少需要4个字符'
  if (!form.value.password) return '请输入密码'
  if (form.value.password.length < 6) return '密码至少需要6个字符'
  if (form.value.password !== form.value.confirmPassword) {
    return '两次输入的密码不一致'
  }
  if (!form.value.name) return '请输入姓名'
  if (!form.value.phone) return '请输入手机号'
  if (!form.value.email) return '请输入邮箱'
  if (!form.value.address) return '请输入地址'

  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(form.value.phone)) {
    return '请输入有效的手机号'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    return '请输入有效的邮箱地址'
  }

  return ''
}

// 处理注册提交
const handleSubmit = async () => {
  const validationError = validateForm()
  if (validationError) {
    error.value = validationError
    return
  }

  loading.value = true
  error.value = ''

  try {
    // 注册请求
    const registerData = {
      username: form.value.username,
      password: form.value.password,
      role: form.value.role,
      name: form.value.name,
      phone: form.value.phone,
      email: form.value.email,
      address: form.value.address
    }

    await authAPI.register(registerData)

    // 注册成功后自动登录
    const loginResponse = await authAPI.login(
      form.value.username,
      form.value.password
    )

    // 存储用户信息
    localStorage.setItem('token', loginResponse.token)
    localStorage.setItem('userRole', loginResponse.user.role)
    localStorage.setItem('userId', loginResponse.user.id)
    localStorage.setItem('username', loginResponse.user.username)

    // 注册成功，跳转到志愿者页面
    router.push('/volunteer')
  } catch (err) {
    error.value = err.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        注册成为志愿者
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        已有账号？
        <router-link to="/login" class="font-medium text-primary hover:text-opacity-90">
          立即登录
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 账号信息 -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              用户名 <span class="text-red-500">*</span>
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="至少4个字符"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              密码 <span class="text-red-500">*</span>
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="至少6个字符"
              />
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              确认密码 <span class="text-red-500">*</span>
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="请再次输入密码"
              />
            </div>
          </div>

          <!-- 志愿者信息 -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              姓名 <span class="text-red-500">*</span>
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              手机号 <span class="text-red-500">*</span>
            </label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              电子邮箱 <span class="text-red-500">*</span>
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">
              联系地址 <span class="text-red-500">*</span>
            </label>
            <div class="mt-1">
              <input
                id="address"
                v-model="form.address"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-400"></i>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <template v-if="loading">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                注册中...
              </template>
              <template v-else>注册</template>
            </button>
          </div>
        </form>
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
.ring-primary {
  --tw-ring-color: #0077b6;
}
.border-primary {
  border-color: #0077b6;
}
</style>
