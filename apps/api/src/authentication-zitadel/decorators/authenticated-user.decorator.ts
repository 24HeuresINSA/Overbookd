import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ZitadelMetadata, ConnectedZitadelUser } from "../zitadel-types";
import { OidcRole, OIDC_ROLES_CLAIMS } from "@overbookd/oidc";

/**
 * Retrieves the current Zitadel logged-in user.
 */
export const AuthenticatedUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ConnectedZitadelUser => {
    const request = ctx.switchToHttp().getRequest();

    const userMetadataEncoded =
      request.user["urn:zitadel:iam:user:metadata"] ?? {};

    const userZitadelRoles = request.user[OIDC_ROLES_CLAIMS] ?? {};

    const userMetadataDecoded = {
      dateOfBirth: "",
    } satisfies ZitadelMetadata;

    // Decode all values
    Object.keys(userMetadataDecoded).forEach((key) => {
      if (userMetadataEncoded[key]) {
        userMetadataDecoded[key] = atob(userMetadataEncoded[key]);
      }
    });

    const userRoles = Object.keys(userZitadelRoles) as OidcRole[];

    return {
      email: request.user.email,
      family_name: request.user.family_name,
      gender: request.user.gender,
      given_name: request.user.given_name,
      phone_number: request.user.phone_number,
      sub: request.user.sub,
      zitadelRoles: userRoles,
      zitadelMetadata: userMetadataDecoded,
    };
  },
);
