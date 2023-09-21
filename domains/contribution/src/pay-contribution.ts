import { Permission } from "@overbookd/permission";
import { Contribution } from "./contribution";
import {
  HasAlreadyPayed,
  InsufficientAmount,
  NotAllowedToPay,
} from "./pay-contribution.error";
import { ONE_YEAR_IN_MS } from "@overbookd/period";

const BASE_EDITION = 49;
const BASE_EDITION_STARTS = new Date("2023-09-01");
const BASE_EDITION_ENDS = new Date("2024-08-31");
const MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS = 100;
const AUGUST = 7;
export const EXPIRATION_DATE = {
  month: AUGUST,
  day: 31,
};

export type Adherent = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
};

type WithPermission = {
  permissions: Permission[];
};

export type Member = Adherent & WithPermission;

export interface PayContributionForm {
  amount: number;
  adherentId: number;
}

export interface ContributionRepository {
  pay(contribution: Contribution): Promise<Contribution>;
  hasAlreadyPayed(adherentId: number, edition: number): Promise<boolean>;
  findAdherentsOutToDate(edition: number): Promise<Adherent[]>;
  isAllowedToPay(memberId: number): Promise<boolean>;
}

export class PayContribution {
  constructor(private readonly contributions: ContributionRepository) {}

  private get currentEdition(): number {
    return this.findEdition(new Date());
  }

  async for({
    adherentId,
    amount,
  }: PayContributionForm): Promise<Contribution> {
    const edition = this.currentEdition;

    const [isAllowedToPay, hasAlreadyPayed] = await Promise.all([
      this.contributions.isAllowedToPay(adherentId),
      this.contributions.hasAlreadyPayed(adherentId, edition),
    ]);
    if (!isAllowedToPay) throw new NotAllowedToPay();
    if (hasAlreadyPayed) throw new HasAlreadyPayed();

    if (amount < MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS) {
      throw new InsufficientAmount();
    }

    const newContribution = {
      adherentId,
      amount,
      paymentDate: new Date(),
      expirationDate: this.calculeExpirationDate(edition),
      edition,
    };

    return this.contributions.pay(newContribution);
  }

  async findAdherentsWithContributionOutToDate(): Promise<Adherent[]> {
    return this.contributions.findAdherentsOutToDate(this.currentEdition);
  }

  private calculeExpirationDate(edition: number): Date {
    const yearsSinceBaseEdition = edition - BASE_EDITION;
    const expirationDateYear =
      BASE_EDITION_ENDS.getFullYear() + yearsSinceBaseEdition;

    return new Date(
      expirationDateYear,
      EXPIRATION_DATE.month,
      EXPIRATION_DATE.day,
    );
  }

  private findEdition(date: Date): number {
    const durationAfterBaseEdition =
      date.getTime() - BASE_EDITION_STARTS.getTime();
    const editionAfterBaseEdition = Math.floor(
      durationAfterBaseEdition / ONE_YEAR_IN_MS,
    );
    return BASE_EDITION + editionAfterBaseEdition;
  }
}
