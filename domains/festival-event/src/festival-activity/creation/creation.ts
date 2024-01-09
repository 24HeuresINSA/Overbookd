import { numberGenerator } from "@overbookd/list";
import { DRAFT, Draft, FestivalActivity } from "../festival-activity";
import { FestivalActivityKeyEvents } from "../festival-activity.event";
import { Adherent } from "../sections/in-charge";

export type FestivalActivityCreationForm = {
  name: string;
  author: Adherent;
};

export type CreateFestivalActivityRepository = {
  create(activity: Draft): Promise<Draft>;
};

export class CreateFestivalActivity {
  private idGenerator: Generator<number>;

  constructor(
    private readonly festivalActivities: CreateFestivalActivityRepository,
    startId: number = 1,
  ) {
    this.idGenerator = numberGenerator(startId);
  }

  async create({ name, author }: FestivalActivityCreationForm): Promise<Draft> {
    const activity: Draft = {
      id: this.generateId(),
      status: DRAFT,
      general: this.generateGeneralSection(name),
      inCharge: this.generateInChargeSection(author),
      signa: this.generateSignaSection(),
      security: this.generateSecuritySection(),
      supply: this.generateSupplySection(),
      inquiry: this.generateInquirySection(),
      feedbacks: [],
      history: [FestivalActivityKeyEvents.created(author)],
    };

    return this.festivalActivities.create(activity);
  }

  private generateId(): FestivalActivity["id"] {
    return this.idGenerator.next().value;
  }

  private generateGeneralSection(name: string): Draft["general"] {
    return {
      name,
      categories: [],
      description: null,
      toPublish: false,
      isFlagship: false,
      photoLink: null,
      timeWindows: [],
    };
  }

  private generateInChargeSection(author: Adherent): Draft["inCharge"] {
    return {
      adherent: author,
      team: null,
      contractors: [],
    };
  }

  private generateSignaSection(): Draft["signa"] {
    return {
      location: null,
      signages: [],
    };
  }

  private generateSecuritySection(): Draft["security"] {
    return {
      specialNeed: null,
      freePass: 0,
    };
  }

  private generateSupplySection(): Draft["supply"] {
    return {
      electricity: [],
      water: null,
    };
  }

  private generateInquirySection(): Draft["inquiry"] {
    return {
      timeWindows: [],
      gears: [],
      electricity: [],
      barriers: [],
    };
  }
}
