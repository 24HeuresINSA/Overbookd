import { CreateFestivalActivity } from "./creation.spec";
import {
  DraftFestivalActivity,
  GeneralSection,
  Adherent,
  InChargeSection,
  SignaSection,
  SecuritySection,
  SupplySection,
  InquirySection,
} from "./draft-festival-activity";

function* numberGenerator(start: number): Generator<number> {
  for (let i = start; i < 1_000_000; i++) {
    yield i;
  }
}

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
      general: this.generateGeneralSection(name),
      inCharge: this.generateInChargeSection(author),
      signa: this.generateSignaSection(),
      security: this.generateSecuritySection(),
      supply: this.generateSupplySection(),
      inquiry: this.generateInquirySection(),
    };

    return DraftFestivalActivity.build(activity);
  }

  private generateGeneralSection(name: string): GeneralSection {
    return {
      name,
      description: null,
      categories: [],
      toPublish: false,
      photoLink: null,
      isFlagship: false,
      timeWindows: [],
    };
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
