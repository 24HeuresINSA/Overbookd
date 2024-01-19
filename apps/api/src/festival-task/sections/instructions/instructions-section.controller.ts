import { UseFilters, Controller } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";
import { InstructionsSectionService } from "./instructions-section.service";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";

@ApiBearerAuth()
@ApiTags("festival-tasks")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseFilters(FestivalTaskErrorFilter)
@Controller("festival-tasks")
export class InstructionsSectionController {
  constructor(
    private readonly instructionsService: InstructionsSectionService,
  ) {}
}
