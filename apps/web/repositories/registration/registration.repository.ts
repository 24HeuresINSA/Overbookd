import { type Credentials, RegisterForm } from "@overbookd/registration";
import { HttpClient } from "~/utils/http/http-client";

export class RegistrationRepository {
  private static readonly basePath = "registrations";

  static registerNewcomer(form: RegisterForm, token?: string) {
    const newcomer = form.complete();
    const body = { token, newcomer };
    const serverErrorMessage =
      "Oups, l'inscription a échoué... Rééssaie de créer ton compte.";
    const options = { serverErrorMessage };
    return HttpClient.post<void>(this.basePath, body, options);
  }

  static forgetMe(credentials: Credentials, token: string) {
    const body = { token, credentials };
    return HttpClient.post<void>(`${this.basePath}/forget`, body);
  }

  static forgetHim(email: string) {
    return HttpClient.delete<void>(`${this.basePath}/forget/${email}`);
  }
}
