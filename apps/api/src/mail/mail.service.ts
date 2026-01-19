import {
  Logger,
  InternalServerErrorException,
  OnApplicationBootstrap,
  Injectable,
} from "@nestjs/common";
import { MailTestRequestDto } from "./dto/mail-test.request.dto";
import { DomainEventService } from "../domain-event/domain-event.service";
import {
  PreviewFestivalActivity,
  PreviewFestivalTask,
} from "@overbookd/festival-event";
import {
  FestivalTaskRejected,
  FestivalActivityRejected,
} from "@overbookd/domain-events";
import { nicknameOrName, Profile } from "@overbookd/user";
import { Membership } from "@overbookd/registration";
import {
  APPROVED,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
} from "@overbookd/festival-event-constants";
import { createTransport, SendMailOptions } from "nodemailer";
import { renderFile } from "ejs";
import { PrismaMembers } from "./repository/members.prisma";

type EmailResetPassword = {
  email: string;
  firstname: string;
  token: string;
};

type WelcomeNewcomer = {
  email: string;
  firstname: string;
  membership: Membership;
};

type EnrollVolunteer = {
  email: string;
  firstname: string;
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
  reason: FestivalActivityRejected["data"]["reason"];
};

type TaskRejected = {
  email: string;
  task: {
    id: PreviewFestivalTask["id"];
    name: PreviewFestivalTask["name"];
  };
  rejector: Member;
  reason: FestivalTaskRejected["data"]["reason"];
};

type ActivityValidated = {
  email: string;
  activity: {
    id: PreviewFestivalActivity["id"];
    name: PreviewFestivalActivity["name"];
  };
};

export type Members = {
  byId(id: number): Promise<Member | null>;
};

@Injectable()
export class MailService implements OnApplicationBootstrap {
  constructor(
    private readonly eventStore: DomainEventService,
    private readonly members: PrismaMembers,
  ) {}

  private logger = new Logger("MailService");

  onApplicationBootstrap() {
    this.eventStore.staffsRegistered.subscribe(({ data: event }) => {
      this.logger.log("Send welcome-staff mail");
      this.logger.debug(JSON.stringify(event));
      this.welcome(event);
    });

    this.eventStore.volunteersRegistered.subscribe(({ data: event }) => {
      this.logger.log("Send welcome-volunteer mail");
      this.logger.debug(JSON.stringify(event));
      this.welcome(event);
    });

    this.eventStore.volunteersEnrolled.subscribe(
      async ({ data: enrolling }) => {
        this.logger.log("Send volunteer-enrolled mail");
        this.logger.debug(JSON.stringify(enrolling));
        const volunteer = await this.members.byId(enrolling.candidate.id);
        this.enrollVolunteer(volunteer);
      },
    );

    this.eventStore.festivalActivityRejected.subscribe(
      async ({ data: rejected }) => {
        const { id, general, inCharge, reviews } = rejected.festivalActivity;

        const rejectionCount = Object.values(reviews).filter(
          (review) => review === REJECTED,
        ).length;
        const hasAlreadySentEmail = rejectionCount > 1;
        if (hasAlreadySentEmail) return;

        this.logger.log("Send festival-activity-rejected mail");
        const activity = { id, name: general.name };
        const reason = rejected.reason;

        const [rejector, { email }] = await Promise.all([
          this.members.byId(rejected.by),
          this.members.byId(inCharge.adherent.id),
        ]);

        this.festivalActivityRejected({ email, reason, rejector, activity });
      },
    );

    this.eventStore.festivalTaskRejected.subscribe(async ({ data: event }) => {
      const { id, general, reviews } = event.festivalTask;

      const rejectionCount = Object.values(reviews).filter(
        (review) => review === REJECTED,
      ).length;
      const hasAlreadySentEmail = rejectionCount > 1;
      if (hasAlreadySentEmail) return;

      this.logger.log("Send festival-task-rejected mail");
      const task = { id, name: general.name };
      const reason = event.reason;

      const [rejector, { email }] = await Promise.all([
        this.members.byId(event.by),
        this.members.byId(general.administrator.id),
      ]);

      this.festivalTaskRejected({ email, reason, rejector, task });
    });

    this.eventStore.festivalActivityApproved.subscribe(
      async ({ data: { festivalActivity } }) => {
        const { reviews, inCharge, general, id } = festivalActivity;
        const stillInReviewCount = Object.values(reviews).filter(
          (review) => review !== NOT_ASKING_TO_REVIEW && review !== APPROVED,
        ).length;
        if (stillInReviewCount > 0) return;

        this.logger.log("Send festival-activity-validated mail");
        const { email } = await this.members.byId(inCharge.adherent.id);
        const activity = { name: general.name, id };

        this.festivalActivityValidated({ email, activity });
      },
    );
  }

  async mailTest({ email, username }: MailTestRequestDto): Promise<void> {
    try {
      const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      const options: SendMailOptions = {
        from: `"Overbookd" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Mail de test de l'API Overbookd",
        template: "mail-test",
        html: await renderFile(__dirname + "/templates/mail-test.ejs", {
          username,
        }),
      };
      await transporter.sendMail(options);
      this.logger.log(`Testing mail sent to ${email}`);
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
      const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      const options: SendMailOptions = {
        from: `"Overbookd" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Réinitialisation de ton mot de passe Overbookd",
        template: "reset-password",
        html: await renderFile(__dirname + "/templates/reset-password.ejs", {
          firstname,
          resetLink: `https://${process.env.DOMAIN}/reset/${token}`,
        }),
      };
      await transporter.sendMail(options);
      this.logger.log(`Reset password mail sent to ${email}`);
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
      const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      const options: SendMailOptions = {
        from: `"Overbookd" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Bienvenue sur Overbookd !",
        template: `welcome-${membership.toLowerCase()}`,
        html: await renderFile(
          __dirname + `/templates/welcome-${membership.toLowerCase()}.ejs`,
          {
            email,
            firstname,
            loginLink: `https://${process.env.DOMAIN}/login`,
          },
        ),
      };
      await transporter.sendMail(options);
      this.logger.log(`Welcome mail sent to ${email}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async enrollVolunteer({ email, firstname }: EnrollVolunteer): Promise<void> {
    try {
      const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      const options: SendMailOptions = {
        from: `"Overbookd" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "[24h de l'INSA] Bienvenue dans l'équipe !",
        template: "volunteer-enrolled",
        html: await renderFile(
          __dirname + "/templates/volunteer-enrolled.ejs",
          { firstname },
        ),
      };
      await transporter.sendMail(options);
      this.logger.log(`enrolment mail sent to ${email}`);
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
      const rejectorName = nicknameOrName(rejector);
      const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      const options: SendMailOptions = {
        from: `"Overbookd" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `${activity.name} rejetée 🙀`,
        template: "festival-activity-rejected",
        html: await renderFile(
          __dirname + "/templates/festival-activity-rejected.ejs",
          {
            activityName: activity.name,
            rejectorName,
            reason,
            activityLink: `https://${process.env.DOMAIN}/fa/${activity.id}`,
          },
        ),
      };
      await transporter.sendMail(options);
      this.logger.log(
        `Festival activity rejected mail sent to ${email} for activity #${activity.id}`,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async festivalTaskRejected({ email, reason, rejector, task }: TaskRejected) {
    try {
      const rejectorName = nicknameOrName(rejector);
      const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      const options: SendMailOptions = {
        from: `"Overbookd" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `[FT] ${task.name} rejetée 🙀`,
        template: "festival-task-rejected",
        html: await renderFile(
          __dirname + "/templates/festival-task-rejected.ejs",
          {
            taskName: task.name,
            rejectorName,
            reason,
            taskLink: `https://${process.env.DOMAIN}/ft/${task.id}`,
          },
        ),
      };
      await transporter.sendMail(options);
      this.logger.log(
        `Festival task rejected mail sent to ${email} for task #${task.id}`,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async festivalActivityValidated({ email, activity }: ActivityValidated) {
    try {
      const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      const options: SendMailOptions = {
        from: `"Overbookd" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `${activity.name} validée 💫`,
        template: "festival-activity-validated",
        html: await renderFile(
          __dirname + "/templates/festival-activity-validated.ejs",
          {
            activityName: activity.name,
            statisticsLink: `https://${process.env.DOMAIN}/stats`,
          },
        ),
      };
      await transporter.sendMail(options);
      this.logger.log(
        `Festival activity validated mail sent to ${email} for activity #${activity.id}`,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
