/**
 * Created by eygle on 4/29/17.
 */
const mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , bcrypt = require("bcrypt-nodejs")
    , normalize = require("../../modules/normalize");

const UserSchema = new Schema({
    email: String,
    userName: String,
    normalizeUserName: String,

    password: String,

    googleId: String,
    googleToken: String,

    facebookId: String,
    facebookToken: String,

    valid: { type : Boolean, default : false },
    access: Number,
  superUser: {type: Boolean, default: false},

    creationDate: { type : Date, default : Date.now },
    updateDate: { type : Date, default : Date.now }
});

UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.checkPassword = (password) => {
    return bcrypt.compareSync(password, this.local.password);
};

UserSchema.methods.censure = (user) => {
    delete user.password;
};

module.exports = mongoose.model('User', UserSchema);