import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Configuration, ConfigurationValue } from './configuration.model';

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  create(data: Configuration): Promise<Configuration> {
    return this.prisma.configuration.create({
      data: {
        key: data.key,
        value: data.value,
      },
    });
  }

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
