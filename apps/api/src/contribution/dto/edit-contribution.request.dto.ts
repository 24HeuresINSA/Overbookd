import { ApiProperty } from "@nestjs/swagger";
import {
  contributionTypes,
  type ContributionType,
  type EditContributionForm,
} from "@overbookd/contribution";
import { IsDefined, IsEnum } from "class-validator";

export class EditContributionRequestDto implements EditContributionForm {
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
