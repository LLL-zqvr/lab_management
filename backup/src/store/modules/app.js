import { login as loginApi } from "@/api/login";
import router from "@/router";
export default {
  namespaced: true,
  state: () => ({
    // 本地存储
    token: sessionStorage.getItem("token") || "",
  }),
  mutations: {
    setToken(state, token) {
      state.token = token;
      sessionStorage.setItem("token", token);
    },
  },
  actions: {
    // userInfo为用户信息
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi(userInfo)
          .then((res) => {
            console.log(res);
            commit("setToken", res.token);
            router.replace("/");
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};
