import { Module } from "@nestjs/common";
import { AppController } from "../src/app.controller";
import { AppService } from "../src/app.service";
import { MailService } from "../src/mail/mail.service";

@Module({
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppTestModule {}
