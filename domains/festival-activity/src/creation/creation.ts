import { DRAFT, Draft, FestivalActivity } from "../festival-activity";
import { FestivalActivityEvents, Created } from "../festival-activity.event";
import { Adherent } from "../sections/in-charge";

function* numberGenerator(start: number): Generator<number> {
  for (let i = start; i < 1_000_000; i++) {
    yield i;
  }
}

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

  async create({
    name,
    author,
  }: FestivalActivityCreationForm): Promise<Created> {
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
    };

    const saved = await this.festivalActivities.create(activity);
    return FestivalActivityEvents.created(saved, author.id);
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
