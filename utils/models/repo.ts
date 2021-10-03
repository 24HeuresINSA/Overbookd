export class BroadcastNotif {
  link: string;
  team: string;
  message: string;
  date: Date;
  type: string;

  constructor() {
    this.date = new Date();
    this.link = "";
    this.team = "";
    this.message = "";
    this.type = "";
  }
}

export interface Expense {
  type: "expense";
  from: User._id;
  to: null;
  amount: number;
  context: string;
  createdAt: date;
}

export interface Deposit {
  type: "deposit";
  from: User._id;
  to: null;
  amount: number;
  context: null;
  createdAt: date;
}

export interface Transfer {
  type: "transfer";
  from: User._id;
  to: User._id;
  amount: number;
  context: string;
  createdAt: date;
}

export type Transactions = Expense | Deposit | Transfer;

export type transactions = Transaction[];

export interface Notification {
  link: string;
  message: string;
  team: string;
  date: string;
  type: string;
  index?: number;
}

export interface Transaction {
  amount: number;
  reason: string;
}

export interface User {
  _id: string;
  team: string[];
  friends: any[];
  nickname?: string;
  firstname: string;
  lastname: string;
  isValid: boolean;
  birthdate: string;
  email: string;
  phone: number;
  keycloakID: string;
  __v: number;
  notifications: Notification[];
  clicks?: number;
  transactionHistory?: Transaction[];
  balance?: number;
}

export interface FriendRequest {
  type: "friendRequest";
  message: string;
  from: string;
  date: Date;
  data: {
    username: string;
    id: string;
  };
}

export interface FriendRequestData {
  to: {
    firstname: string;
    lastname: string;
  };
  data: FriendRequest;
}
