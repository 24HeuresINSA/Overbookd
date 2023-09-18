export interface UserContribution {
  amount: number;
  paymentDate: Date;
}

export interface Contribution {
  amount: number;
  userId: number;
  edition: number;
  paymentDate: Date;
  expirationDate: Date;
}
