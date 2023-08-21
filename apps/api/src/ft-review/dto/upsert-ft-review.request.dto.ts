import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpsertFtReviewRequestDto {
  @ApiProperty({
    required: true,
    type: String,
    description: "The team code of the reviewer",
  })
  @IsString()
  teamCode: string;
}
