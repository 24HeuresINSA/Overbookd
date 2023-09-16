import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, timingSafeEqual } from "crypto";
import { HashingUtilsService } from "../hashing-utils/hashing-utils.service";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma.service";
import { retrievePermissions } from "../team/utils/permissions";
import { UserPasswordOnly } from "../user/user.model";
import { UserService } from "../user/user.service";
import { SELECT_USER_TEAMS_AND_PERMISSIONS } from "../user/user.query";
import { ResetPasswordRequestDto } from "./dto/reset-password.request.dto";
import { JwtPayload } from "./entities/jwt-util.entity";
import { ONE_HOUR_IN_MS } from "@overbookd/period";
import { RefreshAccessRequest, UserAccess } from "./authentication.model";

type UserCredentials = { email: string; password: string };
type UserEmail = { email: string };
type UserId = { id: number };

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
    const user = await this.userService.getUserPassword(email);
    if (await this.isInvalidUser(user, password)) {
      throw new UnauthorizedException("Email ou mot de passe invalide");
    }
    return this.buildJwtUser(email);
  }

  private async buildJwtUser(identity: UserEmail | UserId) {
    const where = this.extractIdentity(identity);
    const userWithPayload = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
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
    };
  }

  private async isInvalidUser(user: UserPasswordOnly | null, pass: string) {
    return (
      !user || !(await this.hashingUtilsService.compare(pass, user.password))
    );
  }

  async login({ email, password }: UserCredentials): Promise<UserAccess> {
    const jwtPayload = await this.validateUser(email, password);
    return {
      accessToken: this.jwtService.sign(jwtPayload),
      refreshToken: this.jwtService.sign(jwtPayload, {
        expiresIn: "7d",
      }),
    };
  }

  async refresh({ refreshToken }: RefreshAccessRequest): Promise<UserAccess> {
    const { userId } = this.jwtService.verify<JwtPayload>(refreshToken);

    const user;

    return {
      accessToken: this.jwtService.sign({
        id: jwtPayload.id,
        userId: jwtPayload.id,
        teams: jwtPayload.teams,
        permissions: jwtPayload.permissions,
      }),
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
