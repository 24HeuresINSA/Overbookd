import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashingUtilsModule } from '../hashing-utils/hashing-utils.module';
import { HashingUtilsService } from '../hashing-utils/hashing-utils.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

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
    AuthenticationService,
    JwtStrategy,
    HashingUtilsService,
    UserService,
    PrismaService,
    MailService,
  ],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
