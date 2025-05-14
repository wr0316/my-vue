import Vue from 'vue'
import VueRouter from 'vue-router'
import Discover from '../views/Discover.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'DiscoverMixed',
    component: Discover,
    props: route => ({ type: 'mixed' }),  // 不带参数，默认混合数据
  },
  {
    path: '/image',
    name: 'DiscoverImage',
    component: Discover,
    props: route => ({ type: 'image' }),  // 只展示图片数据
  },
  {
    path: '/video',
    name: 'DiscoverVideo',
    component: Discover,
    props: route => ({ type: 'video' }),  // 只展示视频数据
  },
]

const router = new VueRouter({
  mode: 'history',  // 推荐使用 history 模式，去掉 url 中的 #
  routes
})

export default router
