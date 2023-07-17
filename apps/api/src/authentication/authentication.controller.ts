import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ForgotPasswordRequestDto } from './dto/forgotPasswordRequest.dto';
import { AuthenticationService } from './authentication.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { LoginDto } from './dto/login.dto';
import { UserAccess } from './dto/userAccess.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('authentication')
@Controller()
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Throttle(10, 30)
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

  @Throttle(2, 60)
  @ApiBody({
    description:
      "Route pour la premiere partie de la procedure de reset de mot de passe, envoie un mail a l'utilisateur",
    type: ForgotPasswordRequestDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Post('forgot')
  async forgot(@Body() user: ForgotPasswordRequestDto) {
    return this.authService.forgot(user);
  }

  @Throttle(2, 60)
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
