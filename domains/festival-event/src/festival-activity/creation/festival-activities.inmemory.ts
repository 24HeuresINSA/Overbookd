import { Draft } from "../festival-activity.js";
import { CreateFestivalActivityRepository } from "./creation.js";

export class InMemoryCreateFestivalActivityRepository implements CreateFestivalActivityRepository {
  constructor(private festivalActivities: Draft[] = []) {}

  create(activity: Draft): Promise<Draft> {
    this.festivalActivities = [...this.festivalActivities, activity];
    return Promise.resolve(activity);
  }
}
