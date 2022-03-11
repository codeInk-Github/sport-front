import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path:"/",
    redirect:"/login"
  },
  {
    path: "/login",
    component: () => import ("../components/Login.vue")
  },
  {
    path: "/home",
    component: () => import ("../views/Home.vue"),
    redirect: "/welcome",
    children:[
      {
        path:"/welcome",
        component:() => import("../components/Welcome")
      },
      {
        path: "/user",
        component:() => import("../components/admin/UserList")
      },
      // {
      //
      // }
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
//  to 将要访问
//  from 从哪访问
//  next 接着访问啥
//      next(url) 重定向到url上
//      next()    继续访问to的路径
  if(to.path==='/login') return next();
  const userFlag = sessionStorage.getItem("user");
  // 无值，返回登录页面
  if(!userFlag) return next('/login');
  next();
})
export default router
