<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div id="app">
    <!-- Header -->
    <header class="fixed w-full bg-white shadow-sm z-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <span class="font-['Pacifico'] text-2xl text-primary">OUC AI LAB</span>
            <nav class="hidden md:ml-10 md:flex space-x-8">
              <router-link
                to="/"
                class="text-gray-500 hover:text-primary"
                :class="{ 'text-primary font-medium': route.path === '/' }"
              >
                首页
              </router-link>
              <router-link
                to="/admin"
                class="text-gray-500 hover:text-primary"
                :class="{ 'text-primary font-medium': route.path === '/admin' }"
              >
                管理后台
              </router-link>
            </nav>
          </div>
          <div class="flex items-center space-x-4">
            <button class="relative !rounded-button">
              <i class="fas fa-bell text-gray-600"></i>
              <span
                class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
                >3</span
              >
            </button>
            <div class="flex items-center space-x-3">
              <img
                class="h-8 w-8 rounded-full"
                src="https://ai-public.mastergo.com/ai/img_res/51f02cdcba26ee7cd1858c81f48f9215.jpg"
                :alt="'头像'"
              />
              <span class="text-gray-700">{{ route.path === '/' ? '陈梓萱' : '管理员' }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <router-view />
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
