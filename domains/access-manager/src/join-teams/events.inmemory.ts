import { Events, TeamsJoined } from "./join-teams";

export class InMemoryEvents implements Events {
  constructor(private events: TeamsJoined[] = []) {}

  publish(event: TeamsJoined): void {
    this.events = [...this.events, event];
  }

  get all(): readonly TeamsJoined[] {
    return this.events;
  }
}
