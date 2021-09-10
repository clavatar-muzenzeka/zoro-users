/**
 * By Clavatar
 */
const ErrorResponse = require("../../custom-modules/zoro-errors-glossary/error-response.class");
const { ZoroErrorsEnum } = require("../../custom-modules/zoro-errors-glossary");
let errorsGlossary = require("../../custom-modules/zoro-errors-glossary/zoro-errors-glossary");
const {
  ZoroErrorUserNameConflict,
  ZoroErrorRessouceNotFound,
  ZoroErrorUnknown,
} = errorsGlossary;
const Utils = require("../../custom-modules/zoro-utils");

/**
 * @param {express.error} err error object
 * @param {express.req} req request object
 * @param {express.res} res response object
 * @param {express.next} next next middleware
 */
const errorHandler = (err, req, res, next) => {
  let error;
  // cast error
  if (err.name === "CastError") {
    error = new ZoroErrorRessouceNotFound({});
  }

  // Unique fields
  if (err.code === 11000) {
    switch (Object.keys(err.keyPattern)[0]) {
      case "username":
        error = new ZoroErrorUserNameConflict({});
        break;
    }
  }

  // Any validation error
  if (err.code !== 1100 && err.name !== "CastError") {
    if (err.toRESTResponse) {
      next(err);
    } else {
      let message = Object.values(err.errors).map((val) => val.message);
      if (Array.isArray(message)) message = message[0];
      let matchingError = Utils.findErrorClassByMessage(
        errorsGlossary,
        message
      );
      if (matchingError) error = new matchingError({});
      else error = new ZoroErrorUnknown({});
    }
  }
  next(error);
};

module.exports = errorHandler;
