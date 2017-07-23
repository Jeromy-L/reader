import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Reader from '../components/Reader'
import BookDetail from '../components/BookDetail'
import Category from '../componests/Category'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/reader/:id',
      name: 'reader',
      component:  'Reader'
    },
    {
      path: '/bookdetail/:id',
      name: 'bookdetail',
      component:  'BookDetail'
    },
    {
      path: '/category',
      name: 'category',
      component:  'Category'
    }
  ]
})
