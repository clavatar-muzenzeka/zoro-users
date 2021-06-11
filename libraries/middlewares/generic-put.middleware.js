/**
 * By clavatar
 * generic mongoose post middleware
 */
const GenericReponse = require("../generic-response.class");

exports = (Model, contextName) => async (req, res, next) => {
  let document = new Model(req.body);
  await document.save().catch(next);

  // send response
  res.status(201).json(new GenericReponse(document));
};
