import { Test, TestingModule } from '@nestjs/testing';
import { FaService } from './fa.service';
import { PrismaService } from '../prisma.service';
import { nakedFA } from './testData';
import { FA, FA_type, Location } from '@prisma/client';

let faservice: FaService;
let prisma: PrismaService;

let fa_type: FA_type;
let location: Location;

/**
 * a executer dans /Users/antoinepiron/Desktop/24H_INSA/overbookd-mono/backend/src/fa
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
