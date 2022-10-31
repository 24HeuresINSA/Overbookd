import { Test, TestingModule } from '@nestjs/testing';
import { FaService } from './fa.service';
import { CreateFaDto, Status } from './dto/create-fa.dto';

const sampleFa: CreateFaDto = {
  name: 'test',
  type: 'Divertissement',
  team_id: 'informatique',
  in_charge: 2,
  location_id: 1,
  status: Status.DRAFT,
  description: 'sample FA',
  is_publishable: true,
  is_major: false,
  is_kids: false,
  created_at: new Date(),
  security_needs: null,
  waterflow_required: null,
};

describe('FaService', () => {
  let service: FaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaService],
    }).compile();

    service = module.get<FaService>(FaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new fa', async () => {
    const result = await service.create(sampleFa);
    expect(result).toEqual(sampleFa);
  });

  it('should get all fa', async () => {
    const result = await service.findAll();
    expect(result).toEqual([sampleFa]);
  });

  it('should get one fa', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(sampleFa);
  });
});
