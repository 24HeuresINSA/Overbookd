import { Injectable } from "@nestjs/common";
import {
  ApplyFor,
  CandidateToEnroll,
  EnrollCandidates,
  RejectMembershipApplication,
  VOLUNTEER,
} from "@overbookd/registration";
import { Users } from "../common/repository/users";
import { VolunteerCandidate } from "@overbookd/http";
import { EnrollCandidatesRepository } from "../common/repository/enroll-candidates";
import { SOFT } from "@overbookd/team-code";
import { ConfigurationService } from "../../../configuration/configuration.service";

type UseCases = {
  applyFor: Readonly<ApplyFor>;
  reject: Readonly<RejectMembershipApplication>;
  enroll: Readonly<EnrollCandidates>;
};

type Repositories = {
  users: Readonly<Users>;
  enroll: Readonly<EnrollCandidatesRepository>;
  configuration: Readonly<ConfigurationService>;
};

@Injectable()
export class VolunteerMembershipApplicationService {
  constructor(
    private readonly useCases: UseCases,
    private readonly repositories: Repositories,
  ) {}

  async rejectVolunteerApplication(candidateId: number): Promise<void> {
    const email = await this.repositories.users.findEmailById(candidateId);
    return this.useCases.reject.applyOne({ email }, VOLUNTEER);
  }

  async cancelVolunteerApplicationRejection(
    candidateId: number,
  ): Promise<void> {
    const email = await this.repositories.users.findEmailById(candidateId);
    return this.useCases.reject.unapplyOne({ email }, VOLUNTEER);
  }

  getCandidates(): Promise<VolunteerCandidate[]> {
    return this.repositories.enroll.findVolunteerCandidates();
  }

  countCandidates(): Promise<number> {
    return this.repositories.enroll.countVolunteerCandidates();
  }

  getRejectedCandidates(): Promise<VolunteerCandidate[]> {
    return this.repositories.enroll.findRejectedVolunteerCandidates();
  }

  enroll(candidates: CandidateToEnroll[]): Promise<void> {
    return this.useCases.enroll.apply({ candidates, team: SOFT });
  }
}
