import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '/@/pages/home/index.vue'
import About from '/@/pages/about/index.vue'
const routes = [
  {
    path: '/',
    component: () => Home,
  },
  {
    path: '/about',
    component: () => About,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
