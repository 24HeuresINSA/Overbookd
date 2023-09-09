export interface UserContribution {
  amount: number;
  paymentDate: Date;
}

export interface Contribution {
  amount: number;
  userId: number;
  paymentDate: Date;
  expirationDate: Date;
}
