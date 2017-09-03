// This is example code from the videos.
const express =require('express');
const router = express.Router();

// middleware
router.use(function(req,res,next){
console.log("Middleware to auth the admin");
next();
});

router.get('/',function(req,res){
  console.log("index for admin");
  res.render('index', {username: "admin"});
});

router.get('/user-list',function(req,res){
  console.log("list for admin");
  res.render('userlist');
});

module.exports = router;
