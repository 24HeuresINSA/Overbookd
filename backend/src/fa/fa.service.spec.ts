import { Test, TestingModule } from '@nestjs/testing';
import { FaService } from './fa.service';
import { PrismaService } from '../prisma.service';
import { nakedFA, collaboratorFA, emptyFA } from './testData';
import { Collaborator, FA, FA_type, Location, User } from '@prisma/client';
import { UpdateFaDto } from './dto/update-fa.dto';

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

describe('FA getters', () => {
  let FAs: UpdateFaDto[];
  let all_fa: FA[];
  beforeAll(async () => {
    FAs = [nakedFA, collaboratorFA, emptyFA];
    FAs.map(async (FA) => {
      FA.FA.type = fa_type.name;
      FA.FA.location_id = location.id;
    });
    expect(faservice.create).toBeDefined();
    await Promise.all(
      FAs.map(async (FA) => {
        return await faservice.create({ name: FA.FA.name });
      }),
    );
  });

  test('should return all FAs', async () => {
    all_fa = await faservice.findAll();
    expect(all_fa.length).toBe(FAs.length);
  });

  test('should return a FA', async () => {
    const FA = await faservice.findOne(all_fa[0].id);
    expect(FA).toBeDefined();
    expect(FA.name).toBe(all_fa[0].name);
  });

  afterAll(async () => {
    await prisma.fA.deleteMany({
      where: {
        id: {
          in: all_fa.map((fa) => fa.id),
        },
      },
    });
  });
});

describe('FA creation', () => {
  describe('Create an FA without any links', () => {
    let result: FA | null;

    test('should create an FA without any links', async () => {
      expect(faservice.create).toBeDefined();
      const FA = nakedFA;
      FA.FA.type = fa_type.name;
      FA.FA.location_id = location.id;
      result = await faservice.create({ name: nakedFA.FA.name });
      expect(result).toBeDefined();
    });

    test('Should update the fa with the correct data', async () => {
      expect(faservice.update).toBeDefined();
      const FA = nakedFA;
      FA.FA.type = fa_type.name;
      FA.FA.location_id = location.id;
      const updatedFA = await faservice.update(result.id, FA);
      expect(updatedFA).toBeDefined();
      Object.keys(FA.FA).map((key) => {
        expect(updatedFA).toHaveProperty(key);
        expect(updatedFA[key]).toStrictEqual(FA.FA[key]);
      });
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
      collab_result = await faservice.create({ name: FA.FA.name });
      expect(collab_result).toBeDefined();
      collab_result = await faservice.update(collab_result.id, FA);
      Object.keys(FA.FA).map((key) => {
        expect(collab_result).toHaveProperty(key);
        expect(collab_result[key]).toStrictEqual(FA.FA[key]);
      });
      const getfa = await faservice.findOne(collab_result.id);
      expect(getfa).toBeDefined();
      console.log(JSON.stringify(getfa, null, 2));
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
});

describe('FA validation system', () => {
  let sampleFA: FA | null;
  let validatorUser: User | null;
  let notValidatorUser: User | null;

  beforeAll(async () => {
    validatorUser = await prisma.user.findFirst({
      where: {
        team: {
          some: {
            team: {
              fa_validator: true,
            },
          },
        },
      },
    });
    notValidatorUser = await prisma.user.findFirst({
      where: {
        team: {
          some: {
            team: {
              fa_validator: false,
            },
          },
        },
      },
    });
    expect(validatorUser).toBeDefined();
    expect(notValidatorUser).toBeDefined();
    const FA = nakedFA;
    FA.FA.type = fa_type.name;
    FA.FA.location_id = location.id;
    sampleFA = await faservice.create({ name: FA.FA.name });
    expect(sampleFA).toBeDefined();
    sampleFA = await faservice.update(sampleFA.id, FA);
  });

  test("Should not validate an FA with a user who's not a validator", async () => {
    //try to validate the FA and expect an error
    await expect(
      faservice.validateFa(sampleFA.id, notValidatorUser.id),
    ).rejects.toThrowError();
  });

  test('Should accept the validation', async () => {
    await expect(
      faservice.validateFa(sampleFA.id, validatorUser.id),
    ).resolves.not.toThrowError();
  });

  test('Should not validate an FA that does not exist', async () => {
    await expect(
      faservice.validateFa(-1, validatorUser.id),
    ).rejects.toThrowError();
  });

  test('Should not validate an FA with a user that does not exist', async () => {
    //try to validate the FA and expect no error
    await expect(faservice.validateFa(sampleFA.id, -1)).rejects.toThrowError();
  });

  test('Should unvalidate the FA', async () => {
    await expect(
      faservice.invalidateFa(sampleFA.id, validatorUser.id),
    ).resolves.not.toThrowError();
    const validation = await prisma.fA_validation.findUnique({
      where: {
        fa_id_user_id: {
          fa_id: sampleFA.id,
          user_id: validatorUser.id,
        },
      },
    });
    expect(validation.is_deleted).toBe(true);
  });

  afterAll(async () => {
    //delete the validation
    await prisma.fA_validation.deleteMany({
      where: {
        fa_id: sampleFA.id,
      },
    });

    await prisma.fA_refuse.deleteMany({
      where: {
        fa_id: sampleFA.id,
      },
    });

    await prisma.fA.delete({
      where: {
        id: sampleFA.id,
      },
    });
  });
});
