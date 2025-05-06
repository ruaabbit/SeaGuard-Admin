<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 用户信息
const token = computed(() => localStorage.getItem('token'))
const userRole = computed(() => localStorage.getItem('userRole'))
const username = computed(() => localStorage.getItem('username'))

// 移动端菜单
const showMobileMenu = ref(false)
// 用户菜单
const showUserMenu = ref(false)

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('username')
  localStorage.removeItem('userId')
  router.push('/login')
}

// 通知数量
const notificationCount = ref(3)
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header v-if="route.path !== '/login' && route.path !== '/register'" class="fixed w-full bg-white shadow-sm z-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Navigation -->
          <div class="flex items-center">
            <router-link to="/" class="font-['Pacifico'] text-2xl text-primary">
              海洋卫士
            </router-link>

            <!-- Desktop Navigation -->
            <nav class="hidden md:ml-10 md:flex space-x-8">
              <router-link
                to="/"
                class="text-gray-500 hover:text-primary"
                :class="{ 'text-primary font-medium': route.path === '/' }"
              >
                首页
              </router-link>
              <template v-if="token">
                <router-link
                  v-if="userRole === 'admin'"
                  to="/admin"
                  class="text-gray-500 hover:text-primary"
                  :class="{ 'text-primary font-medium': route.path === '/admin' }"
                >
                  管理后台
                </router-link>
                <router-link
                  v-if="userRole === 'volunteer'"
                  to="/volunteer"
                  class="text-gray-500 hover:text-primary"
                  :class="{ 'text-primary font-medium': route.path === '/volunteer' }"
                >
                  志愿者中心
                </router-link>
              </template>
            </nav>
          </div>

          <!-- User Actions -->
          <div class="flex items-center space-x-4">
            <!-- Login/Register Buttons (when not logged in) -->
            <template v-if="!token">
              <router-link
                to="/login"
                class="text-gray-500 hover:text-primary px-3 py-2"
              >
                登录
              </router-link>
              <router-link
                to="/register"
                class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
              >
                注册
              </router-link>
            </template>

            <!-- User Menu (when logged in) -->
            <template v-else>
              <!-- Notifications -->
              <button class="relative !rounded-button">
                <i class="fas fa-bell text-gray-600"></i>
                <span
                  v-if="notificationCount > 0"
                  class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
                >
                  {{ notificationCount }}
                </span>
              </button>

              <!-- User Dropdown -->
              <div class="relative">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center space-x-3"
                >
                  <img
                    class="h-8 w-8 rounded-full"
                    src="https://ai-public.mastergo.com/ai/img_res/51f02cdcba26ee7cd1858c81f48f9215.jpg"
                    :alt="username"
                  />
                  <span class="text-gray-700">{{ username }}</span>
                  <i
                    class="fas fa-chevron-down text-xs text-gray-400"
                    :class="{ 'transform rotate-180': showUserMenu }"
                  ></i>
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-show="showUserMenu"
                  class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div class="py-1">
                    <router-link
                      to="/profile"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      @click="showUserMenu = false"
                    >
                      <i class="fas fa-user mr-2"></i>
                      个人中心
                    </router-link>
                    <button
                      @click="handleLogout"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <i class="fas fa-sign-out-alt mr-2"></i>
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- Mobile Menu Button -->
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="md:hidden text-gray-500 hover:text-primary"
            >
              <i class="fas" :class="showMobileMenu ? 'fa-times' : 'fa-bars'"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div
          v-show="showMobileMenu"
          class="md:hidden border-t border-gray-200 py-2"
        >
          <router-link
            to="/"
            class="block py-2 text-gray-500 hover:text-primary"
            :class="{ 'text-primary font-medium': route.path === '/' }"
            @click="showMobileMenu = false"
          >
            首页
          </router-link>
          <template v-if="token">
            <router-link
              v-if="userRole === 'admin'"
              to="/admin"
              class="block py-2 text-gray-500 hover:text-primary"
              :class="{ 'text-primary font-medium': route.path === '/admin' }"
              @click="showMobileMenu = false"
            >
              管理后台
            </router-link>
            <router-link
              v-if="userRole === 'volunteer'"
              to="/volunteer"
              class="block py-2 text-gray-500 hover:text-primary"
              :class="{ 'text-primary font-medium': route.path === '/volunteer' }"
              @click="showMobileMenu = false"
            >
              志愿者中心
            </router-link>
            <router-link
              to="/profile"
              class="block py-2 text-gray-500 hover:text-primary"
              :class="{ 'text-primary font-medium': route.path === '/profile' }"
              @click="showMobileMenu = false"
            >
              个人中心
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main :class="{ 'pt-16': route.path !== '/login' && route.path !== '/register' }">
      <router-view />
    </main>
  </div>
</template>

<style>
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
