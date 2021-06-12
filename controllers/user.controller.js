/**
 * By clavatar
 * User controller
 */
const {
  ZoroErrorUserNotFound,
  ZoroErrorWrongPassword,
  ZoroErrorUserFreezed
} = require("../custom-modules/zoro-errors-glossary/zoro-errors-glossary");
const GenericResponse = require("../libraries/generic-response.class");
const UserModel = require("../models/user.model");

/**
 * Users sign up
 * @param {express.req} req current request object
 * @param {express.res} res current response object
 * @param {express.next} next next middlewrae
 */
exports.login = async (req, res, next) => {
  let mUser = await UserModel.findOne({ username: req.body.username });
  if (!mUser)
    return next(new ZoroErrorUserNotFound({ username: req.body.username }));

  // If tries limit reached
  if (mUser.tries == 0) {
    // check for freeze time that last
    let freezed = mUser.freezed();
    // must wait
    if (freezed) return next(new ZoroErrorUserFreezed({ last: freezed }));

    // freeze time excessed, reinit tries
    mUser.tries = 3;
    await mUser.save();
  }

  // Password check
  if (!mUser.checkPassword(req.body.password)) {
    // wrong password
    // decrement tries
    mUser.tries--;
    if(mUser.tries == 0) mUser.freezedAt = new Date()
    await mUser.save();
    return next(new ZoroErrorWrongPassword({ last: mUser.tries }));
  }

  // password is ok, sign token with JWT
  let pojoUser = JSON.parse(JSON.stringify(mUser))
  let {hashedPassword, ...cleanUser} = pojoUser // remove hashedPassword
  return res.status(200).json(
    new GenericResponse(
      {
        token: mUser.getSignedJwtToken(),
        user: cleanUser, 
      },
      {}
    )
  );
};
