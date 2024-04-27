import { BadRequestException } from "@nestjs/common";
import { PipeTransform, Injectable } from "@nestjs/common";

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  transform(value: string) {
    if (isNaN(Date.parse(value))) {
      throw new BadRequestException("Validation failed");
    }
    return new Date(value);
  }
}
