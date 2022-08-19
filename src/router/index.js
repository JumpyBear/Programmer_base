import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Search from '@/views/Search'
// import SearchResult from '@/views/Search/SearchResult.vue'
// import ArticleDetails from '@/views/ArticleDetails'
// import UserEdit from '@/views/User/UserEdit'
// import Chat from '@/views/Chat'
import { getToken } from '@/utils/token'

Vue.use(VueRouter)

// 路由懒加载
const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login'),
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      // 如果用户已经登录,就不能切换回登录页面
      if (getToken()?.length > 0 && to.path === '/login') {
        next('/layout/home')
      } else {
        // 其他情况放行
        next()
      }
    }
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout'),
    children: [{
      path: 'home',
      component: () => import(/* webpackChunkName: "Home" */ '@/views/Home'),
      meta: {
        // 保存滚动位置
        scrollT: 0
      }
    },
    {
      path: 'user',
      component: () => import(/* webpackChunkName: "User" */ '@/views/User')
    }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search')
  },
  {
    path: '/search_result/:kw',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult.vue')
  },
  {
    path: '/details',
    component: () => import(/* webpackChunkName: "Details" */ '@/views/ArticleDetails')
  },
  // 用户编辑页面
  {
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit')
  },
  // 聊天机器人
  {
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})

// 路由全局前置守卫(在路由发生真正的跳转之前,执行此函数)
// 此函数可以决定路由是否跳转/取消/强制中断切换到别的路由
// router.beforeEach((to, from, next) => {
//   // 如果用户已经登录,就不能切换回登录页面
//   if (getToken()?.length > 0 && to.path === '/login') {
//     next('/layout/home')
//   } else {
//     // 其他情况放行
//     next()
//   }
// })

export default router
