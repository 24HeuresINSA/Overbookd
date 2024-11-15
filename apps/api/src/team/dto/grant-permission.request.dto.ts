import { ApiProperty } from "@nestjs/swagger";
import { type Permission, permissions } from "@overbookd/permission";
import { IsEnum } from "class-validator";

export class GrantPermissionRequestDto {
  @ApiProperty({
    required: true,
    description: "The permission to grant to the team",
    enum: permissions,
  })
  @IsEnum(permissions, {
    message: (validationArgument) =>
      `La permission ${validationArgument.value} n'est pas connue`,
  })
  permission: Permission;
}
