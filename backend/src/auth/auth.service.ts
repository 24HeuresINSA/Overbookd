import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HashingUtilsService } from 'src/hashing-utils/hashing-utils.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private hashingUtilsService: HashingUtilsService
    ) {}

    private readonly logger = new Logger(AuthService.name)
    async validateUser(email: string, pass: string): Promise<any> {
        const whereEmailIsUnique = Prisma.validator<Prisma.UserWhereUniqueInput>()({
            email: email,
        });
        const user = await this.userService.user(whereEmailIsUnique);
        if(!user){
            throw new NotFoundException("L'email n'est pas valide");
        }else if ((await this.hashingUtilsService.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }


    async login(user: any) {
        const payload = { username: user.email, userId: user.userId, role: user.role };
        this.logger.debug(payload);
        return {
          access_token: this.jwtService.sign(payload),//create access token and assign it to a user profile
        };
    }
}
