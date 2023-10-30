import { DraftFestivalActivity } from "./draft-festival-activity";
import {
  InChargeSection,
  SignaSection,
  SecuritySection,
  SupplySection,
} from "./draft-festival-activity.model";
import { InquirySection } from "../festival-activity.core";
import { Adherent } from "../festival-activity.core";
import { GeneralSection } from "./general-section.factory";

function* numberGenerator(start: number): Generator<number> {
  for (let i = start; i < 1_000_000; i++) {
    yield i;
  }
}

export type CreateFestivalActivity = {
  name: string;
  author: Adherent;
};

export class FestivalActivityFactory {
  private idGenerator: Generator<number>;

  constructor(startId: number = 1) {
    this.idGenerator = numberGenerator(startId);
  }

  public create({
    name,
    author,
  }: CreateFestivalActivity): DraftFestivalActivity {
    const activity = {
      id: this.idGenerator.next().value,
      general: GeneralSection.create(name),
      inCharge: this.generateInChargeSection(author),
      signa: this.generateSignaSection(),
      security: this.generateSecuritySection(),
      supply: this.generateSupplySection(),
      inquiry: this.generateInquirySection(),
    };

    return DraftFestivalActivity.build(activity);
  }

  private generateInChargeSection(author: Adherent): InChargeSection {
    return {
      adherent: author,
      team: null,
      contractors: [],
    };
  }

  private generateSignaSection(): SignaSection {
    return {
      location: null,
      signages: [],
    };
  }

  private generateSecuritySection(): SecuritySection {
    return {
      specialNeed: null,
    };
  }

  private generateSupplySection(): SupplySection {
    return {
      electricity: [],
      water: null,
    };
  }

  private generateInquirySection(): InquirySection {
    return {
      timeWindows: [],
      gears: [],
      electricity: [],
      barriers: [],
    };
  }
}
