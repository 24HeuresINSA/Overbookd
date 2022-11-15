import { PartialType } from '@nestjs/swagger';
import { CreateSecurityPassDto } from './create-security_pass.dto';

export class UpdateSecurityPassDto extends PartialType(CreateSecurityPassDto) {}
