import { BadRequestException, Injectable } from "@nestjs/common";
import {
  ApplyFor,
  EnrollCandidates,
  InviteStaff,
  CandidateToEnroll,
  RejectMembershipApplication,
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
};

type Repositories = {
  users: Readonly<Users>;
  configurations: Readonly<Configurations>;
  enrollCandidates: Readonly<EnrollCandidatesRepository>;
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
    return this.useCases.reject.applyOne({ email });
  }

  async cancelStaffApplicationRejection(candidateId: number): Promise<void> {
    const email = await this.repositories.users.findEmailById(candidateId);
    return this.useCases.reject.unapplyOne({ email });
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
    return this.repositories.enrollCandidates.findStaffCandidates();
  }

  countCandidates(): Promise<number> {
    return this.repositories.enrollCandidates.countStaffCandidates();
  }

  getRejectedCandidates(): Promise<StaffCandidate[]> {
    return this.repositories.enrollCandidates.findRejectedStaffCandidates();
  }

  async enroll(candidates: CandidateToEnroll[]): Promise<void> {
    const newcomersToEnroll = EnrollCandidates.with(candidates).to(HARD_CODE);
    await this.repositories.enrollCandidates.enroll(newcomersToEnroll);
  }
}
