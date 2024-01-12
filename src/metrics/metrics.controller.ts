import { Controller, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('mrr')
  async getMRRForYear(
    @Query('year') yearString?: string,
  ): Promise<
    Array<{ month: string; totalMRR: number; activeSubscriptions: number }>
  > {
    const year = yearString ? parseInt(yearString) : new Date().getFullYear();
    if (isNaN(year)) {
      return [];
    }
    return await this.metricsService.calculateMRRForYear(year);
  }

  @Get('churn-rate')
  async getChurnRateForYear(
    @Query('year') yearString?: string,
  ): Promise<
    Array<{ month: string; churnRate: number; cancellations: number }>
  > {
    const year = yearString ? parseInt(yearString) : new Date().getFullYear();
    if (isNaN(year)) {
      return [];
    }
    return await this.metricsService.calculateChurnRateForYear(year);
  }

  @Get('arpu')
  async getARPU(
    @Query('year') yearString?: string,
  ): Promise<Array<{ month: string; ARPU: number }>> {
    const year = yearString ? parseInt(yearString) : new Date().getFullYear();
    if (isNaN(year)) {
      return [];
    }
    return await this.metricsService.calculateARPUForYear(year);
  }

  @Get('revenue-per-customer')
  async getCustomerData(
    @Query('year') yearString?: string,
  ): Promise<{ user: string; revenue: number; purchases: number }[]> {
    const year = yearString ? parseInt(yearString) : new Date().getFullYear();
    if (isNaN(year)) {
      return [];
    }
    return await this.metricsService.calculateRevenueAndPurchasesPerCustomer(
      year,
    );
  }
}
