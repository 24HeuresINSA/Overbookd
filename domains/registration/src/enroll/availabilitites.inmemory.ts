import { Candidate, BriefingAvailabilities } from "./enroll-candidates";
import { IProvidePeriod } from "@overbookd/time";

type UserAvailabiltities = {
  userId: number;
  availabilities: IProvidePeriod[];
};

export class InMemoryBriefingAvailabilities implements BriefingAvailabilities {
  constructor(private readonly availabilities: UserAvailabiltities[] = []) {}

  add(period: IProvidePeriod): {
    to: (candidateId: Candidate["id"]) => Promise<void>;
  } {
    return {
      to: async (candidateId: Candidate["id"]) => {
        const userAvailabilities = this.availabilities.find(
          (availability) => availability.userId === candidateId,
        );
        if (userAvailabilities) {
          userAvailabilities.availabilities.push(period);
          return;
        }
        this.availabilities.push({
          userId: candidateId,
          availabilities: [period],
        });
      },
    };
  }

  availabilitiesOf(candidateId: Candidate["id"]): IProvidePeriod[] {
    const userAvailabilities = this.availabilities.find(
      (availability) => availability.userId === candidateId,
    );
    return userAvailabilities?.availabilities ?? [];
  }
}
