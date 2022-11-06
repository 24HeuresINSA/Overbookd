import { Test, TestingModule } from '@nestjs/testing';
import { FaService } from './fa.service';
import { PrismaService } from '../prisma.service';
import { nakedFA } from './testData';
import { FA } from '@prisma/client';

let faservice: FaService;
let prisma: PrismaService;

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
});

describe('FaService', () => {
  test('should be defined', () => {
    expect(faservice).toBeDefined();
    expect(prisma).toBeDefined();
  });

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
