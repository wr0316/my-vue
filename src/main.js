// src/main.js

import Vue from 'vue'

// 引入 App 根组件
import App from './App.vue'

// 引入路由
import router from './router'

// 引入 Vuex（如果你有用）
import store from './store'

// 引入 vant 组件库及样式（Vant 2.x 版本）
import Vant from 'vant'
import 'vant/lib/index.css'

// 引入 vue-waterfall-easy 组件
import VueWaterfallEasy from 'vue-waterfall-easy'

// 图片懒加载指令
Vue.directive('lazy', {
  inserted(el, binding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.src = binding.value;
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(el);
  }
});

// 使用 vant
Vue.use(Vant)

// 全局注册 vue-waterfall-easy 组件
Vue.component('VueWaterfallEasy', VueWaterfallEasy)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
