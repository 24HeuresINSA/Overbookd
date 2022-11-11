import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { MailService } from './mail/mail.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './auth/dto/login.dto';
import { UserAccess } from './auth/entities/userAccess.entity';
import { emailTestDto } from './mail/dto/mailTest.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/team-auth.guard';
import { Roles } from './auth/team-auth.decorator';
import { userEmailDto } from './user/dto/userEmail.dto';
import { ResetPasswordDto } from './auth/dto/resetPassword.dto';

export type Role =
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
  username: string;
  userId: number;
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
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  @ApiBody({
    description: 'Route de connection',
    type: LoginDto,
  })
  @ApiCreatedResponse({
    description: 'User access token',
    type: UserAccess,
  })
  @ApiUnauthorizedResponse({
    description: 'Wrong email or password',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async login(@Body() userCredentials: LoginDto) {
    return this.authService.login(userCredentials);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('mailtest')
  async mailtest(@Body() to: emailTestDto) {
    return this.mailService.mailTest(to);
  }

  @Post('forgot')
  async forgot(@Body() user: userEmailDto) {
    return this.authService.forgot(user);
  }

  @Post('reset')
  async reset(@Body() userTokenAndPassword: ResetPasswordDto) {
    return this.authService.recoverPassword(userTokenAndPassword);
  }
}
