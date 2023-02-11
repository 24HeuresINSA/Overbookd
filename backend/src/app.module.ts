import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { ConfigModule } from './config/config.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { FaModule } from './fa/fa.module';
import { FaCommentModule } from './fa_comment/fa_comment.module';
import { FaElectricityNeedsModule } from './fa_electricity_needs/fa_electricity_needs.module';
import { FaSignaNeedsModule } from './fa_signa_needs/fa_signa_needs.module';
import { FaSitePublishAnimationModule } from './fa_site_publish_animation/fa_site_publish_animation.module';
import { FtModule } from './ft/ft.module';
import { FtFeedbackModule } from './ft_feedback/ft_feedback.module';
import { FtReviewsModule } from './ft_reviews/ft_reviews.module';
import { FtTimeWindowsModule } from './ft_time_windows/ft_time_windows.module';
import { FtUserRequestModule } from './ft_user_request/ft_user_request.module';
import { GearRequestsModule } from './gear-requests/gearRequests.module';
import { HashingUtilsModule } from './hashing-utils/hashing-utils.module';
import { HashingUtilsService } from './hashing-utils/hashing-utils.service';
import { InventoryModule } from './inventory/inventory.module';
import { MailService } from './mail/mail.service';
import { PermissionModule } from './permission/permission.module';
import { PrismaService } from './prisma.service';
import { SignaLocationModule } from './signa_location/signa_location.module';
import { TeamModule } from './team/team.module';
import { TimeWindowsModule } from './time_windows/time_windows.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { FtTeamRequestModule } from './ft_team_request/ft_team_request.module';
import { CharismaGroupModule } from './charisma_group/charisma_group.module';

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
    FaSitePublishAnimationModule,
    PermissionModule,
    InventoryModule,
    FtModule,
    FtTimeWindowsModule,
    GearRequestsModule,
    FtFeedbackModule,
    FtUserRequestModule,
    FtReviewsModule,
    FtTeamRequestModule,
    CharismaGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, HashingUtilsService, MailService],
  exports: [PrismaService],
})
export class AppModule {}
