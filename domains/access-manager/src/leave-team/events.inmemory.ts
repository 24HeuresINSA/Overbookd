import { Events, TeamLeft } from "./leave-team";

export class InMemoryEvents implements Events {
  constructor(private events: TeamLeft[] = []) { }

  publish(event: TeamLeft): void {
    this.events = [...this.events, event];
  }

  get all(): TeamLeft[] {
    return this.events;
  }
}
