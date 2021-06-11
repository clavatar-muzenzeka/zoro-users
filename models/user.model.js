/**
 * By clavatar
 */

const mongoose = require("mongoose");
const baseShema = require("./_base.schema");
const { extendSchema } = require("../custom-modules/zoro-utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

// default freeze latency on 3 wrong passwords
const DEFAULT_LATENCY = 5 * 1000 * 60;

/**
 * Zoro specific packages
 */
const {
  ZoroErrorUsernameIsRequired,
  ZoroErrorUserNameConflict,
  ZoroErrorPasswordIsRequired,
  ZoroErrorNameIsRequired,
  ZoroErrorWeakPassword,
} = require("../custom-modules/zoro-errors-glossary/zoro-errors-glossary");

/**
 * user schema
 */
var UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, ZoroErrorUsernameIsRequired.message],
      index: true,
      unique: [true, ZoroErrorUserNameConflict.message],
    },
    hashedPassword: {
      type: String,
      required: [true, ZoroErrorPasswordIsRequired.message],
    },
    tries: {
      type: Number,
      default: 3,
    },
    freezedAt: {
      type: Date,
      default: Date.now,
    },
    name: { type: String, required: [true, ZoroErrorNameIsRequired.message] },
  },
  { timestamps: true }
);

/**
 * virtual fiels password setter
 */
UserSchema.virtual("password").set(function (password) {
  // Strong password validation
  if (password.length < 6) {
    this.invalidate("hashedPassword", ZoroErrorWeakPassword.message);
    return;
  } else {
    this.hashedPassword = this.encryptPassword(password);
  }
});

/**
 * Compagre given plain password to current user document hashed password
 * @param {string} password plain password to be checked
 * @returns {Boolean} whether password matchs or not
 */
UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};

/**
 * Create hash of given password ans save it
 * @param {string} password plain password
 * @returns
 */
UserSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, 8);
};

/**
 * Check whether user is under freez period
 * @returns {boolean} if true, must wait
 */
UserSchema.methods.freezed = function () {
  let today = moment();
  let offset = moment(this.freezedAt);
  let latency = process.env.LATENCY ? process.env.LATENCY : DEFAULT_LATENCY;
  offset.add(latency, "milliseconds");

  // if ender freeze periode, return the time that last to inform user
  return offset.isSameOrAfter(today) ? offset.valueOf() - today.valueOf() : false;
};

/**
 *
 * @returns access token
 */
UserSchema.methods.getSignedJwtToken = function () {
  let SECRET = process.env.SECRET || "jhAh5DB4bxzm";
  let TOKEN_VALIIDTY = process.env.TOKEN_VALIIDTY || "30d";
  return jwt.sign({ id: this._id }, SECRET, {
    expiresIn: TOKEN_VALIIDTY,
  });
};

// base schema extention
let extendedSchema = extendSchema(baseShema, UserSchema);

// export created model
module.exports = mongoose.model("user", extendedSchema);
