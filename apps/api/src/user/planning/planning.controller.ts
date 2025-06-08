import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Header,
  HttpException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request as RequestDecorator,
  Res,
  UseGuards,
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
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import {
  AFFECT_VOLUNTEER,
  DOWNLOAD_PLANNING,
  SYNC_PLANNING,
} from "@overbookd/permission";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { PlanningService } from "./planning.service";
import { BreakPeriodDuringRequestDto } from "../dto/break-period-during.request.dto";
import { Duration, Period, Edition } from "@overbookd/time";
import { ParseDatePipe } from "../../common/pipes/parse-date.pipe";
import { VolunteerForPlanningResponseDto } from "../dto/volunteer-for-planning.response.dto";
import { IcalRenderStrategy } from "./render/ical-render-strategy";
import { SecretService } from "./secret.service";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { VolunteerSubscriptionPlanningResponseDto } from "./dto/volunter-subscription-planning.response.dto";
import { RequestWithUserPayload } from "../../app.controller";
import { PlanningSubscription } from "./subscription.service";
import { TaskResponseDto } from "./dto/task.response.dto";
import { ICAL, PDF, JSON } from "@overbookd/http";
import { buildUserName } from "@overbookd/user";
import { PlanningRenderStrategy } from "./render/render-strategy";
import { PeriodResponseDto } from "../../common/dto/period.response.dto";
import { PeriodRequestDto } from "../../common/dto/period.request.dto";
import { PDFBook } from "@overbookd/pdf-book";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";

@Controller("planning")
@ApiTags("planning")
@ApiSwaggerResponse()
export class PlanningController {
  constructor(
    private readonly planning: PlanningService,
    private readonly secret: SecretService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(DOWNLOAD_PLANNING)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get current volunteer planning",
    isArray: true,
    type: TaskResponseDto,
  })
  @ApiProduces(JSON, ICAL, PDF)
  async getCurrentVolunteerPlanning(
    @RequestDecorator() request: RequestWithUserPayload,
    @Res() response: Response,
  ): Promise<TaskResponseDto[]> {
    const volunteerId = request.user.id;
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
      console.error(e);
      response.status(500).send(e);
    }
  }

  @Get("volunteers")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Volunteers with assignments",
    type: VolunteerForPlanningResponseDto,
    isArray: true,
  })
  async getVolunteers(): Promise<VolunteerForPlanningResponseDto[]> {
    return this.planning.getVolunteers();
  }

  @Get("subscribe")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(SYNC_PLANNING)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get current user subscription planning link",
    type: VolunteerSubscriptionPlanningResponseDto,
  })
  async getCurrentVolunteerSubscriptionPlanningLink(
    @RequestDecorator() { user }: RequestWithUserPayload,
  ): Promise<PlanningSubscription> {
    const volunteerId = user.id;
    return this.planning.subscribe(volunteerId);
  }

  @Get("subscribe/:secret")
  @ApiResponse({
    status: 200,
    description: "Ical format volunteer planning",
  })
  @Header("Content-Type", "text/calendar")
  async syncVolunteerPlanning(@Param("secret") secret: string) {
    const volunteerId = await this.retrieveVolunteerId(secret);
    const { tasks } = await this.planning.getPlanning(volunteerId);
    const icalRender = new IcalRenderStrategy();
    return icalRender.render(tasks);
  }

  @Post("booklets")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Get volunteers plannings as booklets",
  })
  @ApiBody({
    description: "Volunteer ids",
    type: [Number],
  })
  async getBooklets(
    @Body() volunteerIds: number[],
    @Res() response: Response,
  ): Promise<string> {
    try {
      const pdfs = await Promise.all(
        volunteerIds.map(
          (id) => this.formatPlanning(id, PDF) as Promise<string>,
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Get volunteer planning as a booklet",
  })
  async getVolunteerBooklet(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
    @Res() response: Response,
  ): Promise<string> {
    try {
      const pdf = (await this.formatPlanning(volunteerId, PDF)) as string;
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get volunteer planning",
    isArray: true,
    type: TaskResponseDto,
  })
  @ApiProduces(JSON, ICAL, PDF)
  async getVolunteerPlanning(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
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
      console.error(e);
      response.status(500).send(e);
    }
  }

  @Get(":volunteerId/break-periods")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Volunteer break periods",
    type: PeriodResponseDto,
    isArray: true,
  })
  async getVolunteerBreakPeriods(
    @Param("volunteerId", ParseIntPipe) volunteerId: number,
  ): Promise<PeriodResponseDto[]> {
    return this.planning.getBreakPeriods(volunteerId);
  }

  @Post(":volunteerId/break-periods")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Volunteer break periods",
    type: PeriodResponseDto,
    isArray: true,
  })
  @ApiBody({
    description: "Break period during",
    type: BreakPeriodDuringRequestDto,
  })
  async addVolunteerBreakPeriods(
    @Param("volunteerId", ParseIntPipe) volunteer: number,
    @Body() { start, durationInHours }: BreakPeriodDuringRequestDto,
  ): Promise<PeriodResponseDto[]> {
    const duration = Duration.hours(durationInHours);
    return this.planning.addBreakPeriod({
      volunteer,
      during: { start, duration },
    });
  }

  @Delete(":volunteerId/break-periods")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 200,
    description: "Volunteer break periods",
    type: PeriodResponseDto,
    isArray: true,
  })
  @ApiBody({
    description: "Period to remove break from",
    type: PeriodRequestDto,
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
    @Query("start", ParseDatePipe) start: Date,
    @Query("end", ParseDatePipe) end: Date,
  ): Promise<PeriodResponseDto[]> {
    const breakPeriod = Period.init({ start, end });
    return this.planning.removeBreakPeriod(volunteerId, breakPeriod);
  }

  private async formatPlanning(volunteerId: number, format: string) {
    const { tasks, volunteer } = await this.planning.getPlanning(volunteerId);
    const renderStrategy = PlanningRenderStrategy.get(format);
    return renderStrategy.render(tasks, {
      id: volunteerId,
      name: buildUserName(volunteer),
      teams: volunteer.teams,
    });
  }

  private async retrieveVolunteerId(secret: string): Promise<number> {
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
