import { Module } from "@nestjs/common";
import { FestivalActivityController } from "./festival-activity.controller";
import { FestivalActivityService } from "./festival-activity.service";
import { PrismaAdherentRepository } from "./repository/adherent-repository.prisma";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import {
  CreateFestivalActivity,
  PrepareFestivalActivity,
} from "@overbookd/festival-activity";
import { PrismaPrepareFestivalActivityRepository } from "./repository/prepare-festival-activity.prisma";
import { PrismaCreateFestivalActivity } from "./repository/create-festival-activity.prisma";
import { PrismaLocationRepository } from "./repository/location-repository.prisma";

@Module({
  controllers: [FestivalActivityController],
  providers: [
    {
      provide: PrismaCreateFestivalActivity,
      useFactory: (prisma: PrismaService) =>
        new PrismaCreateFestivalActivity(prisma),
      inject: [PrismaService],
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
      provide: PrismaLocationRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaLocationRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: CreateFestivalActivity,
      useFactory: async (
        festivalActivities: PrismaCreateFestivalActivity,
        prisma: PrismaService,
      ) => {
        const {
          _max: { id: maxId },
        } = await prisma.festivalActivity.aggregate({ _max: { id: true } });
        return new CreateFestivalActivity(festivalActivities, maxId + 1);
      },
      inject: [PrismaCreateFestivalActivity, PrismaService],
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
        locations: PrismaLocationRepository,
        create: CreateFestivalActivity,
        prepare: PrepareFestivalActivity,
      ) => new FestivalActivityService(adherents, locations, create, prepare),
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
