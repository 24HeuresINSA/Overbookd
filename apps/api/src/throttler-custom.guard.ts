import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerGuardCustom extends ThrottlerGuard {
  protected throwThrottlingException(context: ExecutionContext): void {
    throw new ThrottlerException(
      `Tu as essayé trop de fois, réessaye dans ${this.options.ttl} secondes`,
    );
  }
}
