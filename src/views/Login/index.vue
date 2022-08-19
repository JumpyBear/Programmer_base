<template>
  <div>
    <van-nav-bar
  title="程序员基地-登录"
/>
<div>
  <!-- van-form 整体表单组件
    @submit -> 自定义事件(提交事件)

    van-field 输入框(表单一项)
    1.输入框name属性="用户名",在表单整体提交的时候,收集一个提交对象,往后台发送的参数名就是name里的值
    2.label属性输入框左侧文本
    3.rules配置检验规则 :属性名="表达式" 属性名="字符串"
   -->
  <van-form @submit="onSubmit">
  <van-field
    required
    v-model="user.mobile"
    name="mobile"
    label="手机号"
    placeholder="请输入11位手机号"
    :rules="[{ required: true, message: '请填写正确的手机号', pattern: /^1[3-9]\d{9}$/ }]"
  />
  <van-field
    required
    v-model="user.code"
    type="password"
    name="code"
    label="密码"
    placeholder="请输入6位密码"
    :rules="[{ required: true, message: '请填写正确的6位密码', pattern: /^\d{6}$/  }]"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit" :loading="isLoading" :disabled="isLoading" loading-text="登录ing...">登录</van-button>
  </div>
</van-form>
</div>
  </div>
</template>

<script>
import { loginAPI } from '@/api/index'
import { setToken } from '@/utils/token'
import { setStorage } from '@/utils/storage'
import { Notify } from 'vant'
export default {
  data () {
    return {
      user: {
        mobile: '15538888888', // 手机号
        code: '246810' // 没有验证码接口 密码246810
      },
      isLoading: false
    }
  },
  methods: {
    // 提交方法,需要form整体通过验证才能触发
    async onSubmit () {
      // 可以直接用values,代表收集的参数名和值
      // 也可以用this.user
      // console.log('submit', values)

      // 状态设置为true
      this.isLoading = true
      try {
        const res = await loginAPI(this.user)
        console.log(res)
        Notify({ type: 'success', message: '登录成功!' })
        // 本地存储token
        setToken(res.data.data.token)
        // 将刷新的token存入本地存储
        setStorage('refresh_token', res.data.data.refresh_token)
        // 跳转一定要放在最后，而且尽量最后执行
        this.$router.replace({
          path: this.$route.query.path || '/layout/home' // 写全是因为layout路由中没有重定向
        })
      } catch (err) {
        // Promise的ajax错误,抛出提示,显示在这里
        Notify({ type: 'danger', message: '手机号或密码错误' })
      }
      // 状态设置为false
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang='less'>
/* 此类名是van-nav-bar的根标签 */
// .van-nav-bar {
//   background-color: #007bff;
// }

/*此选择器是van-nav-bar内部的标签，scoped尝试把此选择器后的属性选择器匹配当前页面标签（选不中组件内部的）*/
// lang='less'说明当前style标签内的是less语法，用/deep/就不会报错
// /deep/会把属性选择器加到当前选择器前面,说明先选中当前的属性选择器,再按照后代选择器选中内部的选择器,以此来更改颜色
// 结论:要修改组件内部的样式,如果用了scoped,需要在选择器前面加上/deep/
// /deep/ .van-nav-bar__title {
//   color: white
// }
</style>
