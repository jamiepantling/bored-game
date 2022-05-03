let User = require("../models/user");

module.exports = {
    index
}

function index(req, res, next) {
    console.log(req.user)
    console.log("res.locals:" + res.locals.user)
      res.render('index' ,
      {
        user: req.user,
        title: "Bored? Game!"
        }
        );
    };
  