import { IProvidePeriod } from "@overbookd/period";

export type GeneralSectionRepresentation = {
  name: string;
  description: string | null;
  categories: string[];
  toPublish: boolean;
  photoLink: string | null;
  isFlagship: boolean;
  timeWindows: IProvidePeriod[];
};

export class GeneralSection implements GeneralSection {
  private constructor(
    readonly name: string,
    readonly description: string | null,
    readonly categories: string[],
    readonly toPublish: boolean,
    readonly photoLink: string | null,
    readonly isFlagship: boolean,
    readonly timeWindows: IProvidePeriod[],
  ) {}

  get json(): GeneralSectionRepresentation {
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
      general.timeWindows,
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
}
