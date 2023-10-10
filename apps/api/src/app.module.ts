import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AssignmentModule } from "./assignment/assignment.module";
import { AuthenticationModule } from "./authentication/authentication.module";
import { CatalogModule } from "./catalog/catalog.module";
import { CharismaPeriodModule } from "./charisma-period/charisma-period.module";
import { CollaboratorModule } from "./collaborator/collaborator.module";
import { ConfigurationModule } from "./configuration/configuration.module";
import { FaFeedbackModule } from "./fa-feedback/fa-feedback.module";
import { FaModule } from "./fa/fa.module";
import { FaElectricityNeedModule } from "./fa-electricity-need/fa-electricity-need.module";
import { FaSignaNeedModule } from "./fa-signa-need/fa-signa-need.module";
import { PublicAnimationModule } from "./public-animation/public-animation.module";
import { FaTimeWindowModule } from "./fa-time-window/fa-time-window.module";
import { FriendModule } from "./friend/friend.module";
import { FtFeedbackModule } from "./ft-feedback/ft-feedback.module";
import { FtModule } from "./ft/ft.module";
import { FtReviewModule } from "./ft-review/ft-review.module";
import { FtTeamRequestModule } from "./ft-team-request/ft-team-request.module";
import { FtTimeWindowModule } from "./ft-time-window/ft-time-window.module";
import { FtUserRequestModule } from "./ft-user-request/ft-user-request.module";
import { GearRequestModule } from "./gear-request/gear-request.module";
import { HashingUtilsModule } from "./hashing-utils/hashing-utils.module";
import { HashingUtilsService } from "./hashing-utils/hashing-utils.service";
import { InventoryModule } from "./inventory/inventory.module";
import { NeedHelpModule } from "./need-help/need-help.module";
import { OrgaNeedsModule } from "./orga-needs/orga-needs.module";
import { PermissionModule } from "./permission/permission.module";
import { SignaLocationModule } from "./signa-location/signa-location.module";
import { TeamModule } from "./team/team.module";
import { TimelineModule } from "./timeline/timeline.module";
import { TransactionModule } from "./transaction/transaction.module";
import { UserModule } from "./user/user.module";
import { VolunteerAvailabilityModule } from "./volunteer-availability/volunteer-availability.module";
import { VolunteerPlanningModule } from "./volunteer-planning/volunteer-planning.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuardCustom } from "./throttler-custom.guard";
import { RegistrationModule } from "./registration/registration.module";
import { PrismaModule } from "./prisma.module";
import { MailModule } from "./mail/mail.module";
import { ContributionModule } from "./contribution/contribution.module";
import { CatalogSignageModule } from "./catalog-signage/catalog-signage.module";
import { AlertModule } from "./alert/alert.module";
import { NotificationModule } from "./notification/notification.module";
import { ONE_MINUTE_IN_MS } from "@overbookd/period";

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
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      },
      defaults: {
        from: `"Overbookd" <${process.env.GMAIL_USER}>`,
      },
      template: {
        dir: __dirname + "/mail/templates",
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
    PublicAnimationModule,
    PermissionModule,
    InventoryModule,
    FtModule,
    FtTimeWindowModule,
    GearRequestModule,
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
    RegistrationModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: ONE_MINUTE_IN_MS, limit: 500 }],
    }),
    RegistrationModule,
    PrismaModule,
    MailModule,
    ContributionModule,
    CatalogSignageModule,
    AlertModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    HashingUtilsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuardCustom,
    },
  ],
})
export class AppModule {}
