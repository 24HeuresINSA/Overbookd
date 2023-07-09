import { BadRequestException } from '@nestjs/common';

export class AnimationAlreadyValidatedError extends BadRequestException {
  constructor(animationId: number) {
    const message = `Animation #${animationId} already validated, you can't add gear request`;
    super(message);
  }
}
