
export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  createdAt: Date;
}

export type CalendarView = 'weekly' | 'monthly' | 'yearly';
