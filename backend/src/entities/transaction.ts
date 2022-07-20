import { Schema, model } from "mongoose";
import * as Factory from "factory.ts";
import faker from "faker";
import { BaseEntity } from "@shared/BaseEntity";
import { getModelForClass, prop } from "@typegoose/typegoose";

// Model interfaces

enum TransactionType {
  DEPOSIT = "deposit",
  TRANSFER = "transfer",
  EXPENSE = "expense",
}

export class Transaction extends BaseEntity {
  @prop({ required: true })
  amount: number;

  @prop({ required: true, enum: TransactionType })
  type: string;

  @prop({ required: true })
  from: string;

  @prop({ required: true })
  to: string;

  @prop({ required: true })
  isValid: boolean;

  @prop({ required: true })
  context: string;
}

const TransactionModel = getModelForClass(Transaction);

export default TransactionModel;
interface IExpense {
  type: "expense";
  from: string;
  to: null;
  amount: number;
  context: string;
  createdAt: Date;
  isValid: boolean;
}

interface IDeposit {
  type: "deposit";
  from: null;
  to: string;
  amount: number;
  context: null;
  createdAt: Date;
  isValid: boolean;
}

interface ITransfer {
  type: "transfer";
  from: string;
  to: string;
  amount: number;
  context: string;
  createdAt: Date;
  isValid: boolean;
}

// Mock Interfaces for data generation

export const ExpenseMock = Factory.Sync.makeFactory<IExpense>({
  createdAt: Factory.each(() => faker.datatype.datetime()),
  isValid: true,
  type: "expense",
  amount: Factory.each(() => faker.datatype.number({ min: 0 })),
  context: Factory.each(() => faker.lorem.sentence()),
  from: "user._id",
  to: null,
});

export const DepositMock = Factory.Sync.makeFactory<IDeposit>({
  type: "deposit",
  amount: Factory.each(() => faker.datatype.number({ min: 0 })),
  context: null,
  from: null,
  to: "user._id",
  isValid: true,
  createdAt: Factory.each(() => faker.datatype.datetime()),
});

export const TransferMock = Factory.Sync.makeFactory<ITransfer>({
  type: "transfer",
  amount: Factory.each(() => faker.datatype.number({ min: 0 })),
  context: Factory.each(() => faker.lorem.sentence()),
  from: "user._id",
  to: "user._id",
  isValid: true,
  createdAt: Factory.each(() => faker.datatype.datetime()),
});
