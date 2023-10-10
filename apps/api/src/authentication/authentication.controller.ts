import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ForgotPasswordRequestDto } from "./dto/forgot-password.request.dto";
import { AuthenticationService } from "./authentication.service";
import { ResetPasswordRequestDto } from "./dto/reset-password.request.dto";
import { LoginRequestDto } from "./dto/login.request.dto";
import { UserAccessResponseDto } from "./dto/user-access.response.dto";
import { Throttle } from "@nestjs/throttler";
import { RefreshAccessRequestDto } from "./dto/refresh-access.request.dto";
import { ONE_MINUTE_IN_MS, THIRTY_SECONDS_IN_MS } from "@overbookd/period";

@ApiTags("authentication")
@Controller()
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Throttle({ default: { limit: 10, ttl: THIRTY_SECONDS_IN_MS } })
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

  @Post("refresh")
  @ApiBody({
    description: "Route de refresh du token",
    type: RefreshAccessRequestDto,
  })
  @ApiResponse({
    description: "User access token",
    type: UserAccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "Wrong refresh token",
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
  })
  refresh(@Body() refreshToken: RefreshAccessRequestDto) {
    return this.authService.refresh(refreshToken);
  }

  @Throttle({ default: { limit: 2, ttl: ONE_MINUTE_IN_MS } })
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

  @Throttle({ default: { limit: 2, ttl: ONE_MINUTE_IN_MS } })
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
