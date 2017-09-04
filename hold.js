// This obtains an array of words from a dictionary.
// let words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const dataeasy = require("./data_easy");
const easywords = dataeasy.words;
const datamedium = require("./data_medium");
const mediumwords = datamedium.words;

// console.log(words.length);
// This generates a random word.
function guessWord(difficulty) {
  let sizeMin = 3;
  let sizeMax = 30;
  let goUp = false;
  if (difficulty === "easy") {
    sizeMin = 4;
    sizeMax = 6;
  }
  if (difficulty === "normal") {
    sizeMin = 6;
    sizeMax = 8;
  }
  if (difficulty === "hard") {
    sizeMin = 8;
    sizeMax = 20;
    guessCount = 8;
    goUp = true;
  }
  if (difficulty === "hardcore") {
    sizeMin = 10;
    sizeMax = 50;
    guessCount = 6;
    goUp = true;
  }
  word = easywords[Math.floor(Math.random() * (easywords.length + 1))];
  while (word.length < sizeMin || word.length > sizeMax) {
    word = easywords[Math.floor(Math.random() * (easywords.length + 1))];
  };
  if (goUp === true) {
    word = mediumwords[Math.floor(Math.random() * (mediumwords.length + 1))];
    while (word.length < sizeMin || word.length > sizeMax) {
      word = mediumwords[Math.floor(Math.random() * (mediumwords.length + 1))];
    };
  }
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
let message = "";

// This makes the arrays.
function makeArrays() {
  let i = 0;
  while (i < word.length) {
    let a = word.charAt(i);
    wordArray[i] = a;
    i++;
  }
  i = 0;
  while (i < word.length) {
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
function checkLetter(letter) {
  // Replace a blank if the letter is in the word.
  let i = 0;
  let letterInside = 0;
  while (i < word.length) {
    if (letter === wordArray[i]) {
      if (blankArray[i] === letter) {
        message = "The letter " + letter + " was added already. Try a different letter."
      }
      blankArray[i] = letter;
      letterInside++;
    }
    i++;
  }
  console.log("Letter: " + letter + " found: " + letterInside + " times.");
  //  If the letter is not inside.
  let previousGuess = false;
  let o = 0;
  if (letterInside === 0) {
    console.log("Letter not in word: " + letter);
    console.log("Attempts: " + attemptArray[o]);
    while (o < attemptArray.length) {
      if (letter === attemptArray[o]) {
        previousGuess = true;
      }
      o++;
    }
    //  If you have guessed the letter previously.
    if (previousGuess) {
      // console.log("You guessed the letter: "+letter+" already.");
      message = "You guessed the letter " + letter + " already. Try a different letter."
    } else {
      attemptArray.push(letter);
      attemptList = attemptArray.join(" ");
      guessCount--;
      //  This checks to see if the user ran out of guesses.
      if (guessCount === 0) {
        console.log("Game Over");
        end = "Game Over";
        //  This fills in the missing letters.
        i = 0;
        while (i < word.length) {
          if (blankArray[i] === "_") {
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
  if (letterInside > 0) {
    let p = 0;
    let lettersCorrect = 0;
    while (p < word.length) {
      if (blankArray[p] === wordArray[p]) {
        lettersCorrect++;
      }
      p++;
    }
    if (lettersCorrect === word.length) {
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
app.get("/", function(req, res) {
  res.redirect('/index');
});

app.get('/index', function(req, res) {
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
  res.render('index');
});

// This is called by submitting the form on the index page
// This is called by submitting the form on the gameplay page.

// validate(validation.checkVal)
app.post("/guess_game", function(req, res) {
  //Call req.checkBody function.
  // If the game is over and the button is clicked:
  if (end !== "") {
    console.log('Go back to index');
    res.redirect('/');
  } else {
    // This obtains the letter from the guess.
    let letter = req.body.guess;
    message = "";
    // For all turns after the page loads.
    if (newGame === false) {
      // Converts capital letters to lowercase.
      letter = letter.toLowerCase();
      // use validation to check for one letter, not numbers or symbols - return error
      //Pass inputs to validate.
      //Tell middleware which validators to apply (chain one or more).
      req.checkBody('guess', 'Must be only one letter').len(1, 1);
      req.checkBody('guess', 'Must be a letter').isAlpha();
      // req.checkBody('letter', 'Must not be a number').isNaN();
      // req.checkBody('letter', 'Must not be a symbol').issymbol();not
      req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
          console.log(result.isEmpty());
          // console.log(result.array());
          // console.log(result.mapped());
          // console.log(result.array()[0].msg);
          message = result.array()[0].msg;
          return;
        }
      });

      if (letter.length > 1 || letter.length === 0) {
        console.log("Guess not one character");
        res.render('gameplay', {
          blanks: wordAndBlank,
          count: guessCount,
          attempt: attemptList,
          submit: submit
        });
      }
      // If the guess is acceptable.
      else {
        // console.log("Letter Guessed: " + letter);
        checkLetter(letter);
        // console.log("Guesses Left: " + guessCount);
        if (end !== "") {
          submit = "Back to Menu";
        }
        req.session.guessCount = guessCount;
        req.session.attemptList = attemptList;
        console.log("req.session.word: " + req.session.word + ", guessCount: " + req.session.guessCount + ", attempts: " + req.session.attemptList);
        res.render('gameplay', {
          blanks: wordAndBlank,
          count: guessCount,
          attempt: attemptList,
          end: end,
          submit: submit,
          message: message,
          word: word
        });
      }
    }

    // If this is the first run through do the following.
    else {
      difficulty = req.body.difficulty;
      word = guessWord(difficulty);
      // console.log("req.session.word: " + req.session.word);
      makeArrays();
      // console.log("Word: " + word);
      // console.log("guessCount Initially " + guessCount);
      req.session.word = word;
      req.session.guessCount = guessCount;
      req.session.attemptList = attemptList;
      console.log("req.session.word: " + req.session.word + ", guessCount: " + req.session.guessCount + ", attempts: " + req.session.attemptList);
      res.render('gameplay', {
        blanks: wordAndBlank,
        count: guessCount,
        attempt: attemptList,
        end: end,
        submit: submit
      });
      newGame = false;
    }
  }
});

// This brings up the gameplay page.
app.get("/gameplay", function(req, res) {
  // word = 'term2';
  console.log("Prior to render.");
  submit = "Begin a New Game.";
  message = "Click above to begin a new game.";
  res.render('gameplay', {
    blanks: word,
    count: guessCount,
    submit: submit,
    message: message
  });
});











// Validator:
// use validation to check for one letter, not numbers or symbols - return error
//Pass inputs to validate.
//Tell middleware which validators to apply (chain one or more).
req.checkBody('guess', 'Must be only one letter').len(1, 1);
req.checkBody('guess', 'Must be a letter').isAlpha();
// req.checkBody('letter', 'Must not be a number').isNaN();
// req.checkBody('letter', 'Must not be a symbol').issymbol();not
req.getValidationResult().then(function(result) {
  if (!result.isEmpty()) {
    console.log(result.isEmpty());
    // console.log(result.array());
    // console.log(result.mapped());
    // console.log(result.array()[0].msg);
    message = result.array()[0].msg;
    return;
  }
});


// fill.json info:
// , "userNames":[],"wordGuessed":[],"score":[]
