import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import {
  Configuration,
  ConfigurationKey,
  canReadConfiguration,
  canWriteConfiguration,
} from "@overbookd/configuration";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  async findAll({ permissions }: JwtUtil): Promise<Configuration[]> {
    const config = await this.prisma.configuration.findMany();
    return config.filter((c) => (canReadConfiguration(c.key, permissions)));
  }

  async findOne(key: ConfigurationKey, { permissions }: JwtUtil): Promise<Configuration> {
    if (!canReadConfiguration(key, permissions)) {
      return { key, value: null };
    }
    const config = await this.prisma.configuration.findUnique({
      where: { key },
    });
    return {
      key,
      value: config?.value ?? null,
    };
  }

  upsert(configuration: Configuration, { permissions }: JwtUtil): Promise<Configuration> {
    if (!canReadConfiguration(key, permissions)) {
      throw new ForbiddenException("You are not allowed to write this configuration");
    }
    return this.prisma.configuration.upsert({
      where: { key: configuration.key },
      create: configuration,
      update: configuration,
    });
  }
}
