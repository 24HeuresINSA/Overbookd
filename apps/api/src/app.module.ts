import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AssignmentModule } from "./assignment/assignment.module";
import { AuthenticationModule } from "./authentication/authentication.module";
import { CharismaPeriodModule } from "./charisma-period/charisma-period.module";
import { ConfigurationModule } from "./configuration/configuration.module";
import { FriendModule } from "./friend/friend.module";
import { HashingUtilsModule } from "./hashing-utils/hashing-utils.module";
import { HashingUtilsService } from "./hashing-utils/hashing-utils.service";
import { NeedHelpModule } from "./need-help/need-help.module";
import { OrgaNeedsModule } from "./orga-needs/orga-needs.module";
import { PermissionModule } from "./permission/permission.module";
import { LocationModule } from "./location/location.module";
import { TeamModule } from "./team/team.module";
import { TimelineModule } from "./timeline/timeline.module";
import { TransactionModule } from "./transaction/transaction.module";
import { UserModule } from "./user/user.module";
import { VolunteerAvailabilityModule } from "./volunteer-availability/volunteer-availability.module";
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
import { FestivalActivityModule } from "./festival-event/activity/festival-activity.module";
import { ONE_MINUTE_IN_MS } from "@overbookd/time";
import { PersonalAccountModule } from "./personal-account/personal-account.module";
import { SharedMealModule } from "./shared-meal/shared-meal.module";
import { LogisticModule } from "./logistic/logistic.module";
import { FestivalTaskModule } from "./festival-event/task/festival-task.module";
import { PlanningModule } from "./user/planning/planning.module";
import { CharismaEventModule } from "./charisma-event/charisma-event.module";

@Module({
  imports: [
    AuthenticationModule,
    UserModule,
    HashingUtilsModule,
    TeamModule,
    TransactionModule,
    FestivalActivityModule,
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
    ConfigurationModule,
    LocationModule,
    PermissionModule,
    CharismaPeriodModule,
    CharismaEventModule,
    VolunteerAvailabilityModule,
    FriendModule,
    AssignmentModule,
    OrgaNeedsModule,
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
    PersonalAccountModule,
    SharedMealModule,
    LogisticModule,
    FestivalTaskModule,
    PlanningModule,
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
