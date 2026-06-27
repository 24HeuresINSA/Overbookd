import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { Expense } from "@overbookd/personal-account";

export class RecordExpenseRequestDto implements Expense {
  @ApiProperty({ description: "expense amount in cents", type: Number })
  @IsNumber()
  amount: number;
}
