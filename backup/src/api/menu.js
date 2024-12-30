import request from "./request";
export const menuList = () => {
  return request({
    // 默认get请求（？
    url: "/menus",
  });
};
