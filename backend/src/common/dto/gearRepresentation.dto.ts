import { Gear, SimplifiedCategory, Team } from 'src/catalog/interfaces';

export class GearRepresentation implements Gear {
  id: number;
  name: string;
  slug: string;
  category?: SimplifiedCategoryRepresentation;
  owner?: TeamRepresentation;
  isPonctualUsage: boolean;
}

export class TeamRepresentation implements Team {
  name: string;
  code: string;
}

export class SimplifiedCategoryRepresentation implements SimplifiedCategory {
  id: number;
  name: string;
  path: string;
}
