import { FestivalActivity } from "@overbookd/festival-event";
import { PrismaService } from "../../../../prisma.service";
import { RemoveFestivalActivities } from "../festival-activity-common.model";
import { buildFestivalActivityCondition } from "./festival-activity.query";
import { IS_NOT_DELETED } from "../../../../common/query/not-deleted.query";
import { ForbiddenException } from "@nestjs/common";

export class PrismaRemoveFestivalActivities
  implements RemoveFestivalActivities
{
  constructor(private readonly prisma: PrismaService) {}

  async remove(id: FestivalActivity["id"]): Promise<void> {
    const linkedTasks = await this.prisma.festivalTask.findMany({
      where: { festivalActivityId: id, ...IS_NOT_DELETED },
      select: { id: true },
    });
    if (linkedTasks.length > 0) {
      const tasksTitles = linkedTasks.map(({ id }) => id).join(", ");
      const startErrorMessage = "Impossible de supprimer la FA, elle est liée";
      const endErrorMessage = `${linkedTasks.length === 1 ? "à la FT" : "aux FTs"} ${tasksTitles}`;
      throw new ForbiddenException(`${startErrorMessage} ${endErrorMessage}`);
    }

    await this.prisma.festivalActivity.update({
      where: buildFestivalActivityCondition(id),
      data: { isDeleted: true },
    });
  }
}
