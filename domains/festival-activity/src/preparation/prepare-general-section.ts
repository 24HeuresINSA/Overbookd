import { IProvidePeriod, Period } from "@overbookd/period";
import { TimeWindowAlreadyExists as TimeWindowAlreadyExists } from "../festival-activity.error";
import { Duration } from "@overbookd/period";
import { PrepareGeneralForm } from "./prepare-festival-activity.model";
import { TimeWindow } from "../festival-activity";
import { DraftGeneralSection } from "../creation/draft-festival-activity.model";

type CreateTimeWindow = {
  faId: number;
  period: IProvidePeriod;
};

export class PrepareGeneralSection implements DraftGeneralSection {
  private constructor(
    readonly name: DraftGeneralSection["name"],
    readonly description: DraftGeneralSection["description"],
    readonly categories: DraftGeneralSection["categories"],
    readonly toPublish: DraftGeneralSection["toPublish"],
    readonly photoLink: DraftGeneralSection["photoLink"],
    readonly isFlagship: DraftGeneralSection["isFlagship"],
    private readonly _timeWindows: TimeWindows,
  ) {}

  get timeWindows(): DraftGeneralSection["timeWindows"] {
    return this._timeWindows.timeWindows;
  }

  get json(): DraftGeneralSection {
    return {
      name: this.name,
      description: this.description,
      categories: this.categories,
      toPublish: this.toPublish,
      photoLink: this.photoLink,
      isFlagship: this.isFlagship,
      timeWindows: this.timeWindows,
    };
  }

  static build(general: DraftGeneralSection): PrepareGeneralSection {
    return new PrepareGeneralSection(
      general.name,
      general.description,
      general.categories,
      general.toPublish,
      general.photoLink,
      general.isFlagship,
      TimeWindows.build(general.timeWindows),
    );
  }

  public update(generalUpdate: PrepareGeneralForm): DraftGeneralSection {
    const privateFestivalActivity = {
      toPublish: false,
      photoLink: null,
      isFlagship: false,
    };
    const cleanedUpdate =
      generalUpdate.toPublish === false
        ? { ...generalUpdate, ...privateFestivalActivity }
        : generalUpdate;
    const build = { ...this.json, ...cleanedUpdate };
    return PrepareGeneralSection.build(build);
  }

  public addTimeWindow(timeWindowForm: CreateTimeWindow): DraftGeneralSection {
    const { timeWindows } = this._timeWindows.add(timeWindowForm);
    return PrepareGeneralSection.build({ ...this.json, timeWindows });
  }

  public removeTimeWindow(timeWindowId: string): DraftGeneralSection {
    const { timeWindows } = this._timeWindows.remove(timeWindowId);
    return PrepareGeneralSection.build({ ...this.json, timeWindows });
  }
}

class TimeWindows {
  private constructor(readonly timeWindows: TimeWindow[]) {}

  static build(timeWindows: TimeWindow[]): TimeWindows {
    return new TimeWindows(timeWindows);
  }

  public add(form: CreateTimeWindow): TimeWindows {
    const id = this.generateId(form);
    const { start, end } = Period.init(form.period);
    const timeWindow = { id, start, end };

    const alreadyExists = this.timeWindows.some((tw) => tw.id === id);
    if (alreadyExists) throw new TimeWindowAlreadyExists();

    const timeWindows = [...this.timeWindows, timeWindow];
    return TimeWindows.build(timeWindows);
  }

  public remove(timeWindowId: string): TimeWindows {
    const timeWindows = this.timeWindows.filter((tw) => tw.id !== timeWindowId);
    return TimeWindows.build(timeWindows);
  }

  private generateId(form: CreateTimeWindow): string {
    const { start, end } = form.period;
    const startMinutes = Duration.ms(start.getTime()).inMinutes;
    const endMinutes = Duration.ms(end.getTime()).inMinutes;

    return `${form.faId}-${startMinutes}-${endMinutes}`;
  }
}
