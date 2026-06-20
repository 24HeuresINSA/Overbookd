import type { Consumer, HttpStringified } from "@overbookd/http";
import type { MyUserInformation, UserPersonalData } from "@overbookd/user";

export function castUserPersonalDataWithDate(
  user: HttpStringified<UserPersonalData>,
): UserPersonalData {
  return {
    ...user,
    dateOfBirth: new Date(user.dateOfBirth),
    teams: user.teams.toSorted(),
  };
}

export function castMyUserInformationWithDate(
  user: HttpStringified<MyUserInformation>,
): MyUserInformation {
  return {
    ...user,
    dateOfBirth: new Date(user.dateOfBirth),
    teams: user.teams.toSorted(),
  };
}

export function castConsumerWithDate(
  consumer: HttpStringified<Consumer>,
): Consumer {
  return {
    ...consumer,
    dateOfBirth: new Date(consumer.dateOfBirth),
    teams: consumer.teams.toSorted(),
  };
}
