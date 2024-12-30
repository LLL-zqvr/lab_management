import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router/index";
const service = axios.create({
  // baseURL: VUE_APP_BASE_API,
  baseURL: "/api",
  timeout: 5000,
});

//请求拦截器
service.interceptors.request.use(
  (config) => {
    config.headers.token = sessionStorage.getItem("token");
    // console.log(sessionStorage);
    return config;
  },
  (error) => {
    return Promise.reject(new Error("请求失败！" + error));
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log("这个是response" + response);
    console.log("这个是respose.data" + response.data);
    // token在headers里面！取token出来方便验证
    let { code, data, message } = response.data;
    const { token } = response.headers;
    //将token拼入data中
    data = { ...data, token };
    if (code === 200) {
      return data;
    } else {
      console.log(code);
      ElMessage.error("登陆失败11！" + code + message);
      // 返回到登录页面
      router.replace("/login");
      return Promise.reject(new Error("登陆失败12！" + message));
    }
  },
  // 如果连响应都没有的话
  (error) => {
    error.response && ElMessage.error("登陆失败2！" + error.response.data);
    return Promise.reject(new Error("登陆失败2！" + error.response.data));
  }
);
export default service;
