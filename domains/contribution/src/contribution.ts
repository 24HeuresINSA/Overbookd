export const MEMBER = "MEMBER";
export const DONATOR = "DONATOR";

export type ContributionType = typeof MEMBER | typeof DONATOR;

export const contributionTypes: Record<ContributionType, ContributionType> = {
  MEMBER,
  DONATOR,
};

export type ContributionIdentity = {
  adherentId: number;
  edition: number;
};

export type Contribution = ContributionIdentity & {
  type: ContributionType;
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
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  teams: string[];
};
