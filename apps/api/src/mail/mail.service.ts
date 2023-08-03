import {
  Logger,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailTestRequestDto } from './dto/mail-test.request.dto';

type emailResetPassword = {
  email: string;
  firstname: string;
  token: string;
};
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  private logger = new Logger('MailService');

  async mailTest({ email, username }: MailTestRequestDto): Promise<void> {
    try {
      const mail = await this.mailerService.sendMail({
        to: email,
        subject: "Mail de test de l'API overbookd",
        template: 'mailTest',
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
        subject: 'Réinitialisation de ton mot de passe overbookd',
        template: 'resetPassword',
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

  async mailWelcome({
    email,
    firstname,
  }: {
    email: string;
    firstname: string;
  }): Promise<void> {
    try {
      const mail = await this.mailerService.sendMail({
        to: email,
        subject: 'Bienvenue sur Overbookd !',
        template: 'welcome',
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
      throw new InternalServerErrorException("Can't send welcome mail");
    }
  }
}
