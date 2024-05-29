import { defineStore } from "pinia";

export type LoginForm = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
  }),
  actions: {
    async login(form: LoginForm) {
      const res = await AuthRepository.login(form);

      if (!res.ok) return;
      this.authenticate(res.data.accessToken, res.data.refreshToken);
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
