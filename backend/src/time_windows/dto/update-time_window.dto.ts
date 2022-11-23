import { PartialType } from '@nestjs/swagger';
import { CreateTimeWindowDto } from './create-time_window.dto';

export class UpdateTimeWindowDto extends PartialType(CreateTimeWindowDto) {}
