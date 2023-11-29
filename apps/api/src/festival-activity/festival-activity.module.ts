import { Module } from "@nestjs/common";
import { FestivalActivityController } from "./festival-activity.controller";
import { FestivalActivityService } from "./festival-activity.service";
import { PrismaAdherent } from "./repository/adherent-repository.prisma";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import {
  CreateFestivalActivity,
  PrepareFestivalActivity,
} from "@overbookd/festival-activity";
import { PrismaPrepareFestivalActivity } from "./repository/prepare-festival-activity.prisma";
import { PrismaCreateFestivalActivity } from "./repository/create-festival-activity.prisma";
import { PrismaLocation } from "./repository/location-repository.prisma";

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
      provide: PrismaPrepareFestivalActivity,
      useFactory: (prisma: PrismaService) =>
        new PrismaPrepareFestivalActivity(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaAdherent,
      useFactory: (prisma: PrismaService) =>
        new PrismaAdherent(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaLocation,
      useFactory: (prisma: PrismaService) =>
        new PrismaLocation(prisma),
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
        festivalActivities: PrismaPrepareFestivalActivity,
      ) => new PrepareFestivalActivity(festivalActivities),
      inject: [PrismaPrepareFestivalActivity],
    },
    {
      provide: FestivalActivityService,
      useFactory: (
        adherents: PrismaAdherent,
        locations: PrismaLocation,
        create: CreateFestivalActivity,
        prepare: PrepareFestivalActivity,
      ) => new FestivalActivityService(adherents, locations, create, prepare),
      inject: [
        PrismaAdherent,
        PrismaLocation,
        CreateFestivalActivity,
        PrepareFestivalActivity,
      ],
    },
  ],
  imports: [PrismaModule],
})
export class FestivalActivityModule {}
