import { Category, Gear } from 'src/catalog/interfaces';
import { SlugifyService } from '../common/services/slugify.service';
import {
  GroupedRecord,
  InventoryService,
  toLiteRecord,
} from './inventory.service';
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

describe('Inventory Service', () => {
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
        expect(inventory).toContainEqual({
          quantity: 3,
          gear: PONCEUSE,
          records: [
            {
              quantity: 3,
              storage: 'Local',
            },
          ],
        });
        expect(inventory).toContainEqual({
          quantity: 5,
          gear: MARTEAU,
          records: [
            {
              quantity: 5,
              storage: 'Local',
            },
          ],
        });
      });
      it('should persist the inventory after setup', async () => {
        const persistInventory = await inventoryService.search({});
        expect(persistInventory).toEqual(inventory);
      });
    });
    describe('when ask to setup inventory with 3 records for same gear', () => {
      it('should return a unique grouped record with the sum of quantities', async () => {
        const records = [
          { quantity: 3, gear: TABLE, storage: 'Local' },
          { quantity: 20, gear: TABLE, storage: 'Cave du E' },
          { quantity: 7, gear: TABLE, storage: 'Conteneur H' },
        ];
        const inventory = await inventoryService.setup(records);
        expect(inventory).toHaveLength(1);
        expect(inventory).toContainEqual({
          quantity: 30,
          gear: TABLE,
          records: records.map(toLiteRecord),
        });
      });
    });
    describe('when ask to setup inventory with several records', () => {
      it('should return grouped records with the sum of quantities', async () => {
        const tableRecords = [
          { quantity: 3, gear: TABLE, storage: 'Local' },
          { quantity: 20, gear: TABLE, storage: 'Cave du E' },
          { quantity: 7, gear: TABLE, storage: 'Conteneur H' },
        ];
        const ponceuseRecords = [
          {
            quantity: 3,
            gear: PONCEUSE,
            storage: 'Local',
          },
        ];
        const marteauRecords = [
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
        const inventory = await inventoryService.setup([
          ...tableRecords,
          ...ponceuseRecords,
          ...marteauRecords,
        ]);
        expect(inventory).toHaveLength(3);
        expect(inventory).toContainEqual({
          quantity: 30,
          gear: TABLE,
          records: tableRecords.map(toLiteRecord),
        });
        expect(inventory).toContainEqual({
          quantity: 3,
          gear: PONCEUSE,
          records: ponceuseRecords.map(toLiteRecord),
        });
        expect(inventory).toContainEqual({
          quantity: 20,
          gear: MARTEAU,
          records: marteauRecords.map(toLiteRecord),
        });
      });
    });
  });
  describe('Retrieve inventory grouped records', () => {
    const tableRecords = [
      { quantity: 3, gear: TABLE, storage: 'Local' },
      { quantity: 20, gear: TABLE, storage: 'Cave du E' },
      { quantity: 7, gear: TABLE, storage: 'Conteneur H' },
    ];
    const ponceuseRecords = [
      {
        quantity: 3,
        gear: PONCEUSE,
        storage: 'Local',
      },
    ];
    const marteauRecords = [
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
    const records = [...tableRecords, ...marteauRecords, ...ponceuseRecords];
    const inventoryRepository = new InMemoryInventoryRepository(records);
    const inventoryService = new InventoryService(
      inventoryRepository,
      slugifyService,
    );
    describe('When searching all grouped records', () => {
      it('should return all grouped records with the sum of quantities', async () => {
        const records = await inventoryService.search({});
        expect(records).toHaveLength(3);
        expect(records).toContainEqual({
          quantity: 30,
          gear: TABLE,
          records: tableRecords.map(toLiteRecord),
        });
        expect(records).toContainEqual({
          quantity: 3,
          gear: PONCEUSE,
          records: ponceuseRecords.map(toLiteRecord),
        });
        expect(records).toContainEqual({
          quantity: 20,
          gear: MARTEAU,
          records: marteauRecords.map(toLiteRecord),
        });
      });
    });
    describe.each`
      gearName      | expectedGroupedRecords
      ${TABLE.name} | ${[{ quantity: 30, gear: TABLE, records: tableRecords.map(toLiteRecord) }]}
      ${'A'}        | ${[{ quantity: 30, gear: TABLE, records: tableRecords.map(toLiteRecord) }, { quantity: 20, gear: MARTEAU, records: marteauRecords.map(toLiteRecord) }]}
      ${'Unknown'}  | ${[]}
    `('When searching $gearName', ({ gearName, expectedGroupedRecords }) => {
      it('should return all grouped records matching the gear', async () => {
        const records = await inventoryService.search({ name: gearName });
        expect(records).toHaveLength(expectedGroupedRecords.length);
        expect(records).toEqual(expectedGroupedRecords);
      });
    });
  });
  describe('Retrieve inventory records for a dedicated gear', () => {
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
    describe.each`
      gear                          | expectedRecords
      ${MARTEAU}                    | ${[{ quantity: 5, gear: MARTEAU, storage: 'Local' }, { quantity: 15, gear: MARTEAU, storage: 'Conteneur H' }]}
      ${TABLE}                      | ${[{ quantity: 3, gear: TABLE, storage: 'Local' }, { quantity: 20, gear: TABLE, storage: 'Cave du E' }, { quantity: 7, gear: TABLE, storage: 'Conteneur H' }]}
      ${{ name: 'Unkownn', id: 0 }} | ${[]}
    `(
      'When looking for $gear.name inventory records',
      ({ gear, expectedRecords }) => {
        it(`should return all ${expectedRecords.length} records matching it`, async () => {
          const res = await inventoryService.getDetails(gear.id);
          expect(res).toHaveLength(expectedRecords.length);
        });
      },
    );
  });
});
