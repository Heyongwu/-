<template>
  <!-- 过渡动画 -->

  <div class="img-view" @click="bigImg">
    <!-- 遮罩层 -->
    <div class="img-layer"></div>
      <div class="img">
        <transition name="fade">
        <img :src="imgSrc">
        </transition>
      </div>
  </div>

</template>
<script>
  export default {
    props: ['imgSrc'],
    methods: {
      bigImg() {
        // 发送事件
        this.$emit('clickit')
      }
    }
  }
</script>
<style scoped>
  /*动画*/
  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s linear;
    transform: translate3D(0, 0, 0);
  }

  .fade-enter,
  .fade-leave-active {
    transform: translate3D(100%, 0, 0);
  }


  /* bigimg */

  .img-view {
    width: 100%;
    height: 100%;
  }

  /*遮罩层样式*/
  .img-view .img-layer {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  /*不限制图片大小，实现居中*/
  .img-view .img img {

    width: 250px;
    height: 250px;
    max-width: 100%;
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1000;
  }


  /*不限制图片大小，实现居中*/
  .img-view .img img {

    width: 250px;
    height: 250px;
    max-width: 100%;
    display: block;
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1000;
  }
</style>