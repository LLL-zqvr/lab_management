import { createRouter, createWebHistory } from "vue-router";

// 第二步：创建路由器
// router是路由器，routes是被它管理的路由，是数组

const router = createRouter({
  history: createWebHistory(), //路由器的工作模式
  routes: [
    //一个一个的路由规则
    {
      name: "home",
      path: "/home",
      component: () => import("@/views/main/home.vue"),
      // children: [{ path: "test", component: () => import("@/pages/Test.vue") }],
    },
    {
      name: "login",
      path: "/login",
      component: () => import("@/views/login/login.vue"),
      // children: [{ path: "test", component: () => import("@/pages/Test.vue") }],
    },

    {
      name: "timeTable",
      path: "/timetable3",
      component: () => import("@/views/main/timetable3.vue"),
      // children: [{ path: "test", component: () => import("@/pages/Test.vue") }],
    },
    {
      path: "/",
      redirect: "/login",
    },
  ],
});

// const router = createRouter({
//   history: createWebHistory(), //路由器的工作模式
//   routes: [
//     {
//       name: "home",
//       path: "/home",
//       component: Home,
//       children: [
//         {
//           name: "test",
//           path: "test",
//           component: Test,
//           props: true,
//         },
//       ],
//     },
//     {
//       path: "/",
//       redirect: "/home",
//     },
//   ],
// });

// 将写好的路由暴露出去
export default router;
// 注意，此时还要在main.ts处引用路由，这才能真正地使用路由
