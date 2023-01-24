import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  Period,
  PeriodForm,
  PeriodNotFound,
  PeriodRepository,
} from '../gearRequests.service';

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
