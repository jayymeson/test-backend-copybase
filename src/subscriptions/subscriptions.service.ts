import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { Subscription } from './models/interface/subscription-interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async processUploadedFile(
    file: Express.Multer.File,
  ): Promise<{ inserted: number; ignored: number }> {
    const data = this.extractDataFromFile(file);

    // Inserir dados no banco de dados
    return this.insertSubscriptions(data);
  }

  private async insertSubscriptions(
    subscriptions: Subscription[],
  ): Promise<{ inserted: number; ignored: number }> {
    let insertedCount = 0;
    let ignoredCount = 0;

    for (const subscription of subscriptions) {
      // Mapeia os campos para o formato esperado pelo Prisma
      const prismaData = {
        periodicity: subscription.periodicity,
        charge_count: subscription.chargeCount,
        charge_frequency_days: subscription.chargeFrequencyDays,
        start_date: subscription.startDate,
        status: subscription.status,
        status_date: subscription.statusDate,
        cancellation_date: subscription.cancellationDate,
        amount: subscription.amount,
        next_cycle_date: subscription.nextCycleDate,
        subscriber_id: subscription.subscriberId,
      };

      // Verifica se já existe um registro com o mesmo subscriber_id, start_date e amount
      const existingSubscription = await this.prisma.subscriptions.findFirst({
        where: {
          subscriber_id: prismaData.subscriber_id,
          start_date: prismaData.start_date,
          amount: prismaData.amount,
        },
      });

      // Se não existir, insere o novo registro
      if (!existingSubscription) {
        await this.prisma.subscriptions.create({ data: prismaData });
        insertedCount++;
      } else {
        ignoredCount++;
      }
    }

    return { inserted: insertedCount, ignored: ignoredCount };
  }

  private extractDataFromFile(file: Express.Multer.File): Subscription[] {
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      raw: false,
      dateNF: 'yyyy-mm-dd',
    });

    return rawData.map((item: any) => {
      // Validação de campos obrigatórios e formatos
      if (
        !item.periodicidade ||
        !item['ID assinante'] ||
        isNaN(Number(item.valor))
      ) {
        throw new Error('Dados inválidos na planilha.');
      }

      // Validação de data
      const startDate = new Date(item['data início']);
      if (isNaN(startDate.getTime())) {
        throw new Error('Formato de data inválido.');
      }

      // Verifica se 'próximo ciclo' é uma data válida
      const nextCycleDate = item['próximo ciclo'];
      let validNextCycleDate;
      if (nextCycleDate && !isNaN(Date.parse(nextCycleDate))) {
        validNextCycleDate = new Date(nextCycleDate);
      } else {
        validNextCycleDate = new Date();
      }

      return {
        id: item.id || undefined,
        periodicity: item.periodicidade,
        chargeCount: item['quantidade cobranças']
          ? Number(item['quantidade cobranças'])
          : 0,
        chargeFrequencyDays: item['cobrada a cada X dias']
          ? Number(item['cobrada a cada X dias'])
          : 0,
        startDate: item['data início']
          ? new Date(item['data início'])
          : new Date(),
        status: item.status,
        statusDate: item['data status']
          ? new Date(item['data status'])
          : new Date(),
        cancellationDate:
          item['data cancelamento'] && item['data cancelamento'] !== '0'
            ? new Date(item['data cancelamento'])
            : null,
        amount: item.valor ? Number(item.valor) : 0,
        nextCycleDate: validNextCycleDate,
        subscriberId: item['ID assinante'],
      };
    });
  }

  async deleteAllSubscriptions(): Promise<void> {
    await this.prisma.subscriptions.deleteMany({});
  }
}
