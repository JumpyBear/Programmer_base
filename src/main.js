import '@/utils/console.js'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入flexible.js 设置根标签大小 做移动端适配
import 'amfe-flexible'
import 'highlight.js/styles/default.css' // 代码高亮的样式
import directiveObj from '@/utils/directives'
import '@/Vuecomponents' // vant组件库抽离为单独的文件
// 自定义聚焦指令
Vue.use(directiveObj)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
