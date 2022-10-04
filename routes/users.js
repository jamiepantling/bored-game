var express = require('express');
const User = require('../models/user');
var router = express.Router();
const usersCtrl = require("../controllers/users")
const collectionsCtrl = require("../controllers/collections")

router.get('/', usersCtrl.index);
router.get("/:id", usersCtrl.show)

router.get("/:id/collections/new", collectionsCtrl.new)
router.post("/:id/collections", collectionsCtrl.create)
router.put("/:userId/games/:gameId", collectionsCtrl.addToCollection)
router.get("/:userId/collections/:collectionId", collectionsCtrl.show)
router.put("/:userId/collections/:collectionId", collectionsCtrl.update)
router.get("/:userId/collections/:collectionId/tags/:tagId", collectionsCtrl.showTag)

module.exports = router;
