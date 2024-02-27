import { Module } from "@nestjs/common";
import { AlertController } from "./alert.controller";
import { PrismaModule } from "../prisma.module";
import { PrismaAdherents } from "./repository/adherents.prisma";
import { PrismaService } from "../prisma.service";
import { PersonalAccountAlerting } from "@overbookd/personal-account";
import { AlertService } from "./alert.service";
import { SettleAlerting } from "@overbookd/contribution";
import { PrismaPermissions } from "./repository/permissions.prisma";
import { PrismaContributions } from "./repository/contributions.prisma";
import { PrismaProfilePictureAlerting } from "./repository/profile-picture-alerting.prisma";
import { PrismaNotVolunteerPeriods } from "./repository/not-volunteer-periods.prisma";
import { AvailabilitiesAlerting } from "@overbookd/volunteer-availability";

@Module({
  controllers: [AlertController],
  imports: [PrismaModule],
  providers: [
    {
      provide: PrismaAdherents,
      useFactory: (prisma: PrismaService) => new PrismaAdherents(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaPermissions,
      useFactory: (prisma: PrismaService) => new PrismaPermissions(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaContributions,
      useFactory: (prisma: PrismaService) => new PrismaContributions(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaNotVolunteerPeriods,
      useFactory: (prisma: PrismaService) =>
        new PrismaNotVolunteerPeriods(prisma),
      inject: [PrismaService],
    },
    {
      provide: PersonalAccountAlerting,
      useFactory: (adherents: PrismaAdherents) =>
        new PersonalAccountAlerting(adherents),
      inject: [PrismaAdherents],
    },
    {
      provide: SettleAlerting,
      useFactory: (
        permissions: PrismaPermissions,
        contributions: PrismaContributions,
      ) => new SettleAlerting(permissions, contributions),
      inject: [PrismaPermissions, PrismaContributions],
    },
    {
      provide: PrismaProfilePictureAlerting,
      useFactory: (prisma: PrismaService) =>
        new PrismaProfilePictureAlerting(prisma),
      inject: [PrismaService],
    },
    {
      provide: AvailabilitiesAlerting,
      useFactory: (volunteerPeriods: PrismaNotVolunteerPeriods) =>
        new AvailabilitiesAlerting(volunteerPeriods),
      inject: [PrismaNotVolunteerPeriods],
    },
    {
      provide: AlertService,
      useFactory: (
        personalAccount: PersonalAccountAlerting,
        contribution: SettleAlerting,
        profilePicture: PrismaProfilePictureAlerting,
        availabilities: AvailabilitiesAlerting,
      ) =>
        new AlertService(
          personalAccount,
          contribution,
          profilePicture,
          availabilities,
        ),
      inject: [
        PersonalAccountAlerting,
        SettleAlerting,
        PrismaProfilePictureAlerting,
        AvailabilitiesAlerting,
      ],
    },
  ],
  exports: [PersonalAccountAlerting],
})
export class AlertModule {}
