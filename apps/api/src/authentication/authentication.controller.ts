import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthenticationService } from "./authentication.service";
import { LoginRequestDto } from "./dto/login.request.dto";
import { UserAccessResponseDto } from "./dto/user-access.response.dto";
import { Throttle } from "@nestjs/throttler";
import { THIRTY_SECONDS_IN_MS } from "@overbookd/time";
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
}
