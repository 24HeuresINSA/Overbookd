import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserPasswordOnly, UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashingUtilsService } from 'src/hashing-utils/hashing-utils.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private hashingUtilsService: HashingUtilsService,
  ) {}

  private readonly logger = new Logger(AuthService.name);
  async validateUser(email: string, pass: string): Promise<any> {
    const findUserCondition = {
      email: email,
    };
    const user = await this.userService.getUserPassword(findUserCondition);
    if (await this.isInvalidUser(user, pass)) {
      throw new UnauthorizedException('Email ou mot de passe invalid');
    }
    return this.userService.user(findUserCondition);
  }

  private async isInvalidUser(user: UserPasswordOnly | null, pass: string) {
    return (
      !user || !(await this.hashingUtilsService.compare(pass, user.password))
    );
  }

  async login(user: any) {
    const payload = { username: user.email, userId: user.id, role: user.team };
    this.logger.debug(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
