import { Module } from '@nestjs/common';
import { VolunteerPlanningService } from './volunteer-planning.service';
import { PrismaTaskRepository } from './task.repository.prisma';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { VolunteerPlanningController } from './volunteer-planning.controller';
import { SecretService } from './secret.service';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [VolunteerPlanningController],
  providers: [
    PrismaService,
    VolunteerPlanningService,
    { provide: 'TASK_REPOSITORY', useClass: PrismaTaskRepository },
    {
      provide: JwtService,
      useFactory: () =>
        new JwtService({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '90d' },
        }),
    },
    SecretService,
    SubscriptionService,
  ],
  exports: [
    VolunteerPlanningService,
    { provide: 'TASK_REPOSITORY', useClass: PrismaTaskRepository },
    {
      provide: JwtService,
      useFactory: () =>
        new JwtService({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '90d' },
        }),
    },
    SecretService,
    SubscriptionService,
  ],
})
export class VolunteerPlanningModule {}
