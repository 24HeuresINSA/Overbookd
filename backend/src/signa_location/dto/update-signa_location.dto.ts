import { PartialType } from '@nestjs/swagger';
import { CreateSignaLocationDto } from './create-signa_location.dto';

export class UpdateSignaLocationDto extends PartialType(CreateSignaLocationDto) {}
