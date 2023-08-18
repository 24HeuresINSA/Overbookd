import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigurationValue } from './configuration.model';
import { Configuration } from '@overbookd/configuration';

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Configuration[]> {
    return this.prisma.configuration.findMany();
  }

  findOne(key: string): Promise<Configuration> {
    return this.prisma.configuration.findUnique({
      where: { key },
    });
  }

  upsert(key: string, { value }: ConfigurationValue): Promise<Configuration> {
    const configuration = { key, value };
    return this.prisma.configuration.upsert({
      where: { key },
      create: configuration,
      update: configuration,
    });
  }

  async remove(key: string) {
    await this.prisma.configuration.delete({
      where: { key },
    });
  }
}
