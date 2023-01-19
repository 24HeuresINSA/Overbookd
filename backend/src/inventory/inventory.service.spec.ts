import { Category, Gear } from 'src/catalog/interfaces';
import { SlugifyService } from '../common/services/slugify.service';
import { GroupedRecord, InventoryService } from './inventory.service';
import { InMemoryInventoryRepository } from './repositories/inventory.repository.inmemory';

const teamMatos = { name: 'Orga Logistique Matos', code: 'matos' };

const OUTILS: Category = {
  id: 2,
  name: 'Outils',
  path: 'bricollage->outils',
  owner: teamMatos,
  parent: 1,
};

const MOBILIER: Category = {
  id: 3,
  name: 'Mobilier',
  path: 'mobilier',
  owner: teamMatos,
};

const PONCEUSE: Gear = {
  id: 5,
  name: 'Ponçeuse',
  slug: 'ponceuse',
  category: {
    id: OUTILS.id,
    path: OUTILS.path,
    name: OUTILS.name,
  },
  owner: teamMatos,
  code: 'BR_OU_005',
  isPonctualUsage: true,
};

const MARTEAU: Gear = {
  id: 1,
  name: 'Marteau',
  slug: 'marteau',
  category: {
    id: OUTILS.id,
    path: OUTILS.path,
    name: OUTILS.name,
  },
  owner: teamMatos,
  code: 'BR_OU_001',
  isPonctualUsage: true,
};

const TABLE: Gear = {
  id: 6,
  name: 'Table',
  slug: 'table',
  category: {
    id: MOBILIER.id,
    path: MOBILIER.path,
    name: MOBILIER.name,
  },
  owner: teamMatos,
  code: 'MO_006',
  isPonctualUsage: false,
};

describe('Icnventory Service', () => {
  const slugifyService = new SlugifyService();
  describe('Setup inventory', () => {
    const inventoryRepository = new InMemoryInventoryRepository();
    const inventoryService = new InventoryService(
      inventoryRepository,
      slugifyService,
    );
    describe('when ask to setup inventory with 2 records for different gear', () => {
      let inventory: GroupedRecord[];
      beforeAll(async () => {
        inventory = await inventoryService.setup([
          {
            quantity: 3,
            gear: PONCEUSE,
            storage: 'Local',
          },
          {
            quantity: 5,
            gear: MARTEAU,
            storage: 'Local',
          },
        ]);
      });
      it('should return the new catalog with 2 grouped record', () => {
        expect(inventory).toHaveLength(2);
        expect(inventory).toContainEqual({ quantity: 3, gear: PONCEUSE });
        expect(inventory).toContainEqual({ quantity: 5, gear: MARTEAU });
      });
      it('should persist the inventory after setup', async () => {
        const persistInventory = await inventoryService.search({});
        expect(persistInventory).toEqual(inventory);
      });
    });
    describe('when ask to setup inventory with 3 records for same gear', () => {
      it('should return a unique grouped record with the sum of quantities', async () => {
        const inventory = await inventoryService.setup([
          { quantity: 3, gear: TABLE, storage: 'Local' },
          { quantity: 20, gear: TABLE, storage: 'Cave du E' },
          { quantity: 7, gear: TABLE, storage: 'Conteneur H' },
        ]);
        expect(inventory).toHaveLength(1);
        expect(inventory).toContainEqual({ quantity: 30, gear: TABLE });
      });
    });
    describe('when ask to setup inventory with several records', () => {
      it('should return grouped records with the sum of quantities', async () => {
        const inventory = await inventoryService.setup([
          { quantity: 3, gear: TABLE, storage: 'Local' },
          { quantity: 20, gear: TABLE, storage: 'Cave du E' },
          { quantity: 7, gear: TABLE, storage: 'Conteneur H' },
          {
            quantity: 3,
            gear: PONCEUSE,
            storage: 'Local',
          },
          {
            quantity: 5,
            gear: MARTEAU,
            storage: 'Local',
          },
          {
            quantity: 15,
            gear: MARTEAU,
            storage: 'Conteneur H',
          },
        ]);
        expect(inventory).toHaveLength(3);
        expect(inventory).toContainEqual({ quantity: 30, gear: TABLE });
        expect(inventory).toContainEqual({ quantity: 3, gear: PONCEUSE });
        expect(inventory).toContainEqual({ quantity: 20, gear: MARTEAU });
      });
    });
  });
  describe('Retrieve inventory grouped records', () => {
    const records = [
      { quantity: 3, gear: TABLE, storage: 'Local' },
      { quantity: 20, gear: TABLE, storage: 'Cave du E' },
      { quantity: 7, gear: TABLE, storage: 'Conteneur H' },
      {
        quantity: 3,
        gear: PONCEUSE,
        storage: 'Local',
      },
      {
        quantity: 5,
        gear: MARTEAU,
        storage: 'Local',
      },
      {
        quantity: 15,
        gear: MARTEAU,
        storage: 'Conteneur H',
      },
    ];
    const inventoryRepository = new InMemoryInventoryRepository(records);
    const inventoryService = new InventoryService(
      inventoryRepository,
      slugifyService,
    );
    describe('When searching all grouped records', () => {
      it('should return all grouped records with the sum of quantities', async () => {
        const records = await inventoryService.search({});
        expect(records).toHaveLength(3);
        expect(records).toContainEqual({ quantity: 30, gear: TABLE });
        expect(records).toContainEqual({ quantity: 3, gear: PONCEUSE });
        expect(records).toContainEqual({ quantity: 20, gear: MARTEAU });
      });
    });
    describe.each`
      gearName      | expectedGroupedRecords
      ${TABLE.name} | ${[{ quantity: 30, gear: TABLE }]}
      ${'A'}        | ${[{ quantity: 30, gear: TABLE }, { quantity: 20, gear: MARTEAU }]}
      ${'Unknown'}  | ${[]}
    `('When searching $gearName', ({ gearName, expectedGroupedRecords }) => {
      it('should return all grouped records matching the gear', async () => {
        const records = await inventoryService.search({ name: gearName });
        expect(records).toHaveLength(expectedGroupedRecords.length);
        expect(records).toEqual(expectedGroupedRecords);
      });
    });
  });
});
