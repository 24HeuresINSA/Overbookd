import { ApiProperty } from "@nestjs/swagger";
import { Adherent, Feedback } from "@overbookd/festival-event";
import { AdherentResponseDto } from "./adherent.response.dto";

export class FeedbackResponseDto implements Feedback {
  @ApiProperty({
    type: AdherentResponseDto,
  })
  author: Adherent;

  @ApiProperty({})
  content: string;

  @ApiProperty({})
  publishedAt: Date;
}
