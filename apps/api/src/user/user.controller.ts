import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  StreamableFile,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Permissions } from "../authentication-zitadel/decorators/permissions-auth.decorator";
import { FileUploadRequestDto } from "./dto/file-upload.request.dto";
import { UpdateUserRequestDto } from "./dto/update-user.request.dto";
import { ProfilePictureService } from "./profile-picture.service";
import { MyUserInformation, User, UserPersonalData } from "@overbookd/user";
import { UserService } from "./user.service";
import { UserPersonalDataResponseDto } from "./dto/user-personal-data.response.dto";
import { MyUserInformationResponseDto } from "./dto/my-user-information.response.dto";
import {
  AFFECT_TEAM,
  HAVE_PERSONAL_ACCOUNT,
  MANAGE_USERS,
  VIEW_PLANNING,
  VIEW_VOLUNTEER,
} from "@overbookd/permission";
import { TeamService } from "../team/team.service";
import { UpdateProfileRequestDto } from "./dto/update-profile.request.dto";
import { Consumer } from "./user.model";
import { ConsumerResponseDto } from "./dto/consumer.response.dto";
import { ForgetMemberErrorFilter } from "../registration/index/registration-error.filter";
import { UserIdentifierResponseDto } from "../common/dto/user-identifier.response.dto";
import { PlanningTaskResponseDto } from "./planning/dto/planning-task.response.dto";
import { PlanningService } from "./planning/planning.service";
import { AssignmentEventResponseDto } from "../assignment/common/dto/assignment-event.response.dto";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { ImageInterceptor } from "../utils/image.interceptor";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";
import { AuthenticatedUser } from "../authentication-zitadel/decorators/authenticated-user.decorator";

@Controller("users")
@ApiTags("users")
@ApiBearerAuth()
@ApiSwaggerResponse()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly planningService: PlanningService,
    private readonly profilePictureService: ProfilePictureService,
    private readonly teamService: TeamService,
  ) {}

  @Post("sync")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Synchronisation avec Zitadel réussie",
  })
  userSync(@AuthenticatedUser() user: RequestHydratedUser): Promise<void> {
    return this.userService.userSync(user);
  }

  @Get("me")
  @ApiResponse({
    status: 200,
    description: "Get a current user",
    type: MyUserInformationResponseDto,
  })
  async getCurrentUser(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<MyUserInformation | null> {
    return this.userService.getMyInformation(user);
  }

  @Get("volunteers")
  @Permissions(VIEW_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Get all volunteers",
    type: UserPersonalDataResponseDto,
    isArray: true,
  })
  getVolunteers(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<UserPersonalData[]> {
    return this.userService.getVolunteers(user);
  }

  @Get("adherents")
  @Permissions(VIEW_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Get all adherents",
    type: UserIdentifierResponseDto,
    isArray: true,
  })
  getAdherents(): Promise<User[]> {
    return this.userService.getAdherents();
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
    @AuthenticatedUser() user: RequestHydratedUser,
    @Body() userData: UpdateProfileRequestDto,
  ): Promise<MyUserInformation | null> {
    return this.userService.updateMyInformation(user, userData);
  }

  @Post("me/approve-eula")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Approve End User Licence Agreement",
  })
  async approveEndUserLicenceAgreement(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<void> {
    return this.userService.approveEndUserLicenceAgreement(user);
  }

  @Post("me/sign-volunteer-charter")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Sign Volunteer Charter",
  })
  async signVolunteerCharter(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<void> {
    return this.userService.signVolunteerCharter(user);
  }

  @Get("personal-account-consumers")
  @Permissions(HAVE_PERSONAL_ACCOUNT)
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
  @Permissions(VIEW_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Get a user by id",
    type: UserPersonalDataResponseDto,
  })
  getUserById(
    @Param("id", ParseIntPipe) id: number,
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<UserPersonalData> {
    return this.userService.getById(id, user);
  }

  @Get(":id/mobilizations")
  @Permissions(VIEW_PLANNING)
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
  @Permissions(VIEW_PLANNING)
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
    @Body() userForm: UpdateUserRequestDto,
    @AuthenticatedUser() me: RequestHydratedUser,
  ): Promise<UserPersonalData> {
    return this.userService.updateUser(targetUserId, userForm, me);
  }

  @Delete(":id")
  @Permissions(MANAGE_USERS)
  @UseFilters(ForgetMemberErrorFilter)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete a user by id",
  })
  deleteUser(
    @Param("id", ParseIntPipe) userToDeleteId: number,
    @AuthenticatedUser() me: RequestHydratedUser,
  ): Promise<void> {
    return this.userService.deleteUser(userToDeleteId, me);
  }

  @Post("me/profile-picture")
  @UseInterceptors(ImageInterceptor("file"))
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
    @AuthenticatedUser() user: RequestHydratedUser,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ): Promise<MyUserInformation> {
    return this.profilePictureService.updateProfilePicture(
      user.id,
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
  @Permissions(AFFECT_TEAM)
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
    @AuthenticatedUser() me: RequestHydratedUser,
  ): Promise<string[]> {
    return this.teamService.as(me).user(userId).joins(teams);
  }

  @Delete(":userId/teams/:teamCode")
  @Permissions(AFFECT_TEAM)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Remove a team from a user",
  })
  leaveTeam(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("teamCode") team: string,
    @AuthenticatedUser() me: RequestHydratedUser,
  ): Promise<void> {
    return this.teamService.as(me).user(userId).leave(team);
  }
}
