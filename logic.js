const express = require('express');
const session = require('express-session');
const logic = require('./logic.js');
const fs = require("fs")
const dataeasy = require("./data_easy");
const datamedium = require("./data_medium");
const jsonfile = require('jsonfile');
const bodyParser = require('body-parser');
const easywords = dataeasy.words;
const mediumwords = datamedium.words;
const app = express();
const expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

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
let competitive = false;

// This generates a random word and some arrays.
const getRandomWord = function guessWord(req, res) {
  // This resets values for each new game.
  req.session.word = '';
  req.session.guessCount = 10;
  req.session.wordArray = [];
  req.session.blankArray = [];
  req.session.wordAndBlank = '';
  req.session.attemptArray = [];
  req.session.attemptList = '';
  req.session.newGame = true;
  req.session.end = '';
  req.session.submit = 'Submit Guess';
  req.session.message = "";
  req.session.return = '';
  req.session.score = 0;
  req.session.userName = '';
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
  competitive = false;
  console.log("Difficulty: "+ req.session.difficulty);
    let difficulty = req.session.difficulty;
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
      req.session.guessCount = 8;
      goUp = true;
    }
    if (difficulty === "hardcore") {
      sizeMin = 10;
      sizeMax = 50;
      req.session.guessCount = 6;
      goUp = true;
      competitive = true;
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
    // console.log("word: "+word);
    req.session.word = word;
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
      req.session.wordAndBlank = wordAndBlank;
      req.session.wordArray = wordArray;
      req.session.blankArray = blankArray;
      req.session.competitive = competitive;
      console.log(wordArray);
      console.log(blankArray);
      console.log("wordAndBlank: " + wordAndBlank);
      return word;
      next();
};











const checkGuess = function (req, res) {
  console.log("checkGuess");
  //Call req.checkBody function.
  // If the game is over and the button is clicked:
  // if (req.session.return !== '') {
  //   req.session.message = "";
  //   console.log('Go back to index');
  //   res.redirect('/');
  // }
  // else {
    let letter = req.session.letter;
    let guessCount = req.session.guessCount;
    let word = req.session.word;
    let wordAndBlank = req.session.wordAndBlank;
    let wordArray = req.session.wordArray;
    let blankArray = req.session.blankArray;
    req.session.message = "";
    // For all turns after the page loads.
    if (req.session.newGame === false) {
      // Converts capital letters to lowercase.
      letter = letter.toLowerCase();
      if (letter.length > 1 || letter.length === 0) {
        console.log("Guess not one character");
        message = '';
        return letter;
        next();
      }
      // If the guess is acceptable.
      else {
        console.log("Letter Guessed: " + letter);
        // checkLetter(letter);

          // Replace a blank if the letter is in the word.
          let i = 0;
          let letterInside = 0;
          while (i < word.length) {
            if (letter === wordArray[i]) {
              if (blankArray[i] === letter) {
                message = "The letter " + letter + " was added already. Try a different letter."
              }
              else{
               message = '';
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
              message = '';
              attemptArray.push(letter);
              attemptList = attemptArray.join(" ");
              guessCount--;
              //  This checks to see if the user ran out of guesses.
              if (guessCount === 0) {
                console.log("Game Over");
                end = "Game Over";
                req.session.competitive = false;
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
              // req.session.score = word.length * (6-req.session.guessCount)*100;
              let mod = req.session.guessCount;
              req.session.score = 170*mod*word.length;
              console.log("Score: "+mod+" guessCount: "+req.session.guessCount+" "+req.session.score);
            }
          }
          wordAndBlank = blankArray.join(" ");
          req.session.wordAndBlank = wordAndBlank;
          req.session.wordArray = wordArray;
          req.session.blankArray = blankArray;
          req.session.message = message;
          req.session.end = end;
          //  console.log("word: " + word);
          //  console.log("Letter: " + letter);
          //  console.log("wordAndBlank: " + wordAndBlank);
        console.log("Guesses Left: " + guessCount);
        if (req.session.end !== '') {
          req.session.submit = "Back to Menu";
        }
        req.session.guessCount = guessCount;
        req.session.attemptList = attemptList;
        console.log("req.session.word: " + req.session.word + ", guessCount: " + req.session.guessCount + ", attempts: " + req.session.attemptList);
        return letter;
        next();
      }
    }
  // }
};




module.exports = {
	getRandomWord : getRandomWord,
	checkGuess : checkGuess,
}
