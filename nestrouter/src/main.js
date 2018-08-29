import Vue from 'vue'
import App from './App.vue'
// 导入路由模块
import VueRouter from 'vue-router';

// 导入组件
import user from './components/user.vue';
import icon from './components/icon.vue';
import habbit from './components/habbit.vue';
import setting from './components/setting.vue';

// use一下
Vue.use(VueRouter);

// 注册路由
let router = new VueRouter({
  routes:[
    {
      path:'/user',
      component:user,
      // 嵌套路由
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'icon',
          component: icon
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'habbit',
          component: habbit
        }
      ]
    },
    {
      path:'/setting',
      component:setting
    }
  ]
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router // 挂载路由
}).$mount('#app')
