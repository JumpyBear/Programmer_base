<template>
<div>
  <!-- 一条文章单元格 -->
  <van-cell>
    <!-- 标题区域的插槽 -->
    <template #title>
      <div class="title-box">
        <!-- 标题 -->
        <span>{{artObj.title}}</span>
        <!-- 单图 -->
        <img v-if="artObj.cover.type === 1" class="thumb" v-lazy="artObj.cover.images[0]" alt="">
      </div>
      <!-- 多图 -->
      <div class="thumb-box" v-if="artObj.cover.type > 1">
        <img v-for="(imgUrl, index) in artObj.cover.images" class="thumb" v-lazy="imgUrl" alt="" :key="index">
      </div>
    </template>
    <!-- label 区域的插槽 -->
    <template #label>
      <div class="label-box">
        <div>
          <!-- <span>{{artObj.aut_name}}</span> -->
          <span>程序员小站</span>
          <span>{{artObj.comm_count}}评论</span>
          <span>{{formatTime(artObj.pubdate)}}</span>
        </div>
        <!-- 反馈按钮 -->
        <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
      </div>
    </template>
  </van-cell>
  <!-- 反馈面板 -->
  <!-- get-container挂载到body上 -->
  <van-action-sheet v-model="show" :actions="actions" @select="onSelect" get-container="body" :cancel-text="bottomText" @cancel="cancelFn" @close="closeFn" />
</div>

</template>

<script>
import { timeAgo } from '@/utils/time'
import { firstActions, secondActions } from '@/api/report'
export default {
  props: {
    // 文章对象
    artObj: Object,
    // 显示与隐藏x
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      show: false,
      actions: firstActions,
      bottomText: '取消'
    }
  },
  // timeAgo函数一定要先声明，因为这里是模板
  methods: {
    formatTime: timeAgo, // 函数体是timeAgo
    onSelect (action, index) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false
      // console.log(action) // {name: '反馈垃圾内容'}
      // index 索引
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (action.name === '不感兴趣') {
        // 反馈 子向父
        this.$emit('dislikeArt', this.artObj.art_id)
        // 无论反馈成功/失败 让界面消失
        this.show = false
      } else {
        // 二级反馈的内容 子传父
        this.$emit('reportArt', this.artObj.art_id, action.value)
        this.show = false
      }
    },
    // 底部取消事件
    cancelFn () {
      if (this.bottomText === '取消') {
        this.show = false
      } else {
        this.actions = firstActions
        this.show = true
        this.bottomText = '取消'
      }
    },
    // 关闭面板时触发事件
    closeFn () {
      // 把数据恢复成一级页面
      this.actions = firstActions
    }
  }

}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span{
    margin: 0 3px;
    &:first-child{
        margin-left: 0;
    }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
