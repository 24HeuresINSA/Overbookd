import { BadRequestException, Injectable } from "@nestjs/common";
import {
  ApplyFor,
  InviteStaff,
  RejectMembershipApplication,
} from "@overbookd/registration";
import { jwtConstants } from "../../authentication/jwt-constants";

export type Users = {
  findEmailById: (id: number) => Promise<string>;
};

@Injectable()
export class MembershipApplicationService {
  constructor(
    private readonly applyFor: ApplyFor,
    private readonly reject: RejectMembershipApplication,
    private readonly users: Users,
  ) {}

  async applyAsStaff(email: string, token: string): Promise<void> {
    const isTokenValid = InviteStaff.isInvitationValid({
      token,
      secret: jwtConstants.secret,
    });
    if (!isTokenValid) {
      throw new BadRequestException("Le lien de candidature a expiré");
    }

    return this.applyFor.staff({ email });
  }

  async rejectStaffApplication(candidateId: number): Promise<void> {
    const email = await this.users.findEmailById(candidateId);
    return this.reject.applyOne({ email });
  }
}
