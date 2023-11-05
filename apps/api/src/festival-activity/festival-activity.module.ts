import { Module } from "@nestjs/common";
import { FestivalActivityController } from "./festival-activity.controller";
import { FestivalActivityService } from "./festival-activity.service";
import { PrismaAdherentRepository } from "./repository/adherent-repository.prisma";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import {
  CreateFestivalActivity,
  InMemoryCreateFestivalActivityRepository,
  InMemoryPrepareFestivalActivityRepository,
  PrepareFestivalActivity,
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
      provide: CreateFestivalActivity,
      useFactory: (
        festivalActivities: InMemoryCreateFestivalActivityRepository,
      ) => new CreateFestivalActivity(festivalActivities),
      inject: [InMemoryCreateFestivalActivityRepository],
    },
    {
      provide: PrepareFestivalActivity,
      useFactory: (
        festivalActivities: InMemoryPrepareFestivalActivityRepository,
      ) => new PrepareFestivalActivity(festivalActivities),
      inject: [InMemoryPrepareFestivalActivityRepository],
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
