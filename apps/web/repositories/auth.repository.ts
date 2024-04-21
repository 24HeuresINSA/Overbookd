import { Context } from "./context";

export class AuthRepository {
  static requestResetPassword(context: Context, data: { email: string }) {
    return context.$axios.post("/forgot", data);
  }

  static resetPassword(
    context: Context,
    data: { token: string; password: string; password2: string },
  ) {
    return context.$axios.post("/reset", data);
  }
}
