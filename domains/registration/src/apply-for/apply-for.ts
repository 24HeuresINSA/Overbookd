import { Edition } from "@overbookd/time";
import { STAFF } from "../newcomer.js";
import { AlreadyCandidate } from "./candidature.error.js";

type Volunteer = { email: string };
export type Candidate = Volunteer & {
  membership: typeof STAFF;
  edition: number;
};

export type Candidates = {
  isCandidate(email: string, edition: number): Promise<boolean>;
  add(candidate: Candidate): Promise<void>;
};

export class ApplyFor {
  constructor(private readonly candidates: Candidates) {}

  async staff({ email }: Volunteer): Promise<void> {
    const edition = Edition.current;
    const isCandidate = await this.candidates.isCandidate(email, edition);
    if (isCandidate) throw new AlreadyCandidate(STAFF);

    return this.candidates.add({ email, membership: STAFF, edition });
  }
}
