import { GearRepository } from '../../../src/catalog/interfaces';
import { GearSeekerType } from '../gearRequests.model';
import {
  AnimationRepository,
  GearRequestRepository,
  PeriodRepository,
  TaskRepository,
} from '../gearRequests.service';
import {
  AnimationGearSeekerRegistery,
  TaskGearSeekerRegistery,
} from './gearSeekerRegistery';
import {
  GearRequestOrchestrator,
  ConsumableGearRequest,
  StandardGearRequest,
} from './gearRequestOrchestrator';

export class GearRequestOrchestratorBuilder {
  static build(
    seekerType: GearSeekerType,
    gearIsConsumable: boolean,
    repositories: {
      animation: AnimationRepository;
      task: TaskRepository;
      gear: GearRepository;
      gearRequest: GearRequestRepository;
      period: PeriodRepository;
    },
  ): GearRequestOrchestrator {
    const gearSeekerRegistery =
      GearRequestOrchestratorBuilder.buildGearSeekerRegistery(
        seekerType,
        repositories,
      );
    return gearIsConsumable
      ? new ConsumableGearRequest(
          gearSeekerRegistery,
          repositories.gear,
          repositories.gearRequest,
          repositories.period,
        )
      : new StandardGearRequest(
          gearSeekerRegistery,
          repositories.gear,
          repositories.gearRequest,
          repositories.period,
        );
  }

  private static buildGearSeekerRegistery(
    seekerType: GearSeekerType,
    repositories: {
      animation: AnimationRepository;
      task: TaskRepository;
      gear: GearRepository;
      gearRequest: GearRequestRepository;
    },
  ) {
    return seekerType === GearSeekerType.Animation
      ? new AnimationGearSeekerRegistery(repositories.animation)
      : new TaskGearSeekerRegistery(repositories.task);
  }
}
