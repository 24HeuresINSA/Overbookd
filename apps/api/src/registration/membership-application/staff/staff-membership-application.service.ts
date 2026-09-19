import { Injectable } from "@nestjs/common";
import {
  ApplyFor,
  type CandidateToEnroll,
  EnrollCandidates,
  InviteStaff,
  RejectMembershipApplication,
  STAFF,
  SwitchMembershipApplication,
  VOLUNTEER,
} from "@overbookd/registration";
import { EnrollCandidatesRepository } from "../common/repository/enroll-candidates";
import { StaffCandidate } from "@overbookd/http";
import { HARD } from "@overbookd/team-code";
import { createStaffInvitationToken } from "./jwt.utils";
import { ConfigurationService } from "../../../configuration/configuration.service";
import { INVITE_STAFF_LINK_KEY } from "@overbookd/configuration";
import { RequestHydratedUser } from "../../../authentication-zitadel/request-hydrated-user";

type UseCases = {
  applyFor: Readonly<ApplyFor>;
  reject: Readonly<RejectMembershipApplication>;
  switchApplication: Readonly<SwitchMembershipApplication>;
  enroll: Readonly<EnrollCandidates>;
};

type Repositories = {
  enroll: Readonly<EnrollCandidatesRepository>;
};

type Services = {
  configuration: Readonly<ConfigurationService>;
};

@Injectable()
export class StaffMembershipApplicationService {
  constructor(
    private readonly useCases: UseCases,
    private readonly repositories: Repositories,
    private readonly services: Services,
  ) {}

  async rejectStaffApplication(candidateId: number): Promise<void> {
    return this.useCases.reject.applyOne(candidateId, STAFF);
  }

  async cancelStaffApplicationRejection(candidateId: number): Promise<void> {
    return this.useCases.reject.unapplyOne(candidateId, STAFF);
  }

  async switchStaffToVolunteerApplication(candidateId: number): Promise<void> {
    return this.useCases.switchApplication.applyOne(
      candidateId,
      STAFF,
      VOLUNTEER,
    );
  }

  async getStaffInvitationLink(
    user: RequestHydratedUser,
  ): Promise<URL | undefined> {
    const link = await this.services.configuration.findOne(
      INVITE_STAFF_LINK_KEY,
      user,
    );
    return link?.value ? new URL(link.value.toString()) : undefined;
  }

  async generateStaffInvitationLink(user: RequestHydratedUser): Promise<URL> {
    const domain = process.env.DOMAIN ?? "";
    const token = createStaffInvitationToken();
    const link = InviteStaff.byLink({ domain, token });
    const config = { key: INVITE_STAFF_LINK_KEY, value: link.toString() };
    await this.services.configuration.upsert(config, user);
    return link;
  }

  getCandidates(): Promise<StaffCandidate[]> {
    return this.repositories.enroll.findStaffCandidates();
  }

  countCandidates(): Promise<number> {
    return this.repositories.enroll.countStaffCandidates();
  }

  getRejectedCandidates(): Promise<StaffCandidate[]> {
    return this.repositories.enroll.findRejectedStaffCandidates();
  }

  enroll(candidates: CandidateToEnroll[]): Promise<void> {
    const enrolling = { candidates, team: HARD } as const;
    return this.useCases.enroll.apply(enrolling);
  }
}
