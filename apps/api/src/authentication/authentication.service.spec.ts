import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../mail/mail.service';
import { HashingUtilsService } from '../hashing-utils/hashing-utils.service';
import { UserService } from '../user/user.service';
import { AuthenticationService } from './authentication.service';
import { PrismaService } from '../prisma.service';

describe('AuthService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UserService,
          useValue: {
            getUserPassword: jest.fn(),
            user: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: HashingUtilsService,
          useValue: {
            compare: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            mailResetPassword: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              update: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
