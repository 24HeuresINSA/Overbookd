import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Configuration } from '@prisma/client';

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ConfigurationCreateInput): Promise<Configuration> {
    return this.prisma.configuration.create({ data: data });
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

  update(param: {
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
    throw new Error('Not implemented');
  }
}
