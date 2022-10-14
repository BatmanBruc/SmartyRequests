import { createRouter, createWebHistory } from 'vue-router'
import Requests from '../components/pages/Requests.vue'
import Fields from '../components/pages/Fields.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/requests', component: Requests },
    { path: '/fields', component: Fields },
  ]
})

export default router
