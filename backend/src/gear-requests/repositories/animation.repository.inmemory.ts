import { AnimationRepository } from '../gearRequests.service';
import { Animation } from '../animations/animation.model';

export class InMemoryAnimationRepository implements AnimationRepository {
  animations: Animation[] = [];

  constructor(animations: Animation[]) {
    this.animations = animations;
  }

  getAnimation(animationId: number): Promise<Animation> {
    return Promise.resolve(
      this.animations.find((animation) => animation.id === animationId),
    );
  }
}
