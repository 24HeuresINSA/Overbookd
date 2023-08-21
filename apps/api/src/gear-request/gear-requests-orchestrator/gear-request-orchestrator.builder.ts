import { GearRepository } from "../../catalog/interfaces";
import { GearSeekerType } from "../gear-request.model";
import {
  AnimationRepository,
  GearRequestRepository,
  PeriodRepository,
  TaskRepository,
} from "../gear-request.service";
import {
  AnimationGearSeekerRegistery,
  TaskGearSeekerRegistery,
} from "./gear-seeker-registery";
import {
  GearRequestOrchestrator,
  ConsumableGearRequest,
  StandardGearRequest,
} from "./gear-request-orchestrator";

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
