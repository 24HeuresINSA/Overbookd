import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { IDefineANewcomer, JoinableTeam } from "@overbookd/registration";
import { HttpStringified } from "~/utils/types/http";

type Context = { $axios: NuxtAxiosInstance };

export class RegistrationRepository {
  private static readonly basePath = "registrations";

  static getNewcomers(context: Context) {
    return FakeRegistrationRepository.getNewcomers(context);
    return context.$axios.get<HttpStringified<IDefineANewcomer[]>>(
      this.basePath,
    );
  }

  static addTeamToNewcomers(
    context: Context,
    teamCode: JoinableTeam,
    newcomers: IDefineANewcomer[],
  ) {
    return FakeRegistrationRepository.enrollNewcomers(teamCode, newcomers);
    return context.$axios.post<void>(`${this.basePath}/enroll-to/${teamCode}`, {
      newcomers,
    });
  }
}

class FakeRegistrationRepository {
  private static newcomers: IDefineANewcomer[] = [
    { id: 1, firstName: "John", lastName: "Doe", registeredAt: new Date(), teams: ["strasbourg"] },
    { id: 2, firstName: "Lucas", lastName: "Duval", registeredAt: new Date("2021-09-05"), teams: ["karna"] },
    { id: 3, firstName: "Leon", lastName: "Dumestre", registeredAt: new Date("2022-09-20"), teams: [] },
    { id: 4, firstName: "Leo", lastName: "Mouyna", registeredAt: new Date("2010-10-02"), teams: ["teckos", "woods"] },
    { id: 5, firstName: "Frodon", lastName: "Odon", registeredAt: new Date("2021-09-30"), teams: [] },
    { id: 6, firstName: "Aude", lastName: "Baudoux", registeredAt: new Date("2020-08-23"), teams: ["bde"] },
    { id: 7, firstName: "Luca", lastName: "Magin", registeredAt: new Date("2021-09-06"), teams: [] },
    { id: 8, firstName: "Jasmine", lastName: "Macron", registeredAt: new Date(), teams: ["karna", "teckos", "tendrestival"] },
    { id: 9, firstName: "Casper", lastName: "Le Fantome", registeredAt: new Date(), teams: ["strasbourg"] },
    { id: 10, firstName: "Clement", lastName: "Daguillon", registeredAt: new Date("2022-08-10"), teams: ["teckos"] },
  ]

  static getNewcomers(context: Context): Promise<HttpStringified<IDefineANewcomer[]>>{
    console.debug(context) // Pour pas qu'il soit note comme not used
    return Promise.resolve(this.newcomers.map((newcomer) => ({...newcomer, registeredAt: newcomer.registeredAt.toLocaleString()})));
  }

  static enrollNewcomers(team: JoinableTeam, newcomers: IDefineANewcomer[]): Promise<void> {
    console.warn(`Enrolling ${newcomers.length} as member of ${team}`);
    return Promise.resolve();
  }
}
