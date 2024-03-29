import { ApiProperty } from "@nestjs/swagger";
import { TeamRepresentation } from "../../common/dto/gear-representation.dto";
import { Category, Team } from "../types";

export class CategoryResponseDto implements Category {
  @ApiProperty({
    required: true,
    description: "Category id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "Category name",
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: "Category path",
    type: String,
  })
  path: string;

  @ApiProperty({
    required: false,
    description: "Parent Category id",
    type: Number,
  })
  parent?: number;

  @ApiProperty({
    required: false,
    description: "Category owner",
    type: TeamRepresentation,
  })
  owner?: Team;
}
