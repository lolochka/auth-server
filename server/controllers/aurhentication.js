const jwt = require('jwt-simple');
const User =  require('../models/user');
const config= require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signIn = function(req, res, next) {
    //User has already had their email and pass
    //We just give him a token
    res.send({token: tokenForUser(req.user)});
};

exports.signUp = function(req, res, next) {
    const email = req.body.email;
    const password  = req.body.password;
    
    if(!email || !password){
        return res.status(422).send({
            error: 'You must provide email and password'
        })
    }
    
    //See if the user with given email exists
    User.findOne({email: email}, function(err, existingUser) {
        if (err) {
            return next(err);
        }
        //If user with email does exist, return an error
        if (existingUser) {
            return res.status(422).send({error: 'Email is in use'});
        }
    
        //If NOT, create and save user
        const user = new User({
            email: email,
            password: password
        });
        user.save(function(err) {
            if (err) {
                return next(err);
            }
            
            //Respond to request indicating the user was created
            res.json({token: tokenForUser(user)});
        });
    });
};