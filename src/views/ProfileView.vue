<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">个人资料</h1>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <i class="fas fa-spinner fa-spin text-2xl"></i>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
      <span class="block sm:inline">{{ successMessage }}</span>
    </div>

    <!-- Profile form -->
    <form v-if="!loading && volunteerInfo" @submit.prevent="updateProfile" class="max-w-lg">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
          姓名
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
          电话
        </label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          邮箱
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
          地址
        </label>
        <input
          id="address"
          v-model="formData.address"
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
      </div>

      <!-- Volunteer statistics -->
      <div class="mb-6 p-4 bg-gray-50 rounded">
        <h2 class="text-lg font-semibold mb-3">志愿者统计</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-600">参与活动次数</p>
            <p class="text-xl font-bold">{{ volunteerInfo.activities || 0 }}</p>
          </div>
          <div>
            <p class="text-gray-600">累计志愿时长</p>
            <p class="text-xl font-bold">{{ volunteerInfo.hours || 0 }}小时</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="loading"
        >
          保存更改
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { volunteerAPI } from '@/services/api';

export default {
  name: 'ProfileView',
  data() {
    return {
      loading: false,
      error: null,
      successMessage: null,
      volunteerInfo: null,
      formData: {
        name: '',
        phone: '',
        email: '',
        address: ''
      }
    };
  },
  async created() {
    await this.fetchVolunteerInfo();
  },
  methods: {
    async fetchVolunteerInfo() {
      this.loading = true;
      this.error = null;
      try {
        this.volunteerInfo = await volunteerAPI.getMyInfo();
        // Update form data with current info
        this.formData = {
          name: this.volunteerInfo.name,
          phone: this.volunteerInfo.phone,
          email: this.volunteerInfo.email,
          address: this.volunteerInfo.address
        };
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async updateProfile() {
      this.loading = true;
      this.error = null;
      this.successMessage = null;
      try {
        await volunteerAPI.updateMyInfo(this.formData);
        this.successMessage = '个人信息更新成功';
        // Refresh volunteer info to get latest data
        await this.fetchVolunteerInfo();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
