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
