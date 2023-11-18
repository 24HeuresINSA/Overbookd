import { Module } from "@nestjs/common";
import { PersonalAccountController } from "./personal-account.controller";
import { PrismaService } from "../prisma.service";
import { PrismaModule } from "../prisma.module";
import { PersonalAccountService } from "./personal-account.service";
import { PrismaBarrels } from "./repository/barrels.prisma";
import { DefineBarrelPrice } from "@overbookd/personal-account";

@Module({
  controllers: [PersonalAccountController],
  providers: [
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
      useFactory: (defineBarrelPrice: DefineBarrelPrice) =>
        new PersonalAccountService(defineBarrelPrice),
      inject: [DefineBarrelPrice],
    },
  ],
  imports: [PrismaModule],
})
export class PersonalAccountModule {}
