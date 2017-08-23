//app.js code here.
// runs at http://localhost:3000/
// This requires all the modules and files.
let express = require('express');
const path = require('path');
let bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
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



// This begins the interesting code:

// This controls the localhost page.
app.get("/", function (req, res) {
  // This brings up the index.mustache HTML.
  res.render('index');
});

// This is called by submitting the form on the index page.
app.post("/gameOn", function (req, res) {
  console.log("Game Mode On");
  res.redirect('/gameplay');
});

let guessCount = 0;

// This brings up the gameplay page.
app.get("/gameplay", function (req, res) {
  let word_Filler = 'term';
  res.render('gameplay', {word: word_Filler}, {count: guessCount});
});

// This is called by submitting the form on the gameplay page.
app.post("/guess_Letter", function (req, res) {
  guessCount++;
  console.log("Letter Guessed");
  res.redirect('/gameplay');
});






// This ties the file to the proper localhost.
app.listen(3000, function(){
  console.log('Started express application!')
});
