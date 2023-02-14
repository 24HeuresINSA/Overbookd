import { PartialType } from '@nestjs/swagger';
import { CreateCharismaPeriodDto } from './createCharismaPeriod.dto';

export class UpdateCharismaPeriodDto extends PartialType(
  CreateCharismaPeriodDto,
) {}
