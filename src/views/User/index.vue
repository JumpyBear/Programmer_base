<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userObj.photo" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{userObj.name}}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{userObj.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{userObj.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{userObj.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_edit"/>
      <van-cell icon="chat-o" title="小熊同学" is-link to="/chat"/>
      <van-cell icon="warning-o" title="退出登录" is-link @click="quitFn"/>
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfoAPI } from '@/api/index'
import { Dialog } from 'vant'
import { removeToken } from '@/utils/token'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      userObj: {}
    }
  },
  async activated () {
    const res = await getUserInfoAPI()
    console.log(res)
    this.userObj = res.data.data
    this.SET_USERPHOTO(this.userObj.photo)
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO']),
    // 退出登录方法
    quitFn () {
      Dialog.confirm({
        title: '是否退出登录？',
        message: '这就走了吗？不再留一下？'
      })
        .then(() => { // 用户点击“确认”选项，内部resolve会触发then
          // 业务：清除token，跳转到登录页
          removeToken()
          this.$router.replace('/login')
        })
        .catch(() => { // 用户点击“取消”选项，内部reject会触发catch
          // on cancel
        })
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
