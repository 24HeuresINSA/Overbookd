import { ThrottlerGuard, ThrottlerException } from "@nestjs/throttler";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ThrottlerGuardCustom extends ThrottlerGuard {
  protected throwThrottlingException(): void {
    throw new ThrottlerException(
      `Tu as essayé trop de fois, réessaye dans ${this.options.ttl} secondes`,
    );
  }
}
