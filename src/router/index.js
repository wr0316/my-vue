import Vue from 'vue'
import VueRouter from 'vue-router'
import Discover from '../views/Discover.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Discover',
    component: Discover
  },
]

const router = new VueRouter({
  routes
})

export default router
