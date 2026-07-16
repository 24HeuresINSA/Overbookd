import { SetMetadata } from "@nestjs/common";
import { Permission as PermissionType } from "@overbookd/permission";

export const PERMISSIONS_KEY = "permissions";

export const Permissions = (...permissions: PermissionType[]) => {
  return SetMetadata(PERMISSIONS_KEY, permissions);
};
