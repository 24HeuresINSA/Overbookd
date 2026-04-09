import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { ONE_MINUTE_IN_MS } from "@overbookd/time";
import { AlertModule } from "./alert/alert.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AssignmentModule } from "./assignment/assignment.module";
import { AuthenticationModule } from "./authentication/authentication.module";
import { CatalogSignageModule } from "./catalog-signage/catalog-signage.module";
import { CharismaEventModule } from "./charisma-event/charisma-event.module";
import { CharismaPeriodModule } from "./charisma-period/charisma-period.module";
import { ConfigurationModule } from "./configuration/configuration.module";
import { ContributionModule } from "./contribution/contribution.module";
import { FestivalActivityModule } from "./festival-event/activity/festival-activity.module";
import { FestivalTaskModule } from "./festival-event/task/festival-task.module";
import { FriendModule } from "./friend/friend.module";
import { HashingUtilsModule } from "./hashing-utils/hashing-utils.module";
import { HashingUtilsService } from "./hashing-utils/hashing-utils.service";
import { LocationModule } from "./location/location.module";
import { LogisticModule } from "./logistic/logistic.module";
import { MailModule } from "./mail/mail.module";
import { NeedHelpModule } from "./need-help/need-help.module";
import { NotificationModule } from "./notification/notification.module";
import { OrgaNeedsModule } from "./orga-needs/orga-needs.module";
import { PermissionModule } from "./permission/permission.module";
import { PersonalAccountModule } from "./personal-account/personal-account.module";
import { PrismaModule } from "./prisma.module";
import { RegistrationModule } from "./registration/index/registration.module";
import { MembershipApplicationModule } from "./registration/membership-application/membership-application.module";
import { SharedMealModule } from "./shared-meal/shared-meal.module";
import { TeamModule } from "./team/team.module";
import { ThrottlerGuardCustom } from "./throttler-custom.guard";
import { TimelineModule } from "./timeline/timeline.module";
import { TransactionModule } from "./transaction/transaction.module";
import { PlanningModule } from "./user/planning/planning.module";
import { UserModule } from "./user/user.module";
import { VolunteerAvailabilityModule } from "./volunteer-availability/volunteer-availability.module";

@Module({
  imports: [
    AuthenticationModule,
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
  ],
})
export class AppModule {}
