import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PetList from '../views/pet/PetList.vue'
import PostPet from '../views/pet/PostPet.vue'
import PetDetail from '../views/pet/PetDetail.vue'

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
  },
  {
    path: '/pet/:id',
    name: 'PetDetail',
    component: PetDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
