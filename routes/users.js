var express = require('express');
const User = require('../models/user');
var router = express.Router();
const usersCtrl = require("../controllers/users")
const collectionsCtrl = require("../controllers/collections")

router.get('/', usersCtrl.index);
router.get("/:id", usersCtrl.show)

router.get("/:id/collections/new", collectionsCtrl.new)
router.post("/:id/collections", collectionsCtrl.create)

module.exports = router;
