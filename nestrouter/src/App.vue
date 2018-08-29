<template>
  <div>
    <div class="header">
        <!-- 声明式导航 -->
        <router-link to="/user">个人中心</router-link>
        <router-link to="/setting">设置</router-link>
    </div>
    <!-- 出口 -->
      <router-view></router-view>
    <div class="footer"></div>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

  
<style lang='scss' scoped>
  // scoped的本质 会自动为当前这个页面中的template内的结构
  // 增加一个 随机的属性
  // 样式的后面加载属性选择器 样式就只能在这个页面使用了
.header {
  height: 50px;
  background-color: skyblue;
  a{
    padding: 5px;
    border: 1px solid #000;
    background-color: hotpink;
  }
}
.footer {
  height: 50px;
  background-color: yellowgreen;
}

</style>
