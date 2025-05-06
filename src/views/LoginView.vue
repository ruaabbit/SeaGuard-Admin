<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '@/services/api'

const router = useRouter()
const route = useRoute()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

// 处理登录
const handleSubmit = async () => {
  if (!form.value.username || !form.value.password) {
    error.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await authAPI.login(form.value.username, form.value.password)

    // 存储用户信息
    localStorage.setItem('token', response.token)
    localStorage.setItem('userRole', response.user.role)
    localStorage.setItem('userId', response.user.id)
    localStorage.setItem('username', response.user.username)

    // 根据角色和重定向地址决定跳转路径
    const redirectUrl = route.query.redirect ||
      (response.user.role === 'admin' ? '/admin' : '/volunteer')
    router.push(redirectUrl)
  } catch (err) {
    error.value = err.message || '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        登录海洋卫士
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        还没有账号？
        <router-link to="/register" class="font-medium text-primary hover:text-opacity-90">
          立即注册
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              密码
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
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
                <h3 class="text-sm font-medium text-red-800">
                  {{ error }}
                </h3>
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
                登录中...
              </template>
              <template v-else>
                登录
              </template>
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
