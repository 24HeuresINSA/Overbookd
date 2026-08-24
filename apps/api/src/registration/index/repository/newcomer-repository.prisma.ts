import {
  BaseFulfilledRegistration,
  Membership,
  NewcomerRegistered,
  NewcomerRepository,
  RegistrationTeamCode,
} from "@overbookd/registration";
import { PrismaService } from "../../../prisma.service";

export class PrismaNewcomerRepository implements NewcomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async isEmailUsed(email: string): Promise<boolean> {
    const existing = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });
    return existing !== null;
  }

  async save<T extends Membership>(
    fulfilledForm: BaseFulfilledRegistration,
    registrationMembership: T,
  ): Promise<NewcomerRegistered<T>> {
    const { mobilePhone, ...similarProperties } = fulfilledForm;
    const data = {
      ...similarProperties,
      phoneNumber: mobilePhone,
      registrationMembership,
      teams: {
        createMany: {
          data: fulfilledForm.teams.map((team: RegistrationTeamCode) => ({
            teamCode: team,
          })),
          skipDuplicates: true,
        },
      },
    };
    const { id } = await this.prisma.user.upsert({
      where: { email: fulfilledForm.email },
      update: data,
      create: data,
      select: { id: true },
    });

    return {
      ...similarProperties,
      id,
      membership: registrationMembership,
      mobilePhone,
    };
  }
}
