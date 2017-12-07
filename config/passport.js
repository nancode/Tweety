
var LocalAuth    = require('passport-local').Strategy;

var TwitterAuth  = require('passport-twitter').Strategy;


var User       = require('../app/models/user');


var configAuth = require('./auth');

var x= require('./../app/x'); //nandhini code
module.exports = function(passport) {


 
    passport.serializeUser(function(user, done) {
		
        done(null, user.id);
		console.log(user.id+"in passport line 23");
    });


    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 
    passport.use('local-login', new LocalAuth({
      
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); 

     
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
             
                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

              
                else
                    return done(null, user);
            });
        });

    }));

  
    passport.use('local-signup', new LocalAuth({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); 

      
        process.nextTick(function() {
           
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                 
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // create the user
                        var newUser            = new User();

                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
            // if the user is logged in but has no local account...
            } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return done(err);
                            
                            return done(null,user);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));

   
    
    passport.use(new TwitterAuth({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, tokenSecret, profile, done) {

        // asynchronous
        process.nextTick(function() {
			console.log(tokenSecret+"checking if there is data")

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

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
                                    return done(err);
                                    
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
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
                                return done(err);
                                
                            return done(null, newUser);
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
                        return done(err);
                        
                    return done(null, user);
                });
            }

        });

    }));


};
