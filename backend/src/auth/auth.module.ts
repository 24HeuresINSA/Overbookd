import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { HashingUtilsModule } from '../hashing-utils/hashing-utils.module';
import { HashingUtilsService } from '../hashing-utils/hashing-utils.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    HashingUtilsModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    HashingUtilsService,
    UserService,
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
