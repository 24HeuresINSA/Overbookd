import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Configuration } from '@prisma/client';
import { CreateConfigurationDto } from './dto/createConfiguration.dto';

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateConfigurationDto): Promise<Configuration> {
    return this.prisma.configuration.create({
      data: {
        key: data.key,
        value: data.value,
      },
    });
  }

  configurations(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ConfigurationWhereUniqueInput;
    where?: Prisma.ConfigurationWhereInput;
    orderBy?: Prisma.ConfigurationOrderByWithRelationInput;
    select?: Prisma.ConfigurationSelect;
  }): Promise<Configuration[]> {
    return this.prisma.configuration.findMany({
      ...params,
    });
  }

  findOne(key: string): Promise<Configuration> {
    return this.prisma.configuration.findUnique({
      where: {
        key,
      },
    });
  }

  upsert(param: {
    where: Prisma.ConfigurationWhereUniqueInput;
    data: Prisma.ConfigurationCreateInput;
  }): Promise<Configuration> {
    const { where, data } = param;
    return this.prisma.configuration.upsert({
      where,
      create: data,
      update: data,
    });
  }

  remove(key: string) {
    this.prisma.configuration.update({
      where: {
        key,
      },
      data: {
        is_deleted: true,
      },
    });
  }
}
