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
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailService } from './mail/mail.service';
import { FaSignaNeedsModule } from './fa_signa_needs/fa_signa_needs.module';
import { FaCommentModule } from './fa_comment/fa_comment.module';
import { TimeWindowsModule } from './time_windows/time_windows.module';
import { FaElectricityNeedsModule } from './fa_electricity_needs/fa_electricity_needs.module';
import { CatalogModule } from './catalog/catalog.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { SignaLocationModule } from './signa_location/signa_location.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    HashingUtilsModule,
    TeamModule,
    TransactionModule,
    ConfigModule,
    FaModule,
    CollaboratorModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      },
      defaults: {
        from: `"Overbookd" <${process.env.GMAIL_USER}>`,
      },
      template: {
        dir: __dirname + '/mail/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
    FaSignaNeedsModule,
    FaCommentModule,
    TimeWindowsModule,
    FaElectricityNeedsModule,
    CatalogModule,
    CatalogModule,
    ConfigurationModule,
    SignaLocationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, HashingUtilsService, MailService],
  exports: [PrismaService],
})
export class AppModule {}
