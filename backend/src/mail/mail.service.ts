import { Logger, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { emailTestDto } from './dto/mailTest.dto';

export type emailResetPassword = {
  email: string;
  firstname: string;
  token: string;
};
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  private logger = new Logger('MailService');

  async mailTest({ email, username }: emailTestDto): Promise<void> {
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
  }

  async mailResetPassword({
    email,
    firstname,
    token,
  }: emailResetPassword): Promise<void> {
    const mail = await this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation de ton mot de passe overbookd',
      template: 'resetPassword',
      context: {
        firstname: firstname,
        resetLink: `${process.env.DOMAIN}/reset/${token}`,
      },
    });

    if (mail) {
      this.logger.log(`Reset password mail sent to ${email}`);
    }
  }
}
