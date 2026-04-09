import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BreakPeriods } from "@overbookd/planning";
import { jwtConstants } from "../../authentication/jwt-constants";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { Planning } from "./domain/planning";
import { PlanningService, PlanningVolunteers } from "./planning.service";
import { PlanningRenderStrategy } from "./render/render-strategy";
import { PrismaBreaks } from "./repository/breaks.prisma";
import { PrismaPlanningVolunteers } from "./repository/planning-volunteers.prisma";
import { PrismaTaskRepository } from "./repository/task.repository.prisma";
import { SecretService } from "./secret.service";
import { SubscriptionService } from "./subscription.service";

@Module({
  providers: [
    {
      provide: PrismaBreaks,
      useFactory: (prisma: PrismaService) => new PrismaBreaks(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaPlanningVolunteers,
      useFactory: (prisma: PrismaService) =>
        new PrismaPlanningVolunteers(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaTaskRepository,
      useFactory: (prisma: PrismaService) => new PrismaTaskRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: BreakPeriods,
      useFactory: (breaks: PrismaBreaks) => new BreakPeriods(breaks),
      inject: [PrismaBreaks],
    },
    {
      provide: Planning,
      useFactory: (tasks: PrismaTaskRepository) => new Planning(tasks),
      inject: [PrismaTaskRepository],
    },
    {
      provide: PlanningRenderStrategy,
      useFactory: (volunteers: PlanningVolunteers) =>
        new PlanningRenderStrategy(volunteers),
      inject: [PrismaPlanningVolunteers],
    },
    {
      provide: JwtService,
      useFactory: () =>
        new JwtService({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "90d" },
        }),
    },
    {
      provide: SecretService,
      useFactory: (jwt: JwtService) => new SecretService(jwt),
      inject: [JwtService],
    },
    {
      provide: SubscriptionService,
      useFactory: (secret: SecretService) => new SubscriptionService(secret),
      inject: [SecretService],
    },
    {
      provide: PlanningService,
      useFactory: (
        planning: Planning,
        breaks: BreakPeriods,
        volunteers: PlanningVolunteers,
        renderStrategy: PlanningRenderStrategy,
        subscription: SubscriptionService,
      ) =>
        new PlanningService(
          { planning, breaks, renderStrategy },
          { volunteers },
          subscription,
        ),
      inject: [
        Planning,
        BreakPeriods,
        PrismaPlanningVolunteers,
        PlanningRenderStrategy,
        SubscriptionService,
      ],
    },
  ],
  imports: [PrismaModule],
  exports: [PlanningService, SubscriptionService, SecretService],
})
export class PlanningModule {}
