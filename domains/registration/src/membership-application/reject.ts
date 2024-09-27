import { Edition } from "@overbookd/time";
import { Candidates, Volunteer } from "./candidates.js";
import { NotCandidate } from "./candidature.error.js";
import { STAFF } from "../newcomer.js";

export class RejectMembershipApplication {
  constructor(private readonly candidates: Candidates) {}

  async applyOne({ email }: Volunteer): Promise<void> {
    const edition = Edition.current;
    const isCandidate = await this.candidates.isCandidate(email, edition);
    if (!isCandidate) throw new NotCandidate(STAFF);

    return this.candidates.reject(email, edition);
  }
}
