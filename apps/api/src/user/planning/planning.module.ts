import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BreakPeriods } from "@overbookd/planning";
import { jwtConstants } from "../../authentication/jwt-constants";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { Planning } from "./domain/planning";
import { PlanningService, Volunteers } from "./planning.service";
import { PrismaBreaks } from "./repository/breaks.prisma";
import { PrismaTaskRepository } from "./repository/task.repository.prisma";
import { PrismaVolunteers } from "./repository/volunteers.prisma";
import { SecretService } from "./secret.service";
import { SubscriptionService } from "./subscription.service";
import { PlanningRenderStrategy } from "./render/render-strategy";

@Module({
  providers: [
    {
      provide: PrismaBreaks,
      useFactory: (prisma: PrismaService) => new PrismaBreaks(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaVolunteers,
      useFactory: (prisma: PrismaService) => new PrismaVolunteers(prisma),
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
      useFactory: (volunteers: Volunteers) =>
        new PlanningRenderStrategy(volunteers),
      inject: [PrismaVolunteers],
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
        volunteers: Volunteers,
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
        PrismaVolunteers,
        PlanningRenderStrategy,
        SubscriptionService,
      ],
    },
  ],
  imports: [PrismaModule],
  exports: [PlanningService, SubscriptionService, SecretService],
})
export class PlanningModule {}
