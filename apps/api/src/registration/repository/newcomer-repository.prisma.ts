import {
  FulfilledRegistration,
  Membership,
  NewcomerRegistered,
  NewcomerRepository,
  TeamCode,
} from "@overbookd/registration";
import { PrismaService } from "../../prisma.service";
import { HashingUtilsService } from "../../hashing-utils/hashing-utils.service";

export class PrismaNewcomerRepository implements NewcomerRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: HashingUtilsService,
  ) {}

  async isEmailUsed(email: string): Promise<boolean> {
    const existing = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });
    return existing !== null;
  }

  async save<T extends Membership>(
    fulfilledForm: FulfilledRegistration,
    registrationMembership: T,
  ): Promise<NewcomerRegistered<T>> {
    const { mobilePhone, ...similarProperties } = fulfilledForm;
    const teams = {
      createMany: {
        data: fulfilledForm.teams.map((team: TeamCode) => ({
          teamCode: team,
        })),
      },
    };
    const data = {
      ...similarProperties,
      teams,
      phone: mobilePhone,
      password: await this.crypto.hash(fulfilledForm.password),
      registrationMembership,
    };
    const { id } = await this.prisma.user.create({
      data,
      select: { id: true },
    });

    return { ...fulfilledForm, id, membership: registrationMembership };
  }
}
