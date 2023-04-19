import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SecretService } from './secret.service';
import { VolunteerPlanningService } from './volunteer-planning.service';
import { IcalRenderStrategy } from './render/renderStrategy';

@ApiTags('plannings')
@Controller('plannings')
export class VolunteerPlanningController {
  constructor(
    private readonly secretService: SecretService,
    private readonly planningService: VolunteerPlanningService,
  ) {}

  @Get(':secret')
  @ApiResponse({
    status: 200,
    description: 'Ical format volunteer planning',
  })
  @Header('Content-Type', 'text/calendar')
  async getVolunteerPlanning(@Param('secret') secret: string) {
    const volunteerId = await this.retrieveVolunteerId(secret);
    const tasks = await this.planningService.getVolunteerPlanning(volunteerId);
    if (tasks.length === 0) throw new ServiceUnavailableException();
    const icalRender = new IcalRenderStrategy();
    return icalRender.render(tasks);
  }

  private async retrieveVolunteerId(secret: string): Promise<number> {
    try {
      const { volunteerId } = await this.secretService.checkSecret(secret);
      return volunteerId;
    } catch {
      throw new NotFoundException();
    }
  }
}
