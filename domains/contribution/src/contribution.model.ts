export type ContributionIdentity = {
  userId: number;
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
    contribution.userId === other.userId &&
    contribution.edition === other.edition
  );
}
