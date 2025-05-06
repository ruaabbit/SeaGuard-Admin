import './assets/main.css'
import './assets/tailwind.css'
import '@/assets/fontawesome-free-6.7.2-web/css/all.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 创建全局导航守卫
router.beforeEach((to, from, next) => {
  // 获取token和用户角色
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  // 需要认证的路由
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // 检查角色权限
      if (to.meta.role && to.meta.role !== userRole) {
        next({ path: '/' })
      } else {
        next()
      }
    }
  } else {
    // 如果已登录且访问登录/注册页面，重定向到首页
    if (token && (to.path === '/login' || to.path === '/register')) {
      next({ path: '/' })
    } else {
      next()
    }
  }
})

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Global Error:', err)
  console.error('Error Info:', info)
}

app.use(router)

app.mount('#app')
