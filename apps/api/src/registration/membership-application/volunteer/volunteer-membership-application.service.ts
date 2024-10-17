import { Injectable } from "@nestjs/common";
import {
  ApplyFor,
  CandidateToEnroll,
  EnrollCandidates,
  RejectMembershipApplication,
} from "@overbookd/registration";
import { Users } from "../common/repository/users";
import { VolunteerCandidate } from "@overbookd/http";
import { EnrollCandidatesRepository } from "../common/repository/enroll-candidates";
import { SOFT_CODE } from "@overbookd/team-constants";

type UseCases = {
  applyFor: Readonly<ApplyFor>;
  reject: Readonly<RejectMembershipApplication>;
};

type Repositories = {
  users: Readonly<Users>;
  enrollCandidates: Readonly<EnrollCandidatesRepository>;
};

@Injectable()
export class VolunteerMembershipApplicationService {
  constructor(
    private readonly useCases: UseCases,
    private readonly repositories: Repositories,
  ) {}

  async applyFor(email: string): Promise<void> {
    return this.useCases.applyFor.volunteer({ email });
  }

  async rejectVolunteerApplication(candidateId: number): Promise<void> {
    const email = await this.repositories.users.findEmailById(candidateId);
    return this.useCases.reject.applyOne({ email });
  }

  async cancelVolunteerApplicationRejection(
    candidateId: number,
  ): Promise<void> {
    const email = await this.repositories.users.findEmailById(candidateId);
    return this.useCases.reject.unapplyOne({ email });
  }

  getCandidates(): Promise<VolunteerCandidate[]> {
    return this.repositories.enrollCandidates.findVolunteerCandidates();
  }

  countCandidates(): Promise<number> {
    return this.repositories.enrollCandidates.countVolunteerCandidates();
  }

  getRejectedCandidates(): Promise<VolunteerCandidate[]> {
    return this.repositories.enrollCandidates.findRejectedVolunteerCandidates();
  }

  async enroll(candidates: CandidateToEnroll[]): Promise<void> {
    const candidatesToEnroll = EnrollCandidates.with(candidates).to(SOFT_CODE);
    return this.repositories.enrollCandidates.enroll(candidatesToEnroll);
  }
}
