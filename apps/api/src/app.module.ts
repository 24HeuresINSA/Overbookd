import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AssignmentModule } from "./assignment/assignment.module";
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
import { RegistrationModule } from "./registration/index/registration.module";
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
import { MembershipApplicationModule } from "./registration/membership-application/membership-application.module";
import { ZitadelAuthModule } from "./authentication-zitadel/zitadel-auth.module";
import { ZitadelAuthGuard } from "./authentication-zitadel/guards/zitadel.auth.guard";
import { PermissionsGuard } from "./authentication-zitadel/guards/permissions-auth.guard";

@Module({
  imports: [
    ZitadelAuthModule.forRoot({
      authority: process.env.ZITADEL_BASE_URL,
      authorization: {
        type: "jwt-profile",
        profile: {
          type: "application",
          keyId: process.env.ZITADEL_KEY_ID,
          key: process.env.ZITADEL_KEY,
          appId: process.env.ZITADEL_APP_ID,
          clientId: process.env.ZITADEL_CLIENT_ID,
        },
      },
    }),
    UserModule,
    HashingUtilsModule,
    TeamModule,
    TransactionModule,
    FestivalActivityModule,
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
    MembershipApplicationModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: ONE_MINUTE_IN_MS, limit: 500 }],
    }),
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
    {
      provide: APP_GUARD,
      useClass: ZitadelAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
