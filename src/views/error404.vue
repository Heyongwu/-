<style>
.index {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  text-align: center;
}
#index_pc_bj {
  width: 100%;
  height: 100%;
  background-size: cover;
  overflow: hidden;
  background-image: url(../static/error404.gif);
  background-position: center center;
  box-shadow: 0 0px 3px rgba(0, 0, 0, 0.5);
  text-align: center;
}
#index_pc_bj img{
  width: 100%;
  height: 100%;
}
</style>
<template>
    <div class="index">
        <div id="index_pc_bj">
            <img src="../static/error404.gif" />
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>
