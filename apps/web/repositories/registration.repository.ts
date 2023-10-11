import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  Credentials,
  EnrollNewcomersForm,
  IDefineANewcomer,
  RegisterForm,
} from "@overbookd/registration";
import { HttpStringified } from "~/utils/types/http";

type Context = { $axios: NuxtAxiosInstance };

export class RegistrationRepository {
  private static readonly basePath = "newcomers";

  static getNewcomers(context: Context) {
    return context.$axios.get<HttpStringified<IDefineANewcomer[]>>(
      this.basePath,
    );
  }

  static enrollNewcomers(context: Context, body: EnrollNewcomersForm) {
    return context.$axios.post<void>(`${this.basePath}/enroll`, body);
  }

  static generateLink(context: Context) {
    return context.$axios.get<string>(
      `${this.basePath}/invite-new-adherents-link`,
    );
  }

  static registerNewcomer(
    context: Context,
    form: RegisterForm,
    token?: string,
  ) {
    const newcomer = form.complete();
    return context.$axios.post<void>(`${this.basePath}`, { token, newcomer });
  }

  static forgetMe(context: Context, credentials: Credentials, token: string) {
    const body = { token, credentials };
    return context.$axios.post<void>(`${this.basePath}/forget`, body);
  }
}
