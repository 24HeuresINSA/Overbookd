import type { UserCredentials } from "@overbookd/http";
import { ONE_WEEK_IN_SECONDS } from "@overbookd/time";
import { AuthRepository } from "~/repositories/auth.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
  }),
  getters: {
    accessToken(): string {
      const accessToken = useCookie("accessToken");
      return accessToken.value ?? "";
    },
  },
  actions: {
    async login(credentials: UserCredentials) {
      const res = await AuthRepository.login(credentials);
      if (isHttpError(res)) return;
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

      if (isHttpError(res)) return;
      this.authenticate(res.accessToken, res.refreshToken);
    },

    authenticate(newAccessToken: string, newRefreshToken: string) {
      const accessToken = useCookie("accessToken", {
        maxAge: ONE_WEEK_IN_SECONDS,
      });
      const refreshToken = useCookie("refreshToken", {
        maxAge: ONE_WEEK_IN_SECONDS,
      });
      accessToken.value = newAccessToken;
      refreshToken.value = newRefreshToken;

      this.authenticated = true;
    },
    async requestPasswordReset(email: string) {
      const res = await AuthRepository.requestPasswordReset(email);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        "Un email de réinitialisation de mot de passe t'as été envoyé",
      );
    },
    async resetPassword(token: string, password: string, password2: string) {
      const res = await AuthRepository.resetPassword(
        token,
        password,
        password2,
      );
      if (isHttpError(res)) return;
      sendSuccessNotification("Ton mot de passe a été réinitialisé");
    },
  },
});
