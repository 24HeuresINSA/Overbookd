import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { MailService } from "../mail/mail.service";
import { HashingUtilsService } from "../hashing-utils/hashing-utils.service";
import { UserService } from "../user/user.service";
import { AuthenticationService } from "./authentication.service";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../prisma.service", () => ({
  PrismaService: vi.fn().mockImplementation(() => ({
    user: {
      update: vi.fn(),
      findFirst: vi.fn(),
    },
    $connect: vi.fn(),
  })),
}));

describe("AuthService", () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UserService,
          useValue: {
            getUserPassword: vi.fn(),
            user: vi.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: vi.fn(),
          },
        },
        {
          provide: HashingUtilsService,
          useValue: {
            compare: vi.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            mailResetPassword: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
