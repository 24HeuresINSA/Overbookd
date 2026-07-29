import type { Consumer, HttpStringified } from "@overbookd/http";
import type { MyUserInformation, UserPersonalData } from "@overbookd/user";

export function castUserPersonalDataWithDate(
  user: HttpStringified<UserPersonalData>,
): UserPersonalData {
  return {
    ...user,
    birthDate: new Date(user.birthDate),
    teams: user.teams.toSorted(),
  };
}

export function castMyUserInformationWithDate(
  user: HttpStringified<MyUserInformation>,
): MyUserInformation {
  return {
    ...user,
    birthDate: new Date(user.birthDate),
    teams: user.teams.toSorted(),
  };
}

export function castConsumerWithDate(
  consumer: HttpStringified<Consumer>,
): Consumer {
  return {
    ...consumer,
    birthDate: new Date(consumer.birthDate),
    teams: consumer.teams.toSorted(),
  };
}
