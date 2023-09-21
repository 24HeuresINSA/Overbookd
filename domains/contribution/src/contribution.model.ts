export interface IIdentifyContribution {
  userId: number;
  edition: number;
}

export interface Contribution extends IIdentifyContribution {
  amount: number;
  paymentDate: Date;
  expirationDate: Date;
}

export function areSameContributions(
  contribution: IIdentifyContribution,
  other: IIdentifyContribution,
): boolean {
  return (
    contribution.userId === other.userId &&
    contribution.edition === other.edition
  );
}
