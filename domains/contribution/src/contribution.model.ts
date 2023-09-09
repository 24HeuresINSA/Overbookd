export interface ContributionResponse {
  amount: number;
  paymentDate: Date;
}

export interface Contribution {
  amount: number;
  userId: number;
  paymentDate: Date;
  expirationDate: Date;
}
