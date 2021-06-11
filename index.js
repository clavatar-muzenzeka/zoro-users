const subApplicationName = "zoro-users"; // sub-application name
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
var debug = require("debug")(subApplicationName); // flavoured console.log()
const userRouter = require("./routers/user.router");
const InternalErrorsMapper = require("./libraries/middlewares/inner-error-to-error-respons.middleware");
const ErrorResponse = require("./custom-modules/zoro-errors-glossary/error-response.class");

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

  // connected
  let successMessage = `Mongoose connected from ${subApplicationName}`;
  debug(successMessage);
};

// create mongoose connection if not exists
if (!mongoose.connection.readyState) {
  if (process.env.DB_HOST) mongoose.connect(process.env.DB_HOST, onConnection);
} else {
  // connection exists
  let successMessage = `Mongoose connection got from ${subApplicationName}`;
  debug(successMessage);
}

/**
 * init app
 * @param {Express} express
 * @returns {any} express app
 */
function _initApp(express) {
  const app = express();
  /**
   * ANCHOR remove on nested
   */
  var logger = require("morgan");
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  /**
   * eof remove on nested
   */

  app.use(userRouter);

  /**
   * ANCHOR remove on nested
   */

  // error handlers

  // convert internal errors to http error objects
  app.use(InternalErrorsMapper);
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);

    // if error is convertible
    if (err instanceof ErrorResponse) res.json(err.toRESTResponse());
    else res.end(err.message);
  });
  /**
   * eof remove on nested
   */

  return app;
}

// export module
module.exports = _initApp(express);
