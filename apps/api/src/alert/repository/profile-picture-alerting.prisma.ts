import { User } from "@overbookd/user";
import { ProfilePictureAlerting } from "../alert.service";
import { PrismaService } from "../../prisma.service";

export class PrismaProfilePictureAlerting implements ProfilePictureAlerting {
  constructor(private readonly prisma: PrismaService) {}

  async for(id: User["id"]): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { profilePicture: true },
    });
    return !user?.profilePicture;
  }
}
