import type { UserCredentials } from "@overbookd/http";
import { ONE_MINUTE_IN_MS, ONE_WEEK_IN_SECONDS } from "@overbookd/time";
import { AuthRepository } from "~/repositories/auth.repository";
import { isHttpError } from "~/utils/http/http-error.utils";
import { getTokenExpirationInMs } from "~/utils/user/auth.utils";

export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";

let refreshTimeout: ReturnType<typeof setTimeout>;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
  }),
  getters: {
    accessToken(): string {
      return useCookie(ACCESS_TOKEN).value ?? "";
    },
  },
  actions: {
    async login(credentials: UserCredentials) {
      const res = await AuthRepository.login(credentials);
      if (isHttpError(res)) return;
      this.authenticate(res.accessToken, res.refreshToken);
    },

    logout() {
      clearTimeout(refreshTimeout);

      useCookie(ACCESS_TOKEN).value = null;
      useCookie(REFRESH_TOKEN).value = null;

      this.authenticated = false;
    },

    async refreshTokens() {
      const refreshToken = useCookie(REFRESH_TOKEN);
      if (!refreshToken.value) return;
      const res = await AuthRepository.refresh(refreshToken.value);

      if (isHttpError(res)) return;
      this.authenticate(res.accessToken, res.refreshToken);
    },

    authenticate(access: string, refresh: string) {
      useCookie(ACCESS_TOKEN, { maxAge: ONE_WEEK_IN_SECONDS }).value = access;
      useCookie(REFRESH_TOKEN, { maxAge: ONE_WEEK_IN_SECONDS }).value = refresh;

      this.authenticated = true;
      this.scheduleRefresh();
    },

    scheduleRefresh() {
      clearTimeout(refreshTimeout);

      const accessToken = useCookie(ACCESS_TOKEN).value;
      if (!accessToken) return;

      const tokenExp = getTokenExpirationInMs(accessToken);
      const expiresIn = tokenExp - Date.now();
      const refreshIn = Math.max(expiresIn - ONE_MINUTE_IN_MS, 0);

      refreshTimeout = setTimeout(() => this.refreshTokens(), refreshIn);
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
