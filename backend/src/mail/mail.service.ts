import { Logger, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { emailTestDto } from './dto/mailTest.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  private logger = new Logger('MailService');

  public mailTest(object: emailTestDto): void {
    this.mailerService
      .sendMail({
        to: object.to,
        subject: "Mail de tes de l'API overbookd",
        template: 'mailTest',
        context: {
          username: object.username,
        },
      })
      .then(() => {
        this.logger.log(`Testing mail sent to ${object.to}`);
      })
      .catch((e) => {
        console.log('Mail not sent');
        console.log(e);
      });
  }
}
