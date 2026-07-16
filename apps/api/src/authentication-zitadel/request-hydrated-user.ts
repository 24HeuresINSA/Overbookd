import { Permission } from "@overbookd/permission";
import { ConnectedZitadelUser, ZitadelMetadata } from "./zitadel-types";
import {
  OIDC_METADATA_CLAIMS,
  OIDC_ROLES_CLAIMS,
  OidcRole,
  oidcRoles,
} from "@overbookd/oidc";
import { RawRequestUserData } from "./guards/zitadel.auth.guard";

type ZitadelUserData = Omit<
  ConnectedZitadelUser,
  "given_name" | "family_name" | "phone_number" | "sub"
> & {
  givenName: string;
  familyName: string;
  phoneNumber: string;
  zitadelId: string;
  birthDate: Date | null;
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
  readonly phoneNumber: string;
  readonly birthDate: Date | null;
  readonly zitadelRoles: OidcRole[];
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

    const userRoles = Object.keys(userZitadelRoles) as OidcRole[];
    const birthDate = new Date(userMetadataDecoded.dateOfBirth);

    return new RequestHydratedUser({
      email: user.email,
      familyName: user.family_name,
      givenName: user.given_name,
      phoneNumber: user.phone_number,
      zitadelId: user.sub,
      zitadelRoles: userRoles,
      birthDate: Number.isNaN(birthDate.getTime()) ? null : birthDate,
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
