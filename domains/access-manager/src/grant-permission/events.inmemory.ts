import { Events, PermissionGranted } from "./grant-permission";

export class InMemoryEvents implements Events {
  constructor(private events: readonly PermissionGranted[] = []) {}

  publish(event: PermissionGranted): void {
    this.events = [...this.events, event];
  }

  get all(): readonly PermissionGranted[] {
    return this.events;
  }
}
