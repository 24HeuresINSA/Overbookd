import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { HashingUtilsModule } from 'src/hashing-utils/hashing-utils.module';
import { HashingUtilsService } from 'src/hashing-utils/hashing-utils.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' }, //todo change this to a better time
    }),
    HashingUtilsModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    HashingUtilsService,
    UserService,
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
