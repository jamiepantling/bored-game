const { redirect } = require("express/lib/response");
let Game = require("../models/game");
let User = require("../models/user");


module.exports = {
  create,
};



function create(req, res) {
  Game.findById(req.params.id, function(err, game) {
    game.reviews.push(req.body);
    game.save(function(err) {
      res.redirect(`/games/${game._id}`);
    });
  });
}