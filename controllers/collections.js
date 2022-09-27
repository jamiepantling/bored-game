const { redirect } = require("express/lib/response");
const request = require("request-promise");
const User = require("../models/user");
const clientId = process.env.ATLAS_CLIENT_ID;

module.exports = {
    new: newCollection,
    create,
    show,
    delete: deleteOne
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

async function show(req, res) {
    if (!req.user || req.user.id != req.params.userId) return res.redirect("/")
    let user = await User.findById(req.params.userId)
    let collection = user.collections.id(req.params.collectionId)
    res.render("collections/show", {title: `${collection.title}`, collection})
}


async function deleteOne(req, res) {
    if (!req.user) return res.redirect("/");
    let user = await User.findOne({ "collections._id": req.params.id });
    if (req.user.id != user._id) return res.redirect("/")
    index = user.collections.findIndex((collection) => collection._id == req.params.id);
    user.collections[index].remove();
    await user.save();
    res.redirect(`/users/${user._id}`);
  }
  