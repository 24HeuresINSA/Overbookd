import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { HashingUtilsModule } from "../hashing-utils/hashing-utils.module";
import { HashingUtilsService } from "../hashing-utils/hashing-utils.service";
import { UserModule } from "../user/user.module";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy";
import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../prisma.module";

@Module({
  imports: [
    UserModule,
    PassportModule,
    PrismaModule,
    MailModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: "24h",
      },
    }),
    HashingUtilsModule,
  ],
  providers: [AuthenticationService, JwtStrategy, HashingUtilsService],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
