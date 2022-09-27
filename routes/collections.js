var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();
const collectionsCtrl = require("../controllers/collections")

router.delete("/:id", collectionsCtrl.delete)

module.exports = router;
