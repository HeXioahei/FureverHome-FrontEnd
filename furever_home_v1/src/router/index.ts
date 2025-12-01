import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/home/Home.vue'
import PetList from '../views/pet/PetList.vue'
import PostPet from '../views/pet/PostPet.vue'
import PetDetail from '../views/pet/PetDetail.vue'
import Talk from '../views/talk/Talk.vue'
import PostList from '../views/forum/PostList.vue'
import PostDetail from '../views/forum/PostDetail.vue'
import Profile from '../views/user/Profile.vue'
import UserCenter from '../views/user/UserCenter.vue'
import Login from '../views/user/Login.vue'
import Register from '../views/user/Register.vue'
import NotFound from '../views/error/404.vue'
import PostNew from '../views/forum/PostNew.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/pets',
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
  },
  {
    path: '/communication',
    name: 'Communication',
    component: Talk
  },
  {
    path: '/forum',
    name: 'Forum',
    component: PostList
  },
  {
    path: '/forum/:postId',
    name: 'PostDetail',
    component: PostDetail,
    props:true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/user-center',
    name: 'UserCenter',
    component: UserCenter
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
  {
        path: '/post/new', // 发布帖子页面的路径
        name: 'PostNew',   // 路由名称
        component: PostNew // 对应的组件
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
