<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" @click="closeFn"/>
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span>我的频道
          <span class="small-title">
            点击{{ isEdit? '删除': '编辑' }}频道
          </span>
        </span>
        <span @click="editFn">{{ isEdit? '完成': '编辑' }}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="obj1 in userChannel" :key="obj1.id" @click="userChannelDelFn(obj1)">
          <div class="channel-item van-hairline--surround">
            {{obj1.name}}
            <!-- 删除的徽标 推荐不显示x的图标 -->
            <van-badge v-show="isEdit && obj1.id !== 0" color="transparent" class="cross-badge">
              <template #content>
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col
        span="6"
        v-for="obj2
        in unCheckedList"
        :key="obj2.id"
        @click="moreFn(obj2)"
        >
          <div class="channel-item van-hairline--surround">{{obj2.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userChannel: Array,
    unCheckedList: Array
  },
  data () {
    return {
      // 控制编辑频道的状态
      isEdit: false
    }
  },
  methods: {
    editFn () {
      this.isEdit = !this.isEdit
    },
    // 新增频道
    moreFn (channelObj) {
      if (this.isEdit) {
        // 处于编辑状态
        this.$emit('addChannel', channelObj)
      }
    },

    // 用户频道的点击事件
    userChannelDelFn (obj) {
      if (this.isEdit) {
        // 当不处于推荐项的时候，才可以进行编辑
        if (obj.id !== 0) {
          // 移除频道
          this.$emit('removeChannel', obj)
        }
        // 切换频道
      } else {
        // 关闭弹出层
        this.$emit('closePopup')
        // 切换频道 获取的是父组件的v-model
        this.$emit('input', obj.id)
      }
    },
    // 子传父 关闭弹出层
    closeFn () {
      this.$emit('closePopup')
    //   this.isEdit = false
    }
  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>
