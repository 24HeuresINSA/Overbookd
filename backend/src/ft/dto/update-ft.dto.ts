import { PartialType } from '@nestjs/swagger';
import { CreateFtDto } from './create-ft.dto';

export class UpdateFtDto extends PartialType(CreateFtDto) {}
