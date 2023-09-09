export const SELECT_CONTRIBUTION = {
  amount: true,
  paymentDate: true,
};

export const WHERE_EXPIRATION_DATE_GREATER_THAN_NOW = {
  expirationDate: { gte: new Date() },
};
