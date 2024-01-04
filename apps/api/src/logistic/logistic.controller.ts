import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("logistic")
@Controller("logistic")
export class LogisticController {
  constructor() {}
}
