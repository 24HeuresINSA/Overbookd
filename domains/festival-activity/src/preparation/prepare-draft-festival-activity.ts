import { Prepare, generateTimeWindowId } from "./prepare-festival-activity";

import { IProvidePeriod, Period } from "@overbookd/period";
import { Draft, DRAFT, TimeWindow } from "../festival-activity";
import { TimeWindowAlreadyExists } from "../festival-activity.error";
import {
  PrepareGeneralForm,
  PrepareInChargeForm,
  PrepareSignaForm,
  PrepareSecurityForm,
  PrepareSupplyForm,
} from "./prepare-festival-activity.model";

export class PrepareDraftFestivalActivity implements Draft, Prepare<Draft> {
  private constructor(
    readonly id: Draft["id"],
    readonly general: Draft["general"],
    readonly inCharge: Draft["inCharge"],
    readonly signa: Draft["signa"],
    readonly security: Draft["security"],
    readonly supply: Draft["supply"],
    readonly inquiry: Draft["inquiry"],
  ) {}

  get status(): typeof DRAFT {
    return DRAFT;
  }

  static build(activity: Draft): PrepareDraftFestivalActivity {
    const { id, general, inCharge, signa, security, supply, inquiry } =
      activity;
    return new PrepareDraftFestivalActivity(
      id,
      general,
      inCharge,
      signa,
      security,
      supply,
      inquiry,
    );
  }

  private get festivalActivity(): Draft {
    return {
      id: this.id,
      status: this.status,
      general: this.general,
      inCharge: this.inCharge,
      signa: this.signa,
      security: this.security,
      supply: this.supply,
      inquiry: this.inquiry,
    };
  }

  updateGeneral(form: PrepareGeneralForm): Draft {
    const privateFestivalActivity = {
      toPublish: false,
      photoLink: null,
      isFlagship: false,
    };
    const cleanedUpdate =
      form.toPublish === false ? { ...form, ...privateFestivalActivity } : form;

    const general = { ...this.general, ...cleanedUpdate };
    return { ...this.festivalActivity, general };
  }

  addGeneralTimeWindow(period: IProvidePeriod): Draft {
    const id = generateTimeWindowId(this.id, period);
    const { start, end } = Period.init(period);
    const timeWindow = { id, start, end };

    const alreadyExists = this.general.timeWindows.some((tw) => tw.id === id);
    if (alreadyExists) throw new TimeWindowAlreadyExists();

    const timeWindows = [...this.general.timeWindows, timeWindow];
    const general = { ...this.general, timeWindows };
    return { ...this.festivalActivity, general };
  }

  removeGeneralTimeWindow(id: TimeWindow["id"]): Draft {
    const timeWindows = this.general.timeWindows.filter((tw) => tw.id !== id);
    const general = { ...this.general, timeWindows };
    return { ...this.festivalActivity, general };
  }

  updateInCharge(form: PrepareInChargeForm): Draft {
    const inCharge = { ...this.inCharge, ...form };
    return { ...this.festivalActivity, inCharge };
  }

  updateSigna(form: PrepareSignaForm): Draft {
    const signa = { ...this.signa, ...form };
    return { ...this.festivalActivity, signa };
  }

  updateSecurity(form: PrepareSecurityForm): Draft {
    const security = { ...this.security, ...form };
    return { ...this.festivalActivity, security };
  }

  updateSupply(form: PrepareSupplyForm): Draft {
    const supply = { ...this.supply, ...form };
    return { ...this.festivalActivity, supply };
  }
}
