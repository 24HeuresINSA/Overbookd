import { Module } from "@nestjs/common";
import { FestivalActivityController } from "./festival-activity.controller";
import { FestivalActivityService } from "./festival-activity.service";
import { InMemoryFestivalActivityRepository } from "./repository/festival-activity-repository.inmemory";
import { PrismaAdherentRepository } from "./repository/adherent-repository.prisma";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";

@Module({
  controllers: [FestivalActivityController],
  providers: [
    {
      provide: InMemoryFestivalActivityRepository,
      useFactory: () => new InMemoryFestivalActivityRepository(),
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
        festivalActivities: InMemoryFestivalActivityRepository,
      ) => new FestivalActivityService(adherents, festivalActivities),
      inject: [PrismaAdherentRepository, InMemoryFestivalActivityRepository],
    },
  ],
  imports: [PrismaModule],
})
export class FestivalActivityModule {}
