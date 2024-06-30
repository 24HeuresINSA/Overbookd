import type { UserCredentials, UserAccess } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class AuthRepository {
  static login(credentials: UserCredentials) {
    return HttpClient.post<UserAccess>("login", credentials);
  }

  static refresh(refreshToken: string) {
    return HttpClient.post<UserAccess>("refresh", { refreshToken });
  }

  static requestPasswordReset(email: string) {
    return HttpClient.post("forgot", { email });
  }

  static resetPassword(token: string, password: string, password2: string) {
    return HttpClient.post("reset", { token, password, password2 });
  }
}
