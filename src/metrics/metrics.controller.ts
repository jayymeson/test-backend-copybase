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
    return await this.metricsService.calculateMRRForYear(year);
  }

  @Get('churn-rate')
  async getChurnRateForYear(
    @Query('year') yearString?: string,
  ): Promise<
    Array<{ month: string; churnRate: number; cancellations: number }>
  > {
    const year = yearString ? parseInt(yearString) : new Date().getFullYear();
    return await this.metricsService.calculateChurnRateForYear(year);
  }
}
