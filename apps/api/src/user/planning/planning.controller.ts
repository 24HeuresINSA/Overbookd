import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  Header,
  HttpException,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseDatePipe,
  ParseIntPipe,
  Post,
  Query,
  Request as RequestDecorator,
  Res,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import {
  AFFECT_VOLUNTEER,
  DOWNLOAD_PLANNING,
  SYNC_PLANNING,
  VIEW_MULTI_PLANNING,
} from "@overbookd/permission";
import { PlanningService } from "./planning.service";
import { CreateBreakPeriodRequestDto } from "./dto/create-break-period.request.dto";
import { Duration, Period, Edition } from "@overbookd/time";
import { VolunteerForPlanningLeafletResponseDto } from "./dto/volunteer-for-planning-leaflet.response.dto";
import { SecretService } from "./secret.service";
import { VolunteerSubscriptionPlanningResponseDto } from "./dto/volunter-subscription-planning.response.dto";
import { PlanningSubscription } from "./subscription.service";
import { TaskResponseDto } from "./dto/task.response.dto";
import { ICAL, PDF, JSON } from "@overbookd/http";
import { PDFBook } from "@overbookd/pdf-book";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";
import { MultiPlanningVolunteerResponseDto } from "./dto/multi-planning-volunteer.response.dto";
import { BreakPeriodResponseDto } from "../../assignment/common/dto/break-period.response.dto";
import { RequestHydratedUser } from "../../authentication-zitadel/request-hydrated-user";
import { Permissions } from "../../authentication-zitadel/decorators/permissions-auth.decorator";
import { AuthenticatedUser } from "../../authentication-zitadel/decorators/authenticated-user.decorator";
import { Public } from "../../authentication-zitadel/decorators/public.decorator";

@Controller("planning")
@ApiTags("planning")
@ApiSwaggerResponse()
export class PlanningController {
  constructor(
    private readonly planning: PlanningService,
    private readonly secret: SecretService,
  ) {}

  @Get()
  @Permissions(DOWNLOAD_PLANNING)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get current volunteer planning",
    isArray: true,
    type: TaskResponseDto,
  })
  @ApiQuery({
    name: "after",
    required: false,
    type: Date,
  })
  @ApiProduces(JSON, ICAL, PDF)
  async getCurrentVolunteerPlanning(
    @RequestDecorator() request: Request,
    @AuthenticatedUser() user: RequestHydratedUser,
    @Res() response: Response,
    @Query("after", new ParseDatePipe({ optional: true })) after?: Date,
  ): Promise<TaskResponseDto[]> {
    const volunteerId = user.id;
    const format = request.headers.accept;
    try {
      const planning = await this.planning.buildOne(format, volunteerId, after);
      response.setHeader("content-type", format);
      response.send(planning);
      return;
    } catch (e) {
      if (e instanceof HttpException) {
        response.status(e.getStatus()).send(e.message);
        return;
      }
      console.error(e);
      response.status(500).send(e);
    }
  }

  @Get("volunteers/multi")
  @Permissions(VIEW_MULTI_PLANNING)
  @ApiBearerAuth()
  @ApiQuery({
    name: "volunteerIds",
    required: true,
    description: "The volunteers ids",
    type: Number,
    isArray: true,
  })
  @ApiResponse({
    status: 200,
    description: "Volunteers' plannings",
    type: MultiPlanningVolunteerResponseDto,
    isArray: true,
  })
  getVolunteersForMultiPlanning(
    @Query(
      "volunteerIds",
      new DefaultValuePipe([]),
      new ParseArrayPipe({ items: Number }),
    )
    volunteerIds: number[],
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<MultiPlanningVolunteerResponseDto[]> {
    const withBreakPeriods = user.can(AFFECT_VOLUNTEER);
    return this.planning.getVolunteersForMultiPlanning(
      volunteerIds,
      withBreakPeriods,
    );
  }

  @Get("volunteers")
  @Permissions(AFFECT_VOLUNTEER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Volunteers with assignments for planning leaflets",
    type: VolunteerForPlanningLeafletResponseDto,
    isArray: true,
  })
  async getVolunteersForLeaflets(): Promise<
    VolunteerForPlanningLeafletResponseDto[]
  > {
    return this.planning.getVolunteersForLeaflets();
  }

  @Get("subscribe")
  @Permissions(SYNC_PLANNING)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get current user subscription planning link",
    type: VolunteerSubscriptionPlanningResponseDto,
  })
  async getCurrentVolunteerSubscriptionPlanningLink(
    @AuthenticatedUser() user: RequestHydratedUser,
  ): Promise<PlanningSubscription> {
    return this.planning.subscribe(user.id);
  }

  @Get("subscribe/:secret")
  @Public()
  @ApiResponse({
    status: 200,
    description: "Ical format volunteer planning",
  })
  @ApiQuery({
    name: "after",
    required: false,
    type: Date,
  })
  @ApiQuery({
    name: "plaintext",
    required: false,
    type: Boolean,
    description: "Strip HTML from descriptions (for Apple Calendar)",
  })
  @Header("Content-Type", "text/calendar")
  async syncVolunteerPlanning(
    @Param("secret") secret: string,
    @Query("after", new ParseDatePipe({ optional: true })) after?: Date,
    @Query("plaintext") plaintext?: string,
  ) {
    const volunteerId = await this.retrieveVolunteerIdFromSecret(secret);
    const isPlainText = plaintext === "true";
    return this.planning.buildOne(ICAL, volunteerId, after, isPlainText);
  }

  @Post("booklets")
  @Permissions(AFFECT_VOLUNTEER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get volunteers plannings as booklets",
  })
  @ApiBody({
    description: "Volunteer ids",
    type: [Number],
  })
  @ApiQuery({
    name: "after",
    required: false,
    type: Date,
  })
  async getBooklets(
    @Body() volunteerIds: number[],
    @Res() response: Response,
    @Query("after", new ParseDatePipe({ optional: true })) after?: Date,
  ): Promise<string> {
    try {
      const pdfs = await Promise.all(
        volunteerIds.map(
          (id) => this.planning.buildOne(PDF, id, after) as Promise<string>,
        ),
      );
      const pdfbook = new PDFBook();
      const booklets = await pdfbook.generateMultipleBooklets(pdfs);
      response.setHeader("content-type", PDF);
      response.send(booklets);
      return;
    } catch (e) {
      if (e instanceof HttpException) {
        response.status(e.getStatus()).send(e.message);
        return;
      }
      console.error(e);
      response.status(500).send(e);
    }
  }

  @Get("booklets/:volunteerId")
  @Permissions(AFFECT_VOLUNTEER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get volunteer planning as a booklet",
  })
  @ApiQuery({
    name: "after",
    required: false,
    type: Date,
  })
  async getVolunteerBooklet(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
    @Res() response: Response,
    @Query("after", new ParseDatePipe({ optional: true })) after?: Date,
  ): Promise<string> {
    try {
      const pdf = (await this.planning.buildOne(
        PDF,
        volunteerId,
        after,
      )) as string;
      const pdfbook = new PDFBook();
      const booklets = await pdfbook.generateBooklet(pdf);
      response.setHeader("content-type", PDF);
      response.send(booklets);
      return;
    } catch (e) {
      if (e instanceof HttpException) {
        response.status(e.getStatus()).send(e.message);
        return;
      }
      console.error(e);
      response.status(500).send(e);
    }
  }

  @Get(":volunteerId")
  @Permissions(AFFECT_VOLUNTEER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get volunteer planning",
    isArray: true,
    type: TaskResponseDto,
  })
  @ApiQuery({
    name: "after",
    required: false,
    type: Date,
  })
  @ApiProduces(JSON, ICAL, PDF)
  async getVolunteerPlanning(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
    @RequestDecorator() request: Request,
    @Res() response: Response,
    @Query("after", new ParseDatePipe({ optional: true })) after?: Date,
  ): Promise<TaskResponseDto[]> {
    const format = request.headers.accept;
    try {
      const planning = await this.planning.buildOne(format, volunteerId, after);
      response.setHeader("content-type", format);
      response.send(planning);
      return;
    } catch (e) {
      if (e instanceof HttpException) {
        response.status(e.getStatus()).send(e.message);
        return;
      }
      console.error(e);
      response.status(500).send(e);
    }
  }

  @Get(":volunteerId/break-periods")
  @Permissions(AFFECT_VOLUNTEER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Volunteer break periods",
    type: BreakPeriodResponseDto,
    isArray: true,
  })
  async getVolunteerBreakPeriods(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
  ): Promise<BreakPeriodResponseDto[]> {
    return this.planning.getBreakPeriods(volunteerId);
  }

  @Post(":volunteerId/break-periods")
  @Permissions(AFFECT_VOLUNTEER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Volunteer break periods",
    type: BreakPeriodResponseDto,
    isArray: true,
  })
  @ApiBody({
    description: "Break period during",
    type: CreateBreakPeriodRequestDto,
  })
  async addVolunteerBreakPeriods(
    @Param("volunteerId", ParseIntPipe) volunteer: number,
    @Body() { name, start, durationInHours }: CreateBreakPeriodRequestDto,
  ): Promise<BreakPeriodResponseDto[]> {
    const duration = Duration.hours(durationInHours);
    return this.planning.addBreakPeriod({
      volunteer,
      name,
      during: { start, duration },
    });
  }

  @Delete(":volunteerId/break-periods")
  @Permissions(AFFECT_VOLUNTEER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Volunteer break periods",
    type: BreakPeriodResponseDto,
    isArray: true,
  })
  @ApiParam({
    name: "volunteerId",
    type: Number,
    description: "Volunteer identifier to remove break from",
  })
  @ApiQuery({
    name: "start",
    required: true,
    type: Date,
  })
  @ApiQuery({
    name: "end",
    required: true,
    type: Date,
  })
  async removeVolunteerBreakPeriod(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
    @Query("start", new ParseDatePipe()) start: Date,
    @Query("end", new ParseDatePipe()) end: Date,
  ): Promise<BreakPeriodResponseDto[]> {
    const breakPeriod = Period.init({ start, end });
    return this.planning.removeBreakPeriod(volunteerId, breakPeriod);
  }

  private async retrieveVolunteerIdFromSecret(secret: string): Promise<number> {
    try {
      const { volunteerId, edition } = await this.secret.checkSecret(secret);
      if (edition !== Edition.current) {
        throw new ForbiddenException("This planning is from previous edition");
      }
      return volunteerId;
    } catch {
      throw new NotFoundException();
    }
  }
}
