import { PartialType } from '@nestjs/swagger';
import { CreateCharismaGroupDto } from './createCharsimaGroup.dto';

export class UpdateCharismaGroupDto extends PartialType(
  CreateCharismaGroupDto,
) {}
