import { ThrottlerGuard, ThrottlerException } from "@nestjs/throttler";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerLimitDetail } from "@nestjs/throttler/dist/throttler.guard.interface";
import { Duration } from "@overbookd/period";

@Injectable()
export class ThrottlerGuardCustom extends ThrottlerGuard {
  protected throwThrottlingException(
    context: ExecutionContext,
    { ttl }: ThrottlerLimitDetail,
  ): Promise<void> {
    const ttlInSeconds = Duration.ms(ttl).inSeconds;
    throw new ThrottlerException(
      `Tu as essayé trop de fois, réessaye dans ${ttlInSeconds} secondes`,
    );
  }
}
