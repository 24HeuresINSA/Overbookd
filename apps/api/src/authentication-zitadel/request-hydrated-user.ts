import { Permission } from "@overbookd/permission";
import { ConnectedZitadelUser, ZitadelMetadata } from "./zitadel-types";
import {
  OIDC_METADATA_CLAIMS,
  OIDC_ROLES_CLAIMS,
  OverbookdOidcRole,
  oidcRoles,
} from "@overbookd/oidc";
import { isMobilePhoneNumberValid } from "@overbookd/registration";
import { RawRequestUserData } from "./guards/zitadel.auth.guard";

type ZitadelUserData = Omit<
  ConnectedZitadelUser,
  "given_name" | "family_name" | "phone_number" | "picture" | "sub"
> & {
  givenName: string;
  familyName: string;
  phoneNumber: string;
  zitadelId: string;
  birthDate: Date | undefined;
  profilePicture: string | undefined;
};

export type AdditionalOverbookdUserData = {
  id: number;
  permissions: Permission[];
  teams: string[];
};

export class RequestHydratedUser {
  readonly zitadelId: string;
  readonly email: string;
  readonly familyName: string;
  readonly givenName: string;
  readonly nickname?: string;
  readonly phoneNumber?: string;
  readonly birthDate?: Date;
  readonly profilePicture?: string;
  readonly zitadelRoles: OverbookdOidcRole[];
  readonly id?: number;
  readonly teams?: string[];
  readonly permissions?: Permission[];

  constructor(payload: ZitadelUserData & Partial<AdditionalOverbookdUserData>) {
    Object.assign(this, payload);
  }

  static fromRequestRawUser(user: RawRequestUserData) {
    const userZitadelRoles = user[`${OIDC_ROLES_CLAIMS}`] ?? {};
    const userMetadataEncoded = user[`${OIDC_METADATA_CLAIMS}`] ?? {};

    const userMetadataDecoded: ZitadelMetadata = { dateOfBirth: "" };
    Object.keys(userMetadataDecoded).forEach((key) => {
      if (userMetadataEncoded[`${key}`]) {
        userMetadataDecoded[`${key}`] = atob(userMetadataEncoded[`${key}`]);
      }
    });

    const userRoles = Object.keys(userZitadelRoles) as OverbookdOidcRole[];
    const birthDate = new Date(userMetadataDecoded.dateOfBirth);

    return new RequestHydratedUser({
      zitadelId: user.sub,
      email: user.email,
      familyName: user.family_name,
      givenName: user.given_name,
      nickname: user.nickname ?? undefined,
      phoneNumber:
        user.phone_number && isMobilePhoneNumberValid(user.phone_number)
          ? user.phone_number
          : undefined,
      zitadelRoles: userRoles,
      profilePicture: user.picture ?? undefined,
      birthDate: Number.isNaN(birthDate.getTime()) ? undefined : birthDate,
      ...user.overbookdData,
    });
  }

  get isAdmin(): boolean {
    return this.zitadelRoles.includes(oidcRoles.ADMIN);
  }

  can(permission: Permission): boolean {
    return this.isAdmin || this.permissions?.includes(permission);
  }

  isMemberOf(team: string): boolean {
    return this.isAdmin || this.teams?.includes(team);
  }
}
