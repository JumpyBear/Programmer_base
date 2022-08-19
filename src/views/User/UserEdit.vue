<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="$store.state.userPhoto"
            @click="imageClickFn"
          />
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="profileObj.name"
        @click="nameClickFn"
      />
      <van-cell title="生日" is-link :value="profileObj.birthday" @click="birthdayPickFn"/>
    </van-cell-group>
    <!-- 姓名修改弹窗 -->
    <van-dialog
      v-model="show"
      title="修改名称"
      show-cancel-button
      :beforeClose="beforeCloseFn"
    >
      <input type="text" v-InputFocus v-model="inputUserName" />
    </van-dialog>

    <!-- 时间选择器 -->
    <!-- 弹出层在外面 -->
    <van-popup v-model="dateTimePickshow" position="bottom" round :style="{ height: '50%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="tpCancelFn"
        @confirm="confirmFn"
      />
    </van-popup>
  </div>
</template>

<script>
import { userProfileAPI, userUpdateImg, updateUserInfoAPI } from '@/api/index'
import { Notify } from 'vant'
import { formatDate } from '@/utils/time'
import { mapMutations } from 'vuex'
export default {
  name: 'UserEdit',
  data () {
    return {
      // 用户基本资料
      profileObj: {},
      show: false,
      // 修改名字弹出框的值
      inputUserName: '',
      // 时间范围 最小时间
      minDate: new Date(1940, 0, 1),
      // 最大时间 默认获取系统时间
      maxDate: new Date(),
      // 当前时间
      currentDate: new Date(),
      // 是否显示生日选择弹出层
      dateTimePickshow: false
    }
  },
  async created () {
    const res = await userProfileAPI()
    console.log(res)
    this.profileObj = res.data.data
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO']),
    formatDate,
    // 文件选择改变 - 事件
    async onFileChange (e) {
      // 不选择头像直接返回
      if (e.target.files.length === 0) return
      console.log(e.target.files[0]) // 数组是一个特殊的对象
      //   创建FormData对象
      const theFd = new FormData()
      theFd.append('photo', e.target.files[0]) // 请求体中加入一对参数名和值
      const res = await userUpdateImg(theFd)
      console.log(res)
      // 更新到页面上
      this.profileObj.photo = res.data.data.photo
      // 更新成功后 同步到vuex中
      this.SET_USERPHOTO(res.data.data.photo)
    },
    // 图片点击事件
    imageClickFn () {
      this.$refs.iptFile.click() // js模拟标签的点击事件
    },
    // 姓名点击修改
    nameClickFn () {
      // 点击显示组件
      this.show = true
      this.inputUserName = this.profileObj.name
    },
    // 姓名修改框的回调函数
    async beforeCloseFn (action, done) {
      if (action === 'confirm') {
        // 点确定
        // 正则匹配中文，小写大写字母1-7位
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.inputUserName)) {
          // 通过了校验
          await updateUserInfoAPI({
            name: this.inputUserName
          })
          //  把更新成功的数据回显到页面上
          this.profileObj.name = this.inputUserName
          done()
        } else {
          // 没通过校验
          Notify({
            type: 'warning',
            message: '姓名只能是1-7位中文，英文大小写！'
          })
          done(false)
        }
      } else {
        // 点取消
        done() // 弹窗关闭
      }
    },
    // 生日设置-点击事件
    birthdayPickFn () {
      this.dateTimePickshow = true
      // currentDate要的是日期对象
      this.currentDate = new Date(this.profileObj.birthday)
    },
    // 生日设置-取消
    tpCancelFn () {
      this.dateTimePickshow = false
    },
    // 生日设置-确认
    async confirmFn () {
      await updateUserInfoAPI({
        birthday: formatDate(this.currentDate)
      })
      // 更新页面
      this.profileObj.birthday = formatDate(this.currentDate)
      this.dateTimePickshow = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}

/deep/ .van-dialog__content {
  text-align: center;
  input {
    padding: 0;
    outline: none;
    border: none;
    text-align: center;
  }
}
</style>
