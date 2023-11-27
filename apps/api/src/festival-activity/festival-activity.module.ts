import { Module } from "@nestjs/common";
import { FestivalActivityController } from "./festival-activity.controller";
import { FestivalActivityService } from "./festival-activity.service";
import { PrismaAdherentRepository } from "./repository/adherent-repository.prisma";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import {
  CreateFestivalActivity,
  InMemoryCreateFestivalActivityRepository,
  PrepareFestivalActivity,
} from "@overbookd/festival-activity";
import { PrismaPrepareFestivalActivityRepository } from "./repository/prepare-festival-activity.prisma";

@Module({
  controllers: [FestivalActivityController],
  providers: [
    {
      provide: InMemoryCreateFestivalActivityRepository,
      useFactory: () => new InMemoryCreateFestivalActivityRepository(),
    },
    {
      provide: PrismaPrepareFestivalActivityRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaPrepareFestivalActivityRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaAdherentRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaAdherentRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: CreateFestivalActivity,
      useFactory: (
        festivalActivities: InMemoryCreateFestivalActivityRepository,
      ) => new CreateFestivalActivity(festivalActivities),
      inject: [InMemoryCreateFestivalActivityRepository],
    },
    {
      provide: PrepareFestivalActivity,
      useFactory: (
        festivalActivities: PrismaPrepareFestivalActivityRepository,
      ) => new PrepareFestivalActivity(festivalActivities),
      inject: [PrismaPrepareFestivalActivityRepository],
    },
    {
      provide: FestivalActivityService,
      useFactory: (
        adherents: PrismaAdherentRepository,
        create: CreateFestivalActivity,
        prepare: PrepareFestivalActivity,
      ) => new FestivalActivityService(adherents, create, prepare),
      inject: [
        PrismaAdherentRepository,
        CreateFestivalActivity,
        PrepareFestivalActivity,
      ],
    },
  ],
  imports: [PrismaModule],
})
export class FestivalActivityModule {}
