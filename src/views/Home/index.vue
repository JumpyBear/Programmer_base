<template>
  <div>
    <!-- 头部标题 -->
    <div>
      <van-nav-bar fixed
        title="程序员基地">
        <!-- 插槽的使用 -->
        <template v-slot:left>
          <img class="logo" src="@/assets/logo.png" alt="">
        </template>
        <template #right>
          <!-- postcss中只能翻译style里的css样式代码，标签内的行内样式它无法使px转换为rem，需要自己手动计算。 -->
          <van-icon name="search" size="0.48rem" color="#fff" @click="searchFn"/>
        </template>
      </van-nav-bar>
    </div>
    <div class="main">
      <!-- 每个van-tab代表一个标签导航，中间夹着的内容，对应列表的下属内容 -->
      <van-tabs v-model="channelID" sticky offset-top="1.226667rem" animated>
          <van-tab :title="obj.name" v-for="obj in userChannelList" :key="obj.id" :name="obj.id">
            <ArticleList :channelID="channelID"></ArticleList>
          </van-tab>
      </van-tabs>
      <!-- 编辑频道图标 -->
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="plusClickFn"/>
    </div>
    <!-- 点击加号弹出层 -->
    <van-popup v-model="show" get-container="body" class="channel_popup">
      <ChannelEdit
      :userChannel="userChannelList" :unCheckedList="unCheckChannelList"
      @addChannel="addChannelFn"
      @removeChannel="removeChannelFn"
      @closePopup="closePopupFn"
      ref="editFn"
      v-model="channelID"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannelsAPI, getAllChannelsAPI, updateChannelsAPI } from '@/api/index'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'
export default {
  data () {
    return {
      channelID: 0, // 激活时的频道ID,页面刚打开是推荐频道高亮
      // 频道列表数据
      userChannelList: [],
      // 文章列表数据
      // articleList: []
      show: false,
      // 所有频道列表
      allChannelList: [],
      // 保存每个频道的滚动位置
      // {频道id：滚动距离}
      channelScrollObj: {}
    }
  },
  async created () {
    // 频道列表
    const res = await getUserChannelsAPI()
    this.userChannelList = res.data.data.channels
    // this.channelChangeFn()

    // 所有频道列表
    const res2 = await getAllChannelsAPI()
    this.allChannelList = res2.data.data.channels
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  methods: {
    // tabs切换事件 -> 获取文章数据
    channelChangeFn () {
    // 文章列表
    // const res2 = await getAllArticleListAPI({
    //   channel_id: this.channelID, // 先设定默认
    //   timestamp: (new Date()).getTime()
    // })
    // console.log(res2)
    // this.articleList = res2.data.data.results
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScrollObj[this.channelID]
      })
    },
    plusClickFn () {
      this.show = true
    },
    // 封装一个更新频道的方法
    async updateChannel () {
      // 后台不允许传入推荐频道，id为0
      const newArr = this.userChannelList.filter(obj1 => obj1.id !== 0)
      const sendNewArr = newArr.map((obj3, index) => {
        // 浅拷贝一下
        const newObj = { ...obj3 }
        // 后台只允许我传入id，因此删除名字
        delete newObj.name
        // 传入索引当作seq（接口文档要求）
        newObj.seq = index
        // 让map方法返回一个新数组
        return newObj
      })
      // 调用接口传入数据
      await updateChannelsAPI({
        channels: sendNewArr
      })
    },

    // 接收子组件传来的数据，添加频道
    async addChannelFn (obj) {
      this.userChannelList.push(obj)
      this.updateChannel()
    },

    // 移除频道
    async removeChannelFn (channelObj) {
      // 把传过来的id与
      const index = this.userChannelList.findIndex(obj => obj.id === channelObj.id)
      this.userChannelList.splice(index, 1)
      this.updateChannel()
    },
    // 关闭弹出层
    closePopupFn () {
      this.show = false
      // 关闭后重置编辑按钮状态
      this.$refs.editFn.isEdit = false
    },
    // 点击搜索按钮，进入搜索页面 路由跳转
    searchFn () {
      this.$router.push('/search')
    },
    // 滚动条位置保存
    scrollFn () {
      this.$route.meta.scrollT = document.documentElement.scrollTop
      // 将每个频道的id和滚动距离存入对象
      this.channelScrollObj[this.channelID] = document.documentElement.scrollTop
    }
  },
  computed: {
    unCheckChannelList () {
      // 思路：把所有频道数组挨个对象取出，去用户已选频道数组里查找，如果找不到，则用filter方法收集到一个新数组里
      const newArr = this.allChannelList.filter(Alllist => {
        const index = this.userChannelList.findIndex(userList => {
          return userList.id === Alllist.id
        })
        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  },
  activated () {
    // window和document, 监听网页滚动的事件
    // html标签获取scrollTop，滚动的距离和设置滚动的位置
    window.addEventListener('scroll', this.scrollFn)
    // 立刻设置滚动条的位置
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  // 前提：组件缓存，切走了就是失去激活生命周期函数触发
  // 无组件缓存，destroyed销毁
  deactivated () {
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style scoped lang="less">
.logo {
    width: 30px;
    height: 30px;
  }

.main {
    padding-top: 46px;
  }
  /* 底部layout/index.vue中留过了padding-bottom */

  // 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}

.channel_popup {
  // vw vh 参考的是浏览器的百分比
  width: 100vw;
  height: 100vh;
}
</style>
