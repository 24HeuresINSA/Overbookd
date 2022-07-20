import { Types, PopulatedDoc, Document } from "mongoose";
import * as Factory from "factory.ts";
import faker from "faker";
import { ITimeslot, Timeslot } from "./Timeslot";
import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { BaseEntity } from "@shared/BaseEntity";

export class Notification {
  @prop({ required: false })
  from?: string;

  @prop({ required: true })
  message: string;

  @prop({ required: true, default: () => new Date() })
  date: Date;

  @prop({ required: true })
  link: string;

  @prop({ required: true })
  team: string;

  @prop({ required: true })
  type: string;
}

export class Friends {
  @prop({ required: true })
  username: string;

  @prop({ required: true })
  id: string;
}

export class User extends BaseEntity {
  @prop({ required: true })
  firstname: string;

  @prop({ required: true })
  lastname: string;

  @prop({ required: true })
  email: string;

  @prop({ required: true, select: false })
  password: string;

  @prop({ required: true })
  phone: number;

  @prop()
  nickname: string;

  @prop({ required: true })
  balance: number;

  @prop({ required: true })
  charisma: number;

  @prop({ required: true })
  hasDriverLicense: boolean;

  @prop()
  driverLicenseDate: Date;

  @prop({ required: true, default: false })
  hasPayedContribution: boolean;

  @prop({ required: true })
  birthdate: Date;

  @prop({ type: () => Friends })
  friends: Types.Array<Friends>;

  @prop()
  pp: string;

  @prop({ ref: () => Timeslot })
  availabilities: Ref<Timeslot>[];

  @prop()
  picture: number;

  @prop({ required: true, default: [], type: () => String })
  team: team[];

  @prop()
  resetPasswordToken?: string;

  @prop()
  resetTokenExpires?: Date;

  @prop()
  comment?: string;

  @prop()
  departement?: string;

  @prop()
  year?: string;

  @prop({ type: () => Notification })
  notifications?: Notification[];
}

export const UserModel = getModelForClass(User);

export type team = string;
export interface IUser {
  _id?: string;
  password: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  notifications?: any[];
  balance: number;
  charisma: number;
  phone: number;
  picture?: number;
  email: string;
  team: team[];
  hasDriverLicense: boolean;
  driverLicenseDate?: Date;
  hasPayedContribution: boolean;
  birthdate: Date;
  friends?: string[];
  transactionHistory?: any;
  pp?: string;
  availabilities?: PopulatedDoc<ITimeslot & Document>[];
  resetPasswordToken?: string;
  resetTokenExpires?: Date;
  comment?: string;
  departement: string;
  year: string;
}

// Mock interface for data generation

export const UserMock = Factory.Sync.makeFactory<IUser>({
  firstname: Factory.Sync.each(() => faker.name.firstName()),
  lastname: Factory.Sync.each(() => faker.name.lastName()),
  email: Factory.Sync.each(() => faker.internet.email()),
  password: Factory.Sync.each(() => faker.internet.password()),
  balance: Factory.Sync.each(() => faker.datatype.number({ min: 0, max: 100 })),
  charisma: Factory.Sync.each(() =>
    faker.datatype.number({ min: 0, max: 100 })
  ),
  phone: Factory.Sync.each(() => faker.datatype.number({ min: 0, max: 100 })),
  picture: Factory.Sync.each(() => faker.datatype.number({ min: 0, max: 100 })),
  hasDriverLicense: Factory.Sync.each(() => faker.datatype.boolean()),
  driverLicenseDate: Factory.Sync.each(() => faker.date.past()),
  hasPayedContribution: Factory.Sync.each(() => faker.datatype.boolean()),
  birthdate: Factory.Sync.each(() => faker.date.past()),
  team: ["abc"],
  departement: Factory.Sync.each(() => faker.random.word()),
  year: Factory.Sync.each(() => faker.random.word()),
});

export default UserModel;
