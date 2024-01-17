import { UseFilters, Controller } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";
import { FestivalActivityErrorFilter } from "../../../festival-activity/common/festival-activity-error.filter";
import { GeneralSectionService } from "./general-section.service";

@ApiBearerAuth()
@ApiTags("festival-tasks")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseFilters(FestivalActivityErrorFilter)
@Controller("festival-tasks")
export class GeneralSectionController {
  constructor(private readonly generalService: GeneralSectionService) {}
}
