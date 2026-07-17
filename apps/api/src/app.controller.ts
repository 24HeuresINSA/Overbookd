import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { MailTestRequestDto } from "./mail/dto/mail-test.request.dto";
import { MailService } from "./mail/mail.service";
import { SEND_MAIL_TEST } from "@overbookd/permission";
import { ApiSwaggerResponse } from "./api-swagger-response.decorator";
import { Permissions } from "./authentication-zitadel/decorators/permissions-auth.decorator";
import { Public } from "./authentication-zitadel/decorators/public.decorator";

@Controller()
@ApiBearerAuth()
@ApiSwaggerResponse()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("mailtest")
  @Permissions(SEND_MAIL_TEST)
  @ApiBody({
    description: "Route de test pour le service mail",
    type: MailTestRequestDto,
  })
  async mailtest(@Body() to: MailTestRequestDto) {
    return this.mailService.mailTest(to);
  }
}
