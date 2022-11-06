import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import {
  InMemoryCategoryRepository,
  InMemoryGearRepository,
  InMemoryTeamRepository,
} from './repositories';
import { SlugifyService } from '../common/services/slugify.service';
import { CategoryService } from './category.service';
import { CommonModule } from '../common/common.module';
import { CategoryController } from './category.controller';
import { Team } from './interfaces';

const teamMatos = { name: 'Orga Logistique Matos', slug: 'matos' };
const teamSigna = { name: 'Orga Signaletique', slug: 'signa' };
const teamElec = { name: 'Orga Logistique Electricite & Eau', slug: 'elec' };
const teamBarriere = { name: 'Orga Logistique & Securite', slug: 'barrieres' };

const FAKE_EXISTING_TEAMS: Team[] = [
  teamMatos,
  teamElec,
  teamSigna,
  teamBarriere,
];

@Module({
  imports: [CommonModule],
  providers: [
    SlugifyService,
    CatalogService,
    CategoryService,
    {
      provide: 'GEAR_REPOSITORY',
      useClass: InMemoryGearRepository,
    },
    {
      provide: 'CATEGORY_REPOSITORY',
      useClass: InMemoryCategoryRepository,
    },
    {
      provide: 'TEAM_REPOSITORY',
      useFactory: (existingTeams: Team[] = FAKE_EXISTING_TEAMS) => {
        const teamRepository = new InMemoryTeamRepository();
        teamRepository.teams = existingTeams;
        return teamRepository;
      },
    },
  ],
  controllers: [CategoryController],
  exports: [CatalogService, CategoryService],
})
export class CatalogModule {}
