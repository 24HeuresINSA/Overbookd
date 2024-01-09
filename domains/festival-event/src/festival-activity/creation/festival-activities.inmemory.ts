import { Draft } from "../festival-activity";
import { CreateFestivalActivityRepository } from "./creation";

export class InMemoryCreateFestivalActivityRepository
  implements CreateFestivalActivityRepository
{
  constructor(private festivalActivities: Draft[] = []) {}

  create(activity: Draft): Promise<Draft> {
    this.festivalActivities = [...this.festivalActivities, activity];
    return Promise.resolve(activity);
  }
}
