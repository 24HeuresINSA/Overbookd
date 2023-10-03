import { Observable, ReplaySubject, map } from "rxjs";
import { filterEvents, type DomainEvent } from "@overbookd/domain-events";
import {
  ADHERENT_REGISTERED,
  AdherentRegistered,
  VOLUNTEER_REGISTERED,
  VolunteerRegistered,
} from "@overbookd/registration";

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

  listen<T extends DomainEvent["type"]>(
    domain: T,
  ): Observable<Extract<DomainEvent, { type: T }>> {
    return filterEvents(domain, this.$events);
  }

  publish(event: DomainEvent): void {
    this.$events.next(event);
  }

  get adherentsRegistered(): Observable<AdherentRegistered> {
    return this.listen(ADHERENT_REGISTERED).pipe(map(({ data }) => data));
  }

  get volunteersRegistered(): Observable<VolunteerRegistered> {
    return this.listen(VOLUNTEER_REGISTERED).pipe(map(({ data }) => data));
  }
}
