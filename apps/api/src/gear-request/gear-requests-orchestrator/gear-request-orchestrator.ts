import { GearRepository } from '../../catalog/interfaces';
import {
  buildGearRequestIdentifier,
  CreateGearRequest,
  GearRequest,
  isExistingPeriodForm,
  isPeriodWithDuration,
  NewPeriodCreateGearRequestForm,
  PENDING,
  Period,
  PeriodForm,
  UpdateGearRequest,
} from '../gear-request.model';
import {
  GearRequestRepository,
  PeriodRepository,
} from '../gear-request.service';
import { GearSeekerRegistery } from './gear-seeker-registery';

export abstract class GearRequestOrchestrator {
  constructor(
    protected readonly gearSeekerRegistery: GearSeekerRegistery,
    protected readonly gearRepository: GearRepository,
    protected readonly gearRequestRepository: GearRequestRepository,
    protected readonly periodRepository: PeriodRepository,
  ) {}

  abstract add(form: CreateGearRequest): Promise<GearRequest>;

  abstract removeOnPeriod(
    taskId: number,
    periodRemoval: PeriodForm,
  ): Promise<GearRequest[]>;

  update(
    seekerId: number,
    gearId: number,
    periodId: number,
    form: UpdateGearRequest,
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

  protected retrieveRentalPeriod(form: CreateGearRequest) {
    if (isExistingPeriodForm(form))
      return this.periodRepository.getPeriod(form.periodId);

    const { start, end } = form;
    return this.periodRepository.addPeriod({ start, end });
  }

  protected async buildPeriodSearch(
    form: CreateGearRequest,
  ): Promise<PeriodForm> {
    if (!isExistingPeriodForm(form)) {
      const { start, end } = form;
      return { start, end };
    }

    const { start, end } = await this.periodRepository.getPeriod(form.periodId);
    return { start, end };
  }

  protected findImpactedByRemovalGearRequests(
    taskId: number,
    periodRemoval: PeriodForm,
    isConsumableGear: boolean,
  ): Promise<GearRequest[]> {
    const seeker = this.gearSeekerRegistery.buildSeekerIdentifier(taskId);
    return this.gearRequestRepository.getGearRequests({
      seeker,
      period: periodRemoval,
      gear: { isConsumable: isConsumableGear },
    });
  }
}

export class StandardGearRequest extends GearRequestOrchestrator {
  async add(form: CreateGearRequest): Promise<GearRequest> {
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

  async removeOnPeriod(
    taskId: number,
    periodRemoval: PeriodForm,
  ): Promise<GearRequest[]> {
    const impactedGearRequests = await this.findImpactedByRemovalGearRequests(
      taskId,
      periodRemoval,
      false,
    );
    const updatedGearRequests = impactedGearRequests
      .flatMap(splitGearRequest(periodRemoval))
      .filter((gr) => isPeriodWithDuration(gr.rentalPeriod));

    const toDeleteGearRequests = impactedGearRequests;
    const toInsertGearRequests: GearRequest[] = await this.buildGearRequests(
      updatedGearRequests,
    );

    const gearRequests =
      await this.gearRequestRepository.transactionalMultiOperation({
        toDelete: toDeleteGearRequests,
        toInsert: toInsertGearRequests,
        toUpdate: [],
      });
    return gearRequests;
  }

  private async buildGearRequests(
    updatedGearRequests: GearRequestWithRentalPeriodForm[],
  ): Promise<GearRequest[]> {
    return Promise.all(
      updatedGearRequests.map(async (gr) => {
        const rentalPeriod = await this.retrieveRentalPeriod({
          ...gr.rentalPeriod,
          gearId: gr.gear.id,
          seekerId: gr.seeker.id,
          quantity: gr.quantity,
        });
        return {
          ...gr,
          rentalPeriod,
        };
      }),
    );
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
    const gearRequestId = buildGearRequestIdentifier(toUpdateGearRequest);
    const [updatedGearRequest] = await Promise.all([
      this.gearRequestRepository.updateGearRequest(
        gearRequestId,
        updateGearRequestForm,
      ),
      ...toDeleteGearRequests.map((gr) =>
        this.gearRequestRepository.removeGearRequest(
          buildGearRequestIdentifier(gr),
        ),
      ),
    ]);
    return updatedGearRequest;
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
  async add(form: CreateGearRequest): Promise<GearRequest> {
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

  async removeOnPeriod(
    taskId: number,
    periodRemoval: PeriodForm,
  ): Promise<GearRequest[]> {
    const impactedGearRequests = await this.findImpactedByRemovalGearRequests(
      taskId,
      periodRemoval,
      true,
    );

    const toUpdateGearRequests = this.buildGearRequests(
      impactedGearRequests,
      periodRemoval,
    );

    const toDeleteGearRequests = impactedGearRequests.filter(
      isPeriodIncludeGearRequestRentalPeriod(periodRemoval),
    );

    const updatedGearRequests =
      await this.gearRequestRepository.transactionalMultiOperation({
        toDelete: toDeleteGearRequests,
        toInsert: [],
        toUpdate: toUpdateGearRequests,
      });

    return updatedGearRequests;
  }

  private buildGearRequests(
    impactedGearRequests: GearRequest[],
    periodRemoval: PeriodForm,
  ) {
    return impactedGearRequests
      .reduce(
        (gearRequests, currentGearRequest) =>
          this.shortenConsumableGearRequestRentalPeriodByRemovalPeriod(
            periodRemoval,
          )(gearRequests, currentGearRequest),
        [] as GearRequest[],
      )
      .filter((gr) => isPeriodWithDuration(gr.rentalPeriod));
  }

  private shortenConsumableGearRequestRentalPeriodByRemovalPeriod(
    removalPeriod: PeriodForm,
  ): (gearRequests: GearRequest[], gearRequest: GearRequest) => GearRequest[] {
    return (gearRequests, currentGearRequest) => {
      const isRemovalPeriodNotEffective = isPeriodStrictlyIncludeAnother(
        currentGearRequest.rentalPeriod,
      )(removalPeriod);
      if (isRemovalPeriodNotEffective) return gearRequests;

      const rentalPeriod = this.buildUpdatedPeriod(
        currentGearRequest,
        removalPeriod,
      );
      return [
        ...gearRequests,
        {
          ...currentGearRequest,
          rentalPeriod,
        },
      ];
    };
  }

  private buildUpdatedPeriod(
    currentGearRequest: GearRequest,
    periodRemoval: PeriodForm,
  ): Period {
    if (
      periodRemoval.start.getTime() <=
      currentGearRequest.rentalPeriod.start.getTime()
    ) {
      return {
        start: periodRemoval.end,
        end: currentGearRequest.rentalPeriod.end,
        id: currentGearRequest.rentalPeriod.id,
      };
    }
    return {
      start: currentGearRequest.rentalPeriod.start,
      end: periodRemoval.start,
      id: currentGearRequest.rentalPeriod.id,
    };
  }

  private async updateGearRequestPeriod(
    createForm: CreateGearRequest,
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

type GearRequestWithRentalPeriodForm = Omit<GearRequest, 'rentalPeriod'> & {
  rentalPeriod: PeriodForm;
};

function splitGearRequest(
  periodRemoval: PeriodForm,
): (value: GearRequest) => GearRequestWithRentalPeriodForm[] {
  return (gr: GearRequest) => {
    const firstPeriod = {
      start: new Date(gr.rentalPeriod.start),
      end: new Date(periodRemoval.start),
    };
    const secondPeriod = {
      start: new Date(periodRemoval.end),
      end: new Date(gr.rentalPeriod.end),
    };
    return [
      { ...gr, rentalPeriod: firstPeriod },
      { ...gr, rentalPeriod: secondPeriod },
    ];
  };
}

function isPeriodIncludeGearRequestRentalPeriod(
  period: PeriodForm,
): (value: GearRequest) => boolean {
  return (gearRequest: GearRequest) =>
    period.start.getTime() <= gearRequest.rentalPeriod.start.getTime() &&
    period.end.getTime() >= gearRequest.rentalPeriod.end.getTime();
}

function isPeriodStrictlyIncludeAnother(
  period: Period | PeriodForm,
): (value: Period | PeriodForm) => boolean {
  return (otherPeriod: Period | PeriodForm) =>
    period.start.getTime() < otherPeriod.start.getTime() &&
    period.end.getTime() > otherPeriod.end.getTime();
}
