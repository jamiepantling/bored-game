let User = require("../models/user");
let Game = require("../models/game")
const gamesCtrl = require("./games")

module.exports = {
    index,
    show
}

// ** Code for future functionality 
// for checking user's contributions **

function index (req, res) {
  if (!req.user) return res.redirect("/")
  User.find({}).then(function (users) {
    res.render("/users/index");
  })
}
async function show (req, res) {
  if (!req.user) return res.redirect("/")
  let user = await User.findById(req.user.id);
  let games = await Game.find({"gameAuthor": req.params.id})
  games = gamesCtrl.gameSort(games)
  res.render("users/show", {title: req.user.name, games, collections: user.collections})
}