import { Inject, Injectable } from '@nestjs/common';
import { GearRepository } from '../catalog/interfaces';
import { Animation } from './animations/animation.model';
import { GearRequestOrchestratorBuilder } from './gear-requests-orchestrator/gearRequestOrchestrator.builder';
import {
  GearRequest,
  GearRequestIdentifier,
  GearSeekerType,
  CreateGearRequestForm,
  UpdateGearRequestForm,
  SearchGearRequest,
  ApprovedGearRequest,
  Period,
  PeriodForm,
  MultiOperandGearRequest,
} from './gearRequests.model';
import { Task } from './tasks/task.model';

export interface GearRequestRepository {
  addGearRequest(gearRequest: GearRequest): Promise<GearRequest>;
  getGearRequest(gearRequestId: GearRequestIdentifier): Promise<GearRequest>;
  getGearRequests(gearRequestSearch: SearchGearRequest): Promise<GearRequest[]>;
  updateGearRequest(
    gearRequestId: GearRequestIdentifier,
    updateGearRequestForm: UpdateGearRequestForm,
  ): Promise<GearRequest>;
  removeGearRequest(gearRequestId: GearRequestIdentifier): Promise<void>;
  removeGearRequests(gearRequestIds: GearRequestIdentifier[]): Promise<void>;
  approveGearRequest(
    gearRequestId: GearRequestIdentifier,
    drive: string,
  ): Promise<ApprovedGearRequest>;
  changeLinkedPeriod(
    gearRequestId: GearRequestIdentifier,
    rentalPeriod: Period,
  ): Promise<GearRequest>;
  transactionalMultiOperation(
    multiOperand: MultiOperandGearRequest,
  ): Promise<GearRequest[]>;
}

export interface AnimationRepository {
  getAnimation(animationId: number): Promise<Animation>;
}

export interface TaskRepository {
  getTask(taskId: number): Promise<Task>;
}

export interface PeriodRepository {
  addPeriod(period: PeriodForm): Promise<Period>;
  getPeriod(id: number): Promise<Period>;
}

@Injectable()
export class GearRequestsService {
  constructor(
    @Inject('GEAR_REQUEST_REPOSITORY')
    private readonly gearRequestRepository: GearRequestRepository,
    @Inject('GEAR_REPOSITORY')
    private readonly gearRepository: GearRepository,
    @Inject('ANIMATION_REPOSITORY')
    private readonly animationRepository: AnimationRepository,
    @Inject('PERIOD_REPOSITORY')
    private readonly periodRepository: PeriodRepository,
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: TaskRepository,
  ) {}

  private gearOrchestratorRepositories = {
    animation: this.animationRepository,
    task: this.taskRepository,
    gear: this.gearRepository,
    gearRequest: this.gearRequestRepository,
    period: this.periodRepository,
  };

  async findGearRequest(gearRequestId: GearRequestIdentifier) {
    return this.gearRequestRepository.getGearRequest(gearRequestId);
  }

  async addAnimationRequest(
    createForm: CreateGearRequestForm,
  ): Promise<GearRequest> {
    const gear = await this.gearRepository.getGear(createForm.gearId);
    const gearRequestOrchestrator = GearRequestOrchestratorBuilder.build(
      GearSeekerType.Animation,
      gear.isConsumable,
      this.gearOrchestratorRepositories,
    );
    return gearRequestOrchestrator.add(createForm);
  }

  async addTaskRequest(
    createForm: CreateGearRequestForm,
  ): Promise<GearRequest> {
    const gear = await this.gearRepository.getGear(createForm.gearId);
    const gearRequestOrchestrator = GearRequestOrchestratorBuilder.build(
      GearSeekerType.Task,
      gear.isConsumable,
      this.gearOrchestratorRepositories,
    );
    return gearRequestOrchestrator.add(createForm);
  }

  async getAnimationRequests(animationId: number): Promise<GearRequest[]> {
    return this.gearRequestRepository.getGearRequests({
      seeker: { type: GearSeekerType.Animation, id: animationId },
    });
  }

  async getTaskRequests(taskId: number): Promise<GearRequest[]> {
    return this.gearRequestRepository.getGearRequests({
      seeker: { type: GearSeekerType.Task, id: taskId },
    });
  }

  async updateAnimationRequest(
    animationId: number,
    gearId: number,
    periodId: number,
    updateForm: UpdateGearRequestForm,
  ): Promise<GearRequest> {
    const gear = await this.gearRepository.getGear(gearId);
    const gearRequestOrchestrator = GearRequestOrchestratorBuilder.build(
      GearSeekerType.Animation,
      gear.isConsumable,
      this.gearOrchestratorRepositories,
    );
    return gearRequestOrchestrator.update(
      animationId,
      gearId,
      periodId,
      updateForm,
    );
  }

  async updateTaskRequest(
    taskId: number,
    gearId: number,
    periodId: number,
    updateForm: UpdateGearRequestForm,
  ): Promise<GearRequest> {
    const gear = await this.gearRepository.getGear(gearId);
    const gearRequestOrchestrator = GearRequestOrchestratorBuilder.build(
      GearSeekerType.Task,
      gear.isConsumable,
      this.gearOrchestratorRepositories,
    );
    return gearRequestOrchestrator.update(taskId, gearId, periodId, updateForm);
  }

  removeAnimationRequest(
    animationId: number,
    gearId: number,
    periodId: number,
  ): Promise<void> {
    return this.gearRequestRepository.removeGearRequest({
      seeker: { type: GearSeekerType.Animation, id: animationId },
      gearId,
      rentalPeriodId: periodId,
    });
  }

  removeTaskRequest(
    taskId: number,
    gearId: number,
    periodId: number,
  ): Promise<void> {
    return this.gearRequestRepository.removeGearRequest({
      seeker: { type: GearSeekerType.Task, id: taskId },
      gearId,
      rentalPeriodId: periodId,
    });
  }

  async removeTaskRequests(
    taskId: number,
    periodRemoval: PeriodForm,
  ): Promise<GearRequest[]> {
    const standardGearRequestOrchestrator =
      GearRequestOrchestratorBuilder.build(
        GearSeekerType.Task,
        false,
        this.gearOrchestratorRepositories,
      );
    const consumableGearRequestOrchestrator =
      GearRequestOrchestratorBuilder.build(
        GearSeekerType.Task,
        true,
        this.gearOrchestratorRepositories,
      );
    const gearRequestsOrchestrators = [
      standardGearRequestOrchestrator,
      consumableGearRequestOrchestrator,
    ];
    return (
      await Promise.all(
        gearRequestsOrchestrators.map((orchestrator) =>
          orchestrator.removeOnPeriod(taskId, periodRemoval),
        ),
      )
    ).flat();
  }

  approveGearRequest(
    gearRequestIdentifier: GearRequestIdentifier,
    drive: string,
  ): Promise<ApprovedGearRequest> {
    return this.gearRequestRepository.approveGearRequest(
      gearRequestIdentifier,
      drive,
    );
  }

  getAllRequests(): Promise<GearRequest[]> {
    return this.gearRequestRepository.getGearRequests({});
  }
}
