import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './auth/dto/login.dto';
import { UserAccess } from './auth/entities/userAccess.entity';

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
    private authService: AuthService,
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
}
