import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { HashingUtilsModule } from 'src/hashing-utils/hashing-utils.module';
import { HashingUtilsService } from 'src/hashing-utils/hashing-utils.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { AuthController } from './auth.controller';

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
    MailService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
