import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { PrismaGears } from "./repository/gears.prisma";
import { PrismaModule } from "../../prisma.module";

@Module({
  providers: [
    {
      provide: PrismaGears,
      useFactory: (prisma: PrismaService) => new PrismaGears(prisma),
      inject: [PrismaService],
    },
  ],
  imports: [PrismaModule],
  exports: [PrismaGears],
})
export class LogisticCommonModule {}
