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
  // let user = await User.findById(req.params.id)
  // let games = await Game.find({gameAuthor: req.params.id})
  // let allGames = await Game.find({})
  // let reviewedGames = allGames.filter(game => if (game.review) game.review.reviewAuthor == user._id)
  // let reviews = reviewedGames.map(game => game.reviews)
  // console.log(reviews)
  // res.render("/users/show", {title: user.name, user, games, reviews})
}