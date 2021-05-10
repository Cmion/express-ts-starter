import { Model, model, Query, Schema, Document } from 'mongoose';
import validator from 'validator';
import { User } from '../entity/users.entity';
import { SchemaConfigs } from '../../../interfaces/database-options.interface';
import { config } from '../../factory/service/config.service';
export type UserDocument = Document & User;

export interface UserModelType extends Model<UserDocument> {
  findByEmail(): Promise<UserDocument[]>;
  schemaConfigs(): SchemaConfigs;
  findByAccount(account: string): Promise<UserDocument> | null;
}

export type UserQuery = Query<User, UserDocument>;

const UserSchema: Schema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'accounts',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    mobile: { type: String, required: true },
    active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: config.get<string[]>('api.user_roles'),
      default: 'user',
    },
    deleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    autoCreate: true,
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Statics
UserSchema.statics.findByEmail = async function findByEmail(
  this: UserModelType,
  email: string,
): Promise<UserDocument[]> {
  return this.find({ email });
};

UserSchema.statics.findByAccount = async function findByAccount(
  this: UserModelType,
  account: string,
): Promise<UserDocument> | null {
  let user = this.findOne({ account });
  if (!user) {
    return null;
  }
  return user;
};

UserSchema.statics.schemaConfigs = (): SchemaConfigs => ({
  softDelete: true,
  uniques: [],
  returnDuplicate: false,
  fillables: [],
  updateFillables: [],
  hiddenFields: ['delete', 'password'],
});

export const UserModel: UserModelType = model<UserDocument, UserModelType>('Users', UserSchema);
