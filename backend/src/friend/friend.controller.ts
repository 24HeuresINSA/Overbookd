import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { FriendCreationDto } from "./dto/friendCreation.dto";
import { FriendResponseDto } from "./dto/friendResponse.dto";
import { FriendService } from "./friend.service";

@ApiBearerAuth()
@ApiTags('friend')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get friends of a user',
    isArray: true,
    type: FriendResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'User id',
    type: Number,
    required: true,
  })
  @ApiNotFoundResponse({ description: 'Friends not found' })
  findMany(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FriendResponseDto[]> {
    return this.friendService.findMany(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create relation between two users',
    type: FriendResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'User id',
    type: Number,
    required: true,
  })
  @ApiBody({
    description: 'Friend id',
    type: FriendCreationDto,
  })
  @ApiNotFoundResponse({ description: 'Friend not found' })
  create(
    @Param('id', ParseIntPipe) id: number,
    @Body() friend: FriendCreationDto,
  ): Promise<FriendResponseDto> {
    return this.friendService.create(id, friend);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':friendId/requestor/:userId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete relation between two users',
  })
  @ApiParam({
    name: 'userId',
    description: 'User id',
    type: Number,
    required: true,
  })
  @ApiParam({
    name: 'friendId',
    description: 'Friend id',
    type: Number,
    required: true,
  })
  @ApiNotFoundResponse({ description: 'Friend not found' })
  remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) friendId: number,
  ): Promise<void> {
    return this.friendService.delete(userId, friendId);
  }
}
