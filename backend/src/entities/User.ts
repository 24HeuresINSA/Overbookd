import { model, Schema, Types, PopulatedDoc, Document } from "mongoose";
import * as Factory from "factory.ts";
import faker from "faker";
import { ITimeslot } from "./Timeslot";

export type team = string;
export interface IUser {
  password?: string;
  password2?: string;
  notifications?: any[];
  _id?: string;
  id?: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  balance?: number;
  charisma?: number;
  phone?: number;
  picture?: number;
  email: string;
  team?: team[];
  hasDriverLicense?: boolean;
  driverLicenseDate?: Date;
  hasPayedContribution?: boolean;
  birthdate?: Date;
  friends?: string[];
  transactionHistory?: any;
  pp?: string;
  availabilities?: PopulatedDoc<ITimeslot & Document>[];
  resetPasswordToken?: string;
  resetTokenExpires?: Date;
  comment?: string;
  departement?: string;
  year?: string;
}

// Mock interface for data generation

export const UserMock = Factory.Sync.makeFactory<IUser>({
  firstname: Factory.Sync.each(() => faker.name.firstName()),
  lastname: Factory.Sync.each(() => faker.name.lastName()),
  email: Factory.Sync.each(() => faker.internet.email()),
});

const UserSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    nickname: { type: String, required: false },
    comment: { type: String, required: false },
    departement: { type: String, required: false },
    year: { type: String, required: false },
    password: { type: String, require: false },
    balance: { type: Number, required: false },
    charisma: { type: Number, required: false },
    phone: { type: Number, required: false },
    picture: { type: String, required: false },
    email: { type: String, required: true },
    team: { type: Array, required: false },
    hasDriverLicense: { type: Boolean, required: false },
    driverLicenseDate: { type: Date, required: false },
    birthdate: { type: Date, required: false },
    friends: { type: Array, required: false },
    pp: { type: String, required: false },
    availabilities: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Timeslot",
      },
    ],
    resetPasswordToken: { type: String, required: false },
    resetTokenExpires: { type: Date, required: false },
    hasPayedContribution: { type: Boolean, required: false },
    notifications: { type: Array, required: false },
  },
  { strict: false }
);

export class SafeUser {
  _id?: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  balance?: number;
  charisma?: number;
  phone?: number;
  picture?: number;
  email: string;
  team?: team[];
  hasDriverLicense?: boolean;
  driverLicenseDate?: Date;
  birthdate?: Date;
  friends?: string[];
  pp?: string;
  availabilities?: Types.ObjectId[];
  resetPasswordToken?: string;
  resetTokenExpires?: Date;
  hasPayedContribution: boolean;
  comment?: string;
  departement?: string;
  year?: string;
  notifications?: any[];

  constructor(data: IUser) {
    this._id = data._id;

    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.nickname = data.nickname;
    this.email = data.email;
    this.departement = data.departement;
    this.year = data.year;
    this.comment = data.comment;

    this.balance = data.balance;

    this.charisma = data.charisma;
    this.phone = data.phone;
    this.picture = data.picture;
    this.team = data.team;
    this.birthdate = data.birthdate;
    this.friends = data.friends;
    this.pp = data.pp;
    this.availabilities = data.availabilities;
    this.notifications = data.notifications;

    this.hasDriverLicense = data.hasDriverLicense || false;
    this.driverLicenseDate = data.driverLicenseDate;
    this.hasPayedContribution = data.hasPayedContribution || false;
  }
}

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
