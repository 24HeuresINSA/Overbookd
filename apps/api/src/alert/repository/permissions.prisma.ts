import { Permissions } from "@overbookd/contribution";
import { Permission, isPermission } from "@overbookd/permission";
import { PrismaClient } from "@prisma/client";

export class PrismaPermissions implements Permissions {
  constructor(private readonly prisma: PrismaClient) {}

  async mine(id: number): Promise<Permission[]> {
    const where = this.includeMemberCondition(id);
    const permissions = await this.prisma.permission.findMany({
      select: { name: true },
      where,
    });
    return permissions.map(({ name }) => name).filter(isPermission);
  }

  private includeMemberCondition(userId: number) {
    return {
      teams: { some: { team: { users: { some: { userId } } } } },
    };
  }
}
