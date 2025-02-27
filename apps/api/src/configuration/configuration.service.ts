import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Configuration, ConfigurationKey } from "@overbookd/configuration";

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Configuration[]> {
    return this.prisma.configuration.findMany();
  }

  async findOne(key: ConfigurationKey): Promise<Configuration> {
    const config = await this.prisma.configuration.findUnique({
      where: { key },
    });
    return {
      key,
      value: config?.value ?? null,
    };
  }

  upsert(configuration: Configuration): Promise<Configuration> {
    return this.prisma.configuration.upsert({
      where: { key: configuration.key },
      create: configuration,
      update: configuration,
    });
  }

  async remove(key: ConfigurationKey): Promise<void> {
    await this.prisma.configuration.delete({
      where: { key },
    });
  }
}
