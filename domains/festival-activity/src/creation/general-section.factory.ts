import { IProvidePeriod, Period } from "@overbookd/period";
import { GeneralTimeWindowAlreadyExists } from "../festival-activity.error";
import { Duration } from "@overbookd/period";

export type GeneralTimeWindowRepresentation = IProvidePeriod & {
  id: string;
};

type CreateGeneralTimeWindow = {
  faId: number;
  period: Period;
};

export type GeneralSectionRepresentation = {
  name: string;
  description: string | null;
  categories: string[];
  toPublish: boolean;
  photoLink: string | null;
  isFlagship: boolean;
  timeWindows: GeneralTimeWindowRepresentation[];
};

export class GeneralSection implements GeneralSectionRepresentation {
  private constructor(
    readonly name: string,
    readonly description: string | null,
    readonly categories: string[],
    readonly toPublish: boolean,
    readonly photoLink: string | null,
    readonly isFlagship: boolean,
    readonly timeWindows: GeneralTimeWindow[],
  ) {}

  get json(): GeneralSectionRepresentation {
    return {
      name: this.name,
      description: this.description,
      categories: this.categories,
      toPublish: this.toPublish,
      photoLink: this.photoLink,
      isFlagship: this.isFlagship,
      timeWindows: this.timeWindows.map((tw) => tw.json),
    };
  }

  static create(name: string): GeneralSection {
    return new GeneralSection(name, null, [], false, null, false, []);
  }

  static build(general: GeneralSectionRepresentation): GeneralSection {
    return new GeneralSection(
      general.name,
      general.description,
      general.categories,
      general.toPublish,
      general.photoLink,
      general.isFlagship,
      GeneralTimeWindow.buildArray(general.timeWindows),
    );
  }

  public update(
    generalUpdate: Partial<GeneralSectionRepresentation>,
  ): GeneralSection {
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
    return GeneralSection.build(build);
  }

  public addTimeWindow(timeWindow: CreateGeneralTimeWindow): GeneralSection {
    const newTimeWindow = GeneralTimeWindow.create(timeWindow);

    const alreadyExists = this.timeWindows.some(
      (tw) => tw.id === newTimeWindow.id,
    );
    if (alreadyExists) throw new GeneralTimeWindowAlreadyExists();

    const timeWindows = [...this.timeWindows, newTimeWindow];
    return GeneralSection.build({ ...this.json, timeWindows });
  }

  public removeTimeWindow(timeWindowId: string): GeneralSection {
    const timeWindows = this.timeWindows.filter((tw) => tw.id !== timeWindowId);
    return GeneralSection.build({ ...this.json, timeWindows });
  }
}

export class GeneralTimeWindow implements GeneralTimeWindowRepresentation {
  constructor(readonly id: string, readonly start: Date, readonly end: Date) {}

  get json(): GeneralTimeWindowRepresentation {
    return {
      id: this.id,
      start: this.start,
      end: this.end,
    };
  }

  static build(timeWindow: GeneralTimeWindowRepresentation): GeneralTimeWindow {
    return new GeneralTimeWindow(
      timeWindow.id,
      timeWindow.start,
      timeWindow.end,
    );
  }

  static buildArray(
    timeWindows: GeneralTimeWindowRepresentation[],
  ): GeneralTimeWindow[] {
    return timeWindows.map(GeneralTimeWindow.build);
  }

  static create(form: CreateGeneralTimeWindow): GeneralTimeWindow {
    const { start, end } = form.period;
    return new GeneralTimeWindow(this.generateId(form), start, end);
  }

  private static generateId(form: CreateGeneralTimeWindow): string {
    const { start, end } = form.period;
    const startMinutes = Duration.ms(start.getTime()).inMinutes;
    const endMinutes = Duration.ms(end.getTime()).inMinutes;

    return `${form.faId}-${startMinutes}-${endMinutes}`;
  }
}
