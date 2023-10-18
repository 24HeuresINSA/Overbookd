import {
  Logger,
  Injectable,
  InternalServerErrorException,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { MailTestRequestDto } from "./dto/mail-test.request.dto";
import { DomainEventService } from "../domain-event/domain-event.service";

type emailResetPassword = {
  email: string;
  firstname: string;
  token: string;
};

type welcomeNewcomer = {
  email: string;
  firstname: string;
  membership: string;
};

@Injectable()
export class MailService implements OnApplicationBootstrap {
  constructor(
    private readonly mailerService: MailerService,
    private readonly eventStore: DomainEventService,
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
  }: emailResetPassword): Promise<void> {
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
  }: welcomeNewcomer): Promise<void> {
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
}
