import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from '../metrics.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';

describe('MetricsService', () => {
  let service: MetricsService;
  let prismaService: PrismaService;
  const mockSubscriptionsService = {};

  const mockPrismaService = {
    subscriptions: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findMany for calculateMRRForMonth', async () => {
    (prismaService.subscriptions.findMany as jest.Mock).mockResolvedValue([
      { amount: 100 },
      { amount: 200 },
    ]);

    await service.calculateMRRForMonth(0, 2022);

    expect(prismaService.subscriptions.findMany).toHaveBeenCalled();
  });

  it('should call count for calculateChurnRateForMonth', async () => {
    await service.calculateChurnRateForMonth(0, 2022);
    expect(prismaService.subscriptions.count).toHaveBeenCalledTimes(2);
  });

  it('should calculate ARPU for a month', async () => {
    jest.spyOn(service, 'calculateMRRForMonth').mockResolvedValue({
      month: 'janeiro',
      totalMRR: 1000,
      activeSubscriptions: 10,
    });

    const result = await service.calculateARPUForMonth(0, 2022);
    expect(result).toEqual({
      month: 'janeiro',
      ARPU: 100,
    });
  });

  it('should calculate revenue and purchases per customer', async () => {
    (prismaService.subscriptions.findMany as jest.Mock).mockResolvedValue([
      { subscriber_id: 'user_1', amount: 100 },
      { subscriber_id: 'user_1', amount: 200 },
      { subscriber_id: 'user_2', amount: 300 },
    ]);

    const result = await service.calculateRevenueAndPurchasesPerCustomer(2022);
    expect(result).toEqual([
      { user: 'user_1', revenue: 300, purchases: 2 },
      { user: 'user_2', revenue: 300, purchases: 1 },
    ]);
  });
});
