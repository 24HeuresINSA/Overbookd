import type { AuthResponse, LoginForm } from "~/stores/auth";
import { HttpRequestBuilder } from "~/utils/http/http-request.builder";

export class AuthRepository {
  static login(body: LoginForm) {
    return HttpRequestBuilder.post<AuthResponse>("login")
      .withOptions({ withToken: false })
      .withBody(body)
      .execute();
  }

  static refresh(refreshToken: string) {
    return HttpRequestBuilder.post<AuthResponse>("refresh")
      .withOptions({ withToken: false })
      .withBody({ refreshToken })
      .execute();
  }
}
