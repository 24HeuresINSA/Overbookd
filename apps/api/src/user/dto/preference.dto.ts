import { ApiProperty } from "@nestjs/swagger";
import { Preference } from "@overbookd/http";
import { IsBoolean } from "class-validator";

export class PreferenceDto implements Preference {
  @ApiProperty({
    type: "boolean",
    description: "User preference for paper planning",
    example: false,
  })
  @IsBoolean()
  paperPlanning: boolean;
}
