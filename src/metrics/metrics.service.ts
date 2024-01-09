import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class MetricsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptions: SubscriptionsService,
  ) {}

  async calculateMRRForMonth(
    month: number,
    year: number,
  ): Promise<{ month: string; totalMRR: number; activeSubscriptions: number }> {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const subscriptions = await this.prisma.subscriptions.findMany({
      where: {
        start_date: { gte: startOfMonth, lte: endOfMonth },
        status: 'Ativa',
      },
    });

    const totalMRR = subscriptions.reduce(
      (sum, subscription) => sum + subscription.amount,
      0,
    );

    const monthName = startOfMonth.toLocaleString('default', { month: 'long' });

    return {
      month: monthName,
      totalMRR,
      activeSubscriptions: subscriptions.length,
    };
  }

  async calculateMRRForYear(
    year: number,
  ): Promise<
    Array<{ month: string; totalMRR: number; activeSubscriptions: number }>
  > {
    const results = [];

    for (let month = 0; month < 12; month++) {
      const result = await this.calculateMRRForMonth(month, year);
      results.push(result);
    }

    return results;
  }

  async calculateChurnRateForMonth(
    month: number,
    year: number,
  ): Promise<{ month: string; churnRate: number; cancellations: number }> {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const activeAtStart = await this.prisma.subscriptions.count({
      where: {
        start_date: { lte: startOfMonth },
        OR: [
          { cancellation_date: null },
          { cancellation_date: { gte: startOfMonth } },
        ],
      },
    });

    const cancellations = await this.prisma.subscriptions.count({
      where: { cancellation_date: { gte: startOfMonth, lte: endOfMonth } },
    });

    const churnRate = activeAtStart === 0 ? 0 : cancellations / activeAtStart;
    const monthName = startOfMonth.toLocaleString('default', { month: 'long' });

    return { month: monthName, churnRate, cancellations };
  }

  async calculateChurnRateForYear(
    year: number,
  ): Promise<
    Array<{ month: string; churnRate: number; cancellations: number }>
  > {
    const results = [];

    for (let month = 0; month < 12; month++) {
      const result = await this.calculateChurnRateForMonth(month, year);
      results.push(result);
    }

    return results;
  }
}
