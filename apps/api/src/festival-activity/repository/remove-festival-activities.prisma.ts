import { FestivalActivity } from "@overbookd/festival-activity";
import { PrismaService } from "../../prisma.service";
import { RemoveFestivalActivities } from "../festival-activity.service";
import { buildFestivalActivityCondition } from "./festival-activity.query";

export class PrismaRemoveFestivalActivities
  implements RemoveFestivalActivities
{
  constructor(private readonly prisma: PrismaService) {}

  async remove(id: FestivalActivity["id"]): Promise<void> {
    await this.prisma.festivalActivity.update({
      where: buildFestivalActivityCondition(id),
      data: { isDeleted: true },
    });
  }
}
