
var LocalAuth    = require('passport-local').Strategy;

var TwitterAuth  = require('passport-twitter').Strategy;


var User       = require('../app/models/user');




var x= require('./../app/x'); //nandhini code
module.exports = function(passport) {


 
    passport.serializeUser(function(user, checkuser) {
		
        checkuser(null, user.id);
		console.log(user.id+"in passport line 23");
    });


    passport.deserializeUser(function(id, checkuser) {
        User.findById(id, function(err, user) {
            checkuser(err, user);
        });
    });

 
    passport.use('local-login', new LocalAuth({
      
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, checkuser) {
        if (email)
            email = email.toLowerCase(); 

     
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
             
                if (err)
                    return checkuser(err);

                if (!user)
                    return checkuser(null, false, req.flash('loginMessage', 'No user '));

                if (!user.validPassword(password))
                    return checkuser(null, false, req.flash('loginMessage', ' password did not match'));

              
                else
                    return checkuser(null, user);
            });
        });

    }));

  
    passport.use('local-signup', new LocalAuth({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, checkuser) {
        if (email)
            email = email.toLowerCase(); 

      
        process.nextTick(function() {
           
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                 
                    if (err)
                        return checkuser(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return checkuser(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        var newUser            = new User();

                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                return checkuser(err);

                            return checkuser(null, newUser);
                        });
                    }

                });
           
            } else if ( !req.user.local.email ) {
               
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return checkuser(err);
                    
                    if (user) {
                        return checkuser(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return checkuser(err);
                            
                            return checkuser(null,user);
                        });
                    }
                });
            } else {
                
                return checkuser(null, req.user);
            }

        });

    }));

   
    
    passport.use(new TwitterAuth({

        consumerKey     : 'MGEz3DiTLixGVcy9GDs720bUF',
        consumerSecret  : 'sB867UryxejezrvrGySLSvt1TpjowaWU1GXOvNccUJXZMdgzJT',
        callbackURL     : 'http://localhost:3000/auth/twitter/callback',
        passReqToCallback : true 

    },
    function(req, token, tokenSecret, profile, checkuser) {

    
        process.nextTick(function() {
			//console.log(tokenSecret+"checking if there is data")

            
            if (!req.user) {

                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                    if (err)
                        return checkuser(err);

                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.twitter.token) {
                            user.twitter.token       = token;
							user.twitter.tokenSecret     = tokenSecret;
                            user.twitter.username    = profile.username;
                            x.twitterLogin(tokenSecret,token);
							console.log(tokenSecret+"check1");
                            user.twitter.displayName = profile.displayName;

                            user.save(function(err) {
                                if (err)
                                    return checkuser(err);
                                    
                                return checkuser(null, user);
                            });
                        }

                        return checkuser(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser                 = new User();

                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
						newUser.twitter.tokenSecret     = tokenSecret;
						console.log(tokenSecret+"check1");
                        newUser.twitter.username    = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        newUser.save(function(err) {
                            if (err)
                                return checkuser(err);
                                
                            return checkuser(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user                 = req.user; // pull the user out of the session

                user.twitter.id          = profile.id;
                user.twitter.token       = token;
				user.twitter.tokenSecret     = tokenSecret;
                user.twitter.username    = profile.username;
				console.log(tokenSecret+"check1");
                user.twitter.displayName = profile.displayName;

                user.save(function(err) {
                    if (err)
                        return checkuser(err);
                        
                    return checkuser(null, user);
                });
            }

        });

    }));


};
