import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  EnrollNewcomersForm,
  IDefineANewcomer,
  JoinableTeam,
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
}

export class FakeRegistrationRepository {
  private static newcomers: IDefineANewcomer[] = [
    {
      id: 1,
      firstname: "John",
      lastname: "Doe",
      registeredAt: new Date(),
      teams: ["strasbourg"],
    },
    {
      id: 2,
      firstname: "Lucas",
      lastname: "Duval",
      registeredAt: new Date("2021-09-05"),
      teams: ["karna"],
    },
    {
      id: 3,
      firstname: "Leon",
      lastname: "Dumestre",
      registeredAt: new Date("2022-09-20"),
      teams: [],
    },
    {
      id: 4,
      firstname: "Leo",
      lastname: "Mouyna",
      registeredAt: new Date("2010-10-02"),
      teams: ["teckos", "woods"],
    },
    {
      id: 5,
      firstname: "Frodon",
      lastname: "Odon",
      registeredAt: new Date("2021-09-30"),
      teams: [],
    },
    {
      id: 6,
      firstname: "Aude",
      lastname: "Baudoux",
      registeredAt: new Date("2020-08-23"),
      teams: ["bde"],
    },
    {
      id: 7,
      firstname: "Luca",
      lastname: "Magin",
      registeredAt: new Date("2021-09-06"),
      teams: [],
    },
    {
      id: 8,
      firstname: "Jasmine",
      lastname: "Macron",
      registeredAt: new Date(),
      teams: ["karna", "teckos"],
    },
    {
      id: 9,
      firstname: "Casper",
      lastname: "Le Fantome",
      registeredAt: new Date(),
      teams: ["strasbourg"],
    },
    {
      id: 10,
      firstname: "Clement",
      lastname: "Daguillon",
      registeredAt: new Date("2022-08-10"),
      teams: ["teckos"],
    },
  ];

  static getNewcomers(
    context: Context,
  ): Promise<HttpStringified<IDefineANewcomer[]>> {
    console.debug(context); // Pour pas qu'il soit note comme not used
    return Promise.resolve(
      this.newcomers.map((newcomer) => ({
        ...newcomer,
        registeredAt: newcomer.registeredAt.toString(),
      })),
    );
  }

  static enrollNewcomers(
    team: JoinableTeam,
    newcomers: IDefineANewcomer[],
  ): Promise<void> {
    console.warn(`Enrolling ${newcomers.length} as member of ${team}`);
    return Promise.resolve();
  }

  static generateLink(): Promise<{ data: string } | undefined> {
    const link =
      "https://overbookd.24heures.org/register?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTg3OTY4MDB9.hImidi9xPdKV4IjbvQTjVcCT3p7EWGtciaeT7QHkO8U";
    const url = new URL(link);
    return Promise.resolve({ data: url.href });
  }
}
