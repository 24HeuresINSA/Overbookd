import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

type VolunteerPayload = {
  volunteerId: number;
};

@Injectable()
export class SecretService {
  constructor(private readonly jwtService: JwtService) {}

  generateSecret(volunteerId: number): Promise<string> {
    const payload = { volunteerId };
    return this.jwtService.signAsync(payload);
  }

  checkSecret(secret: string): Promise<VolunteerPayload> {
    return this.jwtService.verifyAsync<VolunteerPayload>(secret);
  }
}
