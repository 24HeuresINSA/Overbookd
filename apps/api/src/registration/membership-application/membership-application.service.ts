import { BadRequestException, Injectable } from "@nestjs/common";
import { ApplyFor, InviteStaff } from "@overbookd/registration";
import { jwtConstants } from "../../authentication/jwt-constants";

@Injectable()
export class MembershipApplicationService {
  constructor(private readonly applyFor: ApplyFor) {}

  async applyAsStaff(email: string, token: string): Promise<void> {
    const isTokenValid = InviteStaff.isInvitationValid({
      token,
      secret: jwtConstants.secret,
    });
    if (!isTokenValid) {
      throw new BadRequestException("Le lien de candidature a expiré");
    }

    await this.applyFor.staff({ email });
  }
}
