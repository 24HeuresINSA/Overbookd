// ALERTING
export { PersonalAccountAlerting } from "./alerting/personal-account-alerting.js";
export { PersonalAccountAlert } from "./alerting/personal-account-alert.js";
export type { Adherents } from "./alerting/adherents.js";
export type {
  IAlertAboutPersonalAccount,
  Summary,
} from "./alerting/personal-account-alert.js";

// TRANSACTION
export type {
  MyTransaction,
  TransactionType,
  TransferIReceiveTransaction,
  TransferISendTransaction,
  MyDepositTransaction,
  MyBarrelTransaction,
  MyProvisionsTransaction,
  TransactionUser,
  TransactionWithSenderAndReceiver,
} from "./transaction/transaction.js";
export {
  BARREL,
  DEPOSIT,
  PROVISIONS,
  TRANSFER,
  SHARED_MEAL,
  ONE_EURO_IN_CENTS,
  doIReceive,
  transactionTypes,
} from "./transaction/transaction.js";
export { Transfer } from "./transaction/transfer/transfer.js";
export type {
  Member,
  TransferMembers,
  Transfers,
  TransferResponse,
} from "./transaction/transfer/transfer.js";
export { Payor } from "./transaction/transfer/payor.js";
export type {
  CreateTransferForm,
  TransferForm,
} from "./transaction/transfer/payor.js";
export { TransferError } from "./transaction/transfer/transfer.error.js";
export { SharedMeal as SharedMealPayment } from "./transaction/shared-meal/shared-meal.js";
export type { SharedMealTransaction } from "./transaction/shared-meal/shared-meal.js";
export { SharedMealError } from "./transaction/shared-meal/shared-meal.error.js";
export {
  type CreateDepositForm,
  type Deposits,
  type DepositTransaction,
  type DepositTransactionForm,
  Deposit,
} from "./transaction/deposit/deposit.js";
export {
  type BarrelTransaction,
  type BarrelTransactionForm,
  type BarrelTransactions,
  type CreateBarrelTransaction,
  CreateBarrelTransactions,
} from "./transaction/barrel/create-barrel-transactions.js";
export {
  type CreateProvisionsTransaction,
  type ProvisionsTransaction,
  type ProvisionsTransactionForm,
  type ProvisionsTransactions,
  CreateProvisionsTransactions,
} from "./transaction/provisions/create-provisions-transactions.js";
export { TransactionError } from "./transaction/transaction.error.js";

export type {
  Barrels,
  ConfiguredBarrel,
  NewBarrel,
  AdjustPrice,
  AdjustOpeningDate,
} from "./barrel-prices/define-barrel-price.js";
export { DefineBarrelPrice } from "./barrel-prices/define-barrel-price.js";
export {
  BarrelNotConfigured,
  SimilarBarrelExist,
} from "./barrel-prices/define-barrel-price.error.js";

// MEAL SHARING
export { MealSharing, SOIR, MIDI } from "./meal-sharing/meal-sharing.js";
export type {
  MealDate,
  Moment,
  Adherents as MealsAdherents,
  SharedMeals,
  SharedMealBuilder,
  SharedMealCreation,
} from "./meal-sharing/meal-sharing.js";
export type {
  SharedMeal,
  OnGoingSharedMeal,
  PastSharedMeal,
  AboutMeal,
  Expense,
} from "./meal-sharing/meals.model.js";
export { isOnGoingMeal, isPastMeal } from "./meal-sharing/meals.model.js";
export type { Adherent, Shotgun } from "./meal-sharing/adherent.js";
export { MealSharingError } from "./meal-sharing/meal-sharing.error.js";
export { PastSharedMealBuilder } from "./meal-sharing/past-shared-meal.builder.js";
export { OnGoingSharedMealBuilder } from "./meal-sharing/on-going-shared-meal.builder.js";
