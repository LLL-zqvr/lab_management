import type { User } from "@/types/index";
import { ADMIN, TEACHER, LABADMIN } from "@/services/Const";
import { shallowRef } from "vue";
const setUserSessionStorage = (user: User, role: string) => {
  sessionStorage.setItem("role", role);
  sessionStorage.setItem("user", JSON.stringify(user));
};
const getRole = () => {
  let role = sessionStorage.getItem("role");
  switch (role) {
    case ADMIN:
      return "管理员";
      break;
    case TEACHER:
      return "老师";
      break;
    case LABADMIN:
      return "实验室管理员";
      break;
  }
};
const getUserName = () => {
  let user = sessionStorage.getItem("user");
  let userS = shallowRef<User>();
  if (user != null) {
    userS.value = JSON.parse(user);
    return userS.value?.name;
  }
};

const clean = () => {
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
};
const store = { setUserSessionStorage, clean, getRole, getUserName };
export const useUserStore = () => {
  return store;
};
