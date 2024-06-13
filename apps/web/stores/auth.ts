import type { UserCredentials } from "@overbookd/http";
import { isSuccess } from "~/utils/http/api-fetch";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
  }),
  actions: {
    async login(form: UserCredentials) {
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

      const { clearLoggedUser } = useUserStore();
      clearLoggedUser();
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
