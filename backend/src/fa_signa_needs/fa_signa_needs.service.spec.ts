import { Test, TestingModule } from '@nestjs/testing';
import { FaSignaNeedsService } from './fa_signa_needs.service';

describe('FaSignaNeedsService', () => {
  let service: FaSignaNeedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaSignaNeedsService],
    }).compile();

    service = module.get<FaSignaNeedsService>(FaSignaNeedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
