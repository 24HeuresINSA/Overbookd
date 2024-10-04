import { PrismaService } from "../../../prisma.service";
import { Users } from "../membership-application.service";

export class PrismaUsers implements Users {
  constructor(private readonly prisma: PrismaService) {}

  async findEmailById(id: number): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user.email;
  }
}