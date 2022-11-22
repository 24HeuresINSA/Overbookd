import { PartialType } from '@nestjs/swagger';
import { CreateFaSignaNeedDto } from './create-fa_signa_need.dto';

export class UpdateFaSignaNeedDto extends PartialType(CreateFaSignaNeedDto) {}
