import type { LoginForm } from "@overbookd/http";
import { defineStore } from "pinia";
import { isSuccess } from "~/utils/http/api-fetch";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
  }),
  actions: {
    async login(form: LoginForm) {
      const res = await AuthRepository.login(form);

      if (!isSuccess(res)) return console.error(res.message);
      this.authenticate(res.accessToken, res.refreshToken);
    },
    logout() {
      const accessToken = useCookie("accessToken");
      const refreshToken = useCookie("refreshToken");
      accessToken.value = null;
      refreshToken.value = null;

      this.authenticated = false;
    },
    authenticate(newAccessToken: string, newRefreshToken: string) {
      const accessToken = useCookie("accessToken");
      const refreshToken = useCookie("refreshToken");
      accessToken.value = newAccessToken;
      refreshToken.value = newRefreshToken;

      this.authenticated = true;
    },
  },
});
