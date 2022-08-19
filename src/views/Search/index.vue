<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()"/>
      <!-- 搜索组件 -->
      <van-search
      placeholder="请输入搜索关键词"
      background="#007BFF"
      shape="round"
      v-InputFocus
      @input="inputFn"
      v-model.trim="kw"
      @search="searchFn"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
        <div
        class="sugg-item"
        v-for="(str, index) in suggestList"
        :key="index"
        v-html="highLightFn(str, kw)"
        @click="clickReFn(str)"
        >
        </div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
    <!-- 标题 -->
    <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
            <van-icon name="delete" class="search-icon" @click="delFn"/>
        </template>
    </van-cell>

    <!-- 历史列表 -->
    <div class="history-list">
        <span class="history-item" v-for="(str, index) in history" :key="index" @click="clickHistoryFn(str)">{{str}}</span>
    </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api/index'
import { getStorage, setStorage } from '@/utils/storage'
export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null,
      suggestList: [], // 输入框联想菜单
      history: JSON.parse(getStorage('hisList')) || [] // 搜索历史
    }
  },
  methods: {
    // 定义封装一个跳转函数
    // 坑：路由跳转在watch监听保存之前，所以要将路由跳转来一个定时器包裹
    moveFn (theKw) {
      setTimeout(() => {
        this.$router.push({
          path: `/search_result/${theKw}`
        })
      }, 0)
    },
    // 输入框防抖
    inputFn () {
      // 防抖：延迟执行逻辑代码，事件再次触发时，清除上一个定时器
    //  如果输入框为空，则清空联想菜单
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        clearTimeout(this.timer)
        this.timer = setTimeout(async () => {
          if (this.kw.length === 0) return

          const res = await suggestListAPI({
            keywords: this.kw
          })
          console.log(res)
          this.suggestList = res.data.data.options
        }, 500)
      }
    },
    // 处理字符串高亮关键字方法
    // originalStr:原来的字符串
    // target:目标关键词
    // 字符串.replace()->替换第一个符合条件
    // 字符串.replaceAll()->匹配所有符合条件
    // 返回值：替换后的完整字符串

    // 如果要使用变量作为正则的匹配条件，要使用完整写法，不能使用语法糖
    highLightFn (originalStr, target) {
      const reg = new RegExp(target, 'ig') // i忽略大小写，g全局匹配
      return originalStr.replace(reg, (match) => {
        // match就是匹配中时，原字符串里的那个字符，用人家原来的，我们给换个颜色即可
        return `<span style="color: red;">${match}</span>`
      })
    },
    // 搜索框回车跳转
    searchFn () {
      // 当搜索框大于0的时候才进行保存和跳转
      if (this.kw.length > 0) {
        // 搜索关键词保存
        this.history.push(this.kw)
        this.moveFn(this.kw)
      }
    },
    // 建议列表传参跳转
    clickReFn (str) {
      this.history.push(str)
      this.moveFn(str)
    },
    // 点击历史列表跳转传参
    clickHistoryFn (str) {
      this.history.push(str)
      this.moveFn(str)
    },
    // 清空历史记录
    delFn () {
      this.history = []
    }
  },
  //   监听history里的变化
  watch: {
    history: {
      deep: true,
      handler () {
        // 覆盖式的保存在本地
        // 新建一个Set对象
        const newSet = new Set(this.history)
        // 将Set对象转回数组arr
        const arr = Array.from(newSet)
        setStorage('hisList', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}

/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
