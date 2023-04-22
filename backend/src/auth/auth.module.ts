import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashingUtilsModule } from '../hashing-utils/hashing-utils.module';
import { HashingUtilsService } from '../hashing-utils/hashing-utils.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import { FileService } from '../user/file.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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
    AuthService,
    JwtStrategy,
    HashingUtilsService,
    UserService,
    PrismaService,
    MailService,
    FileService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
