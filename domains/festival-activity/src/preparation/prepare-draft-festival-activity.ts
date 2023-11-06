import { Prepare } from "./prepare-festival-activity";

import { Duration, IProvidePeriod, Period } from "@overbookd/period";
import { Adherent, Contractor, Draft, TimeWindow } from "../festival-activity";
import {
  ContractorAlreadyExists,
  ContractorNotFound,
  TimeWindowAlreadyExists,
} from "../festival-activity.error";
import {
  PrepareGeneralUpdate,
  PrepareSignaUpdate,
  PrepareSecurityUpdate,
  PrepareSupplyUpdate,
  PrepareInChargeUpdate,
  PrepareContractorCreation,
} from "./prepare-festival-activity.model";
import { updateItemToList } from "@overbookd/list";

type PrepareInChargeFormWithAdherent = Omit<
  PrepareInChargeUpdate,
  "adherentId"
> & {
  adherent?: Adherent;
};

export class PrepareDraftFestivalActivity implements Prepare<Draft> {
  private constructor(private readonly activity: Draft) {}

  static build(activity: Draft): PrepareDraftFestivalActivity {
    return new PrepareDraftFestivalActivity({
      ...activity,
    });
  }

  updateGeneral(form: PrepareGeneralUpdate): Draft {
    const privateFestivalActivity = {
      toPublish: false,
      photoLink: null,
      isFlagship: false,
    };
    const cleanedUpdate =
      form.toPublish === false ? { ...form, ...privateFestivalActivity } : form;

    const general = { ...this.activity.general, ...cleanedUpdate };
    return { ...this.activity, general };
  }

  addGeneralTimeWindow(period: IProvidePeriod): Draft {
    const timeWindows = TimeWindows.build(
      this.activity.general.timeWindows,
    ).add(period, this.activity.id).entries;

    const general = { ...this.activity.general, timeWindows };
    return { ...this.activity, general };
  }

  removeGeneralTimeWindow(id: TimeWindow["id"]): Draft {
    const timeWindows = TimeWindows.build(
      this.activity.general.timeWindows,
    ).remove(id).entries;

    const general = { ...this.activity.general, timeWindows };
    return { ...this.activity, general };
  }

  updateInCharge(form: PrepareInChargeFormWithAdherent): Draft {
    const inCharge = { ...this.activity.inCharge, ...form };
    return { ...this.activity, inCharge };
  }

  addContractor(contractor: PrepareContractorCreation): Draft {
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).add(contractor, this.activity.id).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  updateContractor(contractor: Contractor): Draft {
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).update(contractor).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  removeContractor(contractorId: Contractor["id"]): Draft {
    const contractors = Contractors.build(
      this.activity.inCharge.contractors,
    ).remove(contractorId).entries;

    const inCharge = { ...this.activity.inCharge, contractors };
    return { ...this.activity, inCharge };
  }

  updateSigna(form: PrepareSignaUpdate): Draft {
    const signa = { ...this.activity.signa, ...form };
    return { ...this.activity, signa };
  }

  updateSecurity(form: PrepareSecurityUpdate): Draft {
    const security = { ...this.activity.security, ...form };
    return { ...this.activity, security };
  }

  updateSupply(form: PrepareSupplyUpdate): Draft {
    const supply = { ...this.activity.supply, ...form };
    return { ...this.activity, supply };
  }
}

class TimeWindows {
  private constructor(private readonly timeWindows: TimeWindow[]) {}

  get entries(): TimeWindow[] {
    return this.timeWindows;
  }

  static build(timeWindows: TimeWindow[]): TimeWindows {
    return new TimeWindows(timeWindows);
  }

  add(period: IProvidePeriod, faId: number): TimeWindows {
    const { start, end } = Period.init(period);
    const id = this.generateTimeWindowId(faId, { start, end });
    const timeWindow = { id, start, end };

    const alreadyExists = this.timeWindows.some((tw) => tw.id === id);
    if (alreadyExists) throw new TimeWindowAlreadyExists();

    return new TimeWindows([...this.timeWindows, timeWindow]);
  }

  remove(id: TimeWindow["id"]): TimeWindows {
    return new TimeWindows(this.timeWindows.filter((tw) => tw.id !== id));
  }

  private generateTimeWindowId(faId: number, period: IProvidePeriod): string {
    const { start, end } = period;
    const startMinutes = Duration.ms(start.getTime()).inMinutes;
    const endMinutes = Duration.ms(end.getTime()).inMinutes;

    return `${faId}-${startMinutes}-${endMinutes}`;
  }
}

class Contractors {
  private constructor(private readonly contractors: Contractor[]) {}

  get entries(): Contractor[] {
    return this.contractors;
  }

  static build(contractors: Contractor[]): Contractors {
    return new Contractors(contractors);
  }

  add(form: PrepareContractorCreation, faId: number): Contractors {
    const id = this.generateContractorId(faId);
    const contractor = { ...form, id };

    const alreadyExists = this.contractors.some((c) => c.id === id);
    if (alreadyExists) throw new ContractorAlreadyExists();

    return new Contractors([...this.contractors, contractor]);
  }

  update(contractor: Contractor): Contractors {
    const currentContractor = this.contractors.findIndex(
      (c) => c.id === contractor.id,
    );
    if (currentContractor === -1) throw new ContractorNotFound();

    const contractors = updateItemToList(
      this.contractors,
      currentContractor,
      contractor,
    );
    return new Contractors(contractors);
  }

  remove(id: TimeWindow["id"]): Contractors {
    return new Contractors(this.contractors.filter((tw) => tw.id !== id));
  }

  private generateContractorId(faId: number): string {
    const lastContractor = this.contractors[this.contractors.length - 1];

    if (!lastContractor) return `${faId}-1`;

    const lastId = lastContractor.id.split("-")[1];
    const newId = parseInt(lastId, 10) + 1;

    return `${faId}-${newId}`;
  }
}
