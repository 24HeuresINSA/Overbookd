import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserModificationDto } from './dto/userModification.dto';
import { Username } from './dto/userName.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/team-auth.guard';
import { Roles } from 'src/auth/team-auth.decorator';
import { UserCreationDto } from './dto/userCreation.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({
    description: 'Add new user',
    type: UserCreationDto,
  })
  createUser(@Body() userData: User): Promise<User> {
    return this.userService.createUser(userData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: Array,
  })
  getUsers(): Promise<Partial<User>[]> {
    return this.userService.users({});
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Get a current user',
  })
  getCurrentUser(@Request() req): Promise<User> {
    const id = req.user.userId;
    return this.userService.user({ id });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a user by id',
  })
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.user({ id: Number(id) });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Put(':id')
  @ApiBody({
    description: 'Update a user by id',
    type: UserModificationDto,
  })
  updateUserById(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
    @Request() req: Express.Request,
  ): Promise<User> {
    return this.userService.updateUser(
      {
        where: { id: Number(id) },
        data: userData,
      },
      req.user,
    );
  }
}
