//app.js code here.
// runs at http://localhost:3000/
// This requires all the modules and files.
let express = require('express');
const path = require('path');
let bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const adminRouter = require('./public/routes/admin');
const gameRouter = require('./public/routes/gameplay');
// const data = require('./items.js');
// const userJS = require('./user.js');
const file = './fill.json';
const fileTransfer = require('./fill.json');
// Creates and includes a file system (fs) module
const fs = require('fs');
// Create authorization session
let authorizedSession = "";
// Create app
let app = express();
// Set app to use bodyParser() middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
// This consolelogs a buch of actions
app.use(logger('dev'));
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
// fetch static content from public folder.
app.use(express.static(__dirname + '/public'));


// This sets up the session.
app.use(session({
  secret: 'variant',
  resave: false,
  saveUninitialized: true
}));

// This begins the interesting code:
// This begins the interesting code:
// This begins the interesting code:

// This obtains an array of words from a dictionary.
let words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
// console.log(words.length);
// This generates a random word.
function guessWord(){
  return words[Math.floor(Math.random() * (235886 + 1)) + 0];
}
let word = '';
let guessCount = 0;
let wordArray = [];
let blankArray = [];
let wordAndBlank = '';


function makeArrays(){
// for(i=0, i<word.length, i++){
  // let a = str.charAt(i);
  // wordArray[i] = a;
// };
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


function checkLetter(letter){
console.log("Letter in checkLetter: " + letter);
let i = 0;
   while(i<word.length){
     if (letter === wordArray[i]){
       blankArray[i] = letter;
     }
     i++;
   }
   wordAndBlank = blankArray.join(" ");
   console.log("wordAndBlank: " + wordAndBlank);

}




// This controls the localhost page.
app.get("/", function (req, res) {
  // This brings up the index.mustache HTML.
  guessCount = 0;
  res.render('index');
});


// This is called by submitting the form on the index page
// This is called by submitting the form on the gameplay page.
app.post("/guess_game", function (req, res) {
  // word = 'term3';
  let letter = req.body.guess;
  if(guessCount !== 0){
  if(letter.length > 1 || letter.length === 0){
    console.log("Guess not one character");
    res.render('gameplay', {blanks: word, count: guessCount});
  }
  // If the guess is acceptable.
  else{
  console.log("Letter Guessed: " + letter);
  console.log("Letters.length: " + letter.length)
  checkLetter(letter);
  // console.log("WordArray: " + wordArray);


  console.log("Guesses: " + guessCount);
  res.render('gameplay', {blanks: wordAndBlank, count: guessCount});
  // console.log("Add to count");
  guessCount++;
  }
  }
  // If this is the first run through do the following.
  else{
    word = guessWord();
    makeArrays();
    console.log("Word: " + word);
    // console.log("guessCount Initially " + guessCount);
    res.render('gameplay', {blanks: wordAndBlank, count: guessCount});
    // console.log("Add to count");
    guessCount++;
  }
  // res.redirect('/gameplay');
});

// This brings up the gameplay page.
app.get("/gameplay", function (req, res) {
  // word = 'term2';
  console.log("Prior to render.");
  res.render('gameplay', {blanks: word, count: guessCount});
});








// This ties the file to the proper localhost.
app.listen(3000, function(){
  console.log('Started express application!')
});
