let Tag = require("../models/tag");
let Game = require("../models/game");
const tag = require("../models/tag");
const gamesCtrl = require("./games")


module.exports = {
    show
}


async function show (req, res) {
    // if (!req.user) return res.redirect("/")
    let user;
    if (req.user) {
      user = await User.findById(req.user.id).populate({
        path: "collections",
        populate: {
          path: "games",
        },
      });
    } else {
      user = {};
    }
  //Get this specific tag
  let tag = await Tag.findById(req.params.id)
  //Get all tags
  let tags = await Tag.find({})
  //Sort tags alphabetically
  tags = gamesCtrl.tagSort(tags)
  //Get all game associated with this tag
  let games = await Game.find({tag: { $elemMatch: { $eq: req.params.id } }}).populate("tag");
  res.render("tags/show", {title: tag.content, games, tag, tags, user})
}