
var LocalAuth    = require('passport-local').Strategy;

var TwitterAuth  = require('passport-twitter').Strategy;


var User       = require('../app/models/user');
var twitterLogic= require('./../app/twitterLogic');



module.exports = function(passport) {


 
    passport.serializeUser(function(user, checkuser) {
		
        checkuser(null, user.id);

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

  
    passport.use('usersignup', new LocalAuth({
       
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

               
                    if (user) {
                        return checkuser(null, false, req.flash('signupMessage', 'username is already taken.'));
                    } else {

                       
                        var store            = new User();

                        store.local.email    = email;
                        store.local.password = store.generateHash(password);

                        store.save(function(err) {
                            if (err)
                                return checkuser(err);

                            return checkuser(null, store);
                        });
                    }

                });
           
            } else if ( !req.user.local.email ) {
               
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return checkuser(err);
                    
                    if (user) {
                        return checkuser(null, false, req.flash('loginMessage', 'Username is already taken.'));
                      
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

            
            if (!req.user) {

                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                    if (err)
                        return checkuser(err);

                    if (user) {
                      
                        if (!user.twitter.token) {
                            user.twitter.token       = token;
							user.twitter.tokenSecret     = tokenSecret;
                            user.twitter.username    = profile.username;
                            twitterLogic.twitterLogin(tokenSecret,token);
                            user.twitter.displayName = profile.displayName;

                            user.save(function(err) {
                                if (err)
                                    return checkuser(err);
                                    
                                return checkuser(null, user);
                            });
                        }

                        return checkuser(null, user); 
                    } else {
                        
                        var store                 = new User();

                        store.twitter.id          = profile.id;
                        store.twitter.token       = token;
						store.twitter.tokenSecret     = tokenSecret;
                        store.twitter.username    = profile.username;
                        store.twitter.displayName = profile.displayName;

                        store.save(function(err) {
                            if (err)
                                return checkuser(err);
                                
                            return checkuser(null, store);
                        });
                    }
                });

            } else {
                
                var user                 = req.user;

                user.twitter.id          = profile.id;
                user.twitter.token       = token;
				user.twitter.tokenSecret     = tokenSecret;
                user.twitter.username    = profile.username;
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
