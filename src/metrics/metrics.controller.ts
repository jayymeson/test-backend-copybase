import { Controller, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('mrr')
  async getMRR(
    @Query('start') startString?: string,
    @Query('end') endString?: string,
  ): Promise<{ totalMRR: number; activeSubscriptions: number }> {
    const { totalMRR, activeSubscriptions } =
      await this.metricsService.calculateMRR(startString, endString);
    return { totalMRR, activeSubscriptions };
  }

  @Get('churn-rate')
  async getChurnRate(
    @Query('start') startString?: string,
    @Query('end') endString?: string,
  ): Promise<{ churnRate: number; cancellations: number }> {
    const { churnRate, cancellations } =
      await this.metricsService.calculateChurnRate(startString, endString);
    return { churnRate, cancellations };
  }
}
