// This is for possible future login high score use.
// This is part of my code to make the login page work.
const express =require('express');
const router = express.Router();

// middleware
router.use(function(req,res,next){
console.log("Middleware to auth the Login");
next();
});

router.get('/',function(req,res){
  console.log("index for login");
  res.render('login');
});

// router.get('/login',function(req,res){
//   console.log("Login Appears");
//   res.render('login');
// });

module.exports = router;
