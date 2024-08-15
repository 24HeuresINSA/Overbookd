import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Edition } from "@overbookd/time";

type PlanningIdentifier = {
  volunteerId: number;
  edition: number;
};

@Injectable()
export class SecretService {
  constructor(private readonly jwtService: JwtService) {}

  generateSecret(volunteerId: number): Promise<string> {
    const payload = { volunteerId, edition: Edition.current };
    return this.jwtService.signAsync(payload);
  }

  checkSecret(secret: string): Promise<PlanningIdentifier> {
    return this.jwtService.verifyAsync<PlanningIdentifier>(secret);
  }
}
