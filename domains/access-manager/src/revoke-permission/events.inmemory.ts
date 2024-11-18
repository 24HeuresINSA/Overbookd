import { Events, PermissionRevoked } from "./revoke-permission";

export class InMemoryEvents implements Events {
  constructor(private events: PermissionRevoked[] = []) { }

  publish(event: PermissionRevoked): void {
    this.events = [...this.events, event];
  }

  get all(): PermissionRevoked[] {
    return this.events;
  }
}
