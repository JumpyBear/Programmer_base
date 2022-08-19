<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="{
        'art-cmt-container-1': isShowCmt,
        'art-cmt-container-2': !isShowCmt,
      }"
    >
      <!-- 评论的 Item 项 -->
      <!-- van-list包裹列表，检测网页的滚动事件，判断滚动的位置是否快到达底部，并将loading改为true，加载中 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="别看了，真没有了！要不你发一条？"
        @load="onLoad"
        :immediate-check="false"
      >
        <div class="cmt-item" v-for="obj in commentArr" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="obj.is_liking === true"
                @click="likeFn(true, obj)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="likeFn(false, obj)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ obj.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(obj.pubdate) }}</div>
        </div>
      </van-list>
    </div>

    <!-- 底部评论框 -->
    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isShowCmt === true">
      <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="publishCmtFn">发表评论</div>
      <div class="icon-box">
        <van-badge :content="totalCount === 0 ? '' : totalCount" max="99">
          <van-icon
            name="comment-o"
            size="0.53333334rem"
            @click="clickTurntoFn"
          />
        </van-badge>
        <van-icon name="star-o" size="0.53333334rem" />
        <van-icon name="share-o" size="0.53333334rem" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea
        placeholder="想说什么？请发表友善的言论吧！"
        v-InputFocus
        @blur="loseFocusFn"
        v-model.trim="commentContent"
      ></textarea>
      <van-button
        type="default"
        :disabled="commentContent.length === 0"
        @click="sendFn"
        >发布</van-button
      >
    </div>
  </div>
</template>

<script>
import {
  getCommentListAPI,
  likeItAPI,
  dislikeAPI,
  sendCommentAPI
} from '@/api/index'
import { timeAgo } from '@/utils/time'
export default {
  data () {
    return {
      // 偏移量
      offset: null,
      // 评论列表
      commentArr: [],
      // 评论数量
      totalCount: 0,
      // 底部评论
      isShowCmt: true,
      //   发布评论的内容
      commentContent: '',
      loading: false,
      finished: false,
      lastId: null // 做分页
    }
  },
  async created () {
    const res = await getCommentListAPI({
      id: this.$route.query.art_id
    })
    console.log(res)
    this.commentArr = res.data.data.results
    this.totalCount = res.data.data.total_count // 总数量
    this.lastId = res.data.data.last_id // 分页

    // 网页打开 没有评论
    if (this.commentArr.length === 0) {
      this.finished = true
    }
  },
  methods: {
    timeAgo,
    // 点赞按钮
    async likeFn (bool, comObj) {
      if (bool) {
        // 用户点在了红心身上，希望取消点赞
        comObj.is_liking = false
        // 取消点赞接口
        await dislikeAPI({
          id: comObj.com_id
        })
      } else {
        // 点在非红心身上，希望点赞
        comObj.is_liking = true
        // 点赞接口
        await likeItAPI({
          commId: comObj.com_id
        })
      }
    },
    // 发送评论 大框隐藏
    publishCmtFn () {
      this.isShowCmt = false
    },
    // 评论失焦
    loseFocusFn () {
      // 发现点击发布按钮，点击事件不执行。发布框在点击发布的一瞬间，输入框失去了焦点，被v-if/v-else移除了整个标签
      // 失去焦点时，在最后再执行，异步延后执行
      setTimeout(() => {
        this.isShowCmt = true
      }, 0)
    },
    // 点击评论图标跳转至评论区
    clickTurntoFn () {
      //   const articleHeight = document.querySelector('.article-container').scrollHeight
      //   window.scrollTo(0, articleHeight)
      //   console.log(articleHeight)
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 发布按钮，点击事件
    async sendFn () {
      //   console.log(this.commentContent)
      // 把评论加到列表里（调用接口）
      const res = await sendCommentAPI({
        artId: this.$route.query.art_id,
        content: this.commentContent
      })
      //   console.log(res)
      this.commentArr.unshift(res.data.data.new_obj)
      this.totalCount++
      this.commentContent = ''
      // 发送后置于第一条评论
      this.clickTurntoFn()
    },
    // 加载更多
    async onLoad () {
      if (this.commentArr.length > 0) {
        const res = await getCommentListAPI({
          id: this.$route.query.art_id,
          offset: this.lastId
        })
        console.log(res)
        // 合并下一页获取的评论与旧评论
        this.commentArr = [...this.commentArr, ...res.data.data.results]
        this.totalCount = res.data.data.total_count
        this.lastId = res.data.data.last_id
        // 没有下一页数据，finished改为true
        if (res.data.data.last_id === null) {
          this.finished = true
        }
        this.loading = false
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
