import { NuxtAxiosInstance } from "@nuxtjs/axios";

type Context = { $axios: NuxtAxiosInstance };

export default {
  requestResetPassword(context: Context, data: { userEmail: string }) {
    return context.$axios.post("/forgot", data);
  },
  resetPassword(
    context: Context,
    data: { token: string; password: string; password2: string }
  ) {
    return context.$axios.post("/reset", data);
  },
  sendValidationEmail(context: Context, data: { userEmail: string }) {
    return context.$axios.post("/signupvalidation", data);
  },
};
