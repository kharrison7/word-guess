//app.js code here.
// runs at http://localhost:3000/
// This requires all the modules and files.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const expressValidator = require('express-validator');
const adminRouter = require('./public/routes/admin');
const gameRouter = require('./public/routes/gameplay');
const validation = require('./test/validation/checkVal.js');
// const data = require('./items.js');
// const userJS = require('./user.js');
const file = './fill.json';
const fileTransfer = require('./fill.json');
// Creates and includes a file system (fs) module
const fs = require('fs');
// Create authorization session
let authorizedSession = "";
// Create app
const app = express();
// Set app to use bodyParser() middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
//'extended: false' parses strings and arrays.
//'extended: true' parses nested objects
//'expressValidator' must come after 'bodyParser', since data must be parsed first!
app.use(expressValidator());

// This consolelogs a buch of actions
// app.use(logger('dev'));
app.use(cookieParser());
// Sets the view engine and router.
app.engine('mustache', mustacheExpress());
// use views folder to pick up views.
app.set('views', ['./views','./views/admin']);
// sets mustache as the view engine.
app.set('view engine', 'mustache');
// use the correct routes when callled.
app.use('/admin', adminRouter);
app.use('/gameplay', gameRouter);
// fetch static content from public folder, example css.
app.use(express.static(__dirname + '/public'));


// This sets up the session.
app.use(session({
  secret: 'variant',
  // only save if user changes something.
  resave: false,
  // set to determine save to sessions.
  saveUninitialized: true
}));

// This begins the interesting code:
// This begins the interesting code:
// This begins the interesting code:

// This obtains an array of words from a dictionary.
// let words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const dataeasy = require("./data_easy");
const easywords = dataeasy.words;

// console.log(words.length);
// This generates a random word.
function guessWord(difficulty){
    let sizeMin = 3;
    let sizeMax = 30;
    if(difficulty==="easy"){
      sizeMin = 4;
      sizeMax = 6;
      word=easywords[Math.floor(Math.random() * (easywords.length + 1) )];
    }
    if(difficulty==="normal"){
      sizeMin = 6;
      sizeMax = 8;
    }
    if(difficulty==="hard"){
      sizeMin = 8;
      sizeMax = 20;
      guessCount = 8;
    }
    if(difficulty==="hardcore"){
      sizeMin = 10;
      sizeMax = 50;
      guessCount = 6;
    }
    word=easywords[Math.floor(Math.random() * (easywords.length + 1) )];
  // word = words[Math.floor(Math.random() * (235886 + 1)) + 0];
  // while(word.length<sizeMin||word.length>sizeMax){
  //   word = words[Math.floor(Math.random() * (235886 + 1)) + 0];
  // }
return word;
}

// This sets global variables.
let word = '';
const numGuesses = 10;
let guessCount = numGuesses;
let wordArray = [];
let blankArray = [];
let wordAndBlank = '';
let attemptArray = [];
let attemptList = '';
let newGame = 'true';
let end = '';
let submit = 'Submit Guess';
let difficulty = 'easy';
let message ="";

// This makes the arrays.
function makeArrays(){
let i = 0;
while(i<word.length){
  let a = word.charAt(i);
  wordArray[i] = a;
  i++;
}
i = 0;
while(i<word.length){
  let a = word.charAt(i);
  blankArray[i] = "_";
  i++;
}
wordAndBlank = blankArray.join(" ");
console.log(wordArray);
console.log(blankArray);
console.log("wordAndBlank: " + wordAndBlank);
};

// This checks to see if the letter is in the word.
function checkLetter(letter){
// Replace a blank if the letter is in the word.
let i = 0;
let letterInside = 0;
   while(i<word.length){
     if (letter === wordArray[i]){
       if(blankArray[i] === letter){
         message = "The letter "+letter+" was added already. Try a different letter."
       }
       blankArray[i] = letter;
       letterInside++;
     }
     i++;
   }
   console.log("Letter: "+letter+" found: "+letterInside+" times.");
  //  If the letter is not inside.
  let previousGuess = false;
  let o = 0;
   if(letterInside === 0){
     console.log("Letter not in word: "+letter);
     console.log("Attempts: "+attemptArray[o]);
     while(o<attemptArray.length){
       if (letter === attemptArray[o]){
        previousGuess = true;
       }
       o++;
     }
    //  If you have guessed the letter previously.
     if(previousGuess){
      // console.log("You guessed the letter: "+letter+" already.");
      message = "You guessed the letter "+letter+" already. Try a different letter."
     }
     else{
     attemptArray.push(letter);
     attemptList = attemptArray.join(" ");
     guessCount--;
    //  This checks to see if the user ran out of guesses.
     if(guessCount===0){
       console.log("Game Over");
       end = "Game Over";
         //  This fills in the missing letters.
             i = 0;
             while(i<word.length){
              if(blankArray[i] === "_") {
                let a = wordArray[i].toUpperCase();
                blankArray[i] = a;
              }
              // blankArray[i] = wordArray[i];
              i++;
             }

       }
     }
   }

     //  This checks for a win.
     if(letterInside > 0){
       let p = 0;
       let lettersCorrect = 0;
       while(p<word.length ){
         if (blankArray[p] === wordArray[p]){
           lettersCorrect++;
         }
         p++;
       }
       if( lettersCorrect === word.length ){
         console.log("WIN!");
         end = "You Won";
       }
      }
   wordAndBlank = blankArray.join(" ");
  //  console.log("word: " + word);
  //  console.log("Letter: " + letter);
  //  console.log("wordAndBlank: " + wordAndBlank);
}

// This controls the localhost page.
app.get("/", function (req, res) {
  res.redirect('/index');
});

app.get('/index', function(req, res){
  word = '';
  guessCount = numGuesses;
  wordArray = [];
  blankArray = [];
  wordAndBlank = '';
  attemptArray = [];
  attemptList = '';
  newGame = 'true';
  end = '';
  submit = 'Submit Guess';
  message = "";
  res.render('index')
})

// This is called by submitting the form on the index page
// This is called by submitting the form on the gameplay page.

// validate(validation.checkVal)
app.post("/guess_game", function (req, res) {
  //Call req.checkBody function.
  // If the game is over and the button is clicked:
  if(end  !== ""){
    console.log('Go back to index');
    res.redirect('/');
  } else{
  // This obtains the letter from the guess.
  let letter = req.body.guess;
  message = "";
  // For all turns after the page loads.
  if(newGame === false){
  // Converts capital letters to lowercase.
  letter = letter.toLowerCase();


// use validation to check for one letter, not numbers or symbols - return error
//Pass inputs to validate.
//Tell middleware which validators to apply (chain one or more).
req.checkBody('guess', 'Must be only one letter').len(1,1);
req.checkBody('guess', 'Must be a letter').isAlpha();
// req.checkBody('letter', 'Must not be a number').isNaN();
// req.checkBody('letter', 'Must not be a symbol').issymbol();not
   req.getValidationResult().then(function(result){
     if(!result.isEmpty()){
     console.log(result.isEmpty());
     // console.log(result.array());
     // console.log(result.mapped());
     // console.log(result.array()[0].msg);
     message = result.array()[0].msg;
     return;
     }
   });


  if(letter.length > 1 || letter.length === 0){
    console.log("Guess not one character");
    res.render('gameplay', {blanks: wordAndBlank, count: guessCount, attempt: attemptList, submit: submit});
  }
  // If the guess is acceptable.
  else{
  // console.log("Letter Guessed: " + letter);
  checkLetter(letter);
  // console.log("Guesses Left: " + guessCount);
  if(end  !== ""){
    submit = "Back to Menu";
  }
  req.session.guessCount = guessCount;
  req.session.attemptList = attemptList;
  console.log("req.session.word: "+req.session.word+", guessCount: "+req.session.guessCount+", attempts: "+req.session.attemptList);
  res.render('gameplay', {blanks: wordAndBlank, count: guessCount, attempt: attemptList, end: end, submit: submit, message: message});
  }
  }

  // If this is the first run through do the following.
  else{
    difficulty = req.body.difficulty;
    word = guessWord(difficulty);
    // console.log("req.session.word: " + req.session.word);
    makeArrays();
    // console.log("Word: " + word);
    // console.log("guessCount Initially " + guessCount);
    req.session.word = word;
    req.session.guessCount = guessCount;
    req.session.attemptList = attemptList;
    console.log("req.session.word: "+req.session.word+", guessCount: "+req.session.guessCount+", attempts: "+req.session.attemptList);
    res.render('gameplay', {blanks: wordAndBlank, count: guessCount, attempt: attemptList, end: end, submit: submit});
    newGame = false;
  }
  }
});

// This brings up the gameplay page.
app.get("/gameplay", function (req, res) {
  // word = 'term2';
  console.log("Prior to render.");
  submit = "Begin a New Game.";
  message = "Click above to begin a new game.";
  res.render('gameplay', {blanks: word, count: guessCount, submit: submit, message: message});
});

// This ties the file to the proper localhost or host.
app.listen(process.env.PORT || 3000, function () {
  console.log('Successfully started express application!');
});

// In case I want to export something later.
module.exports = app;
