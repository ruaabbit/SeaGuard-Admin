import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: {
        requiresAuth: true,
        role: 'admin'
      }
    },
    {
      path: '/volunteer',
      name: 'volunteer',
      component: () => import('../views/VolunteerView.vue'),
      meta: {
        requiresAuth: true,
        role: 'volunteer'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        requiresAuth: true,
        role: 'volunteer'
      }
    }
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  // 检查是否需要认证
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

export default router
