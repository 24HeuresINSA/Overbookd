import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from '@prisma/client';
import {Username} from './dto/username';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  getUsers(): Promise<Partial<User>[]> {
    return this.userService.users({});
  }

  @Get('user/me')
  getCurrentUser(): Promise<User> {
    return null;
  }

  @Get('user/all/cp')
  async getAllUsernamesWithCP(): Promise<Username[]> {
    const users = await this.userService.users({
      where: {
        teams: {
          some: {
            team: {
              name: {
                in : ['hard', 'vieux'],
              }
            }
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

  @Get('user/:id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.user({ id: Number(id) });
  }

  @Post('user/availabilities')
  addAvailabilitiesToCurrentUser(
      @Body('availabilities') availabilities: number[],
    ): Promise<User> {

  }


  @Put('user/:id')
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
