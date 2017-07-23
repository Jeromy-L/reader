// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import MintUI from 'mint-ui'
import store from './store/index'
import 'mint-ui/lib/style.css'
import Common from '@/assets/js/utils.js'
import './assets/css/reset.css'
require('animate.css')

Vue.use(Common)
Vue.use(MintUI)



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
