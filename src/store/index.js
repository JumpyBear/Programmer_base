import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 图片头像默认地址
    userPhoto: 'https://i02piccdn.sogoucdn.com/a6922569262262b1',
    // 小思同学默认头像
    robotPhoto: 'https://i02piccdn.sogoucdn.com/a6922569262262b1'
  },
  getters: {
  },
  mutations: {
    // mutations最好大写
    SET_USERPHOTO (state, payload) {
      state.userPhoto = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
