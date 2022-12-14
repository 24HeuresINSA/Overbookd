import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { emailTestDto } from './mail/dto/mailTest.dto';
import { MailService } from './mail/mail.service';
import { Permissions } from './auth/permissions-auth.decorator';
import { PermissionsGuard } from './auth/permissions-auth.guard';
import { JwtPayload } from './auth/auth.service';

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
    description: 'Route de test pour le service mail',
    type: emailTestDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User dont have the right to access this route',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('admin')
  @Post('mailtest')
  async mailtest(@Body() to: emailTestDto) {
    return this.mailService.mailTest(to);
  }
}
