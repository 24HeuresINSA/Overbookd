import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  UserPasswordOnly,
  UserService,
  UserWithTeam,
} from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashingUtilsService } from 'src/hashing-utils/hashing-utils.service';
import { User } from '@prisma/client';

export type UserCredentials = Pick<User, 'email' | 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private hashingUtilsService: HashingUtilsService,
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
    const { id, team: role } = await this.validateUser(email, password);
    const jwtPayload = { id, email, role };
    return {
      access_token: this.jwtService.sign(jwtPayload),
    };
  }
}
