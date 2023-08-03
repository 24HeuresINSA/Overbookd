import { getPeriodDuration } from '../utils/duration';
import { Gear } from '../catalog/interfaces';

export const PENDING = 'PENDING';
export const APPROVED = 'APPROVED';

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

export type NewPeriodCreateGearRequestForm = BaseCreateGearRequestForm &
  PeriodForm;

export type ExistingPeriodGearRequestForm = BaseCreateGearRequestForm & {
  periodId: number;
};

export type CreateGearRequest =
  | NewPeriodCreateGearRequestForm
  | ExistingPeriodGearRequestForm;

export function isExistingPeriodForm(
  value: CreateGearRequest,
): value is ExistingPeriodGearRequestForm {
  return Boolean((value as ExistingPeriodGearRequestForm).periodId);
}

export type UpdateGearRequest = Partial<
  Pick<NewPeriodCreateGearRequestForm, 'start' | 'end' | 'quantity'>
>;

export interface ApproveGearRequest {
  drive: string;
}

export type GearRequestIdentifierSeeker = {
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
  gear?: Partial<Pick<Gear, 'id' | 'isConsumable'>>;
  period?: PeriodForm;
};

type MultiOperand<T> = {
  toDelete: T[];
  toInsert: T[];
  toUpdate: T[];
};

export type MultiOperandGearRequest = MultiOperand<GearRequest>;

export function buildGearRequestIdentifier({
  gear,
  seeker,
  rentalPeriod,
}: GearRequest): GearRequestIdentifier {
  return {
    seeker: seeker,
    gearId: gear.id,
    rentalPeriodId: rentalPeriod.id,
  };
}

export function isSameGeaRequestIdentifier(
  gearRequestId: GearRequestIdentifier,
): (value: GearRequestIdentifier) => boolean {
  return (grId: GearRequestIdentifier) =>
    gearRequestId.gearId === grId.gearId &&
    gearRequestId.rentalPeriodId === grId.rentalPeriodId &&
    gearRequestId.seeker.id === grId.seeker.id &&
    gearRequestId.seeker.type === grId.seeker.type;
}

export function isPeriodWithDuration(period: PeriodForm): boolean {
  return getPeriodDuration(period) > 0;
}
