import type { UserCredentials, UserAccess } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class AuthRepository {
  static login(credentials: UserCredentials) {
    return HttpClient.post<UserAccess>("login", credentials);
  }

  static refresh(refreshToken: string) {
    return HttpClient.post<UserAccess>("refresh", { refreshToken });
  }
}
