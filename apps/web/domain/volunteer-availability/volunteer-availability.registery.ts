import { updateItemToList } from "../../utils/functions/list";
import { Period } from "../../utils/models/period";
import { Availability } from "./volunteer-availability";
import { AvailabilityError } from "./volunteer-availability.error";

export class AvailabilityRegistery {
  private _availabilities: Availability[] = [];

  private constructor(availabilities: Availability[]) {
    this._availabilities = availabilities;
  }

  static fromAvailabilities(
    availabilities: Availability[]
  ): AvailabilityRegistery {
    return new AvailabilityRegistery(availabilities);
  }

  static init(): AvailabilityRegistery {
    return new AvailabilityRegistery([]);
  }

  addPeriod(period: Period) {
    const availability = this.tryCreateAvailability(period);
    const availabilitiesWithPeriodAdded = this._availabilities.map(
      this.tryAddPeriod(period)
    );
    const availabilities = availability
      ? [...availabilitiesWithPeriodAdded, availability]
      : availabilitiesWithPeriodAdded;
    this._availabilities = this.mergeAvailabilities(availabilities);
  }

  get availabilities(): Availability[] {
    return this._availabilities;
  }

  private mergeAvailabilities(availabilities: Availability[]): Availability[] {
    if (!this.canMergeAtLeastOneAvailability(availabilities))
      return availabilities;
    return this.mergeAvailabilities(
      availabilities.reduce(
        AvailabilityRegistery.reduceToMergedAvailabilities,
        [] as Availability[]
      )
    );
  }

  private canMergeAtLeastOneAvailability(
    availabilities: Availability[]
  ): boolean {
    return availabilities.some(
      AvailabilityRegistery.isMergeableFromOneOf(availabilities)
    );
  }

  private static reduceToMergedAvailabilities(
    availabilities: Availability[],
    availability: Availability
  ): Availability[] {
    const mergeableAvailabilityIndex = availabilities.findIndex(
      AvailabilityRegistery.isAvailabilityMergeableToOther(availability)
    );
    if (mergeableAvailabilityIndex === -1) {
      return [...availabilities, availability];
    }

    const mergeableAvailability = availabilities
      .at(mergeableAvailabilityIndex)
      ?.addPeriod(availability);

    if (!mergeableAvailability) {
      return [...availabilities, availability];
    }

    return updateItemToList(
      availabilities,
      mergeableAvailabilityIndex,
      mergeableAvailability
    );
  }

  private tryCreateAvailability(period: Period): Availability | undefined {
    try {
      return Availability.fromPeriod(period);
    } catch (e) {
      if (e instanceof AvailabilityError) {
        return undefined;
      }
      throw e;
    }
  }

  private tryAddPeriod(period: Period): (value: Availability) => Availability {
    return (availability) => {
      try {
        return availability.addPeriod(period);
      } catch (e) {
        if (e instanceof AvailabilityError) {
          return availability;
        }
        throw e;
      }
    };
  }

  private static isAvailabilityMergeableToOther(
    availability: Availability
  ): (value: Availability) => boolean {
    return (existingAvailability) =>
      existingAvailability.canMerge(availability);
  }

  private static isMergeableFromOneOf(
    availabilities: Availability[]
  ): (value: Availability, index: number) => boolean {
    return (availability, startIndex) =>
      availabilities
        .slice(startIndex + 1)
        .some(
          AvailabilityRegistery.isAvailabilityMergeableToOther(availability)
        );
  }
}
