var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();
const gamesCtrl = require("../controllers/games")
const reviewsCtrl = require("../controllers/reviews")

router.get("/", gamesCtrl.index)
router.get("/new", gamesCtrl.new)

router.get("/:id", gamesCtrl.show)
router.put("/:id", gamesCtrl.update)
router.delete("/:id", gamesCtrl.delete)
router.get("/:id/edit", gamesCtrl.edit)
router.get("/:gameId/reviews/:reviewId", reviewsCtrl.show)

router.put("/:gameId/reviews/:reviewId", reviewsCtrl.update)
router.post("/", gamesCtrl.create)
router.post("/:id/reviews", reviewsCtrl.create)
router.post("/:gameId/tags/:tagId", gamesCtrl.addTag)
router.delete("/reviews/:id", reviewsCtrl.delete)

module.exports = router;
