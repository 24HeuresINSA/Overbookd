import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Roles } from './auth/team-auth.decorator';
import { RolesGuard } from './auth/team-auth.guard';
import { emailTestDto } from './mail/dto/mailTest.dto';
import { MailService } from './mail/mail.service';

type Role =
  | 'admin'
  | 'hard'
  | 'soft'
  | 'orga'
  | 'confiance'
  | 'vieux'
  | 'bureau'
  | 'sg'
  | 'log'
  | 'matos'
  | 'elec'
  | 'secu'
  | 'payant'
  | 'humain'
  | 'bar'
  | 'barrieres'
  | 'catering'
  | 'maman'
  | 'scene'
  | 'signa'
  | 'communication'
  | 'concerts'
  | 'courses'
  | 'culture'
  | 'dd'
  | 'deco'
  | 'informatique'
  | 'plaizir'
  | 'sponso'
  | 'sports';

export type JWTPayload = {
  email: string;
  id: number;
  role: Role[];
};

/**
 * IMPORTANT: used in ohters controller like transactions
 */
export type RequestWithUserPayload = Request & {
  user: JWTPayload;
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('mailtest')
  async mailtest(@Body() to: emailTestDto) {
    return this.mailService.mailTest(to);
  }
}
