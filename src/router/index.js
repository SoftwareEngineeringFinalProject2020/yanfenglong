import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Login from '../components/Login'

Vue.use(VueRouter)

const routes = [

  {
    path:'/',redirect:'/login'
  },
  {
    path:'/login',component:Login
  },
  {
    path:'/home',component:Home
  },
]

const index = new VueRouter({
  routes
})
//navigation guaid导航守卫
index.beforeEach((to , from , next) => {
  if (to.path === '/login'){
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr){
    return next('/login')
  }
  next()  //有则放行
})
export default index
