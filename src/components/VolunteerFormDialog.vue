<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  volunteer: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  name: '',
  phone: '',
  email: '',
  address: ''
})

// 监听志愿者数据变化
watch(
  () => props.volunteer,
  (newVolunteer) => {
    if (newVolunteer && props.isEdit) {
      form.value = { ...newVolunteer }
    } else {
      form.value = {
        name: '',
        phone: '',
        email: '',
        address: ''
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('save', { ...form.value })
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-full max-w-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold">{{ isEdit ? '编辑志愿者' : '添加志愿者' }}</h3>
        <button class="text-gray-500 hover:text-gray-700" @click="emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">联系地址</label>
          <input
            v-model="form.address"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div class="mt-6 flex justify-end space-x-3">
        <button
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          @click="emit('close')"
        >
          取消
        </button>
        <button
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          @click="handleSubmit"
        >
          {{ isEdit ? '保存' : '确认' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-primary {
  background-color: #0077b6;
}
</style>
