import type { AuthResponse, LoginForm } from "~/stores/auth";
import { HttpRequest } from "~/utils/http/http-request";

export class AuthRepository {
  static login(body: LoginForm) {
    return HttpRequest.post<AuthResponse>("login", body);
  }

  static refresh(refreshToken: string) {
    return HttpRequest.post<AuthResponse>("refresh", { refreshToken });
  }
}
