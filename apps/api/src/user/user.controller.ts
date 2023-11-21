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
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import {
  ApiBearerAuth,
  ApiBody,
  ApiProduces,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { join } from "path";
import { RequestWithUserPayload } from "../../src/app.controller";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { buildVolunteerDisplayName } from "../../src/utils/volunteer";
import { TaskResponseDto } from "../volunteer-planning/dto/task.response.dto";
import { VolunteerSubscriptionPlanningResponseDto } from "../volunteer-planning/dto/volunter-subscription-planning.response.dto";
import {
  IcalType,
  JsonType,
  PdfType,
  PlanningRenderStrategy,
} from "../volunteer-planning/render/render-strategy";
import {
  PlanningSubscription,
  SubscriptionService,
} from "../../src/volunteer-planning/subscription.service";
import { VolunteerPlanningService } from "../../src/volunteer-planning/volunteer-planning.service";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { FileUploadRequestDto } from "./dto/file-upload.request.dto";
import { UpdateUserRequestDto } from "./dto/update-user.request.dto";
import {
  VolunteerAssignmentDto,
  VolunteerAssignmentStatResponseDto,
} from "./dto/volunteer-assignment-stat.response.dto";
import { ProfilePictureService } from "./profile-picture.service";
import { MyUserInformation, UserPersonalData } from "@overbookd/user";
import { UserService } from "./user.service";
import { UserPersonalDataResponseDto } from "./dto/user-personal-data.response.dto";
import { MyUserInformationResponseDto } from "./dto/my-user-information.response.dto";
import { Task } from "../volunteer-planning/domain/task.model";
import {
  AFFECT_TEAM,
  AFFECT_VOLUNTEER,
  DOWNLOAD_PLANNING,
  HAVE_PERSONAL_ACCOUNT,
  MANAGE_USERS,
  VIEW_VOLUNTEER,
} from "@overbookd/permission";
import { TeamService } from "../team/team.service";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";
import { UpdateProfileRequestDto } from "./dto/update-profile.request.dto";
import { Consumer } from "./user.model";
import { ConsumerResponseDto } from "./dto/consumer.response.dto";
import { ForgetMemberErrorFilter } from "../registration/registration-error.filter";

@ApiTags("users")
@Controller("users")
@ApiBadRequestResponse({
  description: "Bad Request",
})
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly planningService: VolunteerPlanningService,
    private readonly planningSubscription: SubscriptionService,
    private readonly profilePictureService: ProfilePictureService,
    private readonly teamService: TeamService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(VIEW_VOLUNTEER)
  @ApiUnauthorizedResponse({
    description: "User dont have the right to access this route",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all users",
    type: UserPersonalDataResponseDto,
    isArray: true,
  })
  getUsers(): Promise<UserPersonalData[]> {
    return this.userService.getAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(VIEW_VOLUNTEER)
  @ApiUnauthorizedResponse({
    description: "User dont have the right to access this route",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @Get("/volunteers")
  @ApiResponse({
    status: 200,
    description: "Get all volunteers",
    type: UserPersonalDataResponseDto,
    isArray: true,
  })
  getVolunteers(): Promise<UserPersonalData[]> {
    return this.userService.getVolunteers();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("me")
  @ApiResponse({
    status: 200,
    description: "Get a current user",
    type: MyUserInformationResponseDto,
  })
  async getCurrentUser(
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<MyUserInformation | null> {
    return this.userService.getMyInformation(req.user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(DOWNLOAD_PLANNING)
  @ApiBearerAuth()
  @Get("me/planning")
  @ApiResponse({
    status: 200,
    description: "Get current user planning",
    isArray: true,
    type: TaskResponseDto,
  })
  @ApiProduces(JsonType, IcalType, PdfType)
  async getCurrentVolunteerPlanning(
    @RequestDecorator() request: RequestWithUserPayload,
    @Res() response: Response,
  ): Promise<Task[]> {
    const volunteerId = request.user.userId ?? request.user.id;
    const format = request.headers.accept;
    try {
      const planning = await this.formatPlanning(volunteerId, format);
      response.setHeader("content-type", format);
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
  @Permission(DOWNLOAD_PLANNING)
  @ApiBearerAuth()
  @Get("me/planning/subscribe-link")
  @ApiResponse({
    status: 200,
    description: "Get current user subscription planning link",
    type: VolunteerSubscriptionPlanningResponseDto,
  })
  async getCurrentVolunteerSubscriptionPlanningLink(
    @RequestDecorator() request: RequestWithUserPayload,
  ): Promise<PlanningSubscription> {
    const volunteerId = request.user.userId ?? request.user.id;
    return this.planningSubscription.subscribe(volunteerId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("me")
  @ApiResponse({
    status: 200,
    description: "Updated current user",
    type: MyUserInformationResponseDto,
  })
  @ApiBody({
    description: "New current user information",
    type: UpdateProfileRequestDto,
  })
  async updateCurrentUser(
    @RequestDecorator() req: RequestWithUserPayload,
    @Body() userData: UpdateProfileRequestDto,
  ): Promise<MyUserInformation | null> {
    return this.userService.updateMyInformation(req.user, userData);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(HAVE_PERSONAL_ACCOUNT)
  @ApiBearerAuth()
  @Get("personal-account-consumers")
  @ApiResponse({
    status: 200,
    description: "Get all consumers",
    type: ConsumerResponseDto,
    isArray: true,
  })
  async getUsernamesWithValidCP(): Promise<Consumer[]> {
    return this.userService.getAllPersonalAccountConsumers();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(VIEW_VOLUNTEER)
  @Get(":id")
  @ApiResponse({
    status: 200,
    description: "Get a user by id",
    type: UserPersonalDataResponseDto,
  })
  getUserById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<UserPersonalData> {
    return this.userService.getById(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(VIEW_VOLUNTEER)
  @Get(":id/ft-requests")
  @ApiResponse({
    status: 200,
    description: "Get tasks a volunteer is required on",
    isArray: true,
    type: VolunteerAssignmentDto,
  })
  async getFtUserRequestsByUserId(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<VolunteerAssignmentDto[]> {
    return this.userService.getFtUserRequestsByUserId(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(VIEW_VOLUNTEER)
  @Get(":id/assignments")
  @ApiResponse({
    status: 200,
    description: "Get tasks a volunteer is assigned to",
    isArray: true,
    type: VolunteerAssignmentDto,
  })
  async getVolunteerAssignments(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<VolunteerAssignmentDto[]> {
    return this.userService.getVolunteerAssignments(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @ApiBearerAuth()
  @Get(":id/planning")
  @ApiResponse({
    status: 200,
    description: "Get current user planning",
    isArray: true,
    type: TaskResponseDto,
  })
  @ApiProduces(JsonType, IcalType, PdfType)
  async getVolunteerPlanning(
    @Param("id", ParseIntPipe) volunteerId: number,
    @RequestDecorator() request: Request,
    @Res() response: Response,
  ): Promise<TaskResponseDto[]> {
    const format = request.headers.accept;
    try {
      const planning = await this.formatPlanning(volunteerId, format);
      response.setHeader("content-type", format);
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
  @Permission(AFFECT_VOLUNTEER)
  @Get(":id/assignments/stats")
  @ApiResponse({
    status: 200,
    description: "Get duration of assignments for a volunteer",
    isArray: true,
    type: VolunteerAssignmentStatResponseDto,
  })
  async getVolunteerAssignmentStats(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<VolunteerAssignmentStatResponseDto[]> {
    return this.userService.getVolunteerAssignmentStats(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(":id")
  @ApiBody({
    description: "New user information",
    type: UpdateUserRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: "Updated user",
    type: UserPersonalDataResponseDto,
  })
  updateUserById(
    @Param("id", ParseIntPipe) targetUserId: number,
    @Body() user: UpdateUserRequestDto,
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<UserPersonalData> {
    return this.userService.updateUser(targetUserId, user, req.user);
  }

  @UseFilters(ForgetMemberErrorFilter)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(MANAGE_USERS)
  @Delete(":id")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete a user by id",
  })
  deleteUser(@Param("id", ParseIntPipe) userId: number): Promise<void> {
    return this.userService.deleteUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("me/profile-picture")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: join(process.cwd(), "public"),
        filename: (req, file, cb) => {
          const uuid = randomUUID();
          const filenameFragments = file.originalname.split(".");
          const extension = filenameFragments.at(-1) ?? "jpg";
          cb(null, `${uuid}.${extension}`);
        },
      }),
    }),
  )
  @ApiResponse({
    status: 201,
    description: "Add a profile picture to a user",
    type: MyUserInformationResponseDto,
  })
  @ApiBody({
    description: "Profile picture file",
    type: FileUploadRequestDto,
  })
  defineProfilePicture(
    @RequestDecorator() req: RequestWithUserPayload,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MyUserInformation> {
    return this.profilePictureService.updateProfilePicture(
      req.user.id,
      file.filename,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(":userId/profile-picture")
  @ApiResponse({
    status: 200,
    description: "Get a user profile picture",
  })
  getProfilePicture(
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<StreamableFile> {
    return this.profilePictureService.streamProfilePicture(userId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_TEAM)
  @Patch(":userId/teams")
  @ApiResponse({
    status: 200,
    description: "Link a user with different teams",
    type: String,
    isArray: true,
  })
  @ApiBody({
    description: "Teams to link",
    type: String,
    isArray: true,
  })
  async addTeamsToUser(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() teams: string[],
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<string[]> {
    return this.teamService.addTeamsToUser(
      userId,
      teams,
      new JwtUtil(req.user),
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_TEAM)
  @Delete(":userId/teams/:teamCode")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Remove a team from a user",
  })
  async removeTeamFromUser(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("teamCode") teamCode: string,
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<void> {
    return this.teamService.removeTeamFromUser(
      userId,
      teamCode,
      new JwtUtil(req.user),
    );
  }
}
