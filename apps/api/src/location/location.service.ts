import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateLocationRequestDto } from "./dto/create-location.request.dto";
import { UpdateLocationRequestDto } from "./dto/update-location.request.dto";
import { IS_NOT_DELETED } from "../common/query/not-deleted.query";

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
    const [linkedActivities, linkedTasks] = await Promise.all([
      this.prisma.festivalActivity.findMany({
        where: { locationId: id, ...IS_NOT_DELETED },
        select: { id: true },
      }),
      this.prisma.festivalTask.findMany({
        where: { appointmentId: id, ...IS_NOT_DELETED },
        select: { id: true },
      }),
    ]);

    if (linkedActivities.length > 0 || linkedTasks.length > 0) {
      const activitiesTitles = linkedActivities.map(({ id }) => `FA ${id}`);
      const tasksTitles = linkedTasks.map(({ id }) => `FT ${id}`);
      const allLinkedTitles = [...activitiesTitles, ...tasksTitles].join(", ");
      const errorMessage = `Impossible de supprimer le lieu, il est lié à : ${allLinkedTitles}`;
      throw new ForbiddenException(errorMessage);
    }

    return this.prisma.signaLocation.delete({ where: { id } });
  }
}
