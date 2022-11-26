import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CategoryService } from './category.service';
import { CommonModule } from '../common/common.module';
import { CategoryController } from './category.controller';
import { GearController } from './gear.controller';
import { PrismaService } from 'src/prisma.service';
import {
  PrismaCategoryRepository,
  PrismaGearRepository,
  PrismaTeamRepository,
} from './repositories';
import { UserService } from 'src/user/user.service';
import { TeamService } from 'src/team/team.service';
import { PermissionService } from 'src/permission/permission.service';

@Module({
  imports: [CommonModule],
  providers: [
    PrismaService,
    CatalogService,
    CategoryService,
    {
      provide: 'GEAR_REPOSITORY',
      useClass: PrismaGearRepository,
    },
    {
      provide: 'CATEGORY_REPOSITORY',
      useClass: PrismaCategoryRepository,
    },
    {
      provide: 'TEAM_REPOSITORY',
      useClass: PrismaTeamRepository,
    },
    UserService,
    TeamService,
    PermissionService,
  ],
  controllers: [CategoryController, GearController],
  exports: [CatalogService, CategoryService],
})
export class CatalogModule {}
