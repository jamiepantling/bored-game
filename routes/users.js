var express = require('express');
const User = require('../models/user');
var router = express.Router();
const usersCtrl = require("../controllers/users")

/* GET users listing. */
router.get('/', usersCtrl.index);
router.get("/:id", usersCtrl.show)

module.exports = router;
