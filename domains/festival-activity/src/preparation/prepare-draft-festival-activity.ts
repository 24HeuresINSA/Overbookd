import { Prepare, generateTimeWindowId } from "./prepare-festival-activity";

import { IProvidePeriod, Period } from "@overbookd/period";
import { Adherent, Draft, TimeWindow } from "../festival-activity";
import {
  TimeWindowAlreadyExists,
  TimeWindowEndBeforeStart,
} from "../festival-activity.error";
import {
  PrepareGeneralForm,
  PrepareSignaForm,
  PrepareSecurityForm,
  PrepareSupplyForm,
  PrepareInChargeForm,
} from "./prepare-festival-activity.model";

type PrepareInChargeFormWithAdherent = Omit<
  PrepareInChargeForm,
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

  updateGeneral(form: PrepareGeneralForm): Draft {
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
    if (period.start.getTime() >= period.end.getTime()) {
      throw new TimeWindowEndBeforeStart();
    }
    const id = generateTimeWindowId(this.activity.id, period);
    const { start, end } = Period.init(period);
    const timeWindow = { id, start, end };

    const alreadyExists = this.activity.general.timeWindows.some(
      (tw) => tw.id === id,
    );
    if (alreadyExists) throw new TimeWindowAlreadyExists();

    const timeWindows = [...this.activity.general.timeWindows, timeWindow];
    const general = { ...this.activity.general, timeWindows };
    return { ...this.activity, general };
  }

  removeGeneralTimeWindow(id: TimeWindow["id"]): Draft {
    const timeWindows = this.activity.general.timeWindows.filter(
      (tw) => tw.id !== id,
    );
    const general = { ...this.activity.general, timeWindows };
    return { ...this.activity, general };
  }

  updateInCharge(form: PrepareInChargeFormWithAdherent): Draft {
    const inCharge = { ...this.activity.inCharge, ...form };
    return { ...this.activity, inCharge };
  }

  updateSigna(form: PrepareSignaForm): Draft {
    const signa = { ...this.activity.signa, ...form };
    return { ...this.activity, signa };
  }

  updateSecurity(form: PrepareSecurityForm): Draft {
    const security = { ...this.activity.security, ...form };
    return { ...this.activity, security };
  }

  updateSupply(form: PrepareSupplyForm): Draft {
    const supply = { ...this.activity.supply, ...form };
    return { ...this.activity, supply };
  }
}
