import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HashingUtilsService } from "../hashing-utils/hashing-utils.service";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma.service";
import { retrievePermissions } from "../team/utils/permissions";
import { UserService } from "../user/user.service";
import { SELECT_USER_TEAMS_AND_PERMISSIONS } from "../user/user.query";
import { JwtPayload } from "./entities/jwt-util.entity";
import { UserAccess, UserCredentials } from "@overbookd/http";
import { buildUserName } from "@overbookd/user";
import { SELECT_USER_IDENTIFIER } from "../common/query/user.query";

type UserEmail = { email: string };

const DELETED_ACCOUNT_ERROR = new HttpException(
  "Il y a une erreur avec ton compte, envoie un mail à overbookd@24heures.org",
  423,
);

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private hashingUtilsService: HashingUtilsService,
    private mailService: MailService,
    private prisma: PrismaService,
  ) {}

  async login({ email, password }: UserCredentials): Promise<UserAccess> {
    const jwtPayload = await this.validateUser(email, password);
    await this.saveLastLogin(jwtPayload.id);
    const refreshPayload = { id: jwtPayload.id, email };
    return {
      accessToken: this.jwtService.sign(jwtPayload),
      refreshToken: this.jwtService.sign(refreshPayload, { expiresIn: "7d" }),
    };
  }

  async validateUser(email: string, password: string): Promise<JwtPayload> {
    const isDeleted = await this.userService.isDeleted(email);
    const user = await this.userService.getUserPassword(email);
    const isSamePassword = user
      ? await this.isSamePassword(user.password, password)
      : false;

    if (isDeleted && isSamePassword) throw DELETED_ACCOUNT_ERROR;

    if (!user || !isSamePassword) {
      throw new UnauthorizedException("Email ou mot de passe invalide");
    }

    return this.buildJwtUser({ email });
  }

  private async saveLastLogin(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  private async buildJwtUser(where: UserEmail) {
    const userWithPayload = await this.prisma.user.findUnique({
      where,
      select: {
        ...SELECT_USER_IDENTIFIER,
        ...SELECT_USER_TEAMS_AND_PERMISSIONS,
      },
    });
    const teams = userWithPayload.teams.map((t) => t.team.code);
    const permissions = retrievePermissions(userWithPayload.teams);
    return {
      id: userWithPayload.id,
      userId: userWithPayload.id,
      teams: teams,
      permissions: [...permissions],
      username: buildUserName(userWithPayload),
    };
  }

  private async isSamePassword(userPassword: string, existingPassword: string) {
    return this.hashingUtilsService.compare(existingPassword, userPassword);
  }
}
