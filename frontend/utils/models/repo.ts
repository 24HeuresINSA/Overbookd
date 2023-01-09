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
  type: "EXPENSE";
  from: string;
  to: null;
  amount: number;
  context: string;
  created_at: Date;
  is_deleted: boolean;
}

export interface Deposit {
  type: "DEPOSIT";
  from: string;
  to: null;
  amount: number;
  context: string;
  created_at: Date;
  is_deleted: boolean;
}

export interface Transfer {
  type: "TRANSFER";
  from: string;
  to: string;
  amount: number;
  context: string;
  created_at: Date;
  is_deleted: boolean;
}

export type Transaction = Expense | Deposit | Transfer;

export interface Notification {
  link: string;
  message: string;
  team: string;
  date: string;
  type: string;
  index?: number;
}

export interface User {
  id: string;
  team: string[];
  permissions: string[];
  friends: any[];
  nickname?: string;
  firstname: string;
  lastname: string;
  username?: string;
  isValid: boolean;
  birthdate: string;
  email: string;
  phone: number;
  __v: number;
  notifications: Notification[];
  clicks?: number;
  transactionHistory?: Transaction[];
  balance?: number;
  charisma?: number;
  availabilities: string[];
  hasDriverLicense: boolean;
}

export interface availability {
  name: string;
  description: string;
  days: daysFrame[];
}

export interface daysFrame {
  date: string;
  frames: timeframe[];
}

export interface timeframe {
  start: string;
  end: string;
  charisma: string;
  isSelected: boolean;
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
  to: string; // _id
  data: FriendRequest;
}

export interface Timeslot {
  _id?: string;
  groupTitle: string;
  groupDescription?: string;
  timeFrame: {
    start: Date;
    end: Date;
  };
  charisma: number;
  forHardOnly?: boolean;
}

export interface location {
  _id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  neededBy: string[];
}
