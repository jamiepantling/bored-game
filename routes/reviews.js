var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();
const reviewsCtrl = require("../controllers/reviews")

router.delete("/:id", reviewsCtrl.delete)



module.exports = router;
