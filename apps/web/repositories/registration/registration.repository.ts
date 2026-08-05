import type { RegistrationStep } from "@overbookd/http";
import { type Credentials, RegisterForm } from "@overbookd/registration";
import { HttpClient } from "~/utils/http/http-client";

export class RegistrationRepository {
  private static readonly basePath = "registrations";

  static checkUnauthenticatedUser(email: string) {
    const cleanedEmail = email.toLowerCase().trim();
    return HttpClient.get<RegistrationStep>(
      `${this.basePath}/unauthenticated/check/${cleanedEmail}`,
    );
  }

  static checkAuthenticatedUser() {
    return HttpClient.get<RegistrationStep>(
      `${this.basePath}/authenticated/check`,
    );
  }

  static registerNewcomer(form: RegisterForm, token?: string) {
    const newcomer = form.complete();
    const body = { token, newcomer };
    const options = {
      serverErrorMessage:
        "Oups, l'inscription a échoué... Rééssaie de créer ton compte.",
    };
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
