import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  Configuration,
  ConfigurationValue,
  DatabaseConfiguration,
} from './configuration.model';

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  async create(data: Configuration): Promise<Configuration> {
    const res = await this.prisma.configuration.create({
      data: {
        key: data.key,
        value: data.value,
      },
    });
    return this.formatConfiguration(res);
  }

  async findAll(): Promise<Configuration[]> {
    const res = await this.prisma.configuration.findMany();
    return this.formatConfigurations(res);
  }

  async findOne(key: string): Promise<Configuration> {
    const res = await this.prisma.configuration.findUnique({
      where: { key },
    });
    return this.formatConfiguration(res);
  }

  async upsert(
    key: string,
    { value }: ConfigurationValue,
  ): Promise<Configuration> {
    const configuration = { key, value };
    const res = await this.prisma.configuration.upsert({
      where: { key },
      create: configuration,
      update: configuration,
    });
    return this.formatConfiguration(res);
  }

  async remove(key: string) {
    await this.prisma.configuration.delete({
      where: { key },
    });
  }

  private formatConfigurations(
    configurations: DatabaseConfiguration[],
  ): Configuration[] {
    return configurations.map((configuration) =>
      this.formatConfiguration(configuration),
    );
  }

  private formatConfiguration(
    configuration: DatabaseConfiguration,
  ): Configuration {
    return {
      key: configuration.key,
      value: JSON.parse(configuration.value.toString()),
    };
  }
}
