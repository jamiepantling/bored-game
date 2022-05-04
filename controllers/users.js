let User = require("../models/user");
let Game = require("../models/game")


module.exports = {
    index,
    show
}

function index (req, res) {
  User.find({}).then(function (users) {
    res.render("/users/index");
  })
}
async function show (req, res) {
  let games = await Game.find({"gameAuthor": req.params.id})
  res.render("users/show", {title: req.user.name, games})
}