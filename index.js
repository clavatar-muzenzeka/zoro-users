const subApplicationName = "zoro-users"; // sub-application name
const express = require("express");
require("dotenv").config();
var debug = require("debug")(subApplicationName); // flavoured console.log()

/**
 * -------------ZORO USERS EXPRESS SUB APP----------------
 */

/**
 * db connection middlewrare
 * @param {Error} err
 */

const onConnection = (err) => {
  // throw exception on database connection failed

  if (err) {
    let errorMessage = `Error on database connection from ${subApplicationName}`;
    debug(errorMessage);
    throw errorMessage;
  }
};

// create mongoose connection if not exists
if (!mongoose.connection.readyState) {
  if (process.env.DB_HOST) mongoose.connect(process.env.DB_HOST, onConnection);
}

/**
 * init app
 * @param {Express} express
 * @returns {any} express app
 */
function _initApp(express) {
  const app = express();
  app.use("*", (req, res, next) => {
    res.end(`${subApplicationName} works`);
  });
  return express;
}

// export module
module.export = this._initApp(express);
