import type {
  RegistrationLoginStep,
  RegistrationCompletedStep,
  RegistrationFormStepWithData,
  RegistrationFormStepWithoutData,
} from "@overbookd/http";
import { type Credentials, RegisterForm } from "@overbookd/registration";
import { HttpClient } from "~/utils/http/http-client";

export class RegistrationRepository {
  private static readonly basePath = "registrations";

  static checkUnauthenticatedUser(email: string) {
    const cleanedEmail = email.toLowerCase().trim();
    return HttpClient.get<RegistrationLoginStep | RegistrationFormStepWithData>(
      `${this.basePath}/unauthenticated/check/${cleanedEmail}`,
    );
  }

  static checkAuthenticatedUserWithFormData() {
    return HttpClient.get<
      RegistrationFormStepWithData | RegistrationCompletedStep
    >(`${this.basePath}/authenticated/check?withFormData=true`);
  }

  static checkAuthenticatedUserWithoutFormData() {
    return HttpClient.get<
      RegistrationFormStepWithoutData | RegistrationCompletedStep
    >(`${this.basePath}/authenticated/check`);
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
