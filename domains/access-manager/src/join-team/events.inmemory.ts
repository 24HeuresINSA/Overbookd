import { Events, TeamJoined } from "./join-team";

export class InMemoryEvents implements Events {
  constructor(private events: TeamJoined[] = []) {}

  publish(event: TeamJoined): void {
    this.events = [...this.events, event];
  }

  get all(): readonly TeamJoined[] {
    return this.events;
  }
}
