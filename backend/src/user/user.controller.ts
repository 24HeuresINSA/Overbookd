import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { RequestWithUserPayload } from 'src/app.controller';
import { JwtUtil } from 'src/auth/entities/JwtUtil.entity';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserCreationDto } from './dto/userCreation.dto';
import { UserModificationDto } from './dto/userModification.dto';
import { Username } from './dto/userName.dto';
import {
  VolunteerAssignmentStatResponseDto,
  VolunteerAssignmentDto,
} from './dto/volunteerAssignment.dto';
import {
  MyUserInformation,
  UserService,
  UserWithoutPassword,
  UserWithTeamAndPermission,
} from './user.service';
import { TaskResponseDto } from 'src/volunteer-planning/dto/taskResponse.dto';
import { VolunteerPlanningService } from 'src/volunteer-planning/volunteer-planning.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly planningService: VolunteerPlanningService,
  ) {}

  @Post()
  @ApiBody({
    description: 'Add new user',
    type: UserCreationDto,
  })
  createUser(@Body() userData: UserCreationDto): Promise<UserWithoutPassword> {
    return this.userService.createUser(userData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('validated-user')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: Array,
  })
  getUsers(): Promise<Partial<User>[]> {
    return this.userService.users({ where: { is_deleted: false } });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Get a current user',
  })
  async getCurrentUser(
    @Request() req: RequestWithUserPayload,
  ): Promise<MyUserInformation | null> {
    return this.userService.user({ id: req.user.userId ?? req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Permission('can-view-planning')
  @ApiBearerAuth()
  @Get('me/planning')
  @ApiResponse({
    status: 200,
    description: 'Get current user planning',
    isArray: true,
    type: TaskResponseDto,
  })
  async getCurrentVolunteerPlanning(
    @Request() req: RequestWithUserPayload,
  ): Promise<TaskResponseDto[]> {
    const volunteerId = req.user.userId ?? req.user.id;
    return this.planningService.getVolunteerPlanning(volunteerId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('me')
  @ApiResponse({
    status: 200,
    description: 'Update a current user',
  })
  async updateCurrentUser(
    @Request() req: RequestWithUserPayload,
    @Body() userData: Partial<UserModificationDto>,
  ): Promise<UserWithTeamAndPermission | null> {
    return this.userService.updateUserPersonnalData(req.user.id, userData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('cp')
  @ApiBearerAuth()
  @Get('all/cp')
  @ApiResponse({
    status: 200,
    description: 'Get all usernames with valid CP',
    type: Array,
  })
  async getUsernamesWithValidCP(): Promise<Username[]> {
    const users = await this.userService.users({
      where: {
        team: {
          some: {
            team: {
              permissions: {
                some: {
                  permission: {
                    name: 'cp',
                  },
                },
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
    return users
      .map(this.userService.getUsername)
      .sort((a, b) => (a.username > b.username ? 1 : -1));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('manage-cp')
  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Get all usernames',
    type: Array,
  })
  async getAllUsernames(): Promise<Username[]> {
    const users = await this.userService.users({
      select: {
        firstname: true,
        lastname: true,
        id: true,
      },
    });
    return users.map(this.userService.getUsername);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('hard')
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a user by id',
  })
  getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserWithoutPassword> {
    return this.userService.user({ id });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('hard')
  @Get(':id/ft-requests')
  @ApiResponse({
    status: 200,
    description: 'Get tasks a volunteer is required on',
    isArray: true,
    type: VolunteerAssignmentDto,
  })
  async getFtUserRequestsByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VolunteerAssignmentDto[]> {
    return this.userService.getFtUserRequestsByUserId(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('hard')
  @Get(':id/assignments')
  @ApiResponse({
    status: 200,
    description: 'Get tasks a volunteer is assigned to',
    isArray: true,
    type: VolunteerAssignmentDto,
  })
  async getVolunteerAssignments(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VolunteerAssignmentDto[]> {
    return this.userService.getVolunteerAssignments(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permission('can-affect')
  @ApiBearerAuth()
  @Get(':id/planning')
  @ApiResponse({
    status: 200,
    description: 'Get current user planning',
    isArray: true,
    type: TaskResponseDto,
  })
  async getVolunteerPlanning(
    @Param('id', ParseIntPipe) volunteerId: number,
  ): Promise<TaskResponseDto[]> {
    return this.planningService.getVolunteerPlanning(volunteerId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('can-affect')
  @Get(':id/assignments/stats')
  @ApiResponse({
    status: 200,
    description: 'Get duration of assignments for a volunteer',
    isArray: true,
    type: VolunteerAssignmentStatResponseDto,
  })
  async getVolunteerAssignmentStats(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VolunteerAssignmentStatResponseDto[]> {
    return this.userService.getVolunteerAssignmentStats(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiBody({
    description: 'Update a user by id',
    type: UserModificationDto,
  })
  updateUserById(
    @Param('id', ParseIntPipe) targetUserId: number,
    @Body() user: UserModificationDto,
    @Request() req: RequestWithUserPayload,
  ): Promise<UserWithTeamAndPermission> {
    return this.userService.updateUser(
      targetUserId,
      user,
      new JwtUtil(req.user),
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('manage-users')
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a user by id',
  })
  deleteUser(@Param('id', ParseIntPipe) userId: number): Promise<void> {
    return this.userService.deleteUser(userId);
  }
}
