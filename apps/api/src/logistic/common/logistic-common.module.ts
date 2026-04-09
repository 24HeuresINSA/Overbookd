import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { PrismaFindGears } from "./repositories/find-gears.prisma";

@Module({
  providers: [
    {
      provide: PrismaFindGears,
      useFactory: (prisma: PrismaService) => new PrismaFindGears(prisma),
      inject: [PrismaService],
    },
  ],
  imports: [PrismaModule],
  exports: [PrismaFindGears],
})
export class LogisticCommonModule {}
