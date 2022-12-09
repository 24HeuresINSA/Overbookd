import {
  Period,
  PeriodForm,
  PeriodNotFound,
  PeriodRepository,
} from '../gearRequests.service';

export class InMemoryPeriodRepository implements PeriodRepository {
  periods: Period[];

  constructor(periods: Period[]) {
    this.periods = periods;
  }

  addPeriod(form: PeriodForm): Promise<Period> {
    const id = this.periods.length + 1;
    const period = { id, ...form };
    this.periods = [...this.periods, period];
    return Promise.resolve(period);
  }

  getPeriod(id: number): Promise<Period> {
    const period = this.periods.find((p) => p.id === id);
    if (!period) throw new PeriodNotFound(id);
    return Promise.resolve(period);
  }
}
