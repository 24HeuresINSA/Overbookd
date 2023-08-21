import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt } from "class-validator";

export class ReviewerRequestDto {
  @ApiProperty({
    required: true,
    description: "The id of the Reviewer",
  })
  @IsInt()
  @IsDefined()
  id: number;
}
