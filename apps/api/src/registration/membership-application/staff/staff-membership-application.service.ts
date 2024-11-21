import { BadRequestException, Injectable } from "@nestjs/common";
import {
  ApplyFor,
  type CandidateToEnroll,
  EnrollCandidates,
  InviteStaff,
  RejectMembershipApplication,
  STAFF,
} from "@overbookd/registration";
import { jwtConstants } from "../../../authentication/jwt-constants";
import { Users } from "../common/repository/users";
import { Configurations } from "./repository/configurations";
import { EnrollCandidatesRepository } from "../common/repository/enroll-candidates";
import { StaffCandidate } from "@overbookd/http";
import { HARD_CODE } from "@overbookd/team-constants";

type UseCases = {
  applyFor: Readonly<ApplyFor>;
  reject: Readonly<RejectMembershipApplication>;
  enroll: Readonly<EnrollCandidates>;
};

type Repositories = {
  users: Readonly<Users>;
  configurations: Readonly<Configurations>;
  enroll: Readonly<EnrollCandidatesRepository>;
};

@Injectable()
export class StaffMembershipApplicationService {
  constructor(
    private readonly useCases: UseCases,
    private readonly repositories: Repositories,
  ) {}

  async applyFor(email: string, token: string): Promise<void> {
    const isTokenValid = InviteStaff.isInvitationValid({
      token,
      secret: jwtConstants.secret,
    });
    if (!isTokenValid) {
      throw new BadRequestException("Le lien de candidature a expiré");
    }

    return this.useCases.applyFor.staff({ email });
  }

  async rejectStaffApplication(candidateId: number): Promise<void> {
    const email = await this.repositories.users.findEmailById(candidateId);
    return this.useCases.reject.applyOne({ email }, STAFF);
  }

  async cancelStaffApplicationRejection(candidateId: number): Promise<void> {
    const email = await this.repositories.users.findEmailById(candidateId);
    return this.useCases.reject.unapplyOne({ email }, STAFF);
  }

  async getStaffInvitationLink(): Promise<URL | undefined> {
    const link = await this.repositories.configurations.getInviteStaffLink();
    return link ? new URL(link) : undefined;
  }

  async generateStaffInvitationLink(): Promise<URL> {
    const domain = process.env.DOMAIN ?? "";
    const secret = jwtConstants.secret;
    const link = await InviteStaff.byLink({ domain, secret });
    await this.repositories.configurations.saveInviteStaffLink(link.toString());
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
    const enrolling = { candidates, team: HARD_CODE } as const;
    return this.useCases.enroll.apply(enrolling);
  }
}
