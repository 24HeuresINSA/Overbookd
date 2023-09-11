import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./authentication/jwt-auth.guard";
import { MailTestRequestDto } from "./mail/dto/mail-test.request.dto";
import { MailService } from "./mail/mail.service";
import { Permission } from "./authentication/permissions-auth.decorator";
import { PermissionsGuard } from "./authentication/permissions-auth.guard";
import { JwtPayload } from "./authentication/entities/jwt-util.entity";
import { Request } from "express";
import { SEND_MAIL_TEST } from "@overbookd/permission";

/**
 * IMPORTANT: used in others controller like transactions
 */
export type RequestWithUserPayload = Request & {
  user: JwtPayload;
};

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private mailService: MailService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @ApiBody({
    description: "Route de test pour le service mail",
    type: MailTestRequestDto,
  })
  @ApiUnauthorizedResponse({
    description: "User dont have the right to access this route",
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(SEND_MAIL_TEST)
  @Post("mailtest")
  async mailtest(@Body() to: MailTestRequestDto) {
    return this.mailService.mailTest(to);
  }
}
