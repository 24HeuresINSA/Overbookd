import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { PeriodNotFound } from "../gear-request.error";
import { Period, PeriodForm } from "../gear-request.model";
import { PeriodRepository } from "../gear-request.service";

@Injectable()
export class PrismaPeriodRepository implements PeriodRepository {
  constructor(private readonly prismaService: PrismaService) {}

  addPeriod(data: PeriodForm): Promise<Period> {
    return this.prismaService.period.create({ data });
  }

  async getPeriod(id: number): Promise<Period> {
    const period = await this.prismaService.period.findUnique({
      where: { id },
    });
    if (!period) throw new PeriodNotFound(id);
    return period;
  }
}
