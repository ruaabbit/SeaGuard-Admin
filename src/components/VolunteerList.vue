<script setup>
defineProps({
  volunteers: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['edit-volunteer', 'delete-volunteer', 'add-volunteer'])
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between mb-6">
      <h2 class="text-xl font-semibold">志愿者列表</h2>
      <button
        class="bg-primary text-white px-4 py-2 !rounded-button hover:bg-opacity-90"
        @click="emit('add-volunteer')"
      >
        <i class="fas fa-plus mr-2"></i>添加志愿者
      </button>
    </div>

    <div v-if="loading" class="py-12 text-center">
      <i class="fas fa-spinner fa-spin text-primary text-2xl"></i>
      <p class="mt-2 text-gray-600">加载中...</p>
    </div>

    <div v-else-if="error" class="py-12 text-center">
      <i class="fas fa-exclamation-circle text-red-500 text-2xl"></i>
      <p class="mt-2 text-red-500">{{ error }}</p>
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
                @click="emit('edit-volunteer', volunteer)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="text-red-500 hover:text-opacity-75"
                @click="emit('delete-volunteer', volunteer.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
