import { Module } from "@nestjs/common";
import { PersonalAccountController } from "./personal-account.controller";
import { PrismaConfigurations } from "./repository/configurations.prisma";
import { PrismaService } from "../prisma.service";
import { PrismaModule } from "../prisma.module";
import { PersonalAccountService } from "./personal-account.service";

@Module({
  controllers: [PersonalAccountController],
  providers: [
    {
      provide: PrismaConfigurations,
      useFactory: (prisma: PrismaService) => new PrismaConfigurations(prisma),
      inject: [PrismaService],
    },
    {
      provide: PersonalAccountService,
      useFactory: (configurations: PrismaConfigurations) =>
        new PersonalAccountService(configurations),
      inject: [PrismaConfigurations],
    },
  ],
  imports: [PrismaModule],
})
export class PersonalAccountModule {}
