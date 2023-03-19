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

export type CreateGearRequestForm =
  | NewPeriodCreateGearRequestForm
  | ExistingPeriodGearRequestForm;

export function isExistingPeriodForm(
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
  gear?: Pick<Gear, 'id' | 'isConsumable'>;
  period?: PeriodForm;
};
