import { ApiProperty } from "@nestjs/swagger";
import { GeneralSection } from "@overbookd/festival-activity";
import { IProvidePeriod } from "@overbookd/period";
import { PeriodDto } from "./period.dto";

export class GeneralSectionRequestDto implements Partial<GeneralSection> {
  @ApiProperty({
    description: "Festival activity name",
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: "Festival activity presentation",
    required: false,
  })
  description?: string | null;

  @ApiProperty({
    description: "Festival activity categories",
    isArray: true,
    required: false,
  })
  categories?: string[];

  @ApiProperty({
    description:
      "Do we whant to publish this festival activity to our web site",
    required: false,
  })
  toPublish?: boolean;

  @ApiProperty({
    description: "Festival activity photo link",
    required: false,
  })
  photoLink?: string | null;

  @ApiProperty({
    description:
      "Define which festival activities are most important ones (i.e. are flagship)",
    required: false,
  })
  isFlagship?: boolean;

  @ApiProperty({
    description: "time windows during which this festival activity occurs",
    isArray: true,
    type: PeriodDto,
    required: false,
  })
  timeWindows?: IProvidePeriod[];
}
