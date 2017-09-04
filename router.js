// This runs the routing.
const session = require('express-session');
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const router = express.Router();
const app = express();
const fs = require("fs");
const expressValidator = require('express-validator');

const dataeasy = require("./data_easy");
const easywords = dataeasy.words;
const datamedium = require("./data_medium");
const mediumwords = datamedium.words;
const logic = require('./logic');
const routes = require('./router');

// middleware
router.use(function(req,res,next){
// console.log("Middleware");
next();
});

router.get('/',function(req,res){
  console.log("index for user");
  req.session.word = '';
  req.session.guessCount = 10;
  req.session.wordArray = [];
  req.session.blankArray = [];
  req.session.wordAndBlank = '';
  req.session.attemptArray = [];
  req.session.attemptList = '';
  req.session.newGame = true;
  req.session.difficulty = 'easy';
  req.session.end = '';
  req.session.submit = 'Submit Guess';
  req.session.message = "";
  req.session.return = '';
  res.render('index');
});

router.post('/guess_game', function (req, res) {
  console.log("router game");
  // console.log("post difficulty: "+req.body.difficulty);
  req.session.difficulty = req.body.difficulty;
  // console.log("session difficulty: "+req.session.difficulty);
  // console.log("letter: "+req.body.guess);
  req.session.letter = req.body.guess;
	res.redirect('/gameplay');
});

// This brings up the gameplay page.
router.get("/gameplay", function(req, res) {
  console.log("router.get/gameplay");
  // If the game is over.
  if(req.session.end !== ''){
    console.log("end: "+req.session.end);
    console.log("Game Over");
    res.redirect('/');
  }
  else{
  // If a new game
  if(req.session.newGame){
    console.log("Generates Word: "+req.session.newGame);
    console.log("difficulty: "+req.session.difficulty);
    let getRandomWord = logic.getRandomWord(req, res);
    req.session.newGame = false;
  }
  // If guessing and the game is not over.
  else{
    console.log("Guess: "+req.session.letter);
    let checkGuess = logic.checkGuess(req, res);
  }
  console.log("gameplay render");
  res.render('gameplay', {
    blanks: req.session.wordAndBlank,
    count: req.session.guessCount,
    submit: req.session.submit,
    message: req.session.message,
    attempt: req.session.attemptList,
    end: req.session.end,
    word: req.session.word
    });
  }
});

module.exports = router;
