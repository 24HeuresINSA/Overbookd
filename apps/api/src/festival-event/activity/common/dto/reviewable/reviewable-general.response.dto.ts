import { ApiProperty } from "@nestjs/swagger";
import { Reviewable, TimeWindow } from "@overbookd/festival-event";
import { WithAtLeastOneItem } from "@overbookd/list";
import { TimeWindowResponseDto } from "../../../../common/dto/time-window.response.dto";

type PublicGeneral = Extract<Reviewable["general"], { toPublish: true }>;
type PrivateGeneral = Extract<Reviewable["general"], { toPublish: false }>;

export class PublicReviewableGeneralResponseDto implements PublicGeneral {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true, type: String, isArray: true })
  categories: WithAtLeastOneItem<string>;

  @ApiProperty({ required: true })
  toPublish: true;

  @ApiProperty({ required: true })
  photoLink: string;

  @ApiProperty({ required: true })
  isFlagship: boolean;

  @ApiProperty({ required: true, type: TimeWindowResponseDto, isArray: true })
  timeWindows: WithAtLeastOneItem<TimeWindow>;
}

export class PrivateReviewableGeneralResponseDto implements PrivateGeneral {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true, isArray: true, type: String })
  categories: string[];

  @ApiProperty({ required: true })
  toPublish: false;

  @ApiProperty({ required: true, nullable: true, type: String })
  photoLink: null;

  @ApiProperty({ required: true })
  isFlagship: false;

  @ApiProperty({ required: true, type: TimeWindowResponseDto, isArray: true })
  timeWindows: TimeWindow[];
}
