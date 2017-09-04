const express = require("express");
const router = express.Router();

router.use(function(req,res,next){
  console.log("Router Active One");
  next();
});
router.get("/", function(req,res){
  console.log("Router Active");
  res.render("gameplay", {success: false, errors: req.session.errors});
  req.session.errors = null;
});
router.post('/guess_game', function(req,res,next){
  console.log("Router Post Active");
  // check validity
  // req.check('');
  // req.checkBody('');


});
module.exports = router;
