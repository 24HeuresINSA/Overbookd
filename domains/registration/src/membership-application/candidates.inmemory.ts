import { Membership, STAFF, VOLUNTEER } from "../newcomer.js";
import { Candidates, Candidate } from "./candidates.js";

export class InMemoryCandidates implements Candidates {
  constructor(private candidates: Candidate[]) {}

  async isCandidate(
    email: string,
    edition: number,
    membership: Membership,
  ): Promise<boolean> {
    return this.candidates.some(
      (candidate) =>
        candidate.email === email &&
        candidate.edition === edition &&
        candidate.membership === membership,
    );
  }

  async isRejected(
    email: string,
    edition: number,
    membership: Membership,
  ): Promise<boolean> {
    return this.candidates.some(
      (candidate) =>
        candidate.email === email &&
        candidate.edition === edition &&
        candidate.membership === membership &&
        candidate.isRejected,
    );
  }

  async add(candidate: Candidate): Promise<void> {
    this.candidates = [...this.candidates, candidate];
  }

  async reject(
    email: string,
    edition: number,
    membership: Membership,
  ): Promise<void> {
    this.candidates = this.candidates.map((candidate) =>
      candidate.email === email &&
      candidate.edition === edition &&
      candidate.membership === membership
        ? { ...candidate, isRejected: true }
        : candidate,
    );
  }

  async cancelRejection(
    email: string,
    edition: number,
    membership: Membership,
  ): Promise<void> {
    this.candidates = this.candidates.map((candidate) =>
      candidate.email === email &&
      candidate.edition == edition &&
      candidate.membership === membership
        ? { ...candidate, isRejected: false }
        : candidate,
    );
  }

  get staffs(): Candidate[] {
    return this.candidates.filter(
      (candidate) => candidate.membership === STAFF,
    );
  }

  get volunteers(): Candidate[] {
    return this.candidates.filter(
      (candidate) => candidate.membership === VOLUNTEER,
    );
  }
}
