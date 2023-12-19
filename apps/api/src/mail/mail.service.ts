import {
  Logger,
  InternalServerErrorException,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { MailTestRequestDto } from "./dto/mail-test.request.dto";
import { DomainEventService } from "../domain-event/domain-event.service";
import {
  PreviewFestivalActivity,
  REJECTED,
} from "@overbookd/festival-activity";
import { Rejected } from "@overbookd/domain-events";
import { Profile } from "@overbookd/user";

type EmailResetPassword = {
  email: string;
  firstname: string;
  token: string;
};

type WelcomeNewcomer = {
  email: string;
  firstname: string;
  membership: string;
};

export type Member = Pick<
  Profile,
  "email" | "firstname" | "lastname" | "nickname"
>;

type ActivityRejected = {
  email: string;
  activity: {
    id: PreviewFestivalActivity["id"];
    name: PreviewFestivalActivity["name"];
  };
  rejector: Member;
  reason: Rejected["reason"];
};

export type Members = {
  byId(id: number): Promise<Member | null>;
};

export class MailService implements OnApplicationBootstrap {
  constructor(
    private readonly mailerService: MailerService,
    private readonly eventStore: DomainEventService,
    private readonly members: Members,
  ) {}

  private logger = new Logger("MailService");

  onApplicationBootstrap() {
    this.eventStore.adherentsRegistered.subscribe((event) => {
      this.logger.log("Send welcome-adherent mail");
      this.logger.debug(JSON.stringify(event));
      this.welcome(event);
    });

    this.eventStore.volunteersRegistered.subscribe((event) => {
      this.logger.log("Send welcome-volunteer mail");
      this.logger.debug(JSON.stringify(event));
      this.welcome(event);
    });

    this.eventStore.rejectedFestivalActivity.subscribe(async (event) => {
      const { id, general, inCharge, reviews } = event.festivalActivity;

      const rejectionCount = Object.values(reviews).filter(
        (review) => review === REJECTED,
      ).length;
      const hasAlreadySentEmail = rejectionCount > 1;
      if (hasAlreadySentEmail) return;

      this.logger.log("Send festival-activity-rejected mail");
      const activity = { id, name: general.name };
      const reason = event.reason;

      const [rejector, { email }] = await Promise.all([
        this.members.byId(event.by),
        this.members.byId(inCharge.adherent.id),
      ]);

      this.festivalActivityRejected({ email, reason, rejector, activity });
    });
  }

  async mailTest({ email, username }: MailTestRequestDto): Promise<void> {
    try {
      const mail = await this.mailerService.sendMail({
        to: email,
        subject: "Mail de test de l'API Overbookd",
        template: "mail-test",
        context: {
          username: username,
        },
      });

      if (mail) {
        this.logger.log(`Testing mail sent to ${email}`);
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException("Can't send testing mail");
    }
  }

  async mailResetPassword({
    email,
    firstname,
    token,
  }: EmailResetPassword): Promise<void> {
    try {
      const mail = await this.mailerService.sendMail({
        to: email,
        subject: "Réinitialisation de ton mot de passe Overbookd",
        template: "reset-password",
        context: {
          firstname,
          resetLink: `https://${process.env.DOMAIN}/reset/${token}`,
        },
      });

      if (mail) {
        this.logger.log(`Reset password mail sent to ${email}`);
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException("Can't send reset password mail");
    }
  }

  async welcome({
    email,
    firstname,
    membership,
  }: WelcomeNewcomer): Promise<void> {
    try {
      const mail = await this.mailerService.sendMail({
        to: email,
        subject: "Bienvenue sur Overbookd !",
        template: `welcome-${membership}`,
        context: {
          email,
          firstname,
          loginLink: `https://${process.env.DOMAIN}/login`,
        },
      });
      if (mail) {
        this.logger.log(`Welcome mail sent to ${email}`);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async festivalActivityRejected({
    email,
    reason,
    rejector,
    activity,
  }: ActivityRejected) {
    try {
      const rejectorName = rejector.nickname
        ? `${rejector.nickname}`
        : `${rejector.firstname} ${rejector.lastname}`;
      const mail = await this.mailerService.sendMail({
        to: email,
        subject: "Fiche Activité rejetée 🙀",
        template: "festival-activity-rejected",
        context: {
          activityName: activity.name,
          rejectorName,
          reason,
          activityLink: `https://${process.env.DOMAIN}/fa/${activity.id}`,
        },
      });
      if (mail) {
        this.logger.log(
          `Festival activity rejected mail sent to ${email} for activity #${activity.id}`,
        );
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
