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
  UseGuards,
  Request as RequestDecorator,
  Res,
  HttpException,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import {
  IcalType,
  JsonType,
  PdfType,
  PlanningRenderStrategy,
} from 'src/volunteer-planning/render/renderStrategy';
import { VolunteerSubscriptionPlanningResponseDto } from 'src/volunteer-planning/dto/volunterSubscriptionPlanningResponse.dto';
import { SubscriptionService } from 'src/volunteer-planning/subscription.service';
import { Request, Response } from 'express';
import { buildVolunteerDisplayName } from 'src/utils/volunteer';

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly planningService: VolunteerPlanningService,
    private readonly planningSubscription: SubscriptionService,
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
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<MyUserInformation | null> {
    return this.userService.user({ id: req.user.userId ?? req.user.id });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-view-planning')
  @ApiBearerAuth()
  @Get('me/planning')
  @ApiResponse({
    status: 200,
    description: 'Get current user planning',
    isArray: true,
    type: TaskResponseDto,
  })
  @ApiProduces(JsonType, IcalType, PdfType)
  async getCurrentVolunteerPlanning(
    @RequestDecorator() request: RequestWithUserPayload,
    @Res() response: Response,
  ): Promise<TaskResponseDto[]> {
    const volunteerId = request.user.userId ?? request.user.id;
    const format = request.headers.accept;
    try {
      const planning = await this.formatPlanning(volunteerId, format);
      response.setHeader('content-type', format);
      response.send(planning);
      return;
    } catch (e) {
      this.logger.error(e);
      if (e instanceof HttpException) {
        response.status(e.getStatus()).send(e.message);
        return;
      }
      response.status(500).send(e);
    }
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-view-planning')
  @ApiBearerAuth()
  @Get('me/planning/subscribe-link')
  @ApiResponse({
    status: 200,
    description: 'Get current user subscription planning link',
    type: VolunteerSubscriptionPlanningResponseDto,
  })
  async getCurrentVolunteerSubscriptionPlanningLink(
    @RequestDecorator() request: RequestWithUserPayload,
  ): Promise<VolunteerSubscriptionPlanningResponseDto> {
    const volunteerId = request.user.userId ?? request.user.id;
    return this.planningSubscription.subscribe(volunteerId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('me')
  @ApiResponse({
    status: 200,
    description: 'Update a current user',
  })
  async updateCurrentUser(
    @RequestDecorator() req: RequestWithUserPayload,
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @ApiBearerAuth()
  @Get(':id/planning')
  @ApiResponse({
    status: 200,
    description: 'Get current user planning',
    isArray: true,
    type: TaskResponseDto,
  })
  @ApiProduces(JsonType, IcalType, PdfType)
  async getVolunteerPlanning(
    @Param('id', ParseIntPipe) volunteerId: number,
    @RequestDecorator() request: Request,
    @Res() response: Response,
  ): Promise<TaskResponseDto[]> {
    const format = request.headers.accept;
    try {
      const planning = await this.formatPlanning(volunteerId, format);
      response.setHeader('content-type', format);
      response.send(planning);
      return;
    } catch (e) {
      if (e instanceof HttpException) {
        response.status(e.getStatus()).send(e.message);
        return;
      }
      response.status(500).send(e);
    }
  }

  private async formatPlanning(volunteerId: number, format: string) {
    const [tasks, volunteer] = await Promise.all([
      this.planningService.getVolunteerPlanning(volunteerId),
      this.getUserById(volunteerId),
    ]);
    const renderStrategy = PlanningRenderStrategy.get(format);
    return renderStrategy.render(tasks, {
      id: volunteerId,
      name: buildVolunteerDisplayName(volunteer),
    });
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
    @RequestDecorator() req: RequestWithUserPayload,
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
