import { SetMetadata } from "@nestjs/common";
import { OidcRole } from "@overbookd/oidc";

export const ROLES_METADATA = "zest_roles";

export const Roles = (...args: OidcRole[]) => SetMetadata(ROLES_METADATA, args);
