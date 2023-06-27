import { Test, TestingModule } from '@nestjs/testing';
import { HashingUtilsService } from './hashing-utils.service';

describe('HashingUtilsService', () => {
  let service: HashingUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingUtilsService],
    }).compile();

    service = module.get<HashingUtilsService>(HashingUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
