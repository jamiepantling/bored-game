var express = require("express");
var router = express.Router();
const passport = require("passport");
const usersCtrl = require("../controllers/users");

router.get("/", function (req, res) {
  if (req.user) return res.redirect("/games/");
  res.render("index", { title: "Bored? Game!" });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/oauth2callback",
  passport.authenticate("google", {
    successRedirect: "/games",
    failureRedirect: "/games",
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
