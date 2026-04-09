import { Module } from "@nestjs/common";
import { GrantPermission, RevokePermission } from "@overbookd/access-manager";
import { AccessManagerModule } from "../access-manager/access-manager.module";
import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";

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
