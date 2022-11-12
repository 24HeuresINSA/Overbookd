import { Logger, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { emailTestDto } from './dto/mailTest.dto';

export type emailResetPassword = {
  to: string;
  firstname: string;
  token: string;
};
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  private logger = new Logger('MailService');

  public mailTest({ to, username }: emailTestDto): void {
    this.mailerService
      .sendMail({
        to: to,
        subject: "Mail de test de l'API overbookd",
        template: 'mailTest',
        context: {
          username: username,
        },
      })
      .then(() => {
        this.logger.log(`Testing mail sent to ${to}`);
      });
  }

  public mailResetPassword({ to, firstname, token }: emailResetPassword): void {
    this.mailerService
      .sendMail({
        to: to,
        subject: 'Réinitialisation de ton mot de passe overbookd',
        template: 'resetPassword',
        context: {
          firstname: firstname,
          resetLink: `${process.env.DOMAIN}/reset/${token}`,
        },
      })
      .then(() => {
        this.logger.log(`Reset password mail sent to ${to}`);
      });
  }
}
