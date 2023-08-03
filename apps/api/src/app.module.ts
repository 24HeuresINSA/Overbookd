import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssignmentModule } from './assignment/assignment.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CatalogModule } from './catalog/catalog.module';
import { CharismaPeriodModule } from './charisma-period/charismaPeriod.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { FaFeedbackModule } from './fa-feedback/faFeedback.module';
import { FaModule } from './fa/fa.module';
import { FaElectricityNeedModule } from './fa-electricity-need/faElectricityNeed.module';
import { FaSignaNeedModule } from './fa-signa-need/faSignaNeed.module';
import { FaSitePublishAnimationModule } from './fa-site-publish-animation/faSitePublishAnimation.module';
import { FaTimeWindowModule } from './fa-time-window/faTimeWindow.module';
import { FriendModule } from './friend/friend.module';
import { FtFeedbackModule } from './ft-feedback/ftFeedback.module';
import { FtModule } from './ft/ft.module';
import { FtReviewModule } from './ft-review/ftReview.module';
import { FtTeamRequestModule } from './ft-team-request/ftTeamRequest.module';
import { FtTimeWindowModule } from './ft-time-window/ftTimeWindow.module';
import { FtUserRequestModule } from './ft-user-request/ftUserRequest.module';
import { GearRequestsModule } from './gear-requests/gearRequests.module';
import { HashingUtilsModule } from './hashing-utils/hashing-utils.module';
import { HashingUtilsService } from './hashing-utils/hashing-utils.service';
import { InventoryModule } from './inventory/inventory.module';
import { MailService } from './mail/mail.service';
import { NeedHelpModule } from './need-help/needHelp.module';
import { OrgaNeedsModule } from './orga-needs/orga-needs.module';
import { PermissionModule } from './permission/permission.module';
import { PrismaService } from './prisma.service';
import { SignaLocationModule } from './signa-location/signa_location.module';
import { TeamModule } from './team/team.module';
import { TimelineModule } from './timeline/timeline.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { VolunteerAvailabilityModule } from './volunteer-availability/volunteer-availability.module';
import { VolunteerPlanningModule } from './volunteer-planning/volunteer-planning.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuardCustom } from './throttler-custom.guard';

@Module({
  imports: [
    AuthenticationModule,
    UserModule,
    HashingUtilsModule,
    TeamModule,
    TransactionModule,
    FaModule,
    CollaboratorModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      },
      defaults: {
        from: `"Overbookd" <${process.env.GMAIL_USER}>`,
      },
      template: {
        dir: __dirname + '/mail/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
    FaSignaNeedModule,
    FaFeedbackModule,
    FaTimeWindowModule,
    FaElectricityNeedModule,
    CatalogModule,
    CatalogModule,
    ConfigurationModule,
    SignaLocationModule,
    FaSitePublishAnimationModule,
    PermissionModule,
    InventoryModule,
    FtModule,
    FtTimeWindowModule,
    GearRequestsModule,
    FtFeedbackModule,
    FtUserRequestModule,
    FtReviewModule,
    FtTeamRequestModule,
    CharismaPeriodModule,
    VolunteerAvailabilityModule,
    FriendModule,
    AssignmentModule,
    OrgaNeedsModule,
    VolunteerPlanningModule,
    TimelineModule,
    NeedHelpModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 500,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    HashingUtilsService,
    MailService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuardCustom,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
