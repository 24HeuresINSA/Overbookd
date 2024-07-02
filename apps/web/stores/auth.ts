import type { UserCredentials } from "@overbookd/http";
import { isHttpError } from "~/utils/http/api-fetch";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
  }),
  actions: {
    async login(form: UserCredentials) {
      const res = await AuthRepository.login(form);

      if (isHttpError(res)) return console.error(res.message);
      this.authenticate(res.accessToken, res.refreshToken);
    },

    logout() {
      const accessToken = useCookie("accessToken");
      const refreshToken = useCookie("refreshToken");
      accessToken.value = null;
      refreshToken.value = null;

      this.authenticated = false;
    },

    async refreshTokens() {
      const refreshToken = useCookie("refreshToken");
      if (!refreshToken.value) return;
      const res = await AuthRepository.refresh(refreshToken.value);

      if (isHttpError(res)) return console.error(res.message);
      this.authenticate(res.accessToken, res.refreshToken);
    },

    authenticate(newAccessToken: string, newRefreshToken: string) {
      const accessToken = useCookie("accessToken");
      const refreshToken = useCookie("refreshToken");
      accessToken.value = newAccessToken;
      refreshToken.value = newRefreshToken;

      this.authenticated = true;
    },
    async requestPasswordReset(email: string) {
      const res = await AuthRepository.requestPasswordReset(email);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        "Un email de réinitialisation de mot de passe t'as été envoyé ✅",
      );
    },
    async resetPassword(token: string, password: string, password2: string) {
      const res = await AuthRepository.resetPassword(
        token,
        password,
        password2,
      );
      if (isHttpError(res)) return;
      sendSuccessNotification("Ton mot de passe a bien été réinitialisé ✅");
    },
  },
});
