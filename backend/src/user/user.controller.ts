import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService, Username } from './user.service';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserModificationDto } from './dto/userModification.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: Array,
  })
  getUsers(): Promise<Partial<User>[]> {
    return this.userService.users({});
  }

  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Get a current user',
  })
  getCurrentUser(): Promise<User> {
    return null;
  }

  @Get('all/cp')
  @ApiResponse({
    status: 200,
    description: 'Get all users with their CP',
    type: Array,
  })
  async getAllUsernamesWithCP(): Promise<Username[]> {
    const users = await this.userService.users({
      where: {
        teams: {
          some: {
            team: {
              name: {
                in: ['hard', 'vieux'],
              },
            },
          },
        },
      },
      select: {
        firstname: true,
        lastname: true,
        id: true,
      },
    });
    return users.map(this.userService.getUsername);
  }

  // @Get('user/all')
  // async getAllUsernames(): Promise<Username[]> {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a user by id',
  })
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.user({ id: Number(id) });
  }

  @Post('availabilities')
  @ApiBody({
    description: 'Add availabilities to current user',
    type: Array,
  })
  addAvailabilitiesToCurrentUser(
    @Body('availabilities') availabilities: number[],
  ): Promise<User> {
    return null;
  }

  @Put(':id')
  @ApiBody({
    description: 'Update a user by id',
    type: UserModificationDto,
  })
  updateUserById(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: userData,
    });
  }
}
