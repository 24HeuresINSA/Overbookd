import { Injectable } from "@nestjs/common";
import {
  ApplyFor,
  CandidateToEnroll,
  EnrollCandidates,
  RejectMembershipApplication,
  STAFF,
  SwitchMembershipApplication,
  VOLUNTEER,
} from "@overbookd/registration";
import { VolunteerCandidate } from "@overbookd/http";
import { EnrollCandidatesRepository } from "../common/repository/enroll-candidates";
import { SOFT } from "@overbookd/team-code";

type UseCases = {
  applyFor: Readonly<ApplyFor>;
  reject: Readonly<RejectMembershipApplication>;
  switchApplication: Readonly<SwitchMembershipApplication>;
  enroll: Readonly<EnrollCandidates>;
};

type Repositories = {
  enroll: Readonly<EnrollCandidatesRepository>;
};

@Injectable()
export class VolunteerMembershipApplicationService {
  constructor(
    private readonly useCases: UseCases,
    private readonly repositories: Repositories,
  ) {}

  async rejectVolunteerApplication(candidateId: number): Promise<void> {
    return this.useCases.reject.applyOne(candidateId, VOLUNTEER);
  }

  async cancelVolunteerApplicationRejection(
    candidateId: number,
  ): Promise<void> {
    return this.useCases.reject.unapplyOne(candidateId, VOLUNTEER);
  }

  async switchVolunteerToStaffApplication(candidateId: number): Promise<void> {
    return this.useCases.switchApplication.applyOne(
      candidateId,
      VOLUNTEER,
      STAFF,
    );
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
