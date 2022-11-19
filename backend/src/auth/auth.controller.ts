import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { userEmailDto } from '../user/dto/userEmail.dto';
import { MailService } from '../mail/mail.service';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { LoginDto } from './dto/login.dto';
import { UserAccess } from './entities/userAccess.entity';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}

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

  @ApiBody({
    description:
      "Route pour la premeire partie de la procedure de reset de mot de passe, envoie un mail a l'utilisateur",
    type: userEmailDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Post('forgot')
  async forgot(@Body() user: userEmailDto) {
    return this.authService.forgot(user);
  }

  @ApiBody({
    description:
      'Route pour la seconde partie procedure de reset de mot de passe, enregistre le nouveau mot de passe',
    type: ResetPasswordDto,
  })
  @ApiBadRequestResponse({
    description: "Password don't match or don't respect the rules",
  })
  @ApiUnauthorizedResponse({
    description: 'Token expired',
  })
  @Post('reset')
  async reset(@Body() userTokenAndPassword: ResetPasswordDto) {
    return this.authService.recoverPassword(userTokenAndPassword);
  }
}
