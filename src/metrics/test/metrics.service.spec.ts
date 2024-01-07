import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from '../metrics.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: PrismaService,
          useValue: {
            subscriptions: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
        {
          provide: SubscriptionsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
