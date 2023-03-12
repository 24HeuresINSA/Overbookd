import { GearRepository } from 'src/catalog/interfaces';
import {
  CreateGearRequestForm,
  GearRequest,
  isExistingPeriodForm,
  PENDING,
  PeriodForm,
  UpdateGearRequestForm,
} from '../gearRequests.model';
import {
  GearRequestRepository,
  PeriodRepository,
} from '../gearRequests.service';
import { GearSeekerRegistery } from './gearSeekerRegistery';

export abstract class GearRequestOrchestrator {
  constructor(
    protected readonly gearSeekerRegistery: GearSeekerRegistery,
    protected readonly gearRepository: GearRepository,
    protected readonly gearRequestRepository: GearRequestRepository,
    protected readonly periodRepository: PeriodRepository,
  ) {}

  abstract add(form: CreateGearRequestForm): Promise<GearRequest>;
  update(
    seekerId: number,
    gearId: number,
    periodId: number,
    form: UpdateGearRequestForm,
  ): Promise<GearRequest> {
    const seeker = this.gearSeekerRegistery.buildSeekerIdentifier(seekerId);
    return this.gearRequestRepository.updateGearRequest(
      {
        seeker,
        gearId,
        rentalPeriodId: periodId,
      },
      form,
    );
  }

  protected retrieveRentalPeriod(form: CreateGearRequestForm) {
    if (isExistingPeriodForm(form))
      return this.periodRepository.getPeriod(form.periodId);

    const { start, end } = form;
    return this.periodRepository.addPeriod({ start, end });
  }
}

export class StandardGearRequest extends GearRequestOrchestrator {
  async add(form: CreateGearRequestForm): Promise<GearRequest> {
    const { seekerId, quantity, gearId } = form;

    const [seeker, existingGear] = await Promise.all([
      this.gearSeekerRegistery.getSeeker(seekerId),
      this.gearRepository.getGear(gearId),
      this.gearSeekerRegistery.checkSeekerInteractionPossibility(seekerId),
    ]);

    const gearRequest = {
      seeker,
      status: PENDING,
      quantity,
      gear: existingGear,
      rentalPeriod: await this.retrieveRentalPeriod(form),
    };
    return this.gearRequestRepository.addGearRequest(gearRequest);
  }
}

export class ConsumableGearRequest extends GearRequestOrchestrator {
  async add(form: CreateGearRequestForm): Promise<GearRequest> {
    const { seekerId, quantity, gearId } = form;

    const gearRequestSearch = {
      seeker: this.gearSeekerRegistery.buildSeekerIdentifier(seekerId),
      gear: { id: gearId, isConsumable: true },
    };

    const [seeker, gear, [similarGearRequest]] = await Promise.all([
      this.gearSeekerRegistery.getSeeker(seekerId),
      this.gearRepository.getGear(gearId),
      this.gearRequestRepository.getGearRequests(gearRequestSearch),
      this.gearSeekerRegistery.checkSeekerInteractionPossibility(seekerId),
    ]);

    if (similarGearRequest) {
      return this.updateGearRequestPeriod(form, similarGearRequest);
    }

    const gearRequest = {
      seeker,
      status: PENDING,
      quantity,
      gear,
      rentalPeriod: await this.retrieveRentalPeriod(form),
    };
    return this.gearRequestRepository.addGearRequest(gearRequest);
  }

  private async updateGearRequestPeriod(
    createForm: CreateGearRequestForm,
    similarGearRequest: GearRequest,
  ) {
    const { seekerId, gearId } = createForm;
    const newRentalPeriod = await this.retrieveRentalPeriod(createForm);
    const mergedPeriod = mergePeriods([
      newRentalPeriod,
      similarGearRequest.rentalPeriod,
    ]);
    const savedPeriod = await this.periodRepository.addPeriod(mergedPeriod);
    const gearRequestIdentifier = {
      seeker: this.gearSeekerRegistery.buildSeekerIdentifier(seekerId),
      gearId,
      rentalPeriodId: similarGearRequest.rentalPeriod.id,
    };
    return this.gearRequestRepository.changeLinkedPeriod(
      gearRequestIdentifier,
      savedPeriod,
    );
  }
}

function mergePeriods(periods: PeriodForm[]): PeriodForm {
  const start = new Date(
    Math.min(...periods.map(({ start }) => start.getTime())),
  );
  const end = new Date(Math.max(...periods.map(({ end }) => end.getTime())));
  return { start, end };
}
