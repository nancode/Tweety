var express  = require('express');
var multer = require('multer');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
const path = require('path');
const ejs = require('ejs');
var x= require('./app/x'); //nandhini code
var user= require('./app/models/user');


var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// change1

app.use(express.static('./public'));

//change 1 ends here


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'hiddenconfidentialclassified', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
var fun = function(a, b) {
console.log("printing req" + a.twitter.token);
console.log("printing req" + a.twitter.tokenSecret);
x.twitterLogin( a.twitter.tokenSecret, a.twitter.token);

}
exports.fun = fun;

// launch ======================================================================
app.listen(port);
console.log("in server line 48 "+passport.user);

console.log('The app listening on port ' + port);
