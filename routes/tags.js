var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();
const tagsCtrl = require("../controllers/tags")

router.get("/:id", tagsCtrl.show)

module.exports = router;
