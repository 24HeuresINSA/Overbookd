import { ApiProperty } from "@nestjs/swagger";
import { TaskCategory } from "@prisma/client";
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  ValidationArguments,
} from "class-validator";

export class TimeSpanParametersRequestDto {
  @ApiProperty({
    description: "Is the time span a priority timeSpan?",
    example: true,
    type: Boolean,
  })
  @IsDefined()
  @IsBoolean()
  hasPriority: boolean;

  @ApiProperty({
    description: "The category of the task",
    example: TaskCategory.RELOU,
    enum: TaskCategory,
  })
  @IsOptional()
  @IsEnum(TaskCategory, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(TaskCategory)}`,
  })
  category: TaskCategory;
}
