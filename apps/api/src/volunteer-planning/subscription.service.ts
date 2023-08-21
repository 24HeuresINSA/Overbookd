import { Injectable } from "@nestjs/common";
import { SecretService } from "./secret.service";

export type PlanningSubscription = {
  link: string;
};

@Injectable()
export class SubscriptionService {
  constructor(private readonly secretService: SecretService) {}

  async subscribe(volunteerId: number): Promise<PlanningSubscription> {
    const secret = await this.secretService.generateSecret(volunteerId);
    const link = `https://${process.env.DOMAIN}/api/plannings/${secret}`;
    return { link };
  }
}
