import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateFriendRequestDto } from "./dto/create-friend.request.dto";
import { FriendResponseDto } from "./dto/friend.response.dto";
import { FriendService } from "./friend.service";
import { MANAGE_USERS } from "@overbookd/permission";
import { Permissions } from "../authentication-zitadel/decorators/permissions-auth.decorator";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { AuthenticatedUser } from "../authentication-zitadel/decorators/authenticated-user.decorator";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";

@Controller("friends")
@ApiTags("friends")
@ApiBearerAuth()
@ApiSwaggerResponse()
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get("for/:id")
  @ApiResponse({
    status: 200,
    description: "Get potential friends for a user",
    isArray: true,
    type: FriendResponseDto,
  })
  @ApiParam({
    name: "id",
    description: "User id",
    type: Number,
    required: true,
  })
  getFriendsFor(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<FriendResponseDto[]> {
    return this.friendService.findFriendsFor(id);
  }

  @Get(":id")
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
  findMany(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<FriendResponseDto[]> {
    return this.friendService.findUserFriends(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: "Create relation between two users",
    type: FriendResponseDto,
  })
  @ApiBody({
    description: "Friend id",
    type: CreateFriendRequestDto,
  })
  create(
    @Body() friend: CreateFriendRequestDto,
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<FriendResponseDto> {
    return this.friendService.create(user.id, friend.id);
  }

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
  remove(
    @Param("friendId", ParseIntPipe) friendId: number,
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<void> {
    return this.friendService.delete(user.id, friendId);
  }

  @Post(":id")
  @Permissions(MANAGE_USERS)
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
  addFriendToUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() friend: CreateFriendRequestDto,
  ): Promise<FriendResponseDto> {
    return this.friendService.create(id, friend.id);
  }

  @Delete(":id/:friendId")
  @Permissions(MANAGE_USERS)
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
  removeFriendFromUser(
    @Param("id", ParseIntPipe) id: number,
    @Param("friendId", ParseIntPipe) friendId: number,
  ): Promise<void> {
    return this.friendService.delete(id, friendId);
  }
}
