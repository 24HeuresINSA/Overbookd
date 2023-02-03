import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Gear, GearRepository } from '../catalog/interfaces';
import { Status } from '../fa/dto/update-fa.dto';

export const PENDING = 'PENDING';
export const APPROVED = 'APPROVED';

type GearRequestStatus = typeof PENDING | typeof APPROVED;

export class GearRequestAlreadyExists extends BadRequestException {
  gearRequest: GearRequest;
  constructor(gearRequest: GearRequest) {
    super(
      `"Request for ${gearRequest.gear.name}" in ${gearRequest.seeker.type} #${gearRequest.seeker.id} already exists for #${gearRequest.rentalPeriod.id} rental period`,
    );
    this.gearRequest = gearRequest;
  }
}

export class GearRequestNotFound extends NotFoundException {
  constructor(gearRequestId: GearRequestIdentifier) {
    super(
      `Request for gear #${gearRequestId.gearId} from ${gearRequestId.seeker.type} #${gearRequestId.seeker.id} not found`,
    );
  }
}

export class PeriodNotFound extends NotFoundException {
  constructor(periodId: number) {
    super(`Period #${periodId} not found`);
  }
}

export interface GearRequest {
  seeker: GearSeeker;
  status: string;
  quantity: number;
  gear: Gear;
  rentalPeriod: Period;
  drive?: string;
}

export interface ApprovedGearRequest extends GearRequest {
  status: typeof APPROVED;
  drive: string;
}

export type Period = {
  id: number;
  start: Date;
  end: Date;
};

export type PeriodForm = Omit<Period, 'id'>;

export type GearSeeker = {
  type: GearSeekerType;
  id: number;
  name: string;
};

export enum GearSeekerType {
  Animation = 'FA',
  Task = 'FT',
}

type BaseCreateGearRequestForm = {
  seekerId: number;
  quantity: number;
  gearId: number;
};

export type NewPeriodCreateGearRequestForm = BaseCreateGearRequestForm & {
  start: Date;
  end: Date;
};

export type ExistingPeriodGearRequestForm = BaseCreateGearRequestForm & {
  periodId: number;
};

export type CreateGearRequestForm =
  | NewPeriodCreateGearRequestForm
  | ExistingPeriodGearRequestForm;

function isExistingPeriodForm(
  value: CreateGearRequestForm,
): value is ExistingPeriodGearRequestForm {
  return Boolean((value as ExistingPeriodGearRequestForm).periodId);
}

export type UpdateGearRequestForm = Partial<
  Pick<NewPeriodCreateGearRequestForm, 'start' | 'end' | 'quantity'>
>;

export interface ApproveGearRequestForm {
  drive: string;
}

type GearRequestIdentifierSeeker = {
  type: GearSeekerType;
  id: number;
};

export type GearRequestIdentifier = {
  seeker: GearRequestIdentifierSeeker;
  gearId: number;
  rentalPeriodId: number;
};

export type SearchGearRequest = {
  seeker?: Omit<GearSeeker, 'name'>;
};

export interface GearRequestRepository {
  addGearRequest(gearRequest: GearRequest): Promise<GearRequest>;
  getGearRequest(gearRequestId: GearRequestIdentifier): Promise<GearRequest>;
  getGearRequests(gearRequestSearch: SearchGearRequest): Promise<GearRequest[]>;
  updateGearRequest(
    gearRequestId: GearRequestIdentifier,
    updateGearRequestForm: UpdateGearRequestForm,
  ): Promise<GearRequest>;
  removeGearRequest(gearRequestId: GearRequestIdentifier): Promise<void>;
  approveGearRequest(
    gearRequestId: GearRequestIdentifier,
    drive: string,
  ): Promise<ApprovedGearRequest>;
}

export interface Animation {
  id: number;
  name: string;
  status: Status;
}

export interface AnimationRepository {
  getAnimation(animationId: number): Promise<Animation>;
}

export interface Task {
  id: number;
  name: string;
  status: TaskStatus;
}

export const taskStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  VALIDATED: 'VALIDATED',
  REFUSED: 'REFUSED',
  READY: 'READY',
};

type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface TaskRepository {
  getTask(taskId: number): Promise<Task>;
}

export interface PeriodRepository {
  addPeriod(period: PeriodForm): Promise<Period>;
  getPeriod(id: number): Promise<Period>;
}

class AnimationAlreadyValidatedError extends BadRequestException {
  constructor(animationId: number) {
    const message = `Animation #${animationId} already validated, you can't add gear request`;
    super(message);
  }
}

class TaskAlreadyValidatedError extends BadRequestException {
  constructor(taskId: number, status: TaskStatus) {
    const message = `Task #${taskId} already ${status.toLowerCase()}, you can't add gear request`;
    super(message);
  }
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

  async findGearRequest(gearRequestId: GearRequestIdentifier) {
    return this.gearRequestRepository.getGearRequest(gearRequestId);
  }

  async addAnimationRequest(
    createForm: CreateGearRequestForm,
  ): Promise<GearRequest> {
    const { seekerId, quantity, gearId } = createForm;
    const [existingAnimation, existingGear] = await Promise.all([
      this.animationRepository.getAnimation(seekerId),
      this.gearRepository.getGear(gearId),
    ]);

    if (existingAnimation.status === Status.VALIDATED)
      throw new AnimationAlreadyValidatedError(seekerId);

    const gearRequest = {
      seeker: {
        type: GearSeekerType.Animation,
        id: seekerId,
        name: existingAnimation.name,
      },
      status: PENDING,
      quantity,
      gear: existingGear,
      rentalPeriod: await this.retrieveRentalPeriod(createForm),
    };
    return this.gearRequestRepository.addGearRequest(gearRequest);
  }

  async addTaskRequest(
    createForm: CreateGearRequestForm,
  ): Promise<GearRequest> {
    const { seekerId, quantity, gearId } = createForm;

    const [existingTask, existingGear] = await Promise.all([
      this.taskRepository.getTask(seekerId),
      this.gearRepository.getGear(gearId),
    ]);

    if (this.isAlreadyValidated(existingTask))
      throw new TaskAlreadyValidatedError(seekerId, existingTask.status);

    const gearRequest = {
      seeker: {
        type: GearSeekerType.Task,
        id: seekerId,
        name: existingTask.name,
      },
      status: PENDING,
      quantity,
      gear: existingGear,
      rentalPeriod: await this.retrieveRentalPeriod(createForm),
    };
    return this.gearRequestRepository.addGearRequest(gearRequest);
  }

  private isAlreadyValidated(existingTask: Task): boolean {
    return (
      existingTask.status === taskStatus.VALIDATED ||
      existingTask.status === taskStatus.READY
    );
  }

  private retrieveRentalPeriod(form: CreateGearRequestForm) {
    if (isExistingPeriodForm(form))
      return this.periodRepository.getPeriod(form.periodId);

    const { start, end } = form;
    return this.periodRepository.addPeriod({ start, end });
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

  updateAnimationRequest(
    animationId: number,
    gearId: number,
    periodId: number,
    updateForm: UpdateGearRequestForm,
  ): Promise<GearRequest> {
    const seeker = { type: GearSeekerType.Animation, id: animationId };
    return this.updateRequest(seeker, gearId, periodId, updateForm);
  }

  updateTaskRequest(
    taskId: number,
    gearId: number,
    periodId: number,
    updateForm: UpdateGearRequestForm,
  ): Promise<GearRequest> {
    const seeker = { type: GearSeekerType.Task, id: taskId };
    return this.updateRequest(seeker, gearId, periodId, updateForm);
  }

  private updateRequest(
    seeker: GearRequestIdentifierSeeker,
    gearId: number,
    periodId: number,
    updateForm: UpdateGearRequestForm,
  ): Promise<GearRequest> {
    return this.gearRequestRepository.updateGearRequest(
      {
        seeker,
        gearId,
        rentalPeriodId: periodId,
      },
      updateForm,
    );
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

  approveAnimationGearRequest(
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
