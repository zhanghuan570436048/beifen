<template>
    <div class="user">
        <div class="header">
            <router-link to="/user/icon">头像</router-link>
            <router-link to="/user/habbit">爱好</router-link>
        </div>
        <!-- 出口 -->
        <router-view></router-view>
    </div>
</template>
<script>
export default {};
</script>
<style scoped>
.user {
    margin: 0 100px;
  height: 400px;
  background-color: hotpink;
}
.header {
  height: 40px;

  background-color: orange;
}
</style>

