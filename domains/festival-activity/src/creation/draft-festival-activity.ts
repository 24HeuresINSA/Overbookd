import { IProvidePeriod } from "@overbookd/period";

export type Adherent = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
};

export type Signage = {
  quantity: number;
  text: string;
  size: string;
  type: "BACHE" | "PANNEAU" | "AFFICHE";
  comment: string;
};

export type ElectricitySupply = {
  connection:
    | "PC16_Prise_classique"
    | "P17_16A_MONO"
    | "P17_16A_TRI"
    | "P17_16A_TETRA"
    | "P17_32A_MONO"
    | "P17_32A_TRI"
    | "P17_32A_TETRA"
    | "P17_63A_MONO"
    | "P17_63A_TRI"
    | "P17_63A_TETRA"
    | "P17_125A_TETRA";
  device: string;
  power: number;
  count: number;
  comment: string | null;
};

export type Inquiry = {
  id: number;
  quantity: number;
  name: string;
};

export type GeneralSection = {
  name: string;
  description: string | null;
  categories: string[];
  toPublish: boolean;
  photoLink: string | null;
  isFlagship: boolean;
  timeWindows: IProvidePeriod[];
};

export type InChargeSection = {
  adherent: Adherent;
  team: string | null;
  contractors: never[];
};

export type SignaSection = {
  location: string | null;
  signages: Signage[];
};

export type SecuritySection = {
  specialNeed: string | null;
};

export type SupplySection = {
  electricity: ElectricitySupply[];
  water: string | null;
};

export type InquirySection = {
  timeWindows: IProvidePeriod[];
  gears: Inquiry[];
  electricity: Inquiry[];
  barriers: Inquiry[];
};

type BaseFestivalActivity = {
  id: number;
  general: GeneralSection;
  inCharge: InChargeSection;
  signa: SignaSection;
  security: SecuritySection;
  supply: SupplySection;
  inquiry: InquirySection;
};

export const DRAFT = "DRAFT";

export type DraftFestivalActivityRepresentation = BaseFestivalActivity & {
  status: typeof DRAFT;
};

export class DraftFestivalActivity
  implements DraftFestivalActivityRepresentation
{
  general: GeneralSection;

  private constructor(
    readonly id: number,
    general: GeneralSection,
    readonly inCharge: InChargeSection,
    readonly signa: SignaSection,
    readonly security: SecuritySection,
    readonly supply: SupplySection,
    readonly inquiry: InquirySection,
  ) {
    this.general = general;
  }

  get status(): typeof DRAFT {
    return DRAFT;
  }

  public static build(
    draftFestivalActivity: BaseFestivalActivity,
  ): DraftFestivalActivity {
    const { id, general, inCharge, signa, security, supply, inquiry } =
      draftFestivalActivity;

    return new DraftFestivalActivity(
      id,
      general,
      inCharge,
      signa,
      security,
      supply,
      inquiry,
    );
  }

  public changeGeneralSection(
    section: Partial<GeneralSection>,
  ): DraftFestivalActivityRepresentation {
    this.general = { ...this.general, ...section };

    if (section.toPublish === false) {
      this.general.photoLink = null;
      this.general.isFlagship = false;
    }
    return this.json;
  }

  get json(): DraftFestivalActivityRepresentation {
    return {
      id: this.id,
      general: this.general,
      inCharge: this.inCharge,
      signa: this.signa,
      security: this.security,
      supply: this.supply,
      inquiry: this.inquiry,
      status: this.status,
    };
  }
}
