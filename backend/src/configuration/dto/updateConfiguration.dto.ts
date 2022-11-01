import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigurationDto } from './createConfiguration.dto';

export class UpdateConfigurationDto extends PartialType(
  CreateConfigurationDto,
) {}
