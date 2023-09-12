import { SetMetadata } from "@nestjs/common";
import { Permission as PermissionType } from "@overbookd/permission";

export const Permission = (permission: PermissionType) =>
  SetMetadata("permission", permission);
