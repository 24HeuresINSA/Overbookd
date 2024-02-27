import {
  NO_AVAILABILITIES,
  NOT_YET_VOLUNTEER,
} from "./availabilities-alerting.constant";

export type Summary = typeof NO_AVAILABILITIES | typeof NOT_YET_VOLUNTEER;

export interface IAlertAboutAvailabilities {
  summary: Summary;
  nbPeriods: number;
}

export class AvailabilitesAlert implements IAlertAboutAvailabilities {
  constructor(
    readonly summary: Summary,
    readonly nbPeriods: number,
  ) {}
}
