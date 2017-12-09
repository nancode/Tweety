var express  = require('express');
var multer = require('multer');
var app      = express();
var port     = 3000;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var passport = require('passport');
var flash    = require('connect-flash');
const path = require('path');
const ejs = require('ejs');
var twitterLogic= require('./../Tweety/app/twitterLogic');
var user= require('./app/models/user');
var cookiesession= require('cookie-session');

//var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var imgpath1;


mongoose.connect('mongodb://admin:admin@ds123956.mlab.com:23956/passport', { useMongoClient: true }); 

require('./config/passport')(passport); 


console.log("app listening at 3000 port here");
app.use(express.static('./public'));





//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); 

app.use(session({
  secret: 'hiddenconfidentialclassified', 
 resave: true,
   saveUninitialized: true
}));

if(user.session === null ||user.session === undefined){
	
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash());
 


require('./app/routes.js')(app, passport); 
}
else{
//	console.log("usersession "+user.session ) ;
}




var fun = function(a, b) {
	

twitterLogic.twitterLogin( a.twitter.tokenSecret, a.twitter.token,a.twitter.username);

}

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  

  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('Ads');
  
 
  function checkFileType(file, cb){
    
    const filetypes = /jpeg|jpg|png|gif/;
  
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
  
  
  
  
 
  
  
  
  app.get('/adimages', (req, res) => res.render('adimages'));
  
 
  
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





exports.fun = fun;

app.listen(port);
