import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./authentication/jwt-auth.guard";
import { MailTestRequestDto } from "./mail/dto/mail-test.request.dto";
import { MailService } from "./mail/mail.service";
import { Permission } from "./authentication/permissions-auth.decorator";
import { PermissionsGuard } from "./authentication/permissions-auth.guard";
import { JwtPayload } from "./authentication/entities/jwt-util.entity";
import { Request } from "express";
import { SEND_MAIL_TEST } from "@overbookd/permission";
import { ApiSwaggerResponse } from "./api-swagger-response.decorator";

/**
 * IMPORTANT: used in others controller like transactions
 */
export type RequestWithUserPayload = Request & {
  user: JwtPayload;
};

@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiSwaggerResponse()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private mailService: MailService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("mailtest")
  @Permission(SEND_MAIL_TEST)
  @ApiBody({
    description: "Route de test pour le service mail",
    type: MailTestRequestDto,
  })
  async mailtest(@Body() to: MailTestRequestDto) {
    return this.mailService.mailTest(to);
  }
}
