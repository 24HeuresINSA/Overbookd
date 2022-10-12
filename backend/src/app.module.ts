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

@Module({
  imports: [
    AuthModule,
    UserModule,
    HashingUtilsModule,
    TransactionModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, HashingUtilsService],
  exports: [PrismaService],
})
export class AppModule {}
