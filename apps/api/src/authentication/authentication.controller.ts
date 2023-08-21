import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ForgotPasswordRequestDto } from "./dto/forgot-password.request.dto";
import { AuthenticationService } from "./authentication.service";
import { ResetPasswordRequestDto } from "./dto/reset-password.request.dto";
import { LoginRequestDto } from "./dto/login.request.dto";
import { UserAccessResponseDto } from "./dto/user-access.response.dto";
import { Throttle } from "@nestjs/throttler";

@ApiTags("authentication")
@Controller()
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Throttle(10, 30)
  @Post("login")
  @ApiBody({
    description: "Route de connection",
    type: LoginRequestDto,
  })
  @ApiCreatedResponse({
    description: "User access token",
    type: UserAccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Wrong email or password",
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
  })
  async login(@Body() userCredentials: LoginRequestDto) {
    return this.authService.login(userCredentials);
  }

  @Throttle(2, 60)
  @ApiBody({
    description:
      "Route pour la premiere partie de la procedure de reset de mot de passe, envoie un mail a l'utilisateur",
    type: ForgotPasswordRequestDto,
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @Post("forgot")
  async forgot(@Body() user: ForgotPasswordRequestDto) {
    return this.authService.forgot(user);
  }

  @Throttle(2, 60)
  @ApiBody({
    description:
      "Route pour la seconde partie procedure de reset de mot de passe, enregistre le nouveau mot de passe",
    type: ResetPasswordRequestDto,
  })
  @ApiBadRequestResponse({
    description: "Password don't match or don't respect the rules",
  })
  @ApiUnauthorizedResponse({
    description: "Token expired",
  })
  @Post("reset")
  async reset(@Body() userTokenAndPassword: ResetPasswordRequestDto) {
    return this.authService.recoverPassword(userTokenAndPassword);
  }
}
