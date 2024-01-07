import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsPositive } from "class-validator";
import { Expense } from "@overbookd/personal-account";

export class RecordExpenseRequestDto implements Expense {
  @ApiProperty({ description: "expense amount in cents", type: Number })
  @IsPositive()
  amount: number;

  @ApiProperty({ description: "when expense occured", type: Date })
  @IsDate()
  @Type(() => Date)
  date: Date;
}
