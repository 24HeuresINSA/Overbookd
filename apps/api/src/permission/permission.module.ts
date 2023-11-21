import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";
import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../prisma.module";

@Module({
  imports: [MailModule, PrismaModule],
  controllers: [PermissionController],
  providers: [PermissionService, PrismaService],
})
export class PermissionModule {}
