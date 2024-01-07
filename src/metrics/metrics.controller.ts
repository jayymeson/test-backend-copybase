import { Controller, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('mrr')
  async getMRR(
    @Query('start') startString?: string,
    @Query('end') endString?: string,
  ): Promise<{ mrr: number }> {
    const mrr = await this.metricsService.calculateMRR(startString, endString);
    return { mrr };
  }

  @Get('churn-rate')
  async getChurnRate(
    @Query('start') startString?: string,
    @Query('end') endString?: string,
  ): Promise<{ churnRate: number }> {
    const churnRate = await this.metricsService.calculateChurnRate(
      startString,
      endString,
    );
    return { churnRate };
  }
}
