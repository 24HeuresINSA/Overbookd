import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request as RequestDecorator,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiProduces,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { RequestWithUserPayload } from '../../src/app.controller';
import { JwtUtil } from '../../src/auth/entities/JwtUtil.entity';
import { Permission } from '../../src/auth/permissions-auth.decorator';
import { PermissionsGuard } from '../../src/auth/permissions-auth.guard';
import { buildVolunteerDisplayName } from '../../src/utils/volunteer';
import { TaskResponseDto } from '../../src/volunteer-planning/dto/taskResponse.dto';
import { VolunteerSubscriptionPlanningResponseDto } from '../../src/volunteer-planning/dto/volunterSubscriptionPlanningResponse.dto';
import {
  IcalType,
  JsonType,
  PdfType,
  PlanningRenderStrategy,
} from '../../src/volunteer-planning/render/renderStrategy';
import { SubscriptionService } from '../../src/volunteer-planning/subscription.service';
import { VolunteerPlanningService } from '../../src/volunteer-planning/volunteer-planning.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileUploadDto } from './dto/fileUpload.dto';
import { UserCreationDto } from './dto/userCreation.dto';
import { UserModificationDto } from './dto/userModification.dto';
import { UserWithoutPasswordDto } from './dto/userWithoutPassword.dto';
import {
  VolunteerAssignmentDto,
  VolunteerAssignmentStatResponseDto,
} from './dto/volunteerAssignment.dto';
import { ProfilePictureService } from './profilePicture.service';
import {
  MyUserInformation,
  UserPersonnalData,
  UserWithTeamsAndPermissions,
  UserWithoutPassword,
} from './user.model';
import { UserService } from './user.service';
import { UserPersonnalDataDto } from './dto/userPersonnalData.dto';
import { MyUSerInformationDto } from './dto/myUserInformation.dto';
@ApiTags('user')
@Controller('user')
@ApiBadRequestResponse({
  description: 'Bad Request',
})
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly planningService: VolunteerPlanningService,
    private readonly planningSubscription: SubscriptionService,
    private readonly profilePictureService: ProfilePictureService,
  ) {}

  @Post()
  @ApiBody({
    description: 'Add new user',
    type: UserCreationDto,
  })
  @ApiCreatedResponse({
    description: 'created user',
    type: UserWithoutPasswordDto,
  })
  createUser(@Body() userData: UserCreationDto): Promise<UserWithoutPassword> {
    return this.userService.createUser(userData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('validated-user')
  @ApiUnauthorizedResponse({
    description: 'User dont have the right to access this route',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    type: UserPersonnalDataDto,
    isArray: true,
  })
  getUsers(): Promise<UserPersonnalData[]> {
    return this.userService.getAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('validated-user')
  @ApiUnauthorizedResponse({
    description: 'User dont have the right to access this route',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @Get('/volunteers')
  @ApiResponse({
    status: 200,
    description: 'Get all volunteers',
    type: UserPersonnalDataDto,
    isArray: true,
  })
  getVolunteers(): Promise<UserPersonnalData[]> {
    return this.userService.getVolunteers();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('validated-user')
  @ApiUnauthorizedResponse({
    description: 'User dont have the right to access this route',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @Get('/candidates')
  @ApiResponse({
    status: 200,
    description: 'Get all candidates',
    type: UserPersonnalDataDto,
    isArray: true,
  })
  getCandidates(): Promise<UserPersonnalData[]> {
    return this.userService.getCandidates();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Get a current user',
    type: MyUSerInformationDto,
  })
  async getCurrentUser(
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<MyUserInformation | null> {
    return this.userService.getById(req.user.userId ?? req.user.id);
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
  ): Promise<UserWithTeamsAndPermissions | null> {
    return this.userService.updateUserPersonnalData(req.user.id, userData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('cp')
  @ApiBearerAuth()
  @Get('personnal-account-consummers')
  @ApiResponse({
    status: 200,
    description: 'Get all usernames with valid CP',
    type: UserWithoutPasswordDto,
    isArray: true,
  })
  async getUsernamesWithValidCP(): Promise<UserWithoutPassword[]> {
    return this.userService.getAllPersonnalAccountConsummers();
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
    return this.userService.getById(id);
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
  ): Promise<UserWithTeamsAndPermissions> {
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('me/profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'public'),
        filename: (req, file, cb) => {
          const uuid = randomUUID();
          const filenameFragments = file.originalname.split('.');
          const extension = filenameFragments.at(-1) ?? 'jpg';
          cb(null, `${uuid}.${extension}`);
        },
      }),
    }),
  )
  @ApiResponse({
    status: 201,
    description: 'Add a profile picture to a user',
    type: UserWithoutPasswordDto,
  })
  @ApiBody({
    description: 'Profile picture file',
    type: FileUploadDto,
  })
  defineProfilePicture(
    @RequestDecorator() req: RequestWithUserPayload,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserWithTeamsAndPermissions> {
    return this.profilePictureService.updateProfilePicture(
      req.user.id,
      file.filename,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':userId/profile-picture')
  @ApiResponse({
    status: 200,
    description: 'Get a users profile picture',
    type: StreamableFile,
  })
  getProfilePicture(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<StreamableFile> {
    return this.profilePictureService.streamProfilePicture(userId);
  }
}
