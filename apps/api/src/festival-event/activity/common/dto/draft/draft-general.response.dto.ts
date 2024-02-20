import { ApiProperty } from "@nestjs/swagger";
import { Draft, TimeWindow } from "@overbookd/festival-event";
import { TimeWindowResponseDto } from "../../../../common/dto/time-window.response.dto";

export type General = Draft["general"];
export class GeneralDto implements General {
  @ApiProperty({
    description: "Festival activity name",
  })
  name: string;

  @ApiProperty({
    description: "Festival activity presentation",
    required: false,
  })
  description: string | null;

  @ApiProperty({
    description: "Festival activity categories",
    isArray: true,
  })
  categories: string[];

  @ApiProperty({
    description:
      "Do we whant to publish this festival activity to our web site",
  })
  toPublish: boolean;

  @ApiProperty({
    description: "Festival activity photo link",
    required: false,
  })
  photoLink: string | null;

  @ApiProperty({
    description:
      "Define which festival activities are most important ones (i.e. are flagship)",
  })
  isFlagship: boolean;

  @ApiProperty({
    description: "time windows during which this festival activity occurs",
    isArray: true,
    type: TimeWindowResponseDto,
  })
  timeWindows: TimeWindow[];
}
