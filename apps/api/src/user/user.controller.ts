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
  Request as RequestDecorator,
  StreamableFile,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import { join } from "path";
import { RequestWithUserPayload } from "../../src/app.controller";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { FileUploadRequestDto } from "./dto/file-upload.request.dto";
import { UpdateUserRequestDto } from "./dto/update-user.request.dto";
import { VolunteerAssignmentStatResponseDto } from "./dto/assignment-stat.response.dto";
import { ProfilePictureService } from "./profile-picture.service";
import { MyUserInformation, User, UserPersonalData } from "@overbookd/user";
import { UserService } from "./user.service";
import { UserPersonalDataResponseDto } from "./dto/user-personal-data.response.dto";
import { MyUserInformationResponseDto } from "./dto/my-user-information.response.dto";
import {
  AFFECT_TEAM,
  AFFECT_VOLUNTEER,
  HAVE_PERSONAL_ACCOUNT,
  MANAGE_USERS,
  VIEW_PLANNING,
  VIEW_VOLUNTEER,
} from "@overbookd/permission";
import { TeamService } from "../team/team.service";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";
import { UpdateProfileRequestDto } from "./dto/update-profile.request.dto";
import { Consumer } from "./user.model";
import { ConsumerResponseDto } from "./dto/consumer.response.dto";
import { ForgetMemberErrorFilter } from "../registration/index/registration-error.filter";
import { UserIdentifierResponseDto } from "../common/dto/user-identifier.response.dto";
import { PlanningTaskResponseDto } from "./planning/dto/planning-task.response.dto";
import { PlanningService } from "./planning/planning.service";
import { AssignmentEventResponseDto } from "../assignment/common/dto/assignment-event.response.dto";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("users")
@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiSwaggerResponse()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly planningService: PlanningService,
    private readonly profilePictureService: ProfilePictureService,
    private readonly teamService: TeamService,
  ) {}

  @Get("volunteers")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Get all volunteers",
    type: UserPersonalDataResponseDto,
    isArray: true,
  })
  getVolunteers(
    @RequestDecorator() { user }: RequestWithUserPayload,
  ): Promise<UserPersonalData[]> {
    return this.userService.getVolunteers(new JwtUtil(user));
  }

  @Get("adherents")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Get all adherents",
    type: UserIdentifierResponseDto,
    isArray: true,
  })
  getAdherents(): Promise<User[]> {
    return this.userService.getAdherents();
  }

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

  @Post("me/approve-eula")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Approve End User Licence Agreement",
  })
  async approveEndUserLicenceAgreement(
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<void> {
    return this.userService.approveEndUserLicenceAgreement(req.user);
  }

  @Get("personal-account-consumers")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(HAVE_PERSONAL_ACCOUNT)
  @ApiResponse({
    status: 200,
    description: "Get all consumers",
    type: ConsumerResponseDto,
    isArray: true,
  })
  async getUsernamesWithValidCP(): Promise<Consumer[]> {
    return this.userService.getAllPersonalAccountConsumers();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Get a user by id",
    type: UserPersonalDataResponseDto,
  })
  getUserById(
    @Param("id", ParseIntPipe) id: number,
    @RequestDecorator() { user }: RequestWithUserPayload,
  ): Promise<UserPersonalData> {
    return this.userService.getById(id, new JwtUtil(user));
  }

  @Get(":id/mobilizations")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_PLANNING)
  @ApiResponse({
    status: 200,
    description: "Get mobilizations a volunteer is required on",
    isArray: true,
    type: PlanningTaskResponseDto,
  })
  async getMobilizationsUserTakePartOf(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<PlanningTaskResponseDto[]> {
    return this.planningService.getMobilizationsHeIsPartOf(id);
  }

  @Get(":id/assignments")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_PLANNING)
  @ApiResponse({
    status: 200,
    description: "Get tasks a volunteer is assigned to",
    isArray: true,
    type: AssignmentEventResponseDto,
  })
  async getVolunteerAssignments(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<AssignmentEventResponseDto[]> {
    return this.userService.getVolunteerAssignments(id);
  }

  @Get(":id/assignments/stats")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
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

  @Delete(":id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_USERS)
  @UseFilters(ForgetMemberErrorFilter)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete a user by id",
  })
  deleteUser(
    @Param("id", ParseIntPipe) userId: number,
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<void> {
    return this.userService.deleteUser(userId, new JwtUtil(req.user));
  }

  @Post("me/profile-picture")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: join(process.cwd(), "public"),
        filename: (_req, file, cb) => {
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

  @Patch(":userId/teams")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_TEAM)
  @ApiResponse({
    status: 200,
    description: "User's teams",
    type: String,
    isArray: true,
  })
  @ApiBody({
    description: "Teams to link",
    type: String,
    isArray: true,
  })
  joinTeams(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() teams: string[],
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<string[]> {
    const me = new JwtUtil(req.user);
    return this.teamService.as(me).user(userId).joins(teams);
  }

  @Delete(":userId/teams/:teamCode")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_TEAM)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Remove a team from a user",
  })
  leaveTeam(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("teamCode") team: string,
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<void> {
    const me = new JwtUtil(req.user);
    return this.teamService.as(me).user(userId).leave(team);
  }
}
