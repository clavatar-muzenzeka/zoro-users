/**
 * By clavatar
 * generic mongoose post middleware
 */
const { NetworkAuthenticationRequire } = require("http-errors");
const { Mongoose } = require("mongoose");
const GenericReponse = require("../generic-response.class");

/**
 * Return post handler based on model provided in parameter
 * @param {Mongoose.Model} model model in witch data will be inserted
 */
module.exports = (model, contextName) => async (req, res, next) => {
  let document = new model(req.body);
  document.save((err, saved) => {
    // send error to error handler
    if (err) next(err);
    // send response
    else return res.status(201).json(new GenericReponse(document, {  
    }));
  });
};
