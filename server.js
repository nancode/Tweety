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
//////////////////////////////////////////////////////////
console.log("seesion variable" + passport)
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('Ads');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
  
  // Init app
  
  
  // EJS
  
  
  // Public Folder
  app.get('/adimages', (req, res) => res.render('adimages'));
  
  //app.get('/', (req, res) => res.render('profile'));
  
  app.post('/upload', (req, res) => {

    console.log(req.body.num);
    upload(req, res, (err) => {
      if(err){
        res.render('adimages', {
          msg: err
        });
      } else {
        if(req.file == undefined){
          res.render('adimages', {
            msg: 'Error: No File Selected!'
          });
        } else {
          res.render('adimages', {
            msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`
          });
        }
      }
    });
  });


//////////////////////////////////////////////////////////

// console.log('key '+token);
// x.twitterLogin(user.twitter.tokenSecret,user.twitter.token);
exports.fun = fun;

app.listen(port);
