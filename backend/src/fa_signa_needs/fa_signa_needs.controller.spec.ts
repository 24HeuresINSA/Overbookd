import { Test, TestingModule } from '@nestjs/testing';
import { FaSignaNeedsController } from './fa_signa_needs.controller';
import { FaSignaNeedsService } from './fa_signa_needs.service';

describe('FaSignaNeedsController', () => {
  let controller: FaSignaNeedsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaSignaNeedsController],
      providers: [FaSignaNeedsService],
    }).compile();

    controller = module.get<FaSignaNeedsController>(FaSignaNeedsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
