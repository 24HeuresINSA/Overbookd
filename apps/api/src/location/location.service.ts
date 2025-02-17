import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateLocationRequestDto } from "./dto/create-location.request.dto";
import { UpdateLocationRequestDto } from "./dto/update-location.request.dto";
import { IS_NOT_DELETED } from "../common/query/not-deleted.query";

const SELECT_FESTIVAL_EVENT = {
  select: { id: true },
  where: IS_NOT_DELETED,
};

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.signaLocation.findMany({ orderBy: { name: "asc" } });
  }

  findOne(id: number) {
    return this.prisma.signaLocation.findUnique({ where: { id } });
  }

  create(location: CreateLocationRequestDto) {
    return this.prisma.signaLocation.create({ data: location });
  }

  update(id: number, location: UpdateLocationRequestDto) {
    return this.prisma.signaLocation.update({
      where: { id },
      data: location,
    });
  }

  async remove(id: number) {
    const { festivalActivities, festivalTasks } =
      await this.prisma.signaLocation.findUnique({
        where: { id },
        select: {
          festivalActivities: SELECT_FESTIVAL_EVENT,
          festivalTasks: SELECT_FESTIVAL_EVENT,
        },
      });

    if (festivalActivities.length > 0 || festivalTasks.length > 0) {
      const activitiesTitles = festivalActivities.map(({ id }) => `FA ${id}`);
      const tasksTitles = festivalTasks.map(({ id }) => `FT ${id}`);
      const allLinkedTitles = [...activitiesTitles, ...tasksTitles].join(", ");
      const errorMessage = `Impossible de supprimer le lieu, il est lié à : ${allLinkedTitles}`;
      throw new ForbiddenException(errorMessage);
    }

    return this.prisma.signaLocation.delete({ where: { id } });
  }
}
