import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/home/Home.vue'
import PetList from '../views/pet/PetList.vue'
import PostPet from '../views/pet/PostPet.vue'
import PetDetail from '../views/pet/PetDetail.vue'
import Talk from '../views/talk/Talk.vue'
import PostList from '../views/forum/PostList.vue'
import PostDetail from '../views/forum/PostDetail.vue'
import Profile from '../views/user/Profile.vue'
import Login from '../views/user/Login.vue'
import Register from '../views/user/Register.vue'
import NotFound from '../views/error/404.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { showNavBar: true }
  },
  {
    path: '/pets',
    name: 'PetList',
    component: PetList,
    meta: { showNavBar: true }
  },
  {
    path: '/post-pet',
    name: 'PostPet',
    component: PostPet,
    meta: { showNavBar: true }
  },
  {
    path: '/pet/:id',
    name: 'PetDetail',
    component: PetDetail,
    meta: { showNavBar: true }
  },
  {
    path: '/communication',
    name: 'Communication',
    component: Talk,
    meta: { showNavBar: true }
  },
  {
    path: '/forum',
    name: 'Forum',
    component: PostList,
    meta: { showNavBar: true }
  },
  {
    path: '/forum/:id',
    name: 'PostDetail',
    component: PostDetail,
    meta: { showNavBar: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { showNavBar: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { showNavBar: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { showNavBar: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { showNavBar: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
