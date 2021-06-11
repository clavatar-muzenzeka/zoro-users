/**
 * By clavatar
 */
const UserModel = require("../models/user.model");
const GenericPost = require("../libraries/middlewares/generic-post.middleware");
const UserControler = require("../controllers/user.controller");
const { normalizeActionName } = require("../custom-modules/zoro-utils");

var express = require("express");
var router = express.Router();

router
  .route("/")
  .get(function (req, res, next) {
    res.render("index", { title: "Express" });
  })
  .post(GenericPost(UserModel)); // POST user

// infer controller action method by action querry param and call it
router.route("/:action").post((req, res, next) => {
  let action = normalizeActionName(req.params.action);
  return UserControler[action](req, res, next);
});

module.exports = router;
