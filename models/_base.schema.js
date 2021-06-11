/**
 * By clavatar
 */

const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  deleted: { type: Boolean, default: false },
});

module.exports = schema;
