export const MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS = 100;

export type ContributionIdentity = {
  adherentId: number;
  edition: number;
};

export type Contribution = ContributionIdentity & {
  amount: number;
  paymentDate: Date;
  expirationDate: Date;
};

export function areSameContributions(
  contribution: ContributionIdentity,
  other: ContributionIdentity,
): boolean {
  return (
    contribution.adherentId === other.adherentId &&
    contribution.edition === other.edition
  );
}

export type Adherent = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  teams: string[];
};
