import { Test, TestingModule } from '@nestjs/testing';
import { CreateFaDto, Status } from './dto/create-fa.dto';
import { FaService } from './fa.service';
import { PrismaService } from '../prisma.service';

const testFA: CreateFaDto = {
  FA: {
    name: 'test',
    type: 'test',
    team_id: 'hard',
    created_at: new Date(),
    in_charge: 1,
    location_id: 1,
    status: Status.DRAFT,
    description: 'string',
    is_publishable: true,
    is_major: false,
    is_kids: false,
    security_needs: 'string',
    water_flow_required: 0,
  },
  FA_Collaborators: [],
};

describe('FaService', () => {
  let faservice: FaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaService, PrismaService],
    }).compile();

    faservice = module.get<FaService>(FaService);
  });

  test('should be defined', () => {
    expect(faservice).toBeDefined();
  });

  describe('FA creation', () => {
    test('should create an FA without any collaborator', async () => {
      const result = await faservice.create(testFA);
      expect(result).toBeDefined();
    });
  });
});
