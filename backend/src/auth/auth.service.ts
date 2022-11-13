import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  UserPasswordOnly,
  UserService,
  UserWithTeam,
} from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashingUtilsService } from '../hashing-utils/hashing-utils.service';
import { User } from '@prisma/client';
import { randomBytes, timingSafeEqual } from 'crypto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';

type UserCredentials = Pick<User, 'email' | 'password'>;
type UserEmail = Pick<User, 'email'>;
const ONE_HOUR = 3600000;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private hashingUtilsService: HashingUtilsService,
    private mailService: MailService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserWithTeam> {
    const findUserCondition = {
      email,
    };
    const user = await this.userService.getUserPassword(findUserCondition);
    if (await this.isInvalidUser(user, password)) {
      throw new UnauthorizedException('Email ou mot de passe invalid');
    }
    return this.userService.user(findUserCondition);
  }

  private async isInvalidUser(user: UserPasswordOnly | null, pass: string) {
    return (
      !user || !(await this.hashingUtilsService.compare(pass, user.password))
    );
  }

  async login({
    email,
    password,
  }: UserCredentials): Promise<{ access_token: string }> {
    const { id, team: teams } = await this.validateUser(email, password);
    const jwtPayload = { id, teams };
    return {
      access_token: this.jwtService.sign(jwtPayload),
    };
  }

  async forgot({ email }: UserEmail): Promise<void> {
    const user = await this.userService.user({ email });

    if (!user) {
      throw new NotFoundException('Email invalid');
    }

    const reset_token = randomBytes(20).toString('hex');
    const expirationDate = new Date(Date.now() + ONE_HOUR);

    const userDatabaseUpdate = this.prisma.user.update({
      where: { email },
      data: {
        reset_password_token: reset_token,
        reset_password_expires: expirationDate,
      },
    });

    const sendMailToUSer = this.mailService.mailResetPassword({
      email: email,
      firstname: user.firstname,
      token: reset_token,
    });

    await Promise.all([userDatabaseUpdate, sendMailToUSer]);
  }

  async recoverPassword({
    token,
    password,
    password2,
  }: ResetPasswordDto): Promise<void> {
    if (!timingSafeEqual(Buffer.from(password), Buffer.from(password2))) {
      throw new BadRequestException('The passwords are not the same');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        reset_password_token: token,
        reset_password_expires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token is invalid or expired');
    }

    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        password: await this.hashingUtilsService.hash(password),
        reset_password_token: null,
        reset_password_expires: null,
      },
    });
  }
}
