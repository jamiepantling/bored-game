let Tag = require("../models/tag");
let Game = require("../models/game");
const tag = require("../models/tag");
const gamesCtrl = require("./games")


module.exports = {
    show
}


async function show (req, res) {
    if (!req.user) return res.redirect("/")
  let tag = await Tag.findById(req.params.id)
  let tags = await Tag.find({})
  tags = gamesCtrl.tagSort(tags)
  let games = await Game.find({tag: { $elemMatch: { $eq: req.params.id } }}).populate("tag");
  res.render("tags/show", {title: tag.content, games, tag, tags})
}