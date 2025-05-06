<script setup>
defineProps({
  activities: {
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

const emit = defineEmits(['view-registrations', 'edit-activity', 'delete-activity', 'add-activity'])
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex justify-between mb-6">
      <h2 class="text-xl font-semibold">活动列表</h2>
      <button
        class="bg-primary text-white px-4 py-2 !rounded-button hover:bg-opacity-90"
        @click="emit('add-activity')"
      >
        <i class="fas fa-plus mr-2"></i>新建活动
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
                @click="emit('view-registrations', activity)"
                title="查看报名"
              >
                <i class="fas fa-user-friends"></i>
              </button>
              <button
                class="text-primary hover:text-opacity-75 mr-3"
                title="编辑活动"
                @click="emit('edit-activity', activity)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="text-red-500 hover:text-opacity-75"
                @click="emit('delete-activity', activity.id)"
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
