import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from '../metrics.controller';
import { MetricsService } from '../metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;
  let metricsService: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: {
            calculateMRRForYear: jest.fn(),
            calculateChurnRateForYear: jest.fn(),
            calculateARPUForYear: jest.fn(),
            calculateRevenueAndPurchasesPerCustomer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
    metricsService = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call calculateMRRForYear', async () => {
    await controller.getMRRForYear('2022');
    expect(metricsService.calculateMRRForYear).toHaveBeenCalledWith(2022);
  });

  it('should call calculateChurnRateForYear', async () => {
    await controller.getChurnRateForYear('2022');
    expect(metricsService.calculateChurnRateForYear).toHaveBeenCalledWith(2022);
  });

  it('should call calculateARPUForYear', async () => {
    await controller.getARPU('2022');
    expect(metricsService.calculateARPUForYear).toHaveBeenCalledWith(2022);
  });

  it('should call calculateRevenueAndPurchasesPerCustomer', async () => {
    await controller.getCustomerData(2022);
    expect(
      metricsService.calculateRevenueAndPurchasesPerCustomer,
    ).toHaveBeenCalledWith(2022);
  });
});
