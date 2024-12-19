import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateLocationRequestDto } from "./dto/create-location.request.dto";
import { UpdateLocationRequestDto } from "./dto/update-location.request.dto";

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
        where: { locationId: id },
        select: { id: true },
      }),
      this.prisma.festivalTask.findMany({
        where: { appointmentId: id },
        select: { id: true },
      }),
    ]);

    if (linkedActivities.length > 0 || linkedTasks.length > 0) {
      const activitiesError = linkedActivities
        .map((activity) => `FA ${activity.id}`)
        .join(", ");
      const tasksError = linkedTasks.map((task) => `FT ${task.id}`).join(", ");
      const separator =
        linkedActivities.length > 0 && linkedTasks.length > 0 ? ", " : "";

      throw new ForbiddenException(
        `Impossible de supprimer le lieu, il est lié à : ${activitiesError}${separator}${tasksError}`,
      );
    }

    return this.prisma.signaLocation.delete({ where: { id } });
  }
}
