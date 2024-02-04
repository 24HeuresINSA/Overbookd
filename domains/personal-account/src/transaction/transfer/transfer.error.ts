export const NEGATIVE_AMOUNT_ERROR_MESSAGE = "Le montant doit être positif";

export const INSUFFICIENT_AMOUNT_ERROR_MESSAGE =
  "Le montant doit être supérieur à 0";

export const TRANSFER_TO_YOURSELF_ERROR_MESSAGE =
  "Tu ne peux pas faire de virement à toi-même";

export const PAYEE_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE =
  "Ce bénévole n'a pas de compte personnel";

export const PAYOR_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE =
  "Tu n'as pas de compte personnel";

const NEGATIVE_PERSONAL_ACCOUNT_ERROR_MESSAGE =
  "Le montant de ton compte perso doit être positif pour faire un virement";

export class TransferError extends Error {}

export class NegativeAmount extends TransferError {
  constructor() {
    super(NEGATIVE_AMOUNT_ERROR_MESSAGE);
  }
}

export class InsufficientAmount extends TransferError {
  constructor() {
    super(INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
  }
}

export class TransferToYourself extends TransferError {
  constructor() {
    super(TRANSFER_TO_YOURSELF_ERROR_MESSAGE);
  }
}

export class PayeeNotHavePersonalAccount extends TransferError {
  constructor() {
    super(PAYEE_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE);
  }
}

export class PayorNotHavePersonalAccount extends TransferError {
  constructor() {
    super(PAYOR_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE);
  }
}

export class NegativePersonalAccount extends TransferError {
  constructor() {
    super(NEGATIVE_PERSONAL_ACCOUNT_ERROR_MESSAGE);
  }
}
