export interface PayContributionForm {
  amount: number;
  userId: number;
}

export interface ContributionResponse {
  amount: number;
  paymentDate: Date;
}
