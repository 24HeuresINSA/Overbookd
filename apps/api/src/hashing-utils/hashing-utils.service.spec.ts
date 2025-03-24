import { Test, TestingModule } from "@nestjs/testing";
import { HashingUtilsService } from "./hashing-utils.service";
import { beforeEach, describe, expect, it } from "vitest";

describe("HashingUtilsService", () => {
  let service: HashingUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingUtilsService],
    }).compile();

    service = module.get<HashingUtilsService>(HashingUtilsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
