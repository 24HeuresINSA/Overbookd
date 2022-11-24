import { PartialType } from '@nestjs/swagger';
import { CreateFaElectricityNeedDto } from './create-fa_electricity_need.dto';

export class UpdateFaElectricityNeedDto extends PartialType(CreateFaElectricityNeedDto) {}
