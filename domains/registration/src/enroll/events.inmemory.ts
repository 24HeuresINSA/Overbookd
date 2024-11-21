import { Events, CandidateEnrolledEvent } from "./enroll-candidates";

export class InMemoryEvents implements Events {
  constructor(private events: CandidateEnrolledEvent[] = []) { }

  publish(event: CandidateEnrolledEvent): void {
    this.events = [...this.events, event];
  }

  get all(): CandidateEnrolledEvent[] {
    return this.events;
  }
}
