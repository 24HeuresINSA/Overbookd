import { STAFF } from "../newcomer.js";
import { Candidates, Candidate } from "./candidates.js";

export class InMemoryCandidates implements Candidates {
  constructor(private candidates: Candidate[]) {}

  async isCandidate(email: string, edition: number): Promise<boolean> {
    return this.candidates.some(
      (candidate) =>
        candidate.email === email &&
        candidate.edition === edition &&
        !candidate.isRejected,
    );
  }

  async hasRejectedApplication(
    email: string,
    edition: number,
  ): Promise<boolean> {
    console.log(this.candidates);
    return this.candidates.some(
      (candidate) =>
        candidate.email === email &&
        candidate.edition === edition &&
        candidate.isRejected,
    );
  }

  async add(candidate: Candidate): Promise<void> {
    const newCandidate = { ...candidate, isRejected: false };
    this.candidates = [...this.candidates, newCandidate];
  }

  async reject(email: string, edition: number): Promise<void> {
    this.candidates = this.candidates.map((candidate) =>
      candidate.email === email && candidate.edition === edition
        ? { ...candidate, isRejected: true }
        : candidate,
    );
  }

  get staff(): Candidate[] {
    return this.candidates.filter(
      (candidate) => candidate.membership === STAFF,
    );
  }
}
