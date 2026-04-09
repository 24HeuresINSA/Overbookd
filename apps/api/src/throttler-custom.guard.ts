import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard } from "@nestjs/throttler";
import { ThrottlerLimitDetail } from "@nestjs/throttler/dist/throttler.guard.interface";
import { Duration } from "@overbookd/time";

@Injectable()
export class ThrottlerGuardCustom extends ThrottlerGuard {
  protected throwThrottlingException(
    _context: ExecutionContext,
    { ttl }: ThrottlerLimitDetail,
  ): Promise<void> {
    const ttlInSeconds = Duration.ms(ttl).inSeconds;
    throw new ThrottlerException(
      `Tu as essayé trop de fois, réessaye dans ${ttlInSeconds} secondes`,
    );
  }
}
