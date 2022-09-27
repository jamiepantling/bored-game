const { redirect } = require("express/lib/response");
const request = require("request-promise");
const User = require("../models/user");
const clientId = process.env.ATLAS_CLIENT_ID;

module.exports = {
    new: newCollection,
    create
}
function newCollection(req, res) {
    if (!req.user) return res.redirect("/");
    res.render("collections/new", { title: "Add new collection" });
}

async function create(req, res) {
    if (!req.user) return res.redirect("/");
    let user = await User.findById(req.user.id)
    let collection = {
        title: req.body.title
    }
    user.collections.push(collection)
    await user.save()
    res.redirect(`/users/${user._id}`)
}


// async function create(req, res) {
//     if (!req.user) return res.redirect("/");
//     let game = await Game.findById(req.params.id);
//     let review = {
//       content: req.body.content,
//       reviewAuthor: req.user._id,
//       reviewAuthorName: req.user.name,
//     };
//     game.reviews.push(review);
//     await game.save();
//     res.redirect(`/games/${game._id}`);
//   }