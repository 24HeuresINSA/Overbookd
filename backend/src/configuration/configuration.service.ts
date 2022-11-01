import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ConfigurationCreateInput) {
    return this.prisma.configuration.create({ data: data });
  }

  configurations(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ConfigurationWhereUniqueInput;
    where?: Prisma.ConfigurationWhereInput;
    orderBy?: Prisma.ConfigurationOrderByWithRelationInput;
    select?: Prisma.ConfigurationSelect;
  }) {
    return this.prisma.configuration.findMany({
      ...params,
    });
  }

  findOne(key: string) {
    return this.prisma.configuration.findUnique({
      where: {
        key,
      },
    });
  }

  update(param: {
    where: Prisma.ConfigurationWhereUniqueInput;
    data: Prisma.ConfigurationUpdateInput;
  }) {
    const { where, data } = param;
    return this.prisma.configuration.update({ where, data });
  }

  remove(key: string) {
    throw NotImplementedException;
  }
}
