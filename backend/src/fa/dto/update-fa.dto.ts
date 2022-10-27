import { PartialType } from '@nestjs/swagger';
import { CreateFaDto } from './create-fa.dto';

export class UpdateFaDto extends PartialType(CreateFaDto) {}
