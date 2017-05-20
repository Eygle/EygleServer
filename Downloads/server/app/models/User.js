/**
 * Created by eygle on 4/29/17.
 */
const mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , bcrypt = require("bcrypt-nodejs")
  , normalize = require("../../modules/normalize");

function generateHash(plaintext) {
  if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$/.test(plaintext)) {
    return bcrypt.hashSync(plaintext, bcrypt.genSaltSync())
  }
  return null;
}

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'User email required'],
    validate: {
      validator: function (v) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
      },
      message: 'Invalid email format'
    }
  },

  userName: {
    type: String,
    unique: true,
    maxlength: 50,
    minlength: 3
  },

  password: {
    type: String,
    set: generateHash,
    validate: {
      validator: function (v) {
        return v.length > 10;
      },
      message: 'Invalid password format'
    },
    select: false
  },

  userNameNorm: {
    type: String,
    unique: true
  },

  googleId: String,
  googleToken: String,

  facebookId: String,
  facebookToken: String,

  roles: [{type: String}],

  desc: String,

  creationDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now}
});

UserSchema.pre('save', function (next) {
  this.userNameNorm = normalize(this.userName);
  this.roles = ["public"];
  next();
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);