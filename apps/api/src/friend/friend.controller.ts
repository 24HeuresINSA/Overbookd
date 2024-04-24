import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RequestWithUserPayload } from "../../src/app.controller";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { CreateFriendRequestDto } from "./dto/create-friend.request.dto";
import { FriendResponseDto } from "./dto/friend.response.dto";
import { FriendService } from "./friend.service";
import { MANAGE_USERS } from "@overbookd/permission";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";

@ApiBearerAuth()
@ApiTags("friend")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("friends")
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Get friends list",
    isArray: true,
    type: FriendResponseDto,
  })
  getFriends(): Promise<FriendResponseDto[]> {
    return this.friendService.findFriends();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Get friends of a user",
    isArray: true,
    type: FriendResponseDto,
  })
  @ApiParam({
    name: "id",
    description: "User id",
    type: Number,
    required: true,
  })
  @ApiNotFoundResponse({ description: "Friends not found" })
  findMany(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<FriendResponseDto[]> {
    return this.friendService.findUserFriends(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "Create relation between two users",
    type: FriendResponseDto,
  })
  @ApiBody({
    description: "Friend id",
    type: CreateFriendRequestDto,
  })
  @ApiNotFoundResponse({ description: "Friend not found" })
  create(
    @Body() friend: CreateFriendRequestDto,
    @Request() req: RequestWithUserPayload,
  ): Promise<FriendResponseDto> {
    return this.friendService.create(req.user.id, friend.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":friendId")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete relation between two users",
  })
  @ApiParam({
    name: "friendId",
    description: "Friend id",
    type: Number,
    required: true,
  })
  @ApiNotFoundResponse({ description: "Friend not found" })
  remove(
    @Param("friendId", ParseIntPipe) friendId: number,
    @Request() req: RequestWithUserPayload,
  ): Promise<void> {
    return this.friendService.delete(req.user.id, friendId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_USERS)
  @Post(":id")
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "Create relation between two users",
    type: FriendResponseDto,
  })
  @ApiBody({
    description: "Friend id",
    type: CreateFriendRequestDto,
  })
  @ApiNotFoundResponse({ description: "Friend not found" })
  addFriendToUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() friend: CreateFriendRequestDto,
  ): Promise<FriendResponseDto> {
    return this.friendService.create(id, friend.id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_USERS)
  @Delete(":id/:friendId")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete relation between two users",
  })
  @ApiParam({
    name: "friendId",
    description: "Friend id",
    type: Number,
    required: true,
  })
  @ApiNotFoundResponse({ description: "Friend not found" })
  removeFriendFromUser(
    @Param("id", ParseIntPipe) id: number,
    @Param("friendId", ParseIntPipe) friendId: number,
  ): Promise<void> {
    return this.friendService.delete(id, friendId);
  }
}
