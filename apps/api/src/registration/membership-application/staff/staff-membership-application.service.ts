import { BadRequestException, Injectable } from "@nestjs/common";
import {
  ApplyFor,
  type CandidateToEnroll,
  EnrollCandidates,
  InviteStaff,
  RejectMembershipApplication,
  STAFF,
} from "@overbookd/registration";
import { Users } from "../common/repository/users";
import { EnrollCandidatesRepository } from "../common/repository/enroll-candidates";
import { HasApplication, StaffCandidate } from "@overbookd/http";
import { HARD } from "@overbookd/team-constants";
import { createStaffInvitationToken } from "./jwt.utils";
import { ConfigurationService } from "../../../configuration/configuration.service";
import { INVITE_STAFF_LINK_KEY } from "@overbookd/configuration";
import { JwtUtil } from "../../../authentication/entities/jwt-util.entity";

type UseCases = {
  applyFor: Readonly<ApplyFor>;
  reject: Readonly<RejectMembershipApplication>;
  enroll: Readonly<EnrollCandidates>;
};

type Repositories = {
  users: Readonly<Users>;
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

  async applyFor(email: string, token: string): Promise<void> {
    const isTokenValid = InviteStaff.isTokenExpired(token);
    if (!isTokenValid) {
      throw new BadRequestException("Le lien de candidature a expiré");
    }

    return this.useCases.applyFor.staff({ email });
  }

  async getCurrentApplication(email: string): Promise<HasApplication> {
    const hasApplication =
      await this.repositories.enroll.hasStaffApplication(email);
    return { hasApplication };
  }

  async rejectStaffApplication(candidateId: number): Promise<void> {
    const email = await this.repositories.users.findEmailById(candidateId);
    return this.useCases.reject.applyOne({ email }, STAFF);
  }

  async cancelStaffApplicationRejection(candidateId: number): Promise<void> {
    const email = await this.repositories.users.findEmailById(candidateId);
    return this.useCases.reject.unapplyOne({ email }, STAFF);
  }

  async getStaffInvitationLink(user: JwtUtil): Promise<URL | undefined> {
    const link = await this.services.configuration.findOne(
      INVITE_STAFF_LINK_KEY,
      user,
    );
    return link?.value ? new URL(link.value.toString()) : undefined;
  }

  async generateStaffInvitationLink(user: JwtUtil): Promise<URL> {
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
