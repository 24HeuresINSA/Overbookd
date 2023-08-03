import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  FaElectricityNeed,
  FaElectricityNeedWithOptionalId,
} from './fa-electricity-need.model';

const SELECT_ELECTRICITY_NEED = {
  id: true,
  electricityType: true,
  device: true,
  power: true,
  count: true,
  comment: true,
};

@Injectable()
export class FaElectricityNeedService {
  constructor(private prisma: PrismaService) {}

  async upsert(
    faId: number,
    electricityNeed: FaElectricityNeedWithOptionalId,
  ): Promise<FaElectricityNeed> {
    const electricityNeedToUpdate = { ...electricityNeed, faId };

    return this.prisma.faElectricityNeed.upsert({
      where: { id: electricityNeed?.id ?? -1 },
      create: electricityNeedToUpdate,
      update: electricityNeedToUpdate,
      select: SELECT_ELECTRICITY_NEED,
    });
  }

  async remove(faId: number, id: number): Promise<void> {
    await this.prisma.faElectricityNeed.deleteMany({
      where: {
        AND: [{ id }, { faId }],
      },
    });
  }
}
