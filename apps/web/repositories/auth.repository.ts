import type { AuthResponse, LoginForm } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class AuthRepository {
  static login(body: LoginForm) {
    return HttpClient.post<AuthResponse>("login", body);
  }

  static refresh(refreshToken: string) {
    return HttpClient.post<AuthResponse>("refresh", { refreshToken });
  }
}
