import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { SubscriptionData } from './models/interface/subscription-interface';

@Injectable()
export class MetricsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptions: SubscriptionsService,
  ) {}

  /**
   * Calcula a Receita Mensal Recorrente (MRR) para um mês específico.
   * @param {number} month - Mês para o cálculo.
   * @param {number} year - Ano para o cálculo.
   * @return {Promise<{ month: string; totalMRR: number; activeSubscriptions: number }>} MRR total e número de assinaturas ativas.
   */

  async calculateMRRForMonth(
    month: number,
    year: number,
  ): Promise<{ month: string; totalMRR: number; activeSubscriptions: number }> {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const subscriptions: SubscriptionData[] =
      await this.prisma.subscriptions.findMany({
        where: {
          start_date: { gte: startOfMonth, lte: endOfMonth },
          status: 'Ativa',
        },
      });

    const totalMRR = subscriptions.reduce<number>(
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

  /**
   * Calcula a Receita Mensal Recorrente (MRR) para um ano inteiro.
   * @param {number} year - Ano para o cálculo.
   * @return {Promise<Array<{ month: string; totalMRR: number; activeSubscriptions: number }>>} MRR total por mês e número de assinaturas ativas.
   */
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

  /**
   * Calcula a taxa de churn (cancelamento) para um mês específico.
   * @param {number} month - Mês para o cálculo.
   * @param {number} year - Ano para o cálculo.
   * @return {Promise<{ month: string; churnRate: number; cancellations: number }>} Taxa de churn e número de cancelamentos.
   */
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

  /**
   * Calcula a taxa de churn para um ano inteiro, mês a mês.
   * @param {number} year - Ano para o cálculo.
   * @return {Promise<Array<{ month: string; churnRate: number; cancellations: number }>>} Taxa de churn por mês e número de cancelamentos.
   */
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

  /**
   * Calcula a Receita Média Por Usuário (ARPU) para um mês específico.
   * @param {number} month - Mês para o cálculo.
   * @param {number} year - Ano para o cálculo.
   * @return {Promise<{ month: string; ARPU: number }>} ARPU do mês.
   */
  async calculateARPUForMonth(
    month: number,
    year: number,
  ): Promise<{ month: string; ARPU: number }> {
    const { totalMRR, activeSubscriptions } = await this.calculateMRRForMonth(
      month,
      year,
    );

    const ARPU = activeSubscriptions === 0 ? 0 : totalMRR / activeSubscriptions;
    const monthName = new Date(year, month, 1).toLocaleString('default', {
      month: 'long',
    });

    return {
      month: monthName,
      ARPU,
    };
  }

  /**
   * Calcula a Receita Média Por Usuário (ARPU) para um ano inteiro, mês a mês.
   * @param {number} year - Ano para o cálculo.
   * @return {Promise<Array<{ month: string; ARPU: number }>>} ARPU por mês.
   */
  async calculateARPUForYear(
    year: number,
  ): Promise<Array<{ month: string; ARPU: number }>> {
    const results = [];

    for (let month = 0; month < 12; month++) {
      const result = await this.calculateARPUForMonth(month, year);
      results.push(result);
    }

    return results;
  }

  /**
   * Calcula a receita e o número de compras por cliente em um ano específico.
   * @param {number} year - Ano para o cálculo.
   * @return {Promise<{ user: string; revenue: number; purchases: number }[]>} Receita e número de compras por cliente.
   */
  async calculateRevenueAndPurchasesPerCustomer(
    year: number,
  ): Promise<{ user: string; revenue: number; purchases: number }[]> {
    const subscriptions: SubscriptionData[] =
      await this.prisma.subscriptions.findMany({
        where: {
          start_date: {
            gte: new Date(year, 0, 1),
            lte: new Date(year, 11, 31),
          },
        },
        select: {
          subscriber_id: true,
          amount: true,
        },
      });

    type CustomerData = Record<string, { revenue: number; purchases: number }>;
    const customerData = subscriptions.reduce<CustomerData>(
      (acc, subscription) => {
        if (!acc[subscription.subscriber_id]) {
          acc[subscription.subscriber_id] = { revenue: 0, purchases: 0 };
        }
        acc[subscription.subscriber_id].revenue += subscription.amount;
        acc[subscription.subscriber_id].purchases += 1;
        return acc;
      },
      {} as CustomerData,
    );

    const sortedCustomers = Object.entries(customerData)
      .map(([user, data]) => ({
        user,
        revenue: data.revenue,
        purchases: data.purchases,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    return sortedCustomers;
  }
}
