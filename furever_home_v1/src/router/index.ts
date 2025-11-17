import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PetList from '../views/PetList.vue'
import PostPet from '../views/PostPet.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'PetList',
    component: PetList
  },
  {
    path: '/post-pet',
    name: 'PostPet',
    component: PostPet
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
