<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        offset="50"
        @load="onLoad"
      >
        <ArticleItem
          v-for="obj in list"
          :key="obj.art_id"
          :artObj="obj"
          @dislikeArt="dislikeFn"
          @reportArt="reportFn"
          @click.native="ArticleDetailFn(obj.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../../components/ArticleItem.vue'
import {
  getAllArticleListAPI,
  dislikeArticleAPI,
  reportArticleAPI
} from '@/api/index'
import { Notify } from 'vant'
export default {
  data () {
    return {
      list: [],
      loading: false, // 底部加载状态
      finished: false, // 是否完成？
      theTime: new Date().getTime(), // 当前时间戳
      isLoading: false
    }
  },
  components: {
    ArticleItem
  },
  props: {
    // list: Array
    channelID: Number
  },
  created () {
    this.getArticleListFn()
  },
  methods: {
    // 封装一个负责发送文章列表请求的函数
    async getArticleListFn () {
      const res = await getAllArticleListAPI({
        channel_id: this.channelID, // 先设定默认
        timestamp: this.theTime
      })
      // 合并数组
      // created()合并的是空数组
      // onLoad()触底加载更多，合并数组
      this.list = [...this.list, ...res.data.data.results]
      // 请求过去文章的时间戳
      this.theTime = res.data.data.pre_timestamp
      // onload调用时才有用
      this.loading = false

      if (res.data.data.pre_timestamp === null) {
        // 本次回来的数据是最后的，没有下面的数据了
        this.finished = true
      }

      // 顶部的加载状态改为false
      this.isLoading = false
    },
    // 加载更多事件
    async onLoad () {
      if (this.list.length === 0) {
        this.loading = false
        return
      }
      // 请求数据
      this.getArticleListFn()
    },
    // 顶部刷新事件
    async onRefresh () {
      // 目标数组清空，来一份新的数据
      this.list = []
      this.theTime = new Date().getTime()
      // 请求数据
      this.getArticleListFn()
    },
    // 反馈不喜欢文章id
    async dislikeFn (id) {
      await dislikeArticleAPI({
        artId: id
      })
      // console.log(res)
      Notify({ type: 'success', message: '反馈成功！' })
    },

    async reportFn (id, value) {
      await reportArticleAPI({
        artId: id,
        type: value
      })
      Notify({ type: 'success', message: '举报成功！' })
    },
    // 首页点击跳转文章详情
    ArticleDetailFn (id) {
      this.$router.push({
        path: `/details?art_id=${id}`
      })
    }
  }
}
</script>

<style>
</style>
