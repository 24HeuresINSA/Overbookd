import { Test, TestingModule } from '@nestjs/testing';
import { FaService } from './fa.service';
import { PrismaService } from '../prisma.service';
import { nakedFA, collaboratorFA, secuFA } from './testData';
import { Collaborator, FA, FA_type, Location } from '@prisma/client';

let faservice: FaService;
let prisma: PrismaService;

let fa_type: FA_type;
let location: Location;

/**
 * a executer dans /overbookd-mono/backend/src/fa
 * npx jest fa.service.spec.ts --coverage --collectCoverageFrom="./fa/**"
 */

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [FaService, PrismaService],
  }).compile();

  faservice = module.get<FaService>(FaService);
  prisma = module.get<PrismaService>(PrismaService);

  fa_type = await prisma.fA_type.create({
    data: {
      name: 'test',
    },
  });
  location = await prisma.location.create({
    data: {
      type: 'DEPOT',
      name: 'test',
    },
  });
});

afterAll(async () => {
  await prisma.fA_type.delete({ where: { name: fa_type.name } });
  await prisma.location.delete({
    where: {
      id: location.id,
    },
  });
});

describe('check if every variable is defined', () => {
  test('should be defined', () => {
    expect(faservice).toBeDefined();
    expect(prisma).toBeDefined();
    expect(fa_type).toBeDefined();
    expect(location).toBeDefined();
  });
});

describe('FaService', () => {
  describe('FA creation', () => {
    describe('Create an FA without any links', () => {
      let result: FA | null;

      test('should create an FA without any links', async () => {
        expect(faservice.create).toBeDefined();
        const FA = nakedFA;
        FA.FA.type = fa_type.name;
        FA.FA.location_id = location.id;
        result = await faservice.create(nakedFA);
        expect(result).toBeDefined();
      });

      test('Should not get any collaborator', async () => {
        const collaborators = await prisma.collaborator.findMany({
          where: {
            FA_Collaborators: {
              some: {
                fa_id: result.id,
              },
            },
          },
        });
        expect(collaborators.length).toBe(0);
      });

      test('Should not get any security pass', async () => {
        //find all security passes linked to result
        const security_pass = await prisma.security_pass.findMany({
          where: {
            fa_id: result.id,
          },
        });
        expect(security_pass.length).toBe(0);
      });

      afterAll(async () => {
        //delete the FA
        await prisma.fA.delete({
          where: {
            id: result.id,
          },
        });
      });
    });

    describe('Create an FA with a collaborator', () => {
      let collab_result: FA | null;
      let collaborators: Collaborator[];

      test('should create an FA with a collaborator', async () => {
        expect(faservice.create).toBeDefined();
        const FA = collaboratorFA;
        FA.FA.type = fa_type.name;
        FA.FA.location_id = location.id;
        collab_result = await faservice.create(FA);
        expect(collab_result).toBeDefined();
      });

      test('Should get one collaborator', async () => {
        //find all collaborators linked to result
        collaborators = await prisma.collaborator.findMany({
          where: {
            FA_Collaborators: {
              some: {
                fa_id: collab_result.id,
              },
            },
          },
        });
        expect(collaborators.length).toBe(1);
      });

      afterAll(async () => {
        //remove FA foreign key from collaborator
        await prisma.fA_Collaborators.deleteMany({
          where: {
            fa_id: collab_result.id,
          },
        });
        //delete the FA
        await prisma.fA.delete({
          where: {
            id: collab_result.id,
          },
        });
        //delete the collaborator
        await prisma.collaborator.delete({
          where: {
            id: collaborators[0].id,
          },
        });
      });
    });

    describe('Create an FA with a security pass', () => {
      let secu_result: FA | null;
      let security_pass: any;

      test('should create an FA with a security pass', async () => {
        expect(faservice.create).toBeDefined();
        const FA = secuFA;
        FA.FA.type = fa_type.name;
        FA.FA.location_id = location.id;
        secu_result = await faservice.create(FA);
        expect(secu_result).toBeDefined();
      });

      test('Should get one security pass', async () => {
        //find all security passes linked to result
        security_pass = await prisma.security_pass.findMany({
          where: {
            fa_id: secu_result.id,
          },
        });
        expect(security_pass.length).toBe(1);
      });

      afterAll(async () => {
        //delete the security pass
        await prisma.security_pass.delete({
          where: {
            id: security_pass[0].id,
          },
        });
        //delete the FA
        await prisma.fA.delete({
          where: {
            id: secu_result.id,
          },
        });
      });
    });
  });
});
