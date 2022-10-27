import { Test, TestingModule } from '@nestjs/testing';
import { FaService } from './fa.service';

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
});
