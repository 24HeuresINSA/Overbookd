import { DraftFestivalActivity } from "../draft-festival-activity";
import {
  DraftFestivalActivityRepresentation,
  DraftInChargeSection,
  DraftInquirySection,
  DraftSecuritySection,
  DraftSignaSection,
  DraftSupplySection,
} from "./draft-festival-activity.model";
import { Adherent } from "../festival-activity.core";
import {
  DraftGeneralSection,
  DraftGeneralSectionRepresentation,
} from "./draft-general-section";

function* numberGenerator(start: number): Generator<number> {
  for (let i = start; i < 1_000_000; i++) {
    yield i;
  }
}

export type CreateFestivalActivity = {
  name: string;
  author: Adherent;
};

export class FestivalActivityCreation {
  private idGenerator: Generator<number>;

  constructor(startId: number = 1) {
    this.idGenerator = numberGenerator(startId);
  }

  public create({
    name,
    author,
  }: CreateFestivalActivity): DraftFestivalActivityRepresentation {
    const activity = {
      id: this.generateId(),
      general: this.generateGeneralSection(name),
      inCharge: this.generateInChargeSection(author),
      signa: this.generateSignaSection(),
      security: this.generateSecuritySection(),
      supply: this.generateSupplySection(),
      inquiry: this.generateInquirySection(),
    };

    return DraftFestivalActivity.build(activity).json;
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }

  private generateGeneralSection(
    name: string,
  ): DraftGeneralSectionRepresentation {
    return DraftGeneralSection.create(name).json;
  }

  private generateInChargeSection(author: Adherent): DraftInChargeSection {
    return {
      adherent: author,
      team: null,
      contractors: [],
    };
  }

  private generateSignaSection(): DraftSignaSection {
    return {
      location: null,
      signages: [],
    };
  }

  private generateSecuritySection(): DraftSecuritySection {
    return {
      specialNeed: null,
    };
  }

  private generateSupplySection(): DraftSupplySection {
    return {
      electricity: [],
      water: null,
    };
  }

  private generateInquirySection(): DraftInquirySection {
    return {
      timeWindows: [],
      gears: [],
      electricity: [],
      barriers: [],
    };
  }
}
