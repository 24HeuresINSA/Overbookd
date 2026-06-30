import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ConnectedZitadelUser } from "../authentication-zitadel/zitadel-types";
import { UserDataFromZitadel } from "../user/user.service";
import { parseBirthDateFromZitadelMetadata } from "../authentication-zitadel/zitadel-types-utils";

@Injectable()
export class CommonService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserDataFromConnectedZitadelUser(
    zitadelUser: ConnectedZitadelUser,
  ): Promise<UserDataFromZitadel & { id: number; zitadelId: string }> {
    const user = await this.prisma.user.findUnique({
      where: { zitadelId: zitadelUser.sub },
    });
    return {
      id: user.id,
      birthDate: parseBirthDateFromZitadelMetadata(zitadelUser),
      email: zitadelUser.email,
      firstName: zitadelUser.given_name,
      lastName: zitadelUser.family_name,
      phoneNumber: zitadelUser.phone_number,
      zitadelId: user.zitadelId,
    };
  }
}
