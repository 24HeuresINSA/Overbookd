import { faStatuses } from '../../fa/fa.model';
import { AnimationAlreadyValidatedError } from '../animations/animation.error';
import {
  GearRequestIdentifierSeeker,
  GearSeeker,
  GearSeekerType,
} from '../gear-request.model';
import { AnimationRepository, TaskRepository } from '../gear-request.service';
import { TaskAlreadyValidatedError } from '../tasks/task.error';
import { taskStatuses } from '../tasks/task.model';

export interface GearSeekerRegistery {
  getSeeker(id: number): Promise<GearSeeker | undefined>;
  checkSeekerInteractionPossibility(id: number): Promise<void>;
  buildSeekerIdentifier(id: number): GearRequestIdentifierSeeker;
}

export class AnimationGearSeekerRegistery implements GearSeekerRegistery {
  constructor(private readonly animationRepository: AnimationRepository) {}

  async getSeeker(id: number): Promise<GearSeeker> {
    const animation = await this.animationRepository.getAnimation(id);
    return {
      type: GearSeekerType.Animation,
      id,
      name: animation.name,
    };
  }

  async checkSeekerInteractionPossibility(id: number): Promise<void> {
    const animation = await this.animationRepository.getAnimation(id);
    if (animation.status === faStatuses.VALIDATED)
      throw new AnimationAlreadyValidatedError(id);
  }

  buildSeekerIdentifier(id: number): GearRequestIdentifierSeeker {
    return {
      type: GearSeekerType.Animation,
      id,
    };
  }
}

export class TaskGearSeekerRegistery implements GearSeekerRegistery {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getSeeker(id: number): Promise<GearSeeker> {
    const task = await this.taskRepository.getTask(id);
    return {
      type: GearSeekerType.Task,
      id,
      name: task.name,
    };
  }

  async checkSeekerInteractionPossibility(id: number): Promise<void> {
    const task = await this.taskRepository.getTask(id);
    if ([taskStatuses.VALIDATED, taskStatuses.READY].includes(task.status))
      throw new TaskAlreadyValidatedError(id, task.status);
  }

  buildSeekerIdentifier(id: number): GearRequestIdentifierSeeker {
    return {
      type: GearSeekerType.Task,
      id,
    };
  }
}
