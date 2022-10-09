import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Express.Request) {
    return this.authService.login(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async getTest() {
    return 'oui';
  }
}
