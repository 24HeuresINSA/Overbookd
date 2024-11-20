import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";
import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../prisma.module";
import { AccessManagerModule } from "../access-manager/access-manager.module";
import { GrantPermission, RevokePermission } from "@overbookd/access-manager";

@Module({
  imports: [MailModule, PrismaModule, AccessManagerModule],
  controllers: [PermissionController],
  providers: [
    PrismaService,
    {
      provide: PermissionService,
      useFactory: (
        prisma: PrismaService,
        grantPermission: GrantPermission,
        revokePermission: RevokePermission,
      ) => new PermissionService(prisma, grantPermission, revokePermission),
      inject: [PrismaService, GrantPermission, RevokePermission],
    },
  ],
  exports: [PermissionService],
})
export class PermissionModule {}
