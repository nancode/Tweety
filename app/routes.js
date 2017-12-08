var s = require('./../server');
var x= require('./x')
module.exports = function(app, passport) {



  
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    
    app.get('/profile', isLoggedIn, function(req, res) {
		s.fun(req.user,req.user);
        res.render('profile.ejs', {
            user : req.user
        });
    });

 
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


var multer = require('multer');
const path = require('path');	
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

  
		 app.get('/adimages', function(req, res) {
            res.render('adimages.ejs');
        });
		  app.post('/upload', (req, res) => {
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
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/adimages', 
            failureRedirect : '/login', 
            failureFlash : true 
        }));

      
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : 'adimages', 
            failureRedirect : '/signup', 
            failureFlash : true 
        }));

   

       
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

       
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


   


   
        app.get('/connect/local', function(req, res) {
            res.render('localsingin.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : 'adimages.ejs', 
            failureRedirect : '/connect/local',
            failureFlash : true
        }));

   

   

       
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


   


    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

   

    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        x.closeCall();
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

   


};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
