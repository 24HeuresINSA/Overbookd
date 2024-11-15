import type { UserCredentials } from "@overbookd/http";
import { ONE_WEEK_IN_SECONDS } from "@overbookd/time";
import { AuthRepository } from "~/repositories/auth.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
  }),
  getters: {
    accessToken(): string | null {
      const accessToken = useCookie(ACCESS_TOKEN);
      return accessToken.value ?? null;
    },
    refreshToken(): string | null {
      const refreshToken = useCookie(REFRESH_TOKEN);
      return refreshToken.value ?? null;
    },
  },
  actions: {
    async login(credentials: UserCredentials) {
      const res = await AuthRepository.login(credentials);
      if (isHttpError(res)) return;
      this.authenticate(res.accessToken, res.refreshToken);
    },

    logout() {
      const accessToken = useCookie(ACCESS_TOKEN);
      const refreshToken = useCookie(REFRESH_TOKEN);
      accessToken.value = null;
      refreshToken.value = null;

      this.authenticated = false;
    },

    async refreshTokens() {
      const refreshToken = useCookie(REFRESH_TOKEN);
      if (!refreshToken.value) return;
      const res = await AuthRepository.refresh(refreshToken.value);

      if (isHttpError(res)) return;
      this.authenticate(res.accessToken, res.refreshToken);
    },

    authenticate(newAccessToken: string, newRefreshToken: string) {
      const accessToken = useCookie(ACCESS_TOKEN, {
        maxAge: ONE_WEEK_IN_SECONDS,
      });
      const refreshToken = useCookie(REFRESH_TOKEN, {
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
