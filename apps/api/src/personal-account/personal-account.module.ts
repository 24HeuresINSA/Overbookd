import { Module } from "@nestjs/common";
import { PersonalAccountController } from "./personal-account.controller";
import { PrismaConfigurations } from "./repository/configurations.prisma";
import { PrismaService } from "../prisma.service";
import { PrismaModule } from "../prisma.module";
import { PersonalAccountService } from "./personal-account.service";
import { PrismaBarrels } from "./repository/barrels.prisma";
import { DefineBarrelPrice } from "@overbookd/personal-account";

@Module({
  controllers: [PersonalAccountController],
  providers: [
    {
      provide: PrismaConfigurations,
      useFactory: (prisma: PrismaService) => new PrismaConfigurations(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaBarrels,
      useFactory: (prisma: PrismaService) => new PrismaBarrels(prisma),
      inject: [PrismaService],
    },
    {
      provide: DefineBarrelPrice,
      useFactory: (barrels: PrismaBarrels) => new DefineBarrelPrice(barrels),
      inject: [PrismaBarrels],
    },
    {
      provide: PersonalAccountService,
      useFactory: (
        configurations: PrismaConfigurations,
        defineBarrelPrice: DefineBarrelPrice,
      ) => new PersonalAccountService(configurations, defineBarrelPrice),
      inject: [PrismaConfigurations, DefineBarrelPrice],
    },
  ],
  imports: [PrismaModule],
})
export class PersonalAccountModule {}
