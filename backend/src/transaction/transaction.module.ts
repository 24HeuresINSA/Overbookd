import { Module, NestModule, MiddlewareConsumer  } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from '../prisma.service';
import { logger } from '../middleware/logger.middleware';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService],
})
export class TransactionModule implements NestModule {
  configure(cusumer: MiddlewareConsumer) {
    cusumer
      .apply(logger)
      .forRoutes(TransactionController);
  }
}
