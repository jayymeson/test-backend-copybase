import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { Subscription } from './models/interface/subscription-interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Processa um arquivo enviado e insere assinaturas no banco de dados.
   * @param {Express.Multer.File} file - Arquivo de assinaturas enviado.
   * @return {Promise<{ inserted: number; ignored: number }>} O número de assinaturas inseridas e ignoradas.
   */
  async processUploadedFile(
    file: Express.Multer.File,
  ): Promise<{ inserted: number; ignored: number }> {
    const data = this.extractDataFromFile(file);

    // Inserir dados no banco de dados
    return this.insertSubscriptions(data);
  }

  /**
   * Insere um conjunto de assinaturas no banco de dados.
   * @param {Subscription[]} subscriptions - Assinaturas a serem inseridas.
   * @return {Promise<{ inserted: number; ignored: number }>} O número de assinaturas inseridas e ignoradas.
   */
  private async insertSubscriptions(
    subscriptions: Subscription[],
  ): Promise<{ inserted: number; ignored: number }> {
    let insertedCount = 0;
    let ignoredCount = 0;

    for (const subscription of subscriptions) {
      const existingSubscription = await this.prisma.subscriptions.findFirst({
        where: {
          subscriber_id: subscription.subscriber_id,
          start_date: subscription.start_date,
          amount: subscription.amount,
        },
      });

      if (!existingSubscription) {
        await this.prisma.subscriptions.create({ data: subscription });
        insertedCount++;
      } else {
        ignoredCount++;
      }
    }

    return { inserted: insertedCount, ignored: ignoredCount };
  }

  /**
   * Extrai dados de assinaturas de um arquivo Excel.
   * @param {Express.Multer.File} file - Arquivo Excel com os dados das assinaturas.
   * @return {Subscription[]} Um array de objetos de assinatura.
   */
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

      // Validação e conversão de datas
      const startDate = this.parseDate(item['data início']);
      const statusDate = this.parseDate(item['data status']);
      const cancellationDate = this.parseDate(item['data cancelamento']);
      const nextCycleDate = this.parseDate(item['próximo ciclo']);

      return {
        id: item.id || undefined,
        periodicity: item.periodicidade,
        charge_count: item['quantidade cobranças']
          ? Number(item['quantidade cobranças'])
          : 0,
        charge_frequency_days: item['cobrada a cada X dias']
          ? Number(item['cobrada a cada X dias'])
          : 0,
        start_date: startDate,
        status: item.status,
        status_date: statusDate,
        cancellation_date: cancellationDate,
        amount: item.valor ? Number(item.valor) : 0,
        next_cycle_date: nextCycleDate,
        subscriber_id: item['ID assinante'],
      };
    });
  }

  /**
   * Converte uma string de data para um objeto Date.
   * @param {string} dateString - Data em formato de string.
   * @return {Date | null} Objeto Date ou null se a string for inválida.
   */
  private parseDate(dateString: string): Date | null {
    if (!dateString) {
      return null;
    }

    // Formato esperado: "DD/MM/YYYY HH:mm"
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const year = parseInt(parts[2], 10) + 2000; // Ajuste para o ano
      const month = parseInt(parts[0], 10) - 1; // Mês começa do zero
      const day = parseInt(parts[1], 10);
      return new Date(year, month, day);
    }

    // Tenta converter usando o formato 'yyyy-mm-dd'
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  async deleteAllSubscriptions(): Promise<void> {
    await this.prisma.subscriptions.deleteMany({});
  }
}
