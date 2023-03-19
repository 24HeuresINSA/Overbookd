import { GearRepository } from 'src/catalog/interfaces';
import {
  CreateGearRequestForm,
  GearRequest,
  GearRequestIdentifier,
  isExistingPeriodForm,
  NewPeriodCreateGearRequestForm,
  PENDING,
  Period,
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

  protected async buildPeriodSearch(
    form: CreateGearRequestForm,
  ): Promise<PeriodForm> {
    if (!isExistingPeriodForm(form)) {
      const { start, end } = form;
      return { start, end };
    }

    const { start, end } = await this.periodRepository.getPeriod(form.periodId);
    return { start, end };
  }
}

export class StandardGearRequest extends GearRequestOrchestrator {
  async add(form: CreateGearRequestForm): Promise<GearRequest> {
    const { seekerId, quantity, gearId } = form;

    const { start, end } = await this.buildPeriodSearch(form);

    const [seeker, existingGear, overlappingGearRequests] = await Promise.all([
      this.gearSeekerRegistery.getSeeker(seekerId),
      this.gearRepository.getGear(gearId),
      this.findOverlappingGearRequests({ ...form, start, end }),
      this.gearSeekerRegistery.checkSeekerInteractionPossibility(seekerId),
    ]);

    if (overlappingGearRequests.length > 0) {
      return this.mergeGearRequests(overlappingGearRequests, {
        start,
        end,
      });
    }

    const gearRequest = {
      seeker,
      status: PENDING,
      quantity,
      gear: existingGear,
      rentalPeriod: await this.retrieveRentalPeriod(form),
    };
    return this.gearRequestRepository.addGearRequest(gearRequest);
  }

  private async mergeGearRequests(
    overlappingGearRequests: GearRequest[],
    period: PeriodForm,
  ): Promise<GearRequest> {
    const gearRequestModel = overlappingGearRequests.at(0);
    const periodId = gearRequestModel.rentalPeriod.id;
    const rentalPeriod = this.buildUpdatedRentalPeriod(
      overlappingGearRequests,
      period,
      periodId,
    );
    const toDeleteGearRequests = overlappingGearRequests.filter(
      ({ rentalPeriod }) => rentalPeriod.id !== periodId,
    );
    const toUpdateGearRequest = { ...gearRequestModel, rentalPeriod };
    return this.cleanGearRequests(toUpdateGearRequest, toDeleteGearRequests);
  }

  private async cleanGearRequests(
    toUpdateGearRequest: GearRequest,
    toDeleteGearRequests: GearRequest[],
  ): Promise<GearRequest> {
    const updateGearRequestForm = {
      start: toUpdateGearRequest.rentalPeriod.start,
      end: toUpdateGearRequest.rentalPeriod.end,
    };
    const gearRequestId = this.buildGearRequestIdentifier(toUpdateGearRequest);
    const [updatedGearRequest] = await Promise.all([
      this.gearRequestRepository.updateGearRequest(
        gearRequestId,
        updateGearRequestForm,
      ),
      ...toDeleteGearRequests.map((gr) =>
        this.gearRequestRepository.removeGearRequest(
          this.buildGearRequestIdentifier(gr),
        ),
      ),
    ]);
    return updatedGearRequest;
  }

  private buildGearRequestIdentifier({
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

  private buildUpdatedRentalPeriod(
    overlappingGearRequests: GearRequest[],
    period: PeriodForm,
    periodId: number,
  ): Period {
    const periods = [
      ...overlappingGearRequests.map(({ rentalPeriod }) => rentalPeriod),
      { ...period, id: -1 },
    ];
    const startTimes = periods.map(({ start }) => new Date(start).getTime());
    const endTimes = periods.map(({ end }) => new Date(end).getTime());
    const rentalPeriod = {
      id: periodId,
      start: new Date(Math.min(...startTimes)),
      end: new Date(Math.max(...endTimes)),
    };
    return rentalPeriod;
  }

  private async findOverlappingGearRequests(
    form: NewPeriodCreateGearRequestForm,
  ): Promise<GearRequest[]> {
    const periodSearch = { start: form.start, end: form.end };
    const seekerSearch = this.gearSeekerRegistery.buildSeekerIdentifier(
      form.seekerId,
    );
    const gearSearch = { id: form.gearId, isConsumable: false };
    return this.gearRequestRepository.getGearRequests({
      seeker: seekerSearch,
      period: periodSearch,
      gear: gearSearch,
    });
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
