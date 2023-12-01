import { Draft, InReview } from "./festival-activity";
import { Adherent } from "./sections/in-charge";

export type Created = {
  festivalActivity: Draft;
  by: Adherent["id"];
  at: Date;
  id: Draft["id"];
};

export type ReadyToReview = {
  festivalActivity: InReview;
  by: Adherent["id"];
  at: Date;
  id: InReview["id"];
};

export type Approved = {
  festivalActivity: InReview;
  by: Adherent["id"];
  at: Date;
  id: InReview["id"];
};

export class FestivalActivityEvents {
  static created(festivalActivity: Draft, by: Adherent["id"]): Created {
    const at = this.computeAt();
    return { festivalActivity, by, at, id: festivalActivity.id };
  }

  static readyToReview(
    festivalActivity: InReview,
    by: Adherent["id"],
  ): ReadyToReview {
    const at = this.computeAt();
    return { festivalActivity, by, at, id: festivalActivity.id };
  }

  static approved(festivalActivity: InReview, by: Adherent["id"]): Approved {
    const at = this.computeAt();
    return { festivalActivity, by, at, id: festivalActivity.id };
  }

  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}
