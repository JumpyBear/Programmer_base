<template>
    <div>
      <!-- 搜索结果页-头部导航 -->
      <div class="search-result-container">
        <!-- 点击实现后退效果 -->
        <van-nav-bar
          title="搜索结果"
          left-arrow
          @click-left="$router.go(-1)"
          fixed
        />
      </div>
      <!-- 文章搜索结果页 -->
      <div>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
        <ArticleItem
        v-for="obj in resultList"
        :key="obj.art_id"
        :artObj="obj"
        :isShow="false"
        @click.native="ArticleClickFn(obj.art_id)"
        ></ArticleItem>
        </van-list>
      </div>
    </div>
</template>

<script>
import { SearchResultAPI } from '@/api/index'
import ArticleItem from '@/components/ArticleItem.vue'
export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1, // 页码
      resultList: [], // 文章搜索结果数据
      loading: false, // 加载更多
      finished: false // 是否加载完毕
    }
  },
  async created () {
    const res = await SearchResultAPI({
      q: this.$route.params.kw,
      page: this.page
    })
    console.log(res)
    this.resultList = res.data.data.results
  },
  components: {
    ArticleItem
  },
  methods: {
    async onLoad () {
      if (this.resultList.length > 0) {
        // 请求下一页的数据
        this.page++
        const res = await SearchResultAPI({
          q: this.$route.params.kw,
          page: this.page
        })
        console.log(res)
        if (res.data.data.results === 0) {
          // 没有更多数据了
          this.finished = true
          return
        }
        // 合并新老数据
        this.resultList = [...this.resultList, ...res.data.data.results]
        this.loading = false
      } else {
        this.loading = false
      }
    },
    // 点击跳转到详情页
    ArticleClickFn (id) {
      this.$router.push({
        path: `/details?art_id=${id}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
