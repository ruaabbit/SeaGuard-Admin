<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  activity: {
    type: Object,
    default: null
  },
  registrations: {
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

const emit = defineEmits(['close', 'update-status'])

function handleUpdateStatus(registration, status) {
  emit('update-status', { registration, status })
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-6xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold">报名列表 - {{ activity?.title }}</h3>
        <button class="text-gray-500 hover:text-gray-700" @click="emit('close')">
          <i class="fas fa-times"></i>
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
                报名时间
              </th>
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
                身份证号
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                紧急联系人
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
            <tr
              v-for="registration in registrations.filter(
                (r) => r.activityId === activity?.id,
              )"
              :key="registration.id"
            >
              <td class="px-6 py-4 whitespace-nowrap">{{ registration.createTime }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ registration.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ registration.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ registration.idCard }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ registration.emergencyContact }}
                <br />
                <span class="text-gray-500 text-sm">{{ registration.emergencyPhone }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    registration.status === '待审核'
                      ? 'bg-yellow-100 text-yellow-600'
                      : registration.status === '已通过'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600',
                  ]"
                >
                  {{ registration.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="registration.status === '待审核'" class="space-x-2">
                  <button
                    class="text-green-600 hover:text-opacity-75"
                    @click="handleUpdateStatus(registration, '已通过')"
                    title="通过"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    class="text-red-500 hover:text-opacity-75"
                    @click="handleUpdateStatus(registration, '已拒绝')"
                    title="拒绝"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <span v-else class="text-gray-400">--</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          @click="emit('close')"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-primary {
  color: #0077b6;
}
</style>
