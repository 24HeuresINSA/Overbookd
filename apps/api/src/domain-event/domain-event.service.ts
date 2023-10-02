import { Observable, ReplaySubject, filter, map } from "rxjs";
import {
  DomainEvent,
  Domain,
  OverbookdEvent,
  isAdherentRegistered,
  isVolunteerRegistered,
} from "./domain-event";
import {
  AdherentRegistered,
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

  private listen(domain: Domain): Observable<OverbookdEvent> {
    return this.$events
      .pipe(filter((event) => event.domain === domain))
      .pipe(map(({ event }) => event));
  }

  publish<T extends OverbookdEvent>(event: DomainEvent<T>): void {
    this.$events.next(event);
  }

  get adherentRegisteredEvents(): Observable<AdherentRegistered> {
    return this.listen("registration").pipe(filter(isAdherentRegistered));
  }

  get volunteerRegisteredEvents(): Observable<VolunteerRegistered> {
    return this.listen("registration").pipe(filter(isVolunteerRegistered));
  }
}
