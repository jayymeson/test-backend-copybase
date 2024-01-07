export interface Subscription {
  id: string;
  periodicity: string;
  chargeCount: number;
  chargeFrequencyDays: number;
  startDate: Date;
  status: string;
  statusDate: Date;
  cancellationDate?: Date;
  amount: number;
  nextCycleDate: Date;
  subscriberId: string;
}
