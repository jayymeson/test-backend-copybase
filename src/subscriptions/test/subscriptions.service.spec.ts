import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from '../subscriptions.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: PrismaService,
          useValue: {
            subscriptions: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
