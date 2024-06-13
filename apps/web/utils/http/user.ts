import type { Consumer, HttpStringified } from "@overbookd/http";
import type { MyUserInformation, UserPersonalData } from "@overbookd/user";

export function castUserPersonalDataWithDate(
  user: HttpStringified<UserPersonalData>,
): UserPersonalData {
  return { ...user, birthdate: new Date(user.birthdate) };
}

export function castMyUserInformationWithoutDate(
  user: HttpStringified<MyUserInformation>,
): MyUserInformation {
  return { ...user, birthdate: new Date(user.birthdate) };
}

export function castConsumerWithDate(
  consumer: HttpStringified<Consumer>,
): Consumer {
  return { ...consumer, birthdate: new Date(consumer.birthdate) };
}
