<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import { getAllChannelsAPI } from '@/api/index'
export default {
  async  created () {
    try {
      // 可能会报错的代码
      const res = await getAllChannelsAPI()
      console.log(res)
    } catch (err) {
      // 错误对象
      // console.dir()详细打印
      console.dir(err)
    }
  }
}
</script>

<style>
</style>
