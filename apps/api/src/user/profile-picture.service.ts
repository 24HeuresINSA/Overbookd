import { Injectable, NotFoundException, StreamableFile } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { FileService } from "../utils/file.service";
import { SELECT_MY_USER_INFORMATION } from "./user.query";
import { UserService } from "./user.service";
import { MyUserInformation } from "@overbookd/user";
import { SELECT_CHARISMA_PERIOD } from "../common/query/charisma.query";

@Injectable()
export class ProfilePictureService {
  constructor(
    private readonly fileService: FileService,
    private readonly prisma: PrismaService,
  ) {}

  private async getProfilePicture(userId: number): Promise<string | null> {
    const { profilePicture } = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { profilePicture: true },
    });
    return profilePicture;
  }

  async updateProfilePicture(
    userId: number,
    profilePicture: string,
  ): Promise<MyUserInformation> {
    const currentProfilePicture = await this.getProfilePicture(userId);
    if (currentProfilePicture) {
      this.fileService.deleteFile(currentProfilePicture);
    }
    const [user, charismaPeriods] = await Promise.all([
      this.prisma.user.update({
        where: { id: userId },
        data: { profilePicture },
        select: SELECT_MY_USER_INFORMATION,
      }),
      this.prisma.charismaPeriod.findMany({ select: SELECT_CHARISMA_PERIOD }),
    ]);
    return UserService.formatToMyInformation(user, charismaPeriods);
  }

  async streamProfilePicture(userId: number): Promise<StreamableFile> {
    const profilePictureName = await this.getProfilePicture(userId);
    if (!profilePictureName) {
      throw new NotFoundException("Profile picture not found");
    }
    return this.fileService.streamFile(profilePictureName);
  }
}
