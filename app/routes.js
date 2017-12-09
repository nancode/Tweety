var s = require('./../server');
var twitterLogic= require('./twitterLogic')
var count=5;
var flash    = require('connect-flash');
module.exports = function(app, passport) {



  
    app.get('/', function(req, res){ 
        if( req.user !== null && req.user !== undefined){
            if(req.user.id !== null || req.user.id !== undefined){
                res.redirect("/profile");
            } else{
                res.render('Home.ejs');}}
            else{
            res.render('Home.ejs');}
    });

    
    app.get('/profile', sessionactive, function(req, res) {
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
    destination: './',
    filename: function(req, file, cb){
      cb(null,file.fieldname + Date.now() + path.extname(file.originalname));
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
            var user = req.user;
            user.local.file_name= req.file.filename;
            user.local.count= count;
            user.save();
        
          res.render('adimages', {
          

            msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`
          });
        }
      }
});
 });
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage')
        
     });
        });

        
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/adimages', 
            failureRedirect : '/', 
            failureFlash : true 
			 
        }));

      
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        
        app.post('/signup', passport.authenticate('usersignup', {
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


   


   

   

   

       
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


   


    app.get('/unlink/local', sessionactive, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

   

    app.get('/unlink/twitter', sessionactive, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        twitterLogic.closeCall();
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

   


};


function sessionactive(req, res, next) {
    if (req.isAuthenticated())
		//console.log("line route 179 "+req.user.twitter.token);
        return next();

    res.redirect('/');
}
