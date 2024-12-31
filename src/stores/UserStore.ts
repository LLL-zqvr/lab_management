import type { User } from "@/types/index";

const setUserSessionStorage = (user: User, role: string) => {
  sessionStorage.setItem("role", role);
  sessionStorage.setItem("user", JSON.stringify(user));
};
const store = { setUserSessionStorage };
export const useUserStore = () => {
  return store;
};
