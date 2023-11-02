import { Module } from "@nestjs/common";
import { FestivalActivityController } from "./festival-activity.controller";
import { FestivalActivityService } from "./festival-activity.service";
import { PrismaAdherentRepository } from "./repository/adherent-repository.prisma";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import {
  InMemoryCreateFestivalActivityRepository,
  InMemoryPrepareFestivalActivityRepository,
} from "@overbookd/festival-activity";

@Module({
  controllers: [FestivalActivityController],
  providers: [
    {
      provide: InMemoryCreateFestivalActivityRepository,
      useFactory: () => new InMemoryCreateFestivalActivityRepository(),
    },
    {
      provide: InMemoryPrepareFestivalActivityRepository,
      useFactory: () => new InMemoryPrepareFestivalActivityRepository(),
    },
    {
      provide: PrismaAdherentRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaAdherentRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: FestivalActivityService,
      useFactory: (
        adherents: PrismaAdherentRepository,
        create: InMemoryCreateFestivalActivityRepository,
        prepare: InMemoryPrepareFestivalActivityRepository,
      ) => new FestivalActivityService(adherents, create, prepare),
      inject: [
        PrismaAdherentRepository,
        InMemoryCreateFestivalActivityRepository,
        InMemoryPrepareFestivalActivityRepository,
      ],
    },
  ],
  imports: [PrismaModule],
})
export class FestivalActivityModule {}
