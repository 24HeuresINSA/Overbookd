import { Candidates, Candidate } from "./apply-for.js";

export class InMemoryCandidates implements Candidates {
  constructor(private candidates: Candidate[]) {}

  async isCandidate(email: string, edition: number): Promise<boolean> {
    return this.candidates.some(
      (candidate) => candidate.email === email && candidate.edition === edition,
    );
  }

  async add(candidate: Candidate): Promise<void> {
    this.candidates = [...this.candidates, candidate];
  }

  get staff(): Candidate[] {
    return this.candidates;
  }
}
