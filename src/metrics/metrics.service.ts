import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class MetricsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptions: SubscriptionsService,
  ) {}

  async calculateMRR(
    startString?: string,
    endString?: string,
  ): Promise<number> {
    const { startOfMonth, endOfMonth } = this.getPeriod(startString, endString);

    const subscriptions = await this.prisma.subscriptions.findMany({
      where: {
        start_date: { gte: startOfMonth, lte: endOfMonth },
        status: 'Ativa',
      },
    });

    return subscriptions.reduce(
      (sum, subscription) => sum + subscription.amount,
      0,
    );
  }

  async calculateChurnRate(
    startString?: string,
    endString?: string,
  ): Promise<number> {
    const { startOfMonth, endOfMonth } = this.getPeriod(startString, endString);

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

    return activeAtStart === 0 ? 0 : cancellations / activeAtStart;
  }

  private getPeriod(startString?: string, endString?: string) {
    let startOfMonth: Date;
    let endOfMonth: Date;

    if (startString) {
      const startYear = parseInt(startString.split('-')[0]);
      const startMonth = parseInt(startString.split('-')[1]) - 1;
      startOfMonth = new Date(startYear, startMonth, 1);
    } else {
      const now = new Date();
      startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (endString) {
      const endYear = parseInt(endString.split('-')[0]);
      const endMonth = parseInt(endString.split('-')[1]);
      endOfMonth = new Date(endYear, endMonth, 0);
    } else {
      endOfMonth = new Date(
        startOfMonth.getFullYear(),
        startOfMonth.getMonth() + 1,
        0,
      );
    }

    return { startOfMonth, endOfMonth };
  }
}
