import { Document, Model, Query } from 'mongoose';

export interface Account {
  email: string;
  password: string;
  lastSeenAt: Date;
  isVerified: boolean;
}

export type AccountDocument = Account & Document;

export type AccountModel = Model<AccountDocument>;

export type AccountQuery = Query<Account, AccountDocument>;
