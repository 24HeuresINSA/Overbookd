import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, timingSafeEqual } from "crypto";
import { HashingUtilsService } from "../hashing-utils/hashing-utils.service";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma.service";
import { retrievePermissions } from "../team/utils/permissions";
import { UserService } from "../user/user.service";
import { SELECT_USER_TEAMS_AND_PERMISSIONS } from "../user/user.query";
import { ResetPasswordRequestDto } from "./dto/reset-password.request.dto";
import { JwtPayload, RefreshJwt } from "./entities/jwt-util.entity";
import { ONE_HOUR_IN_MS } from "@overbookd/time";
import { UserAccess, UserCredentials } from "@overbookd/http";
import { buildUserName } from "@overbookd/user";

type UserEmail = { email: string };
export type RefreshAccessRequest = { refreshToken: string };

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private hashingUtilsService: HashingUtilsService,
    private mailService: MailService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<JwtPayload> {
    const isDeleted = await this.userService.isDeleted(email);
    const user = await this.userService.getUserPassword(email);
    const isSamePassword = user
      ? await this.isSamePassword(user.password, password)
      : false;

    if (isDeleted && isSamePassword) {
      throw new HttpException(
        "Il y a une erreur avec ton compte, envoie un mail à overbookd@24heures.org",
        423,
      );
    }

    if (!user || !isSamePassword) {
      throw new UnauthorizedException("Email ou mot de passe invalide");
    }

    return this.buildJwtUser({ email });
  }

  private async buildJwtUser(where: UserEmail) {
    const userWithPayload = await this.prisma.user.findUnique({
      where,
      select: {
        id: true,
        firstname: true,
        lastname: true,
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

  async login({ email, password }: UserCredentials): Promise<UserAccess> {
    const jwtPayload = await this.validateUser(email, password);
    const refreshPayload = { id: jwtPayload.id, email };
    return {
      accessToken: this.jwtService.sign(jwtPayload),
      refreshToken: this.jwtService.sign(refreshPayload, { expiresIn: "7d" }),
    };
  }

  async refresh({ refreshToken }: RefreshAccessRequest): Promise<UserAccess> {
    const { email } = this.jwtService.verify<RefreshJwt>(refreshToken);

    const user = await this.buildJwtUser({ email });

    return {
      accessToken: this.jwtService.sign(user),
      refreshToken,
    };
  }

  async forgot({ email }: UserEmail): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { email, isDeleted: false },
    });

    if (!user) return;

    const resetToken = randomBytes(20).toString("hex");
    const expirationDate = new Date(Date.now() + ONE_HOUR_IN_MS);

    const userDatabaseUpdate = this.prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: expirationDate,
      },
    });

    const sendMailToUSer = this.mailService.mailResetPassword({
      email: email,
      firstname: user.firstname,
      token: resetToken,
    });

    await Promise.all([userDatabaseUpdate, sendMailToUSer]);
  }

  async recoverPassword({
    token,
    password,
    password2,
  }: ResetPasswordRequestDto): Promise<void> {
    if (!timingSafeEqual(Buffer.from(password), Buffer.from(password2))) {
      throw new BadRequestException("The passwords are not the same");
    }

    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException("Token is invalid or expired");
    }

    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        password: await this.hashingUtilsService.hash(password),
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }
}
