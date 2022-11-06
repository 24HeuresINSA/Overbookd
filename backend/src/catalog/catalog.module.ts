import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import {
  InMemoryCategoryRepository,
  InMemoryGearRepository,
  InMemoryTeamRepository,
} from './repositories';
import { SlugifyService } from 'src/common/services/slugify.service';
import { CategoryService } from './category.service';
import { CommonModule } from 'src/common/common.module';
import { CategoryController } from './catalog.controller';
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
  providers: [
    SlugifyService,
    CatalogService,
    CategoryService,
    InMemoryGearRepository,
    InMemoryCategoryRepository,
    {
      provide: InMemoryTeamRepository,
      useFactory: (existingTeams: Team[] = FAKE_EXISTING_TEAMS) => {
        const teamRepository = new InMemoryTeamRepository();
        teamRepository.teams = existingTeams;
        return teamRepository;
      },
    },
  ],
  controllers: [CategoryController],
  imports: [CommonModule],
  exports: [CatalogService, CategoryService],
})
export class CatalogModule {}
