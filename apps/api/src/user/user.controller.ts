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
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
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
import { PlanningEventResponseDto } from "../assignment/common/dto/planning-event.response.dto";
import { PlanningService } from "./planning/planning.service";

@ApiTags("users")
@Controller("users")
@ApiBadRequestResponse({
  description: "Bad Request",
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly planningService: PlanningService,
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(VIEW_VOLUNTEER)
  @ApiUnauthorizedResponse({
    description: "User dont have the right to access this route",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @Get("/adherents")
  @ApiResponse({
    status: 200,
    description: "Get all adherents",
    type: UserIdentifierResponseDto,
    isArray: true,
  })
  getAdherents(): Promise<User[]> {
    return this.userService.getAdherents();
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    @RequestDecorator() { user }: RequestWithUserPayload,
  ): Promise<UserPersonalData> {
    return this.userService.getById(id, new JwtUtil(user));
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(VIEW_PLANNING)
  @Get(":id/mobilizations")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission(VIEW_PLANNING)
  @Get(":id/assignments")
  @ApiResponse({
    status: 200,
    description: "Get tasks a volunteer is assigned to",
    isArray: true,
    type: PlanningEventResponseDto,
  })
  async getVolunteerAssignments(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<PlanningEventResponseDto[]> {
    return this.userService.getVolunteerAssignments(id);
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
  deleteUser(
    @Param("id", ParseIntPipe) userId: number,
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<void> {
    return this.userService.deleteUser(userId, new JwtUtil(req.user));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    description: "User's teams",
    type: String,
    isArray: true,
  })
  @ApiBody({
    description: "Teams to link",
    type: String,
    isArray: true,
  })
  async joinTeams(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() teams: string[],
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<string[]> {
    const me = new JwtUtil(req.user);
    return this.teamService.as(me).user(userId).joins(teams);
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
  async leaveTeam(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("teamCode") team: string,
    @RequestDecorator() req: RequestWithUserPayload,
  ): Promise<void> {
    const me = new JwtUtil(req.user);
    return this.teamService.as(me).user(userId).leave(team);
  }
}
