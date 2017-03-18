const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create local strategy
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email,password,done) {
    //Verify this username and password call done
    User.findOne({email: email}, function(err, user) {
        if (err) {return done(err);}
        if (!user) {return done(null,false);}
        
        user.comparePasswords(password, function(err,isMatch) {
            if (err) {return done(err);}
            if (!isMatch) {return done(null,false);}
            
            return done(null,user);
        })
    })
});

//Setup options for jwt strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//Create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    //See if the user ID in the payload exists in our database
    //if it does, call 'done' with that other
    //otherwise, call done without user object
    User.findById(payload.sub, function(err,user) {
        if (err) {return done(err, false);}
        
        if (user) {
            done(null,user);
        } else {
            done(null,false);
        }
    })
});

//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);