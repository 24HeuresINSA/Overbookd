import { Module } from "@nestjs/common";
import { DefineBarrelPrice } from "@overbookd/personal-account";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { PersonalAccountController } from "./personal-account.controller";
import { PersonalAccountService } from "./personal-account.service";
import { PrismaBarrels } from "./repository/barrels.prisma";

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
