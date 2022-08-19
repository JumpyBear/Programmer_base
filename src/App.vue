<template>
  <div>
    <!-- 有一些一级路由页面不需要缓存 -->
    <keep-alive exclude="Search,SearchResult,Details,UserEdit">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>
