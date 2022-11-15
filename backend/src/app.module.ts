import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';
import { PrismaService } from './prisma.service';
import { TransactionModule } from './transaction/transaction.module';
import { HashingUtilsModule } from './hashing-utils/hashing-utils.module';
import { HashingUtilsService } from './hashing-utils/hashing-utils.service';
import { TeamModule } from './team/team.module';
import { FaModule } from './fa/fa.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { SecurityPassModule } from './security_pass/security_pass.module';
import { FA_commentModule } from './fa/fa_comment/fa_comment.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    HashingUtilsModule,
    TeamModule,
    TransactionModule,
    ConfigModule,
    FaModule,
    FA_commentModule,
    CollaboratorModule,
    SecurityPassModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, HashingUtilsService],
  exports: [PrismaService],
})
export class AppModule {}
