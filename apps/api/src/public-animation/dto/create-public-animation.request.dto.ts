import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { PublicAnimation } from "../public-animation.model";
import { UpdatePublicAnimationRequestDto } from "./update-public-animation.request.dto";

type PublicAnimationWithFaId = PublicAnimation & {
  faId: number;
};

export class CreatePublicAnimationRequestDto
  extends UpdatePublicAnimationRequestDto
  implements PublicAnimationWithFaId
{
  @ApiProperty({
    required: true,
    description: "Related FA id of the publish animation",
    type: Number,
  })
  @IsNumber()
  faId: number;
}
