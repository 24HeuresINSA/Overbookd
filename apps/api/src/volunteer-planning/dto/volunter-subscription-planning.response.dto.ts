import { ApiProperty } from '@nestjs/swagger';
import { PlanningSubscription } from '../subscription.service';

export class VolunteerSubscriptionPlanningResponseDto
  implements PlanningSubscription
{
  @ApiProperty({
    description: 'Link that can be used to subscribe to planning',
  })
  link: string;
}
