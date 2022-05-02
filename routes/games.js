var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();
const gamesCtrl = require("../controllers/games")

router.get("/", gamesCtrl.index)
router.get("/new", gamesCtrl.new)
router.get("/:id", gamesCtrl.show)

router.post("/", gamesCtrl.create)

module.exports = router;
