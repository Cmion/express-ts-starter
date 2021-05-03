import { Schema } from 'mongoose';
import { AccountDocument, AccountQuery } from '../interface/account.interface';
import { genSalt as generateSalt, hash as hashPassword } from 'bcrypt';
import validator from 'validator';
import { setLastSeenAt } from '../methods/account.methods';
import { findByEmail } from '../statics/account.statics';

const AccountSchema: Schema = new Schema({
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
  password: { type: String, required: true },
  lastSeenAt: {
    type: Date,
    default: new Date(),
  },
  isVerified: Boolean,
});

// Middlewares
AccountSchema.pre<AccountDocument>('save', function (next) {
  // Make sure not to rehash the password if it is already hashed
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a salt and use it to hash the user's password
  generateSalt(10, (genSaltError, salt) => {
    if (genSaltError) {
      return next(genSaltError);
    }

    hashPassword(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    });
  });
});

AccountSchema.pre<AccountQuery>('findOneAndUpdate', function (next) {
  const updateFields = this.getUpdate()[0];

  // Generate a salt and use it to hash the user's password
  if (updateFields.password) {
    generateSalt(10, (genSaltError, salt) => {
      if (genSaltError) {
        return next(genSaltError);
      }

      hashPassword(updateFields.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        updateFields.password = hash;
        return next(err);
      });
    });
  }
  return next(null);
});

// Statics
AccountSchema.statics.findByEmail = findByEmail;

// Methods.
AccountSchema.methods.setLastSeenAt = setLastSeenAt;

export default AccountSchema;
