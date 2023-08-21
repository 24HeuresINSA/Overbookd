import { PartialType } from "@nestjs/swagger";
import { CreateCharismaPeriodRequestDto } from "./create-charisma-period.request.dto";

export class UpdateCharismaPeriodRequestDto extends PartialType(
  CreateCharismaPeriodRequestDto,
) {}
