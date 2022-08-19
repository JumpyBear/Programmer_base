<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章加载等待 -->
    <van-loading color="#1989fa" v-if="Object.keys(artDetailObj).length === 0">
      文章疯狂加载中...
    </van-loading>

    <!-- 文章信息区域 -->
    <div class="article-container" v-else>
      <!-- 文章标题 -->
      <h1 class="art-title">{{ artDetailObj.title }}</h1>

      <!-- 用户信息 -->
      <van-cell
        center
        title="程序员小站"
        :label="dateFormat(artDetailObj.pubdate)"
      >
        <template #icon>
          <img :src="artDetailObj.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <!-- is_followed false未关注 -->
            <van-button type="info" size="mini" v-if="artDetailObj.is_followed" @click="isFollowedFn(true)"
              >已关注</van-button
            >
            <van-button
            icon="plus"
            type="info"
            size="mini"
            plain
            v-else
            @click="isFollowedFn(false)"
            >关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="artDetailObj.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <!-- attitude -1未点赞, 1已点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small" v-if="artDetailObj.attitude === 1" @click="thumbUpFn(true)"
          >已点赞</van-button
        >
        <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="thumbUpFn(false)"
          >点赞</van-button
        >
      </div>

      <!-- 文章评论 -->
      <div>
        <CommentList></CommentList>
      </div>
    </div>

  </div>
</template>

<script>
import { getDetailAPI, authorFollowAPI, authorUnfollowAPI, thumbDownAPI, thumbUpAPI } from '@/api/index'
import { timeAgo } from '@/utils/time.js'
import CommentList from './CommentList.vue'
export default {
  name: 'Details',
  data () {
    return {
      artDetailObj: {}
    }
  },
  async created () {
    const res = await getDetailAPI({
      // 把值从路由路径中取下来传到网络请求方法里
      id: this.$route.query.art_id
    })
    console.log(res)
    this.artDetailObj = res.data.data
  },
  methods: {
    dateFormat: timeAgo,
    // 点击取消关注/关注按钮
    async isFollowedFn (boolean) {
      if (boolean === true) {
        // 用户点击在了已关注按钮，希望取消关注
        this.artDetailObj.is_followed = false
        // 调用取关接口
        await authorUnfollowAPI({
          authorId: this.artDetailObj.aut_id
        })
      } else {
        // 用户点在了关注按钮，希望关注
        this.artDetailObj.is_followed = true
        // 调用关注接口
        await authorFollowAPI({
          authorId: this.artDetailObj.aut_id
        })
      }
    },
    // 对文章点赞，取消点赞
    async thumbUpFn (bool) {
      if (bool === true) {
        // 用户点击了已点赞按钮，希望取消点赞
        this.artDetailObj.attitude = -1
        // 调用取消点赞接口
        await thumbDownAPI({
          artId: this.artDetailObj.art_id
        })
      } else {
        this.artDetailObj.attitude = 1
        await thumbUpAPI({
          artId: this.artDetailObj.art_id
        })
      }
    }
  },
  components: {
    CommentList
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

// 加载中居中样式
.van-loading {
  text-align: center;
  padding-top: 46px;
}
</style>
