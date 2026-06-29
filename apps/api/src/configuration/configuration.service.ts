import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import {
  Configuration,
  ConfigurationKey,
  VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
  canReadConfiguration,
  canWriteConfiguration,
} from "@overbookd/configuration";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";
import { Availability } from "@overbookd/volunteer-availability";
import { IProvidePeriod, Period } from "@overbookd/time";

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  async findAll(user?: JwtUtil): Promise<Configuration[]> {
    const config = await this.prisma.configuration.findMany();
    if (user?.isAdmin) return config;
    return config.filter((c) =>
      canReadConfiguration(c.key, user?.permissions ?? []),
    );
  }

  async findOne(key: ConfigurationKey, user?: JwtUtil): Promise<Configuration> {
    if (!user?.isAdmin && !canReadConfiguration(key, user?.permissions ?? [])) {
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

  upsert(configuration: Configuration, user?: JwtUtil): Promise<Configuration> {
    if (
      !user?.isAdmin &&
      !canWriteConfiguration(configuration.key, user?.permissions ?? [])
    ) {
      throw new ForbiddenException(
        "Tu n'es pas autorisé à modifier cette configuration",
      );
    }
    if (configuration.key === VOLUNTEER_BRIEFING_TIME_WINDOW_KEY) {
      const period = Period.init(configuration.value as IProvidePeriod);
      Availability.fromPeriod(period);
    }
    return this.prisma.configuration.upsert({
      where: { key: configuration.key },
      create: configuration,
      update: configuration,
    });
  }

  upsertBriefingTimeWindow(period: IProvidePeriod): Promise<Configuration> {
    Availability.fromPeriod(period);
    const configuration: Configuration = {
      key: VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
      value: period,
    };
    return this.prisma.configuration.upsert({
      where: { key: configuration.key },
      create: configuration,
      update: configuration,
    });
  }
}
