import { Consumer, HttpStringified } from "@overbookd/http";
import { MyUserInformation, UserPersonalData } from "@overbookd/user";

export function castUserWithDate(
  user: HttpStringified<UserPersonalData | MyUserInformation | Consumer>,
) {
  return {
    ...user,
    birthdate: new Date(user.birthdate),
  };
}
