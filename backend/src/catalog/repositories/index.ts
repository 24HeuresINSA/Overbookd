import {
  InMemoryCategoryRepository,
  InMemoryGearRepository,
  InMemoryTeamRepository,
} from './in-memory';
import {
  PrismaCategoryRepository,
  PrismaGearRepository,
  PrismaTeamRepository,
} from './prisma';

export {
  // Use this for development
  // InMemoryCategoryRepository,
  // InMemoryTeamRepository,
  // InMemoryGearRepository,
  PrismaCategoryRepository,
  PrismaGearRepository,
  PrismaTeamRepository,
};
