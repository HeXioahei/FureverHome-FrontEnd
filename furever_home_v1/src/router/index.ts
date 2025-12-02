import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/home/Home.vue'
import PetList from '../views/pet/PetList.vue'
import PostPet from '../views/pet/PostPet.vue'
import PetDetail from '../views/pet/PetDetail.vue'
import ApplyAdoption from '../views/pet/ApplyAdoption.vue'
import Talk from '../views/talk/Talk.vue'
import PostList from '../views/forum/PostList.vue'
import PostDetail from '../views/forum/PostDetail.vue'
import Profile from '../views/user/Profile.vue'
import UserCenter from '../views/user/UserCenter.vue'
import Login from '../views/user/Login.vue'
import Register from '../views/user/Register.vue'
import NotFound from '../views/error/404.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminPosts from '../views/admin/Posts.vue'
import AdminPets from '../views/admin/Pets.vue'
import AdminApplications from '../views/admin/Applications.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'

// 来自 cwx 的新增发布帖子页面
import PostNew from '../views/forum/PostNew.vue'

//登录页面（邮箱，密码，注册可选择）
import LoginEmail from '../views/user/LoginEmail.vue'
import LoginPassword from '../views/user/LoginPassword.vue'
import LoginSuccess from '../views/user/LoginSuccess.vue';


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
    path: '/pet/:id/apply',
    name: 'ApplyAdoption',
    component: ApplyAdoption
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
    path: '/forum/:id',
    name: 'PostDetail',
    component: PostDetail
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/profile/:userId',
    name: 'UserProfile',
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
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'posts',
        name: 'AdminPosts',
        component: AdminPosts
      },
      {
        path: 'pets',
        name: 'AdminPets',
        component: AdminPets
      },
      {
        path: 'applications',
        name: 'AdminApplications',
        component: AdminApplications
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
  {
  path: '/login/email',
  name: 'LoginEmail',
  component: LoginEmail
},
{
  path: '/login/password',
  name: 'LoginPassword',
  component: LoginPassword
},
{
    path: '/login-success',
    name: 'LoginSuccess',
    component: LoginSuccess
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
