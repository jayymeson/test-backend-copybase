export interface Subscription {
  id: string;
  periodicity: string;
  charge_count: number;
  charge_frequency_days: number;
  start_date: Date;
  status: string;
  status_date: Date;
  cancellation_date?: Date;
  amount: number;
  next_cycle_date: Date;
  subscriber_id: string;
}
