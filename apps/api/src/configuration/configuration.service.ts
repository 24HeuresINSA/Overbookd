import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import {
  Configuration,
  ConfigurationKey,
  canReadConfiguration,
  canWriteConfiguration,
} from "@overbookd/configuration";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";

@Injectable()
export class ConfigurationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user?: RequestHydratedUser): Promise<Configuration[]> {
    const config = await this.prisma.configuration.findMany();
    if (user?.isAdmin) return config;
    return config.filter((c) => canReadConfiguration(c.key, user?.permissions));
  }

  async findOne(
    key: ConfigurationKey,
    user?: RequestHydratedUser,
  ): Promise<Configuration> {
    if (!user?.isAdmin && !canReadConfiguration(key, user?.permissions)) {
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

  async upsert(
    configuration: Configuration,
    user?: RequestHydratedUser,
  ): Promise<Configuration> {
    if (
      !user?.isAdmin &&
      !canWriteConfiguration(configuration.key, user?.permissions)
    ) {
      throw new ForbiddenException(
        "Tu n'es pas autorisé à modifier cette configuration",
      );
    }

    return this.prisma.configuration.upsert({
      where: { key: configuration.key },
      create: configuration,
      update: configuration,
    });
  }
}
