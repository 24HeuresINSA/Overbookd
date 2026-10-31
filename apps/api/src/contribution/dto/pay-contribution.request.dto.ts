import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEnum, IsNumber } from "class-validator";
import {
  contributionTypes,
  type ContributionType,
  type PayContributionForm,
} from "@overbookd/contribution";

export class PayContributionRequestDto implements PayContributionForm {
  @ApiProperty({
    description: "The adherent id",
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  adherentId: number;

  @ApiProperty({
    description: "The contribution type",
    enum: contributionTypes,
    example: "MEMBER",
  })
  @IsDefined()
  @IsEnum(contributionTypes, {
    message: () => "Le type de cotisation est invalide",
  })
  type: ContributionType;
}
