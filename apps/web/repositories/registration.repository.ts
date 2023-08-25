import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { IDefineANewcomer } from "@overbookd/registration";
import { HttpStringified } from "~/utils/types/http";

type Context = { $axios: NuxtAxiosInstance };

export class RegistrationRepository {
  private static readonly basePath = "registrations";

  static getNewcomers(context: Context) {
    return context.$axios.get<HttpStringified<IDefineANewcomer[]>>(
      this.basePath,
    );
  }

  static addTeamToNewcomers(
    context: Context,
    teamCode: string,
    newcomers: IDefineANewcomer[],
  ) {
    return context.$axios.post<void>(
      `${this.basePath}/enroll-to/${teamCode}`,
      { newcomers },
    );
  }
}
