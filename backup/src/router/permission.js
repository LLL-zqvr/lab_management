import router from "./index";
import store from "@/store";
import service from "@/api/request";
//白名单（用户没有登录也可以去访问）
const whiteList = ["/login"];
router.beforeEach((to, from, next) => {
  if (store.getters.token) {
    // 如果登陆成功才能放过去,但是这里又被响应拦截器拦住了
    console.log(store.getters.token);
    if (to.path === "/login") {
      console.log("啊？");
      // 如果登录了，可以到首页去
      next("/");
    } else {
      console.log("1");
      next();
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      // 虽然没有token（没有登录），但是请求访问的页面在白名单中，那么也可以放过去
      next();
    } else {
      next("/login");
    }
  }
});
