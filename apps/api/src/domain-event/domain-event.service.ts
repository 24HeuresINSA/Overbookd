import { Observable, ReplaySubject, filter, map } from "rxjs";
import { DomainEvent, Domain, OverbookEvent } from "./domain-event";

export class DomainEventService {
  private readonly $events = new ReplaySubject<DomainEvent>();

  private constructor(events: DomainEvent[]) {
    events.forEach((event) => this.$events.next(event));
  }

  static withEvents(events: DomainEvent[]): DomainEventService {
    return new DomainEventService(events);
  }

  static init(): DomainEventService {
    return new DomainEventService([]);
  }

  listen(domain: Domain): Observable<OverbookEvent> {
    return this.$events
      .pipe(filter((event) => event.domain === domain))
      .pipe(map(({ event }) => event));
  }

  publish<T extends OverbookEvent>(event: DomainEvent<T>): void {
    this.$events.next(event);
  }
}
