import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
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
import { ONE_MINUTE_IN_MS, THIRTY_SECONDS_IN_MS } from "@overbookd/time";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller()
@ApiTags("authentication")
@ApiSwaggerResponse()
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post("login")
  @Throttle({ default: { limit: 10, ttl: THIRTY_SECONDS_IN_MS } })
  @ApiBody({
    description: "Login credentials",
    type: LoginRequestDto,
  })
  @ApiResponse({
    description: "User access token",
    type: UserAccessResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Wrong email or password" })
  async login(@Body() userCredentials: LoginRequestDto) {
    return this.authService.login(userCredentials);
  }

  @Post("refresh")
  @ApiBody({
    description: "Refresh token",
    type: RefreshAccessRequestDto,
  })
  @ApiResponse({
    description: "User access token",
    type: UserAccessResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Wrong refresh token" })
  refresh(@Body() refreshToken: RefreshAccessRequestDto) {
    return this.authService.refresh(refreshToken);
  }

  @Post("forgot")
  @Throttle({ default: { limit: 2, ttl: ONE_MINUTE_IN_MS } })
  @HttpCode(204)
  @ApiBody({
    description: "Email for password reset",
    type: ForgotPasswordRequestDto,
  })
  @ApiNotFoundResponse({ description: "User not found" })
  async forgot(@Body() user: ForgotPasswordRequestDto) {
    return this.authService.forgot(user);
  }

  @Post("reset")
  @Throttle({ default: { limit: 2, ttl: ONE_MINUTE_IN_MS } })
  @HttpCode(204)
  @ApiBody({
    description: "New password and token for password reset",
    type: ResetPasswordRequestDto,
  })
  @ApiBadRequestResponse({
    description: "Password don't match or don't respect the rules",
  })
  @ApiUnauthorizedResponse({ description: "Token expired" })
  async reset(@Body() userTokenAndPassword: ResetPasswordRequestDto) {
    return this.authService.recoverPassword(userTokenAndPassword);
  }
}
