import { ConnectedZitadelUser } from "./zitadel-types";

export function parseBirthDateFromZitadelMetadata(
  zitadelUser: ConnectedZitadelUser,
): Date | null {
  const safeDate = new Date(zitadelUser.zitadelMetadata.dateOfBirth);
  if (isNaN(safeDate.getTime())) return null;
  return safeDate;
}
